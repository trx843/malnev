import React, {createContext, FC, useContext} from "react";

interface SidePageProviderProps {
  loading?: boolean;
}

interface SidePageContextProps {
  loading: boolean;
}

export const SidePageContext = createContext<SidePageContextProps>({
  loading: false
});

export const useSidePage = () => useContext(SidePageContext);

export const SidePageProvider: FC<SidePageProviderProps> = ({
  loading = false,
  children
}) => {
  return (
    <SidePageContext.Provider value={{ loading }}>
      {children}
    </SidePageContext.Provider>
  );
};
