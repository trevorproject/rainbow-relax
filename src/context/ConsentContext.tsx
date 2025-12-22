import { createContext } from "react";

export interface ConsentContextType {
  hasConsented: boolean;
  setHasConsented: (consented: boolean) => void;
}

/**
 * Default context value for ConsentContext.
 * 
 * This default value is provided to prevent errors when the context is accessed
 * outside of a provider. The useConsent hook will throw an error if the context
 * is used without a provider, making this default primarily useful for type safety
 * and preventing runtime errors during component initialization.
 */
export const ConsentContext = createContext<ConsentContextType>({
  hasConsented: false,
  setHasConsented: () => {},
});
