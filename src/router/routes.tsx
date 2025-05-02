import { Route, Routes } from "react-router-dom";
import WelcomePage from "../components/WelcomePage";
import QuickEscape from "../components/QuickEscape";
import { MainAnimation } from "../components/MainAnimation";
import { RoutesEnum } from "./routesEnum";
import BreathingInstructions from "../components/Instructions";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={RoutesEnum.HOME}
        element={
          <>
            <QuickEscape />
            <WelcomePage />
            <MainAnimation />
          </>
        }
      />
      <Route path={RoutesEnum.BREATHING} element={<BreathingInstructions/>} />
    </Routes>
  );
}
