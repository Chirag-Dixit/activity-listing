import React, { createContext, useState, useContext } from "react";

const defaultFilters = { 
  search: "", 
  types: [], 
  status: null,
  program: null,
  sortBy: "date",
  sortOrder: "asc",
};

const FiltersContext = createContext({
  filters: defaultFilters,
  setFilters: () => {},
  resetFilters: () => {},
});

export const FiltersProvider = ({ children }) => {
  const [filters, setFiltersState] = useState(defaultFilters);
  
  const setFilters = (f) => setFiltersState((prev) => ({ ...prev, ...f }));
  
  const resetFilters = () => setFiltersState(defaultFilters);
  
  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
export default FiltersContext;
