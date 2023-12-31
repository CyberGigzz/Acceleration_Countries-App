import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { getCache, setCache } from './apiCache';

const LoadingSkeleton = () => {
  return (
    <div className="mt-5 p-5 shadow-lg">
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
    </div>
  );
};

const CurrencyExchange = ({ selectedCountryDetails, countries, isLoading }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState('');

  // console.log(selectedCurrency);
  // console.log(amount);
  // console.log(convertedAmount);

  let options = [];
  if (
    countries &&
    selectedCountryDetails &&
    selectedCountryDetails.currencies
  ) {
    options = countries
      .map((country) => {
        if (country.currencies) {
          return {
            value: Object.keys(country.currencies)[0],
            label: `${country.name.common} (${
              Object.keys(country.currencies)[0]
            })`,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  // useEffect(() => {
  //   if (selectedCurrency && amount) {
  //     const baseCurrency = Object.keys(selectedCountryDetails.currencies)[0];
  //     const url = `https://api.exchangerate.host/convert?from=${baseCurrency}&to=${selectedCurrency}`;

  //     axios
  //       .get(url)
  //       .then((response) => {
  //         const rate = response.data.info.rate;
  //         const converted = amount * rate;
  //         setConvertedAmount(converted.toFixed(2));
  //       })
  //       .catch((error) => console.error('Error fetching exchange rate', error));
  //   }
  // }, [selectedCurrency, amount, selectedCountryDetails]);

  useEffect(() => {
    if (selectedCurrency && amount) {
      const cachedData = getCache(
        `${selectedCountryDetails.cca2}-${selectedCurrency}`
      );
      if (cachedData) {
        const rate = cachedData;
        const converted = amount * rate;
        setConvertedAmount(converted.toFixed(2));
      } else {
        const baseCurrency = Object.keys(selectedCountryDetails.currencies)[0];
        const url = `http://api.exchangerate.host/convert?from=${baseCurrency}&to=${selectedCurrency}&access_key=6ff1f3c5f82f5920e8582f7212cfc6c3&amount=${amount}`;

        axios
          .get(url)
          .then((response) => {
            if (response.data && response.data.success) {
              const rate = response.data.info.quote;
              const converted = amount * rate;
              setConvertedAmount(converted.toFixed(2));
              setCache(
                `${selectedCountryDetails.cca2}-${selectedCurrency}`,
                rate
              );
            } else {
              console.error('Unexpected API response', response);
              if (response.data && response.data.error) {
                console.error('API Error details', response.data.error);
              }
            }
          })
          .catch((error) =>
            console.error('Error fetching exchange rate', error)
          );
      }
    }
  }, [selectedCurrency, amount, selectedCountryDetails]);

  const handleChange = (selectedOption) => {
    setSelectedCurrency(selectedOption.value);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="shadow-lg p-5">
      {selectedCountryDetails && (
        <>
          <h2 className="text-3xl font-bold">Currency Exchange</h2>
          {options.length > 0 && (
            <div style={{ marginTop: '20px', width: '160px' }}>
              <Select
                value={options.find(
                  (option) => option && option.value === selectedCurrency
                )}
                onChange={handleChange}
                options={options}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    cursor: 'pointer',
                    fontSize: '16px',
                  }),
                }}
                menuPlacement="auto"
              />
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-start">
            <div
              className="input-wrapper"
              data-symbol={
                selectedCountryDetails && selectedCountryDetails.currencies
                  ? selectedCountryDetails.currencies[
                      Object.keys(selectedCountryDetails.currencies)[0]
                    ].symbol
                  : ''
              }
            >
              <input
                type="number"
                pattern="\d*"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value !== '' && !isNaN(value) && value >= 0) {
                    setAmount(value);
                  }
                }}
                className="flex-grow p-2 pl-8 border-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="hidden sm:flex items-center text-xl font-bold text-gray-700">
              =
            </div>

            <div
              className="input-wrapper"
              data-symbol={
                selectedCurrency
                  ? countries.find(
                      (country) =>
                        country.currencies &&
                        Object.keys(country.currencies)[0] === selectedCurrency
                    ).currencies[selectedCurrency].symbol
                  : selectedCountryDetails && selectedCountryDetails.currencies
                  ? selectedCountryDetails.currencies[
                      Object.keys(selectedCountryDetails.currencies)[0]
                    ].symbol
                  : ''
              }
            >
              <input
                type="number"
                value={convertedAmount}
                readOnly
                className="flex-grow p-2 pl-8 border-2 border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-normal"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyExchange;
