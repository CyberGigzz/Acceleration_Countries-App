import { useState, useEffect } from 'react';
import axios from 'axios';

const Airports = ({ selectedCountryDetails }) => {
  const [search, setSearch] = useState('');
  const [airports, setAirports] = useState([]);

  const apiKey = import.meta.env.VITE_AIRPORTS_API_KEY;

  //   useEffect(() => {
  //     if (selectedCountryDetails.name) {
  //       const url = `https://api.api-ninjas.com/v1/airports?name=${selectedCountryDetails.name.common}`;
  //       axios
  //         .get(url, {
  //           headers: {
  //             'X-Api-Key': apiKey,
  //           },
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           setAirports(response.data);
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching airports', error);
  //           if (error.response) {
  //             console.log(error.response.data);
  //             console.log(error.response.status);
  //             console.log(error.response.headers);
  //           }
  //         });
  //     }
  //   }, [selectedCountryDetails]);

  useEffect(() => {
    if (selectedCountryDetails.name) {
      console.log(selectedCountryDetails);
      const url = `https://api.api-ninjas.com/v1/airports?country=${selectedCountryDetails.cca2}`;
      axios
        .get(url, {
          headers: {
            'X-Api-Key': apiKey,
          },
        })
        .then((response) => {
          console.log(response.data);
          setAirports(response.data);
        })
        .catch((error) => {
          console.error('Error fetching airports', error);
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    }
  }, [selectedCountryDetails]);

  //   useEffect(() => {
  //     if (selectedCountryDetails.name) {
  //       console.log(selectedCountryDetails.name.common);
  //       //   const url = `https://api.api-ninjas.com/v1/airports?country=${encodeURIComponent(
  //       //     selectedCountryDetails.iso2Code
  //       const url = `https://api.api-ninjas.com/v1/airports?country=${selectedCountryDetails.name.common}
  //       )}`;
  //       axios
  //         .get(url, {
  //           headers: {
  //             'X-Api-Key': apiKey,
  //           },
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           setAirports(response.data);
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching airports', error);
  //           if (error.response) {
  //             console.log(error.response.data);
  //             console.log(error.response.status);
  //             console.log(error.response.headers);
  //           }
  //         });
  //     }
  //   }, [selectedCountryDetails]);

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
        className="mt-5"
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
