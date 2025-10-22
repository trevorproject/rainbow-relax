import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../context/WidgetConfigContext';

import TrevorLogoEn from '../assets/TrevorLogo-en.svg';
import TrevorLogoEs from '../assets/TrevorLogo-es.svg';


interface LogoProps {
  className?: string;
}

const LOGO_STYLE: React.CSSProperties = {
  width: 'clamp(100px, 20vw, 180px)',
  height: 'auto',
  aspectRatio: '1/1',
  maxWidth: '180px',
  minWidth: '100px',
  display: 'block',
};

const Logo: React.FC<LogoProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const { config } = useWidgetConfig();
  
  const language = i18n.language.startsWith('es') ? 'es' : 'en';
  const trevorLogoSrc = language === 'es' ? TrevorLogoEs : TrevorLogoEn;
  
  // Use CDN logo if provided, otherwise use Trevor logo
  const logoSrc = config.logoUrl || trevorLogoSrc;
  
  return (
    <img
      src={logoSrc}
      alt={t('LogoAlt')}
      style={LOGO_STYLE}
      className={className}
      onError={() => {
        console.error('Failed to load CDN logo:', config.logoUrl);
        // Fallback is handled by the src attribute change
      }}
    />
  );
};

export default Logo;
