import Select from 'react-select';
import { BeatLoader } from 'react-spinners';

const CountrySelect = ({
  options,
  selectedCountry,
  handleChange,
  isLoading,
}) => {
  return (
    <div className="relative">
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
          indicatorsContainer: (provided) => ({
            ...provided,
            display: isLoading ? 'none' : 'flex',
          }),
        }}
        isDisabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-2">
          <BeatLoader size={8} color={'#007BFF'} loading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
