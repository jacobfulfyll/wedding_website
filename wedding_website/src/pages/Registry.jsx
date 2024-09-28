import React from 'react';
import FlipCards from '../components/FlipCards';

const RegistryPage = () => {
  const onlineCashFundFrontImages = ['images/disco_pic.png'];
  const onlineCashFundBackImages = ['images/hero_image.jpg'];
  const onlineCashFundFrontTexts = ['Cash Gift'];
  const onlineCashFundLinks = ['https://www.honeyfund.com/site/press-mazzola-08-30-2025'];
  const onlineCashFundBackTexts = ['Thanks a ton for your generosity'];
  const onlineCashFundButtonTexts = ['View Registry'];

  const storeRegistriesFrontImages = [
    'images/bennington_potters.jpg',
    'images/crate_and_barrel.jpeg',
    'images/william_sonoma.jpg'
  ];
  const storeRegistriesBackImages = [
    'images/bennington_potters.jpg',
    'images/crate_and_barrel.jpeg',
    'images/william_sonoma.jpg'
  ];
  const storeRegistriesFrontTexts = [
    'Bennington Potters',
    'Crate & Barrel',
    'William Sonoma'
  ];
  const storeRegistriesLinks = [
    'https://www.benningtonpotters.com/registry',
    'https://www.crateandbarrel.com/gift-registry/kate-and-jeremy-bennington/r6324888',
    'https://www.williamsonoma.com/gift-registry/kate-bennington/r6324888'
  ];
  const storeRegistriesBackTexts = [
    'Bennington Potters',
    'Crate & Barrel',
    'William Sonoma'
  ];
  const storeRegistriesButtonTexts = [
    'View Registry',
    'View Registry',
    'View Registry'
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <h4 className="text-center text-5xl font-bold mt-12 mb-8">Store Registries</h4> {/* Reduced bottom margin */}
      <FlipCards numberOfCards={3} frontImages={storeRegistriesFrontImages} backImages={storeRegistriesBackImages} frontTexts={storeRegistriesFrontTexts} links={storeRegistriesLinks} backTexts={storeRegistriesBackTexts} buttonTexts={storeRegistriesButtonTexts}/>
      <h4 className="text-center text-5xl font-bold mt-20 mb-8">Online Cash Fund</h4> {/* Reduced top and bottom margins */}
      <FlipCards numberOfCards={1} frontImages={onlineCashFundFrontImages} backImages={onlineCashFundBackImages} frontTexts={onlineCashFundFrontTexts} links={onlineCashFundLinks} backTexts={onlineCashFundBackTexts} buttonTexts={onlineCashFundButtonTexts}/>
      </div>
    </div>
  );
};

export default RegistryPage;