import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import axios from 'axios';
import CountrySelect from './components/CountrySelect';
import CountryDetails from './components/CountryDetails';
import InfoLinks from './components/InfoLinks';
import CurrencyExchange from './components/CurrencyExchange';
import Airports from './components/Airports';

const App = () => {
  const navigate = useNavigate();
  const { countryCode } = useParams();

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [activeLink, setActiveLink] = useState('currency');
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geoError, setGeoError] = useState(null);

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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching countries', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!countryCode) {
      navigate('/defaultCountryCode');
    }
  }, [countryCode, navigate]);

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
    navigate(`/${selectedOption.value}`);
  };

  return (
    <Router>
      <div className="p-6 border-solid border-2 max-w-7xl  w-full m-4">
        <CountrySelect
          options={options}
          selectedCountry={selectedCountry}
          handleChange={handleChange}
          isLoading={isLoading}
        />
        <Routes>
          <Route
            path="/:countryCode"
            element={
              <>
                <CountryDetails
                  selectedCountryDetails={selectedCountryDetails}
                  countries={countries}
                  isLoading={isLoading}
                />
                <InfoLinks
                  activeLink={activeLink}
                  setActiveLink={setActiveLink}
                  geoError={geoError}
                  userLocation={userLocation}
                  setGeoError={setGeoError}
                  selectedCountryDetails={selectedCountryDetails}
                />
                {activeLink === 'currency' ? (
                  <CurrencyExchange
                    selectedCountryDetails={selectedCountryDetails}
                    countries={countries}
                    isLoading={isLoading}
                  />
                ) : (
                  <Airports selectedCountryDetails={selectedCountryDetails} />
                )}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
