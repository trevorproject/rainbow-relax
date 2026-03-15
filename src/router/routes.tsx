import { Route, Routes } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import { RoutesEnum } from "./routesEnum";
import BreathingPage from "../pages/BreathingPage";
import ThankYouPage from "../pages/ThankYouPage";
import { ConsentPage } from "../pages/ConsentPage";
import GA4 from "../components/GA4";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={RoutesEnum.CONSENT} element={<ConsentPage />} />
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
            <GA4 />
            <WelcomePage />
          </>
        }
      />
      <Route path={RoutesEnum.BREATHING} element={<BreathingPage />} />
      <Route path={RoutesEnum.THANKYOU} element={<ThankYouPage />} />
    </Routes>
  );
}
