import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../context/WidgetConfigContext';


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
  const { t } = useTranslation();
  const { config, logoSrc } = useWidgetConfig();
  
  return (
    <img
      src={logoSrc}
      alt={t('LogoAlt')}
      style={LOGO_STYLE}
      className={className}
      onError={() => {
        console.error('Failed to load CDN logo:', config.logoUrl);
      }}
    />
  );
};

export default Logo;
