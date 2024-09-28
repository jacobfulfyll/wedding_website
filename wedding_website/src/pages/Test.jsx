import React from 'react';
import { getGuests, seedGuests, getUniqueNewGuestsFromSheets, clearTable, exportGuestsToSheets } from 'wasp/client/operations';

function Test() {
  const handleOperation = async (operation) => {
    try {
      if (operation === 'seedGuests') {
        console.log('Seeding Guests...');
        await seedGuests();
        console.log('Guests Table seeded successfully');
      } 
      else if (operation === 'getGuests') {
        const guests = await getGuests();
        console.log('Guests:', guests);
      } 
      else if (operation === 'updateGuestsDbFromSheets') {
        try {
          const guests = await getGuests();
          console.log('Existing Guests:', guests);
          
          const uniqueNewGuests = await getUniqueNewGuestsFromSheets(guests);
          console.log('Unique New Guests:', uniqueNewGuests);

          if (uniqueNewGuests.length > 0) {
            const seedResult = await seedGuests(uniqueNewGuests);
            console.log('Seed Result:', seedResult);
          } else {
            console.log('No new guests to add.');
          }
        } catch (error) {
          console.error('Error updating guests from sheets:', error);
          // Handle the error appropriately
        }
      }
      else if (operation === 'clearGuests') {
        console.log('Clearing Guests table...');
        const result = await clearTable('Guest');
        if (result.success) {
          console.log(result.message);
        } else {
          console.error('Error clearing Guests table:', result.error);
        }
      }
      // New functionality for exporting guests to sheets
      else if (operation === 'exportGuestsToSheets') {
        console.log('Exporting Guests to Sheets...');
        const guests = await getGuests(); // Fetch guests first
        const result = await exportGuestsToSheets(guests); // Pass guests to export function
        if (result.success) {
          console.log(result.message);
        } else {
          console.error('Error exporting Guests to Sheets:', result.error);
        }
      }
    } catch (error) {
      console.error('Error in operation:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
      <Button onClick={() => handleOperation('seedGuests')}>
        seedGuests()
      </Button>
      <Button onClick={() => handleOperation('getGuests')}>
        getGuests()
      </Button>
      <Button onClick={() => handleOperation('updateGuestsDbFromSheets')}>
        Update Guests DB From Sheets
      </Button>
      <Button onClick={() => handleOperation('clearGuests')}>
        Clear Guests Table
      </Button>
      {/* New button for exporting guests to sheets */}
      <Button onClick={() => handleOperation('exportGuestsToSheets')}>
        Export Guests to Sheets
      </Button>
    </div>
  );
}

const Button = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '20px 40px',
      fontSize: '24px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

export default Test;

