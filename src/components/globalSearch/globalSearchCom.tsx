import React, { useState, useEffect, useCallback, useMemo } from 'react';
import InputField from './inputField';
import useDebounce from './useDebounce';

interface SearchFilterProps {
  apiUrl: string;
  type: string;
  filterFunction: (data: any[], input: string) => any[];
  searchCategory: string;
  placeholder?: string;
}

const GlobalSearch: React.FC<SearchFilterProps> = ({ apiUrl, type, filterFunction, searchCategory, placeholder }) => {
  const [input, setInput] = useState('');
  const [searchData, setSearchData] = useState<any[]>([]);
  const [apiData, setApiData] = useState<any[]>([]);

  // Debounce the input to avoid frequent API calls
  const debouncedInput = useDebounce(input);

  // Fetch the data only once, on component mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setApiData(data);
        setSearchData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApiData();
  }, [apiUrl]);

  // Memoized filter logic to avoid re-filtering unless debouncedInput or apiData changes
  const filteredData = useMemo(() => {
    if (debouncedInput.trim() === '') {
      return apiData;
    } else {
      return apiData.filter((item) => {
        return item[searchCategory]?.toLowerCase().includes(debouncedInput.toLowerCase());
      });
    }
  }, [debouncedInput, apiData, searchCategory]);

  // Update the filtered data when debounced input changes
  useEffect(() => {
    const results = filterFunction(filteredData, debouncedInput);
    setSearchData(results);
  }, [debouncedInput, filteredData, filterFunction]);

  // Memoize the input field to avoid unnecessary re-renders
  const memoizedInputField = useMemo(() => {
    return (
      <InputField
        type={type}
        value={input}
        onChange={setInput}
        placeholder={placeholder}
      />
    );
  }, [type, input, placeholder]);

  return (
    <>
      {memoizedInputField}
      {/* <div>
        {searchData.length > 0 ? (
          searchData.map((item, index) => (
            <p key={index}>{item.customerName}</p> // Adjust based on your data structure
          ))
        ) : (
          <p>No results found</p>
        )}
      </div> */}
    </>
  );
};

export default React.memo(GlobalSearch); // Memoizing the component itself
