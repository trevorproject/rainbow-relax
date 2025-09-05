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
  return (
    <img
      src={`/src/assets/TrevorLogo-${language}.svg`}
      alt={t('LogoAlt')}
      style={LOGO_STYLE}
      className={className}
    />
  );
};

export default Logo;
