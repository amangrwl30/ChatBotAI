import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const HistoryAutoSuggest = ({placeholder, onChange}) => {
  // Load search history from localStorage on component mount
  const [searchHistory, setSearchHistory] = useState(() => {
    const savedHistory = typeof window !== 'undefined' ? localStorage.getItem('searchHistory') : null;
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [selectedValue, setSelectedValue] = useState(null);

  // Save to localStorage whenever searchHistory changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    onChange(newValue?.value)
    if (newValue?.value) {
      // Add new value to search history (move to top if exists)
      setSearchHistory(prev => [
        newValue.value,
        ...prev.filter(item => item !== newValue.value)
      ].slice(0, 10)); // Keep only last 10 items
    }
  };

  // Convert search history to react-select options
  const options = searchHistory.map(item => ({
    value: item,
    label: item,
  }));

  return (
    <div className="w-[310px]">
      <CreatableSelect
        formatCreateLabel={(inputValue) => inputValue} // This removes the "Create" prefix
        isClearable
        options={options}
        value={selectedValue}
        onChange={handleChange}
        placeholder={placeholder}
        unstyled
        classNames={{
          control: (state) => 
            `w-full rounded-lg border-2 p-2 text-sm ${
              state.isFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'
            }`,
          menu: () => 'mt-2 border border-gray-300 rounded-lg bg-white shadow-lg text-left',
          option: (state) => 
            `px-4 py-2 text-sm hover:bg-gray-100 ${
              state.isSelected ? 'bg-blue-100' : ''
            } ${state.isFocused ? 'bg-gray-100' : ''}`,
          input: () => 'text-gray-900',
          placeholder: () => 'text-gray-400 text-left',
          clearIndicator: () => 'text-gray-400 hover:text-red-500',
          indicatorSeparator: () => 'bg-gray-300',
          dropdownIndicator: () => 'text-gray-400 hover:text-gray-500',
        }}
      />
    </div>
  );
};

export default HistoryAutoSuggest;