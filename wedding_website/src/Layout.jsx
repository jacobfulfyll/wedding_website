import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Main.css";

// List of paths that should not be wrapped in the layout
const excludedPaths = ['/rsvp'];

export function Layout({ children }) {
  const location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const openSubMenu = () => {
    setIsSubMenuOpen(true);
  };

  const closeSubMenu = () => {
    setIsSubMenuOpen(false);
  };

  // Check if the current path is in the excluded list
  if (excludedPaths.includes(location.pathname)) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="bg-background w-full z-10 fixed top-0 left-0">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/">
            <img src="/images/wedding_logo.png" alt="Logo" className="h-20 w-30 mt-1 mb-1" />
          </Link>
          <nav>
            <ul className="flex space-x-20">
              {['Home', 'Registry', 'Itinerary', 'Plan Your Stay'].map((item) => {
                const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                const isActive = location.pathname === path;
                return (
                  <li key={item} className="relative group">
                    {item !== 'Plan Your Stay' ? (
                      <Link to={path}>
                        <div className="px-2 py-1">
                          <h2 className={`font-cormorant-garamond font-light text-3xl ${isActive ? 'text-black group-hover:text-sky' : 'text-black group-hover:text-sky'}`}>
                            {item}
                          </h2>
                          <div className={`absolute bottom-0 left-0 w-full h-0.5 ${isActive ? 'bg-black group-hover:bg-sky' : 'bg-charcoal group-hover:bg-sky'} ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform duration-300 ease-in-out`}></div>
                        </div>
                      </Link>
                    ) : (
                      <div 
                        className="px-2 py-1 cursor-default" 
                        onMouseEnter={openSubMenu}
                        onMouseLeave={closeSubMenu}
                      >
                        <h2 className="font-cormorant-garamond font-light text-3xl text-black">
                          {item}
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                      </div>
                    )}
                    {item === 'Plan Your Stay' && (
                      <div 
                        className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-full min-w-max bg-[#fdf8f2] shadow-md origin-top transition-all duration-300 ease-in-out ${isSubMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        onMouseEnter={openSubMenu}
                        onMouseLeave={closeSubMenu}
                      >
                        {['Things to Do', 'Accommodations', 'Travel', 'FAQs'].map((subItem, index) => (
                          <div key={subItem}>
                            <Link to={`/${subItem.toLowerCase().replace(/\s+/g, '-')}`} onClick={closeSubMenu}>
                              <div className="px-4 py-2 hover:bg-charcoal hover:bg-opacity-10 transition-colors duration-200 text-center">
                                <h2 className="font-cormorant-garamond font-light text-xl text-black whitespace-nowrap">
                                  {subItem}
                                </h2>
                              </div>
                            </Link>
                            {index < 3 && <div className="mx-auto w-4/5 h-px bg-charcoal"></div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link 
            to='/rsvp' 
            className='elegant-button-primary'
          >
            <h2 className='font-garamond font-light text-3xl text-white'>RSVP</h2>
          </Link>
        </div>
      </header>
      <main className="flex-grow mt-16">
        {children}
      </main>
      <footer className="bg-background">
        <div className="container mx-auto p-4">
          <p className="text-center text-gray-500 text-sm">
            wedding_website ~ Powered by Wasp
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;