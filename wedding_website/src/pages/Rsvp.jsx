import React, { useState, useEffect } from 'react';
import { getGuests, useQuery, updateGuestEvents } from 'wasp/client/operations';
import { Link } from 'react-router-dom';

const RsvpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    welcomeParty: false,
    wedding: false,
    farewellBrunch: false,
    rehearsalDinner: false,
  });
  const { data: guests, isLoading, error: fetchError } = useQuery(getGuests);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyRsvp, setFamilyRsvp] = useState({});

  useEffect(() => {
    if (guests && searchTerm) {
      const filtered = guests.filter(guest => 
        `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRecommendations(filtered);
      setSelectedIndex(-1);
    } else {
      setRecommendations([]);
      setSelectedIndex(-1);
    }
  }, [searchTerm, guests]);

  useEffect(() => {
    if (selectedGuest && selectedGuest.family_name) {
      const familyGuests = guests.filter(guest => 
        guest.family_name === selectedGuest.family_name && guest.id !== selectedGuest.id
      );
      setFamilyMembers(familyGuests);
      const initialFamilyRsvp = familyGuests.reduce((acc, guest) => {
        acc[guest.id] = null;
        return acc;
      }, {});
      setFamilyRsvp(initialFamilyRsvp);
    } else {
      setFamilyMembers([]);
      setFamilyRsvp({});
    }
  }, [selectedGuest, guests]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prevIndex => 
        prevIndex < recommendations.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectGuest(recommendations[selectedIndex]);
      } else {
        const [firstName, lastName] = searchTerm.split(' ');
        const guest = guests.find(g => g.first_name.toLowerCase() === firstName.toLowerCase() && g.last_name.toLowerCase() === lastName.toLowerCase());
        if (guest) {
          selectGuest(guest);
        } else {
          setError('Guest not found. Please try again.');
        }
      }
    }
  };

  const selectGuest = (guest) => {
    setSelectedGuest(guest);
    setSearchTerm('');
    setRecommendations([]);
    setError('');
  };

  const handleFamilyRsvpChange = (guestId, value) => {
    setFamilyRsvp(prev => ({ ...prev, [guestId]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the guest IDs for updating
      const guestIds = [selectedGuest.id, ...Object.entries(familyRsvp)
        .filter(([_, value]) => value === true)
        .map(([id, _]) => parseInt(id))
      ];

      // Debugging: Log guestIds to ensure it's an array
      console.log('Guest IDs:', guestIds);

      // Prepare the events data
      const events = {
        welcomeParty: formData.welcomeParty,
        wedding: formData.wedding,
        farewellBrunch: formData.farewellBrunch,
        rehearsalDinner: formData.rehearsalDinner,
      };

      // Call the updateGuestEvents action
      await updateGuestEvents({ guestIds, events });

      console.log('RSVP updated successfully');

      // Reset the form and selected guest
      setFormData({
        welcomeParty: false,
        wedding: false,
        farewellBrunch: false,
        rehearsalDinner: false,
      });
      setSelectedGuest(null);
      setFamilyRsvp({});
    } catch (error) {
      console.error('Error updating RSVP:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (isLoading) return 'Loading...';
  if (fetchError) return 'Error: ' + fetchError;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative pt-20">
      <Link
        to="/"
        className="absolute top-10 left-10 text-lg text-charcoal hover:text-sky-blue transition-all duration-300 hover:text-xl"
      >
        &lt; Home
      </Link>
      <div className="w-full max-w-5xl flex items-center justify-center mb-5">
        {!selectedGuest && (
          <>
            <div className="w-1/2">
              <div className="h-full flex items-center justify-end mr-20">
                <img src="/images/disco_pic.png" alt="Disco Picture" className="w-3/5 object-cover rounded-lg shadow-hanging" />
              </div>
            </div>
            <div className="w-1/2">
              <h2 className="text-6xl mb-4 text-black">Hi There!</h2>
              <h2 className="text-4xl text-black">Thanks for joining us...</h2>
            </div>
          </>
        )}
        {selectedGuest && (
          <div className="w-full">
            <h2 className="text-6xl mb-4 text-black text-center">
              Hi {selectedGuest.first_name}!
            </h2>
            <h2 className="text-4xl text-black text-center">Thanks for joining us...</h2>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl mt-10 relative">
        <div className={`${selectedGuest ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <input
            type="text"
            placeholder="Search for your name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-5 py-5 text-4xl text-black bg-[#fdf8f2] font-snell border-y border-x border-black shadow-elegant focus:outline-none focus:ring-2 focus:ring-sky-light indent-[30px] leading-tight mt-[-0.25em]"
          />
          {recommendations.length > 0 && (
            <ul className="mt-4 bg-white rounded-lg shadow-hanging">
              {recommendations.map((guest, index) => (
                <li 
                  key={guest.id} 
                  className={`w-full px-5 py-4 text-4xl text-black border-black bg-[#fdf8f2] font-snell cursor-pointer hover:bg-charcoal-light ${
                    recommendations.length === 1 ? 'border-y' : 
                    index === recommendations.length - 1 ? 'border-y' : 'border-t'
                  } ${
                    index === selectedIndex ? 'bg-charcoal-light' : ''
                  }`}
                  onClick={() => selectGuest(guest)}
                >
                  {guest.first_name} {guest.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className={`transition-opacity duration-500 ${selectedGuest ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute top-0 left-0 w-full`}>
          {selectedGuest && (
            <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
              {familyMembers.length > 0 && (
                <div className="mb-10">
                  <h5 className="text-4xl mb-4 text-center">Who is included in this RSVP:</h5>
                  {familyMembers.map(member => (
                    <div key={member.id} className="mb-4 flex items-center ml-10">
                      <input
                        type="checkbox"
                        id={`family-${member.id}`}
                        className="custom-checkbox mr-3"
                        checked={familyRsvp[member.id] === true}
                        onChange={(e) => handleFamilyRsvpChange(member.id, e.target.checked)}
                      />
                      <label htmlFor={`family-${member.id}`} className="text-2xl cursor-pointer text-forest">
                        {member.first_name} {member.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <h5 className="text-4xl mb-4 text-center mt-10">Which Events Will You Attend:</h5>
              <div className="space-y-4 ml-10">
                <label className="flex items-center text-2xl cursor-pointer text-forest">
                  <input
                    type="checkbox"
                    checked={formData.welcomeParty}
                    onChange={(e) => setFormData({...formData, welcomeParty: e.target.checked})}
                    className="custom-checkbox h-6 w-6 text-sky-blue mr-3"
                  />
                  Welcome Party
                </label>
                <label className="flex items-center text-2xl cursor-pointer text-forest">
                  <input
                    type="checkbox"
                    checked={formData.wedding}
                    onChange={(e) => setFormData({...formData, wedding: e.target.checked})}
                    className="custom-checkbox h-6 w-6 text-sky-blue mr-3"
                  />
                  Wedding
                </label>
                <label className="flex items-center text-2xl cursor-pointer text-forest">
                  <input
                    type="checkbox"
                    checked={formData.farewellBrunch}
                    onChange={(e) => setFormData({...formData, farewellBrunch: e.target.checked})}
                    className="custom-checkbox h-6 w-6 text-sky-blue mr-3"
                  />
                  Farewell Brunch
                </label>
                {selectedGuest.bridal_party && (
                  <label className="flex items-center text-2xl cursor-pointer text-forest">
                    <input
                      type="checkbox"
                      checked={formData.rehearsalDinner}
                      onChange={(e) => setFormData({...formData, rehearsalDinner: e.target.checked})}
                      className="custom-checkbox h-6 w-6 text-sky-blue mr-3"
                    />
                    Rehearsal Dinner
                  </label>
                )}
              </div>
              <div className="flex justify-center mt-20">
                <button type="submit" className="elegant-button-primary">
                  Submit RSVP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RsvpPage;

export const RsvpPageWithoutLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <RsvpPage />
    </div>
  );
}
