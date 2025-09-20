import { ReactNode, useMemo, useEffect, useState } from "react";
import BreathingInstructions from "../components/Instructions";
import NavBar from "../components/NavBar";
import QuickEscape from "../components/QuickEscape";
import ThankYouPage from "../components/ThankYouPage";
import WelcomePage from "../components/WelcomePage";
import WidgetGA4 from "../components/WidgetGA4";
import { MainAnimationProvider } from "../context/MainAnimationProvider";
import { init } from "../i18n/init";
import { useNavigation } from "../navigation";
import { NavigationContext, ExerciseState } from "../navigationContext";
import { RoutesEnum } from "../router/routesEnum";

init();

function AppRoutes() {
  const { currentView, showQuickEscape, exerciseState } = useNavigation();
  
  switch (currentView) {
    case RoutesEnum.BREATHING:
      return (
        <BreathingInstructions 
          minutes={exerciseState?.minutes || 1}
          exerciseType={exerciseState?.exerciseType || "4-7-8"}
        />
      );
    case RoutesEnum.THANKYOU:
      return <ThankYouPage />;
    case RoutesEnum.HOME:
    default:
      return (
        <>
          <QuickEscape showQuickEscape={showQuickEscape} />
          <WidgetGA4 />
          <WelcomePage />
        </>
      );
  }
}

function AppContent() {
  const { currentView } = useNavigation();
  const isWelcomePage = currentView === RoutesEnum.HOME;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-global', "'Manrope', sans-serif");
    root.style.setProperty('--background-global', '#F3E9DC');
    root.style.setProperty('--color-text', '#4E4E4E');
    root.style.setProperty('--color-button', '#4A7543');
    root.style.setProperty('--color-button-text', '#FFFFFF');
    root.style.setProperty('--circle-level-1', 'rgba(74, 117, 67, 0.5)');
    root.style.setProperty('--circle-level-2', 'rgba(74, 117, 67, 0.6)');
    root.style.setProperty('--circle-level-3', 'rgb(74, 117, 67)');
    root.style.setProperty('--circle-custom', '#4A7543');
    root.style.setProperty('--circle-top', 'rgba(74, 117, 67, 0.5)');
    root.style.setProperty('--circle-mid-top', 'rgba(74, 117, 67, 0.4)');
    root.style.setProperty('--circle-mid-bottom', 'rgba(74, 117, 67, 0.3)');
    root.style.setProperty('--circle-bottom', 'rgba(74, 117, 67, 0.2)');
  }, []);

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px", // Ensure minimum height for content
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        color: "var(--color-text, #4E4E4E)",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        backgroundColor: "var(--background-global, #F3E9DC)",
        fontFamily: "var(--font-global, 'Manrope', sans-serif)",
        "--font-global": "'Manrope', sans-serif",
        "--background-global": "#F3E9DC",
        "--color-text": "#4E4E4E",
        "--color-button": "#4A7543",
        "--color-button-text": "#FFFFFF",
        "--circle-level-1": "rgba(74, 117, 67, 0.5)",
        "--circle-level-2": "rgba(74, 117, 67, 0.6)",
        "--circle-level-3": "rgb(74, 117, 67)",
        "--circle-custom": "#4A7543",
        "--circle-top": "rgba(74, 117, 67, 0.5)",
        "--circle-mid-top": "rgba(74, 117, 67, 0.4)",
        "--circle-mid-bottom": "rgba(74, 117, 67, 0.3)",
        "--circle-bottom": "rgba(74, 117, 67, 0.2)"
      } as React.CSSProperties}
    >
      {isWelcomePage && (
        <header>
          <NavBar />
        </header>
      )}

      <main 
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: isWelcomePage ? "80px 20px 20px 20px" : "20px",
          overflow: "visible",
          maxWidth: "100%",
          boxSizing: "border-box",
          minHeight: "350px",
          zIndex: 10
        }}
      >
        <AppRoutes />
      </main>
    </div>
  );
}

function NavigationProviderWrapper({ children }: { children: ReactNode }) {
  const showQuickEscape = useMemo(() => {
    if (typeof window !== 'undefined' && (window as any).myWidgetConfig) {
      return (window as any).myWidgetConfig.showQuickEscape ?? false;
    }
    return false;
  }, []);
  
  const [currentView, setCurrentView] = useState<string>(RoutesEnum.HOME);
  const [exerciseState, setExerciseState] = useState<ExerciseState>({
    minutes: 1,
    exerciseType: "4-7-8"
  });
  
  const navigateTo = (path: string, state?: Partial<ExerciseState>) => {
    setCurrentView(path);
    if (state) {
      setExerciseState(prev => ({ ...prev, ...state }));
    }
  };
  
  return (
    <NavigationContext.Provider value={{ currentView, navigateTo, showQuickEscape, exerciseState }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function WidgetAppShell() {
  return (
    <MainAnimationProvider>
      <NavigationProviderWrapper>
        <AppContent />
      </NavigationProviderWrapper>
    </MainAnimationProvider>
  );
}

export default WidgetAppShell;
