import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import QuickEscape from "../components/QuickEscape";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/Instructions";
import ThankYouPage from "../components/ThankYouPage";
import { useMemo } from "react";

export function AppRoutes() {
  const showQuickEscape = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("showquickescape") !== "false";
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
