import { createContext, useState, useCallback, useMemo, useContext } from "react";

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
// eslint-disable-next-line react-refresh/only-export-components
export const ConsentContext = createContext<ConsentContextType>({
  hasConsented: false,
  setHasConsented: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within ConsentProvider");
  return context;
};

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const initialConsent = (() => {
    try {
      return localStorage.getItem("rainbow-relax-bandwidth-consent") === "true";
    } catch {
      return false;
    }
  })();

  const [hasConsented, setHasConsentedState] = useState(initialConsent);

  const setHasConsented = useCallback((consented: boolean) => {
    setHasConsentedState(consented);
    try {
      localStorage.setItem("rainbow-relax-bandwidth-consent", String(consented));
    } catch { /* ignore */ }
  }, []);

  const contextValue = useMemo(
    () => ({ hasConsented, setHasConsented }),
    [hasConsented, setHasConsented]
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};
