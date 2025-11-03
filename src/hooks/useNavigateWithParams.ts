import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { buildUrlWithParams } from '../utils/navigationHelpers';

export function useNavigateWithParams() {
  const navigate = useReactRouterNavigate();

  const navigateWithParams = (
    to: string | { pathname: string; search?: string; hash?: string; state?: any },
    options?: { replace?: boolean; state?: any }
  ) => {
    if (typeof to === 'string') {
      const urlWithParams = buildUrlWithParams(to);
      navigate(urlWithParams, options);
    } else {
      const existingSearch = to.search ? new URLSearchParams(to.search) : new URLSearchParams();
      const existingParams: Record<string, string> = {};
      
      existingSearch.forEach((value, key) => {
        existingParams[key] = value;
      });
      
      const urlWithParams = buildUrlWithParams(to.pathname || '/', existingParams);
      const parts = urlWithParams.split('?');
      const pathname = parts[0];
      const search = parts[1];
      
      navigate({
        ...to,
        pathname,
        search: search ? `?${search}` : undefined
      }, options);
    }
  };

  return navigateWithParams;
}
