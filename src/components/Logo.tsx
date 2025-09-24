import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const language = i18n.language.startsWith('es') ? 'es' : 'en';
  
  // Check if we're in widget mode
  const isWidget = typeof window !== 'undefined' && 
    (window as typeof window & { myWidgetConfig?: unknown }).myWidgetConfig;
  
  // Get asset base from widget config if available
  const getAssetBase = () => {
    if (typeof window === 'undefined') return '/src/assets/';
    
    const win = window as typeof window & { myWidgetConfig?: { assetBase?: string; cdnBase?: string } };
    const config = win.myWidgetConfig;
    
    if (config?.assetBase) {
      return config.assetBase;
    }
    if (config?.cdnBase) {
      return config.cdnBase;
    }
    
    return isWidget ? './assets/' : '/src/assets/';
  };
  
  const logoSrc = `${getAssetBase()}TrevorLogo-${language}.svg`;
  
  return (
    <img
      className={className}
      src={logoSrc}
      alt={t('LogoAlt')}
      style={LOGO_STYLE}
      data-testid="logo"
    />
  );
};

export default Logo;
