import React from 'react';
import { Link } from 'wasp/client/router';

const Home = () => {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <div className='h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: 'url(/images/hero_image.jpg)' }}>
        <div className='flex-grow bg-black bg-opacity-50 flex items-start justify-center'>
          <div className='text-background h-[20%] flex flex-col items-center justify-start pt-40 mt-7'>
            <h1 className='mb-10 text-center'>Juliet & Jacob</h1>
            <h3 className='mb-5 text-center'>8.30.25</h3>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className='h-[100vh] flex bg-background'>
        {/* Left side - Image */}
        <div className='w-3/5 flex items-center justify-center'>
          <div className="relative w-224 h-168 my-8">
            <img
              src="/images/woodstock_transition.png"
              alt="Woodstock, VT"
              className="w-full h-full object-cover rounded-2xl border border-forest shadow-inner"
            />
            <div className="absolute inset-0 rounded-2xl shadow-elegant pointer-events-none"></div>
          </div>
        </div>
        {/* Right side - Text */}
        <div className='w-2/5 flex items-center justify-center'>
          <div className='w-4/5 border-black border rounded-xl shadow-[0px_0px_40px_rgba(0,0,0,0.3)] p-6 mr-20'>
            <h4 className='text-center leading-relaxed'>
              3:30pm<br />
              The Woodstock Inn<br />
              14 The Green,<br />
              Woodstock, VT 05901
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;