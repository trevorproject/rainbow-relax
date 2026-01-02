import { useEffect, useState, useRef } from "react";
import { ConsentPrompt } from "./ConsentPrompt";
import { useConsent } from "../hooks/useConsent";
import { RoutesEnum } from "../router/routesEnum";
import { useNavigateWithParams } from "../hooks/useNavigateWithParams";
import {
  isSlowConnectionType,
  MIN_DOWNLINK_MBPS,
  FALLBACK_APP_SIZE_FORMATTED,
  FALLBACK_APP_SIZE_BYTES,
} from "../config/consentConfig";

interface AppSizeData {
  totalSizeBytes: number;
  totalSizeFormatted: string;
  calculatedAt: string;
}

export const ConsentPage = () => {
  const navigate = useNavigateWithParams();
  const { hasConsented, setHasConsented } = useConsent();
  const [appSize, setAppSize] = useState<AppSizeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forceConsent = urlParams.get('forceConsent') === 'true';

    if (!forceConsent && hasConsented) {
      navigate(RoutesEnum.HOME, { replace: true });
      return;
    }

    if (!forceConsent) {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (!connection) {
        setHasConsented(true);
        navigate(RoutesEnum.HOME, { replace: true });
        return;
      }

      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      
      const isSlowByType = isSlowConnectionType(effectiveType);
      const isSlowBySpeed = downlink !== undefined && downlink < MIN_DOWNLINK_MBPS;

      if (!isSlowByType && !isSlowBySpeed) {
        setHasConsented(true);
        navigate(RoutesEnum.HOME, { replace: true });
        return;
      }
    }

    abortControllerRef.current = new AbortController();
    const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    fetch(`${basePath}/app-size.json`, {
      signal: abortControllerRef.current.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch app size");
        }
        return res.json();
      })
      .then((data: AppSizeData) => {
        setAppSize(data);
        setIsLoading(false);
        setShowPrompt(true);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }
        console.error("Error loading app size:", error);
        setAppSize({
          totalSizeBytes: FALLBACK_APP_SIZE_BYTES,
          totalSizeFormatted: FALLBACK_APP_SIZE_FORMATTED,
          calculatedAt: new Date().toISOString(),
        });
        setIsLoading(false);
        setShowPrompt(true);
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [hasConsented, navigate, setHasConsented]);

  const handleConsent = () => {
    setHasConsented(true);
    navigate(RoutesEnum.HOME, { replace: true });
  };

  if (isLoading) {
    return (
      <div 
        data-testid="consent-page-loading"
        className="min-h-screen flex items-center justify-center bg-[var(--background-global)]"
      >
        <div className="text-[var(--color-text)]">Loading...</div>
      </div>
    );
  }

  if (!showPrompt || !appSize) {
    return null;
  }

  return (
    <div 
      data-testid="consent-page"
      className="min-h-screen bg-[var(--background-global)]"
    >
      <ConsentPrompt
        totalSizeFormatted={appSize.totalSizeFormatted}
        totalSizeBytes={appSize.totalSizeBytes}
        onConsent={handleConsent}
      />
    </div>
  );
};
