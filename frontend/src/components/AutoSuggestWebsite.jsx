import React, { useState } from 'react';
import Select from 'react-select';

const AutoSuggestWebsite = ({onChange}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Debounce logic to wait before fetching
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = debounce(async (query) => {
    if (!query) return;
    setIsLoading(true);
  
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL_LLM_CHATBOT  + `/proxy?query=${query}`);
      const data = await response.json();
      setOptions(data.map((item) => ({ label: item.domain, value: item.domain })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, 600);

  const handleInputChange = (newValue) => {
    console.log('handleInputChange ' + newValue)
    setInputValue(newValue);
    fetchSuggestions(newValue);
  };

  return (
    <div >
      <Select
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onChange={(obj) => onChange(obj)}
        inputValue={inputValue}
        options={options}
        isClearable
        placeholder="www.example.com"
        className="ml-2 border w-[350px] border-gray-300 rounded-lg w-60 focus:outline-none focus:border-indigo-500 text-black"
        required
      />
    </div>
  );
};

export default AutoSuggestWebsite;
