import { useState, useEffect } from 'react';
import axios from 'axios';

const LoadingSkeleton = () => {
  return (
    <div className="mt-5 p-5 shadow-lg">
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
    </div>
  );
};

const Airports = ({ selectedCountryDetails }) => {
  const [search, setSearch] = useState('');
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiKey = import.meta.env.VITE_AIRPORTS_API_KEY;

  useEffect(() => {
    if (selectedCountryDetails.name) {
      const url = `https://api.api-ninjas.com/v1/airports?country=${selectedCountryDetails.cca2}`;
      axios
        .get(url, {
          headers: {
            'X-Api-Key': apiKey,
          },
        })
        .then((response) => {
          setAirports(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching airports', error);
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
          setIsLoading(false);
        });
    }
  }, [selectedCountryDetails, apiKey]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const filteredAirports = airports.filter((airport) =>
    airport.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 shadow-lg">
      <h1 className="text-3xl font-bold">Airports</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search airports..."
        className="mt-5 p-2 w-full border-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      {airports.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {filteredAirports.map((airport, index) => (
            <div key={index} className="border p-2">
              {airport.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Airports;
