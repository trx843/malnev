import React, { createContext, useContext, useState } from "react";
import { User } from "classes";

export type IndexContextType = {
  currentUser: User;
  isUIB: boolean;
  indexState: string;
  goToState: (goto: string) => void;
};

export const IndexContext = createContext<IndexContextType | null>(null);

export const useIndex = () => useContext(IndexContext);

export const IndexProvider: React.FC<React.ReactNode> = ({ children }) => {
  const currentUserJsonStr = String(localStorage.getItem("userContext"));

  const currentUser = JSON.parse(currentUserJsonStr) as User;

  const groupsList = currentUser.groupsList;

  let isUIB = false;

  if ( // если
    groupsList.length // список групп не пустой
    && groupsList.length < 2 // там одна запись
    && groupsList[0].name === "TKO_UIB" // и это кураторы
  ) {
    isUIB = true; // поднимаем флаг куратора
  }

  // состояние стартовой страницы
  const [indexState, setIndexState] = useState<string>("index");

  // метод изменения состояния
  const goToState = (goto) => {
    // console.log("goto", goto);
    setIndexState(goto);
  } 

  return (
    <IndexContext.Provider
      value={{
        currentUser,
        isUIB, // флаг куратора
        indexState, // состояние стартовой страницы
        goToState // метод изменения состояния
      }}
    >
      {children}
    </IndexContext.Provider>
  );
}