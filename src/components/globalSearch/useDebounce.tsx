import { useState, useEffect } from 'react';

const useDebounce = <T,>(value: T, delay = 1000): T => {

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {

    const handler = setTimeout(() => setDebouncedValue(value), delay);
    // console.log("debouncedValue trigger")
    return () => clearTimeout(handler);

  }, [value, delay]);

  return debouncedValue;

};

export default useDebounce;
