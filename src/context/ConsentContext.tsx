import { createContext } from "react";

export interface ConsentContextType {
  hasConsented: boolean;
  setHasConsented: (consented: boolean) => void;
}

export const ConsentContext = createContext<ConsentContextType>({
  hasConsented: false,
  setHasConsented: () => {},
});

