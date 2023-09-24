import getSymbolFromCurrency from 'currency-symbol-map';

const CountryDetails = ({ selectedCountryDetails, countries }) => {
  if (!selectedCountryDetails) {
    return (
      <div className="mt-5 p-5 shadow-lg">
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
      </div>
    );
  }

  return (
    <div className="mt-5 p-5 shadow-lg">
      {selectedCountryDetails && (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-3xl font-bold">
              {selectedCountryDetails.name.common}
            </h2>
            <img
              src={selectedCountryDetails.flags.png}
              alt={`${selectedCountryDetails.name.common} flag`}
              className="w-14 h-auto"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>Capital: {selectedCountryDetails?.capital}</p>
            <p>
              Currency:{' '}
              {Object.values(selectedCountryDetails?.currencies)[0].name} (
              {getSymbolFromCurrency(
                Object.keys(selectedCountryDetails?.currencies)[0]
              )}
              )
            </p>
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
                  <span
                    key={border}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {borderCountry.name.common}
                  </span>
                ) : null;
              })}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CountryDetails;
