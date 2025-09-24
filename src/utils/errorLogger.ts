// Enhanced error logging system for the widget

interface ErrorLogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

interface ErrorLoggerConfig {
  enableConsoleLogging: boolean;
  enableGA4Tracking: boolean;
  enableLocalStorage: boolean;
  maxLogEntries: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

class ErrorLogger {
  private config: ErrorLoggerConfig;
  private logs: ErrorLogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableGA4Tracking: true,
      enableLocalStorage: false,
      maxLogEntries: 100,
      logLevel: 'error',
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.loadLogsFromStorage();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadLogsFromStorage(): void {
    if (!this.config.enableLocalStorage || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('widget_error_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load error logs from storage:', error);
    }
  }

  private saveLogsToStorage(): void {
    if (!this.config.enableLocalStorage || typeof window === 'undefined') return;

    try {
      // Keep only the most recent logs
      const recentLogs = this.logs.slice(-this.config.maxLogEntries);
      localStorage.setItem('widget_error_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Failed to save error logs to storage:', error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.log('error', 'Global JavaScript Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message
      }, event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', 'Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        promise: event.promise
      });
    });
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  public log(
    level: ErrorLogEntry['level'],
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const logEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
      stack: error?.stack,
      sessionId: this.sessionId
    };

    // Add to internal logs
    this.logs.push(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(-this.config.maxLogEntries);
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 
                           level === 'info' ? 'info' : 'log';
      
      console[consoleMethod](`[Widget ${level.toUpperCase()}] ${message}`, {
        context,
        error,
        sessionId: this.sessionId
      });
    }

    // GA4 tracking
    if (this.config.enableGA4Tracking && typeof window !== 'undefined' && window.gtag_rl) {
      try {
        window.gtag_rl('event', 'widget_log', {
          event_category: 'rainbow_relax_widget',
          event_label: level,
          custom_parameter_1: message,
          custom_parameter_2: context ? JSON.stringify(context) : 'no_context',
          value: level === 'error' ? 1 : 0
        });
      } catch (gaError) {
        console.warn('Failed to track log in GA4:', gaError);
      }
    }

    // Save to storage
    this.saveLogsToStorage();
  }

  public error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log('error', message, context, error);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  public getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      localStorage.removeItem('widget_error_logs');
    }
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public getSessionId(): string {
    return this.sessionId;
  }
}

// Create global logger instance
let globalLogger: ErrorLogger | null = null;

const getLogger = (): ErrorLogger => {
  if (!globalLogger) {
    // Initialize with config from widget config if available
    const config: Partial<ErrorLoggerConfig> = {};
    
    if (typeof window !== 'undefined' && window.myWidgetConfig) {
      const widgetConfig = window.myWidgetConfig;
      config.enableConsoleLogging = widgetConfig.debug ?? true;
      config.enableGA4Tracking = !!widgetConfig.GTAG;
      config.logLevel = widgetConfig.debug ? 'debug' : 'error';
    }

    globalLogger = new ErrorLogger(config);
  }
  
  return globalLogger;
};

// Convenience functions
export const logError = (message: string, context?: Record<string, unknown>, error?: Error): void => {
  getLogger().error(message, context, error);
};

export const logWarn = (message: string, context?: Record<string, unknown>): void => {
  getLogger().warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  getLogger().info(message, context);
};


