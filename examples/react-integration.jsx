// React Integration Example - Rainbow Relax Widget
// This file demonstrates how to integrate the Rainbow Relax Widget into a React application

import React, { useEffect, useRef, useState } from 'react';

// Method 1: Component Integration
const RainbowRelaxWidget = ({ config = {}, onLoad, onError }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const containerId = containerRef.current?.id || 'rainbow-relax-container';

    // Set up widget configuration
    window.myWidgetConfig = {
      containerId,
      showQuickExit: true,
      donateURL: 'https://www.trevorproject.org/donate/',
      getHelpURL: 'https://www.trevorproject.org/get-help/',
      width: '100%',
      height: '600px',
      language: 'en',
      theme: 'default',
      audioEnabled: true,
      debug: process.env.NODE_ENV === 'development',
      autoStart: false,
      defaultDuration: 1,
      ...config,
    };

    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.example.com/rainbowRelax.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    script.onerror = (err) => {
      setError(err);
      onError?.(err);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.RainbowRelax) {
        window.RainbowRelax.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [config, onLoad, onError]);

  if (error) {
    return (
      <div className='widget-error'>
        <p>Failed to load Rainbow Relax widget</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id='rainbow-relax-container'
      style={{
        width: '100%',
        height: '600px',
        minHeight: '400px',
      }}
    />
  );
};

// Method 2: Hook Integration
const useRainbowRelaxWidget = (config = {}) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    const containerId = containerRef.current?.id || 'rainbow-relax-container';

    // Set up widget configuration
    window.myWidgetConfig = {
      containerId,
      showQuickExit: true,
      donateURL: 'https://www.trevorproject.org/donate/',
      getHelpURL: 'https://www.trevorproject.org/get-help/',
      width: '100%',
      height: '600px',
      language: 'en',
      theme: 'default',
      audioEnabled: true,
      debug: process.env.NODE_ENV === 'development',
      autoStart: false,
      defaultDuration: 1,
      ...config,
    };

    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.example.com/rainbowRelax.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setWidget(window.RainbowRelax);
    };

    script.onerror = (err) => {
      setError(err);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.RainbowRelax) {
        window.RainbowRelax.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [config]);

  return {
    containerRef,
    isLoaded,
    error,
    widget,
    healthCheck: () => widget?.healthCheck(),
    isInitialized: () => widget?.isInitialized(),
    destroy: () => widget?.destroy(),
  };
};

// Method 3: Context Provider
const RainbowRelaxContext = React.createContext();

const RainbowRelaxProvider = ({ children, config = {} }) => {
  const [widget, setWidget] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up widget configuration
    window.myWidgetConfig = {
      containerId: 'rainbow-relax-container',
      showQuickExit: true,
      donateURL: 'https://www.trevorproject.org/donate/',
      getHelpURL: 'https://www.trevorproject.org/get-help/',
      width: '100%',
      height: '600px',
      language: 'en',
      theme: 'default',
      audioEnabled: true,
      debug: process.env.NODE_ENV === 'development',
      autoStart: false,
      defaultDuration: 1,
      ...config,
    };

    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.example.com/rainbowRelax.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setWidget(window.RainbowRelax);
    };

    script.onerror = (err) => {
      setError(err);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.RainbowRelax) {
        window.RainbowRelax.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [config]);

  const value = {
    widget,
    isLoaded,
    error,
    healthCheck: () => widget?.healthCheck(),
    isInitialized: () => widget?.isInitialized(),
    destroy: () => widget?.destroy(),
  };

  return (
    <RainbowRelaxContext.Provider value={value}>
      {children}
    </RainbowRelaxContext.Provider>
  );
};

const useRainbowRelax = () => {
  const context = React.useContext(RainbowRelaxContext);
  if (!context) {
    throw new Error(
      'useRainbowRelax must be used within a RainbowRelaxProvider'
    );
  }
  return context;
};

// Usage Examples

