import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

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

  // const handleCountryChange = (event) => {
  //   setSelectedCountry(event.target.value);
  // };

  const options = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
  }));

  console.log(options);

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
  };

  return (
    <div className="p-6 border-solid border-2 max-w-7xl  w-full m-4">
      {/* <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className="max-w-xs w-64"
      >
        <option value="" disabled hidden>
          Choose a country
        </option>
        {countries.map((country) => (
          <option key={country.cca2} value={country.cca2}>
            {country.name.common}
          </option>
        ))}
      </select> */}
      <Select
        value={options.find((option) => option.value === selectedCountry)}
        onChange={handleChange}
        options={options}
        className="w-full hover:cursor-pointer"
      />
      {selectedCountryDetails && (
        <div>
          <h2>
            <img
              src={selectedCountryDetails.flags.png}
              alt={`${selectedCountryDetails.name.common} flag`}
              style={{ width: '50px', height: 'auto' }}
            />
            {selectedCountryDetails.name.common}
          </h2>
          <p>Capital: {selectedCountryDetails?.capital}</p>
          <p>Region: {selectedCountryDetails?.region}</p>
          <p>Subregion: {selectedCountryDetails?.subregion}</p>
          <p>
            Population: {selectedCountryDetails?.population.toLocaleString()}
          </p>
          <p>
            Borders:{' '}
            {selectedCountryDetails.borders?.map((border) => {
              const borderCountry = countries.find(
                (country) => country.cca3 === border
              );
              return borderCountry ? (
                <span key={border}>{borderCountry.name.common} </span>
              ) : null;
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
