// InfoLinks.js
// import { useState } from 'react';

const InfoLinks = ({ activeLink, setActiveLink }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-start my-4  border-gray-200">
      <a
        href="#"
        className={`pb-2 sm:mr-4 ${
          activeLink === 'currency'
            ? 'border-b-2 text-blue-500 border-blue-500'
            : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          setActiveLink('currency');
        }}
      >
        CURRENCY EXCHANGE
      </a>
      <a
        href="#"
        className={`pb-2 sm:mr-4 ${
          activeLink === 'airports'
            ? 'border-b-2 text-blue-500 border-blue-500'
            : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          setActiveLink('airports');
        }}
      >
        AIRPORTS
      </a>
    </div>
  );
};

export default InfoLinks;
