const WIDGET_CONFIG_PARAMS = [
  'logoUrl',
  'backgroundUrl', 
  'instructionsUrl',
  'guidedVoiceUrl',
  'audioUrl',
  'donationUrl',
  'helpUrl',
  'homeUrl'
] as const;

type WidgetConfigParam = typeof WIDGET_CONFIG_PARAMS[number];

export function extractWidgetConfigParams(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const configParams: Record<string, string> = {};
  
  WIDGET_CONFIG_PARAMS.forEach(param => {
    const value = urlParams.get(param);
    if (value !== null) {
      configParams[param] = value;
    }
  });
  
  return configParams;
}

export function buildUrlWithParams(
  path: string, 
  existingParams?: Record<string, string>
): string {
  const widgetParams = extractWidgetConfigParams();
  const allParams = { ...widgetParams, ...existingParams };
  
  const searchParams = new URLSearchParams();
  Object.entries(allParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function isWidgetConfigParam(param: string): param is WidgetConfigParam {
  return WIDGET_CONFIG_PARAMS.includes(param as WidgetConfigParam);
}

export function getCurrentPath(): string {
  return window.location.pathname;
}
