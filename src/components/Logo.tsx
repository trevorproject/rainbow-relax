import React, { useState, useEffect } from 'react';
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
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [logoError, setLogoError] = useState<boolean>(false);
  
  const language = i18n.language.startsWith('es') ? 'es' : 'en';
  const trevorLogoSrc = language === 'es' ? TrevorLogoEs : TrevorLogoEn;
  
  useEffect(() => {
    if (config.logoUrl && !logoError) {
      // Try to load CDN logo first
      const img = new Image();
      img.onload = () => {
        setLogoSrc(config.logoUrl!);
      };
      img.onerror = () => {
        console.error('Failed to load CDN logo:', config.logoUrl);
        setLogoError(true);
        setLogoSrc(trevorLogoSrc);
      };
      img.src = config.logoUrl;
    } else {
      // Use Trevor logo as fallback
      setLogoSrc(trevorLogoSrc);
    }
  }, [config.logoUrl, logoError, trevorLogoSrc]);
  
  // Don't render anything if CDN logo is configured but failed to load and we're in error state
  if (config.logoUrl && logoError) {
    return null;
  }
  
  return (
    <img
      src={logoSrc}
      alt={t('LogoAlt')}
      style={LOGO_STYLE}
      className={className}
    />
  );
};

export default Logo;
