import { TypicalPlanCardFilterEntitiesDto } from "api/requests/pspControl/plan-typical-violations/dto-types";
import { useState, useRef, useContext, FC, createContext } from "react";

const SortViolationContext = createContext({});

export const useSortViolationsValue = () => useContext(SortViolationContext);

export const SortViolationProvider: FC = ({ children }) => {
  const [values, setValues] = useState({});
  const valuesRef = useRef({});

  const handleChange = (e: any, item: TypicalPlanCardFilterEntitiesDto) => {
    const newItems = {
      ...values,
      [item.id]: {
        ...values[item.id],
        [e.target.name]: e.target.value,
      },
    };

    setValues(newItems);
    valuesRef.current = newItems;
  };

  const handleClear = () => {
    valuesRef.current = {}
    setValues({})
  }

  return (
    <SortViolationContext.Provider
      value={{
        setValues,
        values,
        valuesRef: valuesRef.current || {},
        onChange: handleChange,
        onClear: handleClear,
      }}
    >
      {children}
    </SortViolationContext.Provider>
  );
};
