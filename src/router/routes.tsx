import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import QuickEscape from "../components/QuickEscape";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/BreathingInstructions";
import ThankYouPage from "../components/ThankYouPage";
import { ConsentPage } from "../components/ConsentPage";
import { useMemo } from "react";
import GA4 from "../components/GA4"

export function AppRoutes() {
  const showQuickEscape = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("showquickescape") !== "false";
  }, []);
  return (
    <Routes>
      <Route path={RoutesEnum.CONSENT} element={<ConsentPage />} />
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
            <QuickEscape showQuickEscape={showQuickEscape} />
            <GA4/>
            <WelcomePage />
          </>
        }
      />
      <Route path={RoutesEnum.BREATHING} element={<BreathingInstructions />} />
      <Route path={RoutesEnum.THANKYOU} element={<ThankYouPage />} />
    </Routes>
  );
}
