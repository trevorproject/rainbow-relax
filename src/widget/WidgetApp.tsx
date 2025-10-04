import { ReactNode, useEffect, useState, useMemo } from "react";
import BreathingInstructions from "../components/Instructions";
import ErrorBoundary from "../components/ErrorBoundary";
import NavBar from "../components/NavBar";
import QuickEscape from "../components/QuickEscape";
import ThankYouPage from "../components/ThankYouPage";
import WelcomePage from "../components/WelcomePage";
import WidgetGA4 from "../components/WidgetGA4";
// import { MainAnimation } from "../components/MainAnimation";
import { MainAnimationProvider } from "../context/MainAnimationProvider";
import { init } from "../i18n/init";
import { useNavigation, NavigationContext, ExerciseState } from "../utils/navigation";
import { RoutesEnum } from "../router/routesEnum";
import { logError, logInfo } from "../utils/errorLogger";
import { WidgetAudioProvider } from "../context/WidgetAudioProvider";
import { detectWidgetMode } from "../utils/widgetEnvironment";

init();

function AppRoutes() {
  const { currentView, showQuickEscape, exerciseState } = useNavigation();
  
  
  try {
    switch (currentView) {
      case RoutesEnum.BREATHING:
        return (
          <ErrorBoundary
            onError={(error, errorInfo) => {
              logError('Error in BreathingInstructions component', {
                currentView,
                exerciseState,
                componentStack: errorInfo.componentStack
              }, error);
            }}
          >
            <BreathingInstructions 
              minutes={exerciseState?.minutes ?? 1}
              exerciseType={exerciseState?.exerciseType || "4-7-8"}
            />
          </ErrorBoundary>
        );
      case RoutesEnum.THANKYOU:
        return (
          <ErrorBoundary
            onError={(error, errorInfo) => {
              logError('Error in ThankYouPage component', {
                currentView,
                componentStack: errorInfo.componentStack
              }, error);
            }}
          >
            <ThankYouPage />
          </ErrorBoundary>
        );
      case RoutesEnum.HOME:
      default:
        return (
          <ErrorBoundary
            onError={(error, errorInfo) => {
              logError('Error in WelcomePage components', {
                currentView,
                showQuickEscape,
                componentStack: errorInfo.componentStack
              }, error);
            }}
          >
            <QuickEscape showQuickEscape={showQuickEscape} />
            <WelcomePage />
          </ErrorBoundary>
        );
    }
  } catch (error) {
    logError('Critical error in AppRoutes', {
      currentView,
      exerciseState
    }, error as Error);
    
    // Return fallback UI
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '0.5rem',
        margin: '1rem'
      }}>
        <h2>Something went wrong</h2>
        <p>Please try refreshing the page.</p>
      </div>
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

  // Animation is initialized in MainAnimationProvider, no need to call changeAnimation here

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        color: "var(--color-text, #4E4E4E)",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        backgroundColor: "var(--background-global, #F3E9DC)",
        fontFamily: "var(--font-global, 'Manrope', sans-serif)",
      }}
    >
      <WidgetGA4 />
      
      {isWelcomePage && (
        <header>
          <NavBar />
        </header>
      )}

      <main className="rr-flex-grow rr-flex rr-flex-col rr-items-center rr-justify-start" style={{ paddingTop: "clamp(0.25rem, 2vw, 1rem)" }}>
        <AppRoutes />
      </main>
    </div>
  );
}

function NavigationProviderWrapper({ children }: { children: ReactNode }) {
  const showQuickEscape = useMemo(() => {
    if (detectWidgetMode() && typeof window !== 'undefined') {
      return (window as any).myWidgetConfig?.showQuickEscape ?? false;
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
  useEffect(() => {
    logInfo('Widget app shell initialized', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }, []);
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logError('Critical error in WidgetAppShell', {
          componentStack: errorInfo.componentStack
        }, error);
      }}
    >
      <WidgetAudioProvider>
        <MainAnimationProvider>
          <NavigationProviderWrapper>
            <AppContent />
          </NavigationProviderWrapper>
        </MainAnimationProvider>
      </WidgetAudioProvider>
    </ErrorBoundary>
  );
}

export default WidgetAppShell;