// Example 1: Basic Component Usage
const App = () => {
  const widgetConfig = {
    showQuickExit: true,
    language: 'en',
    theme: 'default',
    audioEnabled: true,
  };

  return (
    <div>
      <h1>My App</h1>
      <RainbowRelaxWidget
        config={widgetConfig}
        onLoad={() => console.log('Widget loaded')}
        onError={(err) => console.error('Widget error:', err)}
      />
    </div>
  );
};

// Example 2: Hook Usage
const MyComponent = () => {
  const { containerRef, isLoaded, error, widget } = useRainbowRelaxWidget({
    language: 'es',
    theme: 'dark',
    audioEnabled: true,
  });

  if (error) {
    return <div>Error loading widget: {error.message}</div>;
  }

  return (
    <div>
      <h1>My Component</h1>
      <div
        ref={containerRef}
        id='rainbow-relax-container'
        style={{ width: '100%', height: '600px' }}
      />
      {isLoaded && (
        <button onClick={() => console.log(widget.healthCheck())}>
          Check Widget Health
        </button>
      )}
    </div>
  );
};

// Example 3: Context Provider Usage
const AppWithProvider = () => {
  const widgetConfig = {
    showQuickExit: true,
    language: 'en',
    theme: 'default',
    audioEnabled: true,
  };

  return (
    <RainbowRelaxProvider config={widgetConfig}>
      <MyAppContent />
    </RainbowRelaxProvider>
  );
};

const MyAppContent = () => {
  const { widget, isLoaded, error, healthCheck } = useRainbowRelax();

  if (error) {
    return <div>Error loading widget: {error.message}</div>;
  }

  return (
    <div>
      <h1>My App with Provider</h1>
      <div
        id='rainbow-relax-container'
        style={{ width: '100%', height: '600px' }}
      />
      {isLoaded && (
        <button onClick={() => console.log(healthCheck())}>
          Check Widget Health
        </button>
      )}
    </div>
  );
};

// Example 4: Dynamic Configuration
const DynamicWidget = () => {
  const [config, setConfig] = useState({
    language: 'en',
    theme: 'default',
    audioEnabled: true,
  });

  const updateConfig = (newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <div>
      <h1>Dynamic Widget</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => updateConfig({ language: 'en' })}>
          English
        </button>
        <button onClick={() => updateConfig({ language: 'es' })}>
          Spanish
        </button>
        <button onClick={() => updateConfig({ theme: 'dark' })}>
          Dark Theme
        </button>
        <button onClick={() => updateConfig({ theme: 'light' })}>
          Light Theme
        </button>
        <button
          onClick={() => updateConfig({ audioEnabled: !config.audioEnabled })}
        >
          Toggle Audio
        </button>
      </div>

      <RainbowRelaxWidget config={config} />
    </div>
  );
};

// Example 5: Multiple Widget Instances
const MultipleWidgets = () => {
  const [widgets, setWidgets] = useState([]);

  const addWidget = () => {
    const newWidget = {
      id: Date.now(),
      config: {
        language: widgets.length % 2 === 0 ? 'en' : 'es',
        theme: widgets.length % 2 === 0 ? 'light' : 'dark',
      },
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  const removeWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div>
      <h1>Multiple Widgets</h1>

      <button onClick={addWidget}>Add Widget</button>

      {widgets.map((widget) => (
        <div key={widget.id} style={{ marginBottom: '20px' }}>
          <h3>Widget {widget.id}</h3>
          <button onClick={() => removeWidget(widget.id)}>Remove Widget</button>
          <RainbowRelaxWidget
            config={{
              ...widget.config,
              containerId: `widget-${widget.id}`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Export components and hooks
export {
  RainbowRelaxWidget,
  useRainbowRelaxWidget,
  RainbowRelaxProvider,
  useRainbowRelax,
  App,
  MyComponent,
  AppWithProvider,
  DynamicWidget,
  MultipleWidgets,
};

export default RainbowRelaxWidget;

