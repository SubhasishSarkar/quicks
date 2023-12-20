import { createContext, useContext } from "react";

const CheckBoxGroupContext = createContext(null);

export const CheckBoxGroupProvider = CheckBoxGroupContext.Provider;
export const useCheckBoxGroup = () => useContext(CheckBoxGroupContext);
