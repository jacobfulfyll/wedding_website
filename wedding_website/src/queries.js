import { HttpError } from 'wasp/server'

export const getRsvp = async ({ id }, context) => {
  if (!context.user) { throw new HttpError(401) };
  const rsvp = await context.entities.Rsvp.findUnique({
    where: { id },
  });
  if (!rsvp) throw new HttpError(404, 'No RSVP with id ' + id);
  if (rsvp.userId !== context.user.id) {
    throw new HttpError(400, 'RSVP does not belong to the user');
  }
  return rsvp;
}

export const getRegistry = async (args, context) => {
  try {
    const registryItems = await context.entities.Registry.findMany();
    return registryItems;
  } catch (error) {
    console.error('Error in getRegistry:', error);
    throw error;
  }
}

export const getGuests = async (args, context) => {
  try {
    // console.log("HERE I AM: ", config.allowedCORSOrigins)
    return await context.entities.Guest.findMany();
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw new Error('Failed to fetch guests');
  }
}

export const seedGuests = async (guestsData, context) => {
  try {
    console.log('Seeding guests:', guestsData);
    const createdGuests = await Promise.all(
      guestsData.map(async (guestData) => {
        return await context.entities.Guest.create({
          data: guestData,
        });
      })
    );

    console.log('Guests seeded successfully:', createdGuests);
    return { success: true, message: `${createdGuests.length} guests seeded successfully` };
  } catch (error) {
    console.error('Error seeding guests:', error);
    throw new Error(`Failed to seed guests: ${error.message}`);
  }
};

export const clearTable = async (entityName, context) => {
  try {
    if (!context.entities[entityName]) {
      throw new Error(`Invalid entity name: ${entityName}`);
    }
    
    await context.entities[entityName].deleteMany({});
    return { success: true, message: `All records in ${entityName} table cleared successfully` };
  } catch (error) {
    console.error(`Error clearing ${entityName} table:`, error);
    return { success: false, error: error.message };
  }
};

export const updateGuestEvents = async ({ guestIds, events }, context) => {
  if (!Array.isArray(guestIds)) {
    throw new Error('guestIds must be an array');
  }

  // Example logic to update guest events in the database
  try {
    await context.entities.Guest.updateMany({
      where: { id: { in: guestIds } },
      data: {
        welcome_party: events.welcomeParty,
        wedding: events.wedding,
        farewell_brunch: events.farewellBrunch,
        rehearsal_dinner: events.rehearsalDinner,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating guest events:', error);
    throw new Error('Failed to update guest events');
  }
};


