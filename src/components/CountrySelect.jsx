import Select from 'react-select';

const CountrySelect = ({ options, selectedCountry, handleChange }) => {
  return (
    <Select
      value={options.find((option) => option.value === selectedCountry)}
      onChange={handleChange}
      options={options}
      className="w-full"
      styles={{
        control: (provided) => ({
          ...provided,
          cursor: 'pointer',
          padding: '13px 6.5px',
          fontSize: '16px',
        }),
      }}
    />
  );
};

export default CountrySelect;
