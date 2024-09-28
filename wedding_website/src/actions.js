import { HttpError } from 'wasp/server'
import { google } from 'googleapis';
import { getGuests, seedGuests } from './queries';

export const createRsvp = async ({ guestName, attending, guests }, context) => {
  if (!context.user) { throw new HttpError(401) };

  return await context.entities.Rsvp.create({
    data: {
      user: { connect: { id: context.user.id } },
      guestName,
      attending,
      guests
    }
  });
}

export const updateRsvp = async ({ id, guestName, attending, guests }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const rsvp = await context.entities.Rsvp.findUnique({
    where: { id: id }
  });
  if (rsvp.userId !== context.user.id) { throw new HttpError(403) };

  return context.entities.Rsvp.update({
    where: { id: id },
    data: { guestName: guestName, attending: attending, guests: guests }
  });
}

export const createRegistry = async ({ itemName, itemDescription, itemPrice }, context) => {
  if (!context.user) { throw new HttpError(401) };

  return await context.entities.Registry.create({
    data: {
      user: { connect: { id: context.user.id } },
      itemName,
      itemDescription,
      itemPrice,
      purchased: false
    }
  });
}

export const updateRegistry = async ({ id, itemName, itemDescription, itemPrice, purchased }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const registry = await context.entities.Registry.findUnique({ where: { id: id } });
  if (registry.userId !== context.user.id) { throw new HttpError(403) };

  return context.entities.Registry.update({ 
    where: { id: id }, 
    data: { itemName: itemName, itemDescription: itemDescription, itemPrice: itemPrice, purchased: purchased } 
  });
}

// Start of Selection
const getGoogleSheetsService = async () => {
  console.info('Initializing Google Sheets service...');
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    console.info('GOOGLE_SHEETS_CREDENTIALS:', process.env.GOOGLE_SHEETS_CREDENTIALS);
    console.info('WEDDING_WORKBOOK_ID:', process.env.WEDDING_WORKBOOK_ID);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ],
    });
    
    const client = await auth.getClient();
    console.info('Google authentication successful.');
    
    const sheets = google.sheets({ version: 'v4', auth: client });
    console.info('Google Sheets API client created successfully.');

    return sheets;
  } catch (error) {
    console.error('Failed to initialize Google Sheets service:', error);
    throw error;
  }
};

/**
 * This function processes raw guest data from a Google Sheets spreadsheet.
 * It converts the raw data into a structured format with specific fields.
 * 
 * @param {Array} rawData - The raw data from the spreadsheet.
 * @returns {Array} - An array of guest objects with structured data.
 */
const processRawGuestData = (rawData) => {
  // Define the fields we expect for each guest
  const guestFields = ['first_name', 'last_name', 'family_name', 'bridal_party', 'rehearsal_dinner', 'welcome_party', 'wedding', 'farewell_brunch'];
  
  // Process each row of raw data, skipping the header row
  return rawData.slice(1).map(row => {
    const guest = {};
    
    // Map each field to its corresponding value in the row
    guestFields.forEach((field, index) => {
      const value = row[index]?.trim() || '';
      
      // Convert specific fields to boolean or null values as needed
      if (field === 'bridal_party') {
        guest[field] = value === 'TRUE';
      } else if (field === 'rehearsal_dinner') {
        guest[field] = guest.bridal_party ? (value === '' ? null : value === 'TRUE') : false;
      } else if (['welcome_party', 'wedding', 'farewell_brunch'].includes(field)) {
        guest[field] = value === '' ? null : value === 'TRUE';
      } else {
        guest[field] = value || null;
      }
    });
    
    return guest;
  });
};

export const getUniqueNewGuestsFromSheets = async (existingGuests, context) => {
  try {
    console.info('Fetching RSVP data from Google Sheets...');
    const GUEST_LIST = 'guestList';
    const service = await getGoogleSheetsService();

    console.debug('Fetching spreadsheet values...');
    const result = await service.spreadsheets.values.get({
      spreadsheetId: process.env.WEDDING_WORKBOOK_ID,
      range: GUEST_LIST,
    });
    console.debug('Spreadsheet values fetched successfully.');

    const rawData = result.data.values;
    console.log(`Raw data received: ${JSON.stringify(rawData)}`);

    if (!rawData || rawData.length === 0) {
      console.warn("No data found in Google Sheets.");
      return [];
    }

    const newGuests = processRawGuestData(rawData);

    const uniqueNewGuests = Array.isArray(existingGuests) && existingGuests.length > 0
      ? newGuests.filter(newGuest => 
          !existingGuests.some(existingGuest => 
            existingGuest.first_name === newGuest.first_name &&
            existingGuest.last_name === newGuest.last_name &&
            existingGuest.family_name === newGuest.family_name
          )
        )
      : newGuests;

    console.info(`Found ${uniqueNewGuests.length} new guests to add.`);
    console.log('Existing guests:', existingGuests);
    console.log('New guests:', newGuests);
    console.log('Unique new guests:', uniqueNewGuests);
    return uniqueNewGuests;

  } catch (error) {
    console.error('Error in getUniqueNewGuestsFromSheets:', error);
    throw new HttpError(500, 'Failed to fetch new guests from Google Sheets');
  }
}

export const exportGuestsToSheets = async (guests, context) => {
  try {
    console.info('Exporting guests data to Google Sheets...');
    const GUEST_LIST = 'guestList';
    const service = await getGoogleSheetsService();

    if (!guests || guests.length === 0) {
      console.warn("No guests provided.");
      return { success: false, message: "No guests provided." };
    }

    // Prepare data for Google Sheets
    const sheetData = guests.map(guest => [
      guest.first_name,
      guest.last_name,
      guest.family_name,
      guest.bridal_party,
      guest.rehearsal_dinner,
      guest.welcome_party,
      guest.wedding,
      guest.farewell_brunch
    ]);

    // Add headers to the sheet data
    const headers = [
      'first_name', 'last_name', 'family_name', 
      'bridal_party', 'rehearsal_dinner', 'welcome_party', 
      'wedding', 'farewell_brunch'
    ];
    sheetData.unshift(headers);

    // Write data to Google Sheets
    await service.spreadsheets.values.update({
      spreadsheetId: process.env.WEDDING_WORKBOOK_ID,
      range: GUEST_LIST,
      valueInputOption: 'RAW',
      resource: {
        values: sheetData
      }
    });

    console.info('Guests data exported successfully to Google Sheets.');
    return { success: true, message: "Guests data exported successfully to Google Sheets." };

  } catch (error) {
    console.error('Error in exportGuestsToSheets:', error);
    throw new HttpError(500, 'Failed to export guests to Google Sheets');
  }
}
