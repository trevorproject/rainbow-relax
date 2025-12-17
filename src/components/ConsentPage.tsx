import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ConsentPrompt } from "./ConsentPrompt";
import { useConsent } from "../hooks/useConsent";
import { RoutesEnum } from "../router/routesEnum";

interface AppSizeData {
  totalSizeBytes: number;
  totalSizeFormatted: string;
  calculatedAt: string;
}

export const ConsentPage = () => {
  const navigate = useNavigate();
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
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (!connection) {
        setHasConsented(true);
        navigate(RoutesEnum.HOME, { replace: true });
        return;
      }

      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      const slowConnections = ["slow-2g", "2g", "3g"];
      
      const isSlowByType = effectiveType && slowConnections.includes(effectiveType);
      const isSlowBySpeed = downlink !== undefined && downlink < 1.5; // 3G typically < 1.5 Mbps

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
          totalSizeBytes: 0,
          totalSizeFormatted: "~3 MB",
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

