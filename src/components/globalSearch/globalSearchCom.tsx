import React, { useState, useEffect } from 'react';
import InputField from './inputField';
import useDebounce from './useDebounce';

interface SearchFilterProps {
  apiUrl: string;
  type: string;
  filterFunction: (data: any[], input: string) => any[];
  searchCategory : string;
  placeholder?: string;
}

const GlobalSearch: React.FC<SearchFilterProps> = ({ apiUrl, type, filterFunction, searchCategory, placeholder }) => {
  const [input, setInput] = useState('');
  const [searchData, setSearchData] = useState<any[]>([]);
  const [apiData, setApiData] = useState<any[]>([]); 
  const debouncedInput = useDebounce(input);

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

  // Filter data based on the debounced input
  useEffect(() => {
    if (debouncedInput.trim() === '') {
        console.log("Debounced Input is empty:", debouncedInput);
      setSearchData(apiData);
      filterFunction(apiData, debouncedInput);
    } else {
        console.log("Debounced Input:", debouncedInput);
        const filteredData = apiData.filter((user) => {
            // console.log("User Api Data:", user)
        if (user[searchCategory]) {
          return user[searchCategory].toLowerCase().includes(debouncedInput.toLowerCase());
        }
        return false; 
      });
      // Use filterFunction to get filtered results
      const filteredResults = filterFunction(filteredData, debouncedInput);
      setSearchData(filteredResults);
    }
    
    console.log("Filtered Results:", searchData);
  }, [debouncedInput, apiData, filterFunction]);

  return (
    <>
      <InputField type={type} value={input} onChange={setInput} placeholder={placeholder} />
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

export default GlobalSearch;
