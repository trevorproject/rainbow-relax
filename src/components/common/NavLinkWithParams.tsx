import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { buildUrlWithParams } from '../../utils/navigationHelpers';

export const NavLinkWithParams: React.FC<NavLinkProps> = ({ to, ...props }) => {
  const enhancedTo = React.useMemo(() => {
    if (typeof to === 'string') {
      return buildUrlWithParams(to);
    } else if (to && typeof to === 'object') {
      const existingSearch = to.search ? new URLSearchParams(to.search) : new URLSearchParams();
      const existingParams: Record<string, string> = {};
      
      existingSearch.forEach((value, key) => {
        existingParams[key] = value;
      });
      
      const urlWithParams = buildUrlWithParams(to.pathname || '/', existingParams);
      const parts = urlWithParams.split('?');
      const pathname = parts[0];
      const search = parts[1];
      
      return {
        ...to,
        pathname,
        search: search ? `?${search}` : undefined
      };
    }
    
    return to;
  }, [to]);

  return <NavLink {...props} to={enhancedTo} />;
};

export default NavLinkWithParams;
