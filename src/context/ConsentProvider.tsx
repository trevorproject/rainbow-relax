import { useState, useCallback, useMemo } from "react";
import { ConsentContext, ConsentContextType } from "./ConsentContext";

export const ConsentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasConsented, setHasConsentedState] = useState(false);

  const setHasConsented = useCallback((consented: boolean) => {
    setHasConsentedState(consented);
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


