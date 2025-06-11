import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import QuickEscape from "../components/QuickEscape";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/Instructions";
import ThankYouPage from "../components/ThankYouPage";
import { useEffect } from "react";
import { useState } from "react";

export function AppRoutes() {
  const [showQuickEscape, setShowQuickEscape] = useState(false);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.showQuickEscape !== undefined) {
        setShowQuickEscape(event.data.showQuickEscape);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return (
    <Routes>
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
            <QuickEscape showQuickEscape={showQuickEscape} />
            <WelcomePage />
          </>
        }
      />
      <Route path={RoutesEnum.BREATHING} element={<BreathingInstructions />} />
      <Route path={RoutesEnum.THANKYOU} element={<ThankYouPage />} />
    </Routes>
  );
}
