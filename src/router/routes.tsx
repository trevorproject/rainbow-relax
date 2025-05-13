import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import QuickEscape from "../components/QuickEscape";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/Instructions";
import ThankYouPage from "../components/ThankYouPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
            <QuickEscape />
            <WelcomePage />
          </>
        }
      />
      <Route path={RoutesEnum.BREATHING} element={<BreathingInstructions/>} />
      <Route path={RoutesEnum.THANKYOU}  element={<ThankYouPage />} />
    </Routes>
  );
}
