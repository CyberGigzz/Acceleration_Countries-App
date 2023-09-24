import Select, { components } from 'react-select';

import { BeatLoader } from 'react-spinners';

const DropdownIndicator = (props) => {
  return props.selectProps.isLoading ? null : (
    <components.DropdownIndicator {...props} />
  );
};

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
        }}
        isDisabled={isLoading}
        components={{ DropdownIndicator }}
      />
      {isLoading && (
        <div className="absolute right-0 top-0 h-full flex items-center pr-2">
          <BeatLoader size={8} color={'#123abc'} loading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
