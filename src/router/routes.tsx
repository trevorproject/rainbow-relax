import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/Instructions";
import ThankYouPage from "../components/ThankYouPage";
import { ConsentPage } from "../components/ConsentPage";
import GA4 from "../components/GA4"

export function AppRoutes() {
  return (
    <Routes>
      <Route path={RoutesEnum.CONSENT} element={<ConsentPage />} />
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
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
