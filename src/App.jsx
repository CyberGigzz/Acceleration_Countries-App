import { useState, useEffect } from 'react';
import axios from 'axios';
import CountrySelect from './components/CountrySelect';
import CountryDetails from './components/CountryDetails';
import InfoLinks from './components/InfoLinks';
import CurrencyExchange from './components/CurrencyExchange';
import Airports from './components/Airports';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [activeLink, setActiveLink] = useState('currency');
  const [userLocation, setUserLocation] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries', error);
      });
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK') {
            const countryComponent = data.results[0].address_components.find(
              (component) => component.types.includes('country')
            );
            if (countryComponent) {
              setSelectedCountry(countryComponent.short_name);
            }
          }
        })
        .catch((error) => {
          console.error('Error getting country', error);
        });
    }
  }, [userLocation, apiKey]);

  const selectedCountryDetails = countries.find(
    (country) => country.cca2 === selectedCountry
  );

  const options = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
  }));

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
  };

  return (
    <div className="p-6 border-solid border-2 max-w-7xl  w-full m-4">
      <CountrySelect
        options={options}
        selectedCountry={selectedCountry}
        handleChange={handleChange}
      />
      <CountryDetails
        selectedCountryDetails={selectedCountryDetails}
        countries={countries}
      />
      <InfoLinks activeLink={activeLink} setActiveLink={setActiveLink} />
      {/* <CurrencyExchange selectedCountryDetails={selectedCountryDetails} countries={countries} /> */}
      {activeLink === 'currency' ? (
        <CurrencyExchange
          selectedCountryDetails={selectedCountryDetails}
          countries={countries}
        />
      ) : (
        <Airports selectedCountryDetails={selectedCountryDetails} />
      )}
    </div>
  );
};

export default App;
