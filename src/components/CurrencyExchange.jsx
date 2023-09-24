import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const CurrencyExchange = ({ selectedCountryDetails, countries }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

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

  useEffect(() => {
    if (selectedCurrency && amount) {
      const baseCurrency = Object.keys(selectedCountryDetails.currencies)[0];
      const url = `https://api.exchangerate.host/convert?from=${baseCurrency}&to=${selectedCurrency}`;

      axios
        .get(url)
        .then((response) => {
          const rate = response.data.info.rate;
          setConvertedAmount(amount * rate);
        })
        .catch((error) => console.error('Error fetching exchange rate', error));
    }
  }, [selectedCurrency, amount, selectedCountryDetails]);

  const handleChange = (selectedOption) => {
    setSelectedCurrency(selectedOption.value);
  };

  return (
    <div className="shadow-lg p-5">
      <h2 className="text-3xl font-bold">Currency Exchange</h2>
      {options.length > 0 && (
        <div style={{ marginTop: '20px', width: '25%' }}>
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
      <div className="mt-5 flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input type="number" value={convertedAmount} readOnly />
      </div>
    </div>
  );
};

export default CurrencyExchange;
