import { useState, useCallback, useMemo } from "react";
import { ConsentContext, ConsentContextType } from "./ConsentContext";

export const ConsentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialConsent = (() => {
    try {
      const stored = localStorage.getItem('rainbow-relax-bandwidth-consent');
      return stored === 'true';
    } catch {
      return false;
    }
  })();
  const [hasConsented, setHasConsentedState] = useState(initialConsent);

  const setHasConsented = useCallback((consented: boolean) => {
    setHasConsentedState(consented);
    try {
      localStorage.setItem('rainbow-relax-bandwidth-consent', String(consented));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  const contextValue: ConsentContextType = useMemo(
    () => ({
      hasConsented,
      setHasConsented,
    }),
    [hasConsented, setHasConsented]
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};

