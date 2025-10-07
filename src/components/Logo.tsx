import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTailwindAdapter } from '../utils/tailwindAdapter';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('es') ? 'es' : 'en';
  const cn = useTailwindAdapter();
  
  // Check if we're in widget mode
  const isWidget = typeof window !== 'undefined' && 
    (window as typeof window & { myWidgetConfig?: unknown }).myWidgetConfig;
  
  // Get asset base from widget config if available
  const getAssetBase = () => {
    if (typeof window === 'undefined') return '/src/assets/';
    
    const win = window as typeof window & { myWidgetConfig?: { assetBase?: string; cdnBase?: string } };
    const config = win.myWidgetConfig;
    
    // Use the same logic as the widget configuration
    if (config?.assetBase) {
      return config.assetBase;
    }
    if (config?.cdnBase) {
      return config.cdnBase;
    }
    
    // For widget mode, use CDN-relative path
    if (isWidget) {
      return 'assets/';
    }
    
    return '/src/assets/';
  };

  // Dynamic logo sizing based on actual widget dimensions
  const getLogoSize = () => {
    if (typeof window === 'undefined') {
      return {
        height: 'clamp(1.5rem, 4vw, 3rem)',
        minWidth: '20px',
        minHeight: '20px',
        maxHeight: 'none',
      };
    }

    // Get actual widget container dimensions
    let containerWidth = 800; // Default fallback
    let containerHeight = 600; // Default fallback
    
    const widgetContainer = document.getElementById('rainbow-relax-container') || 
                           document.getElementById('dynamic-widget-container');
    
    if (widgetContainer) {
      const rect = widgetContainer.getBoundingClientRect();
      containerWidth = rect.width || parseInt(widgetContainer.style.width) || 800;
      containerHeight = rect.height || parseInt(widgetContainer.style.height) || 600;
    }

    // Calculate logo size for absolute positioning - no container constraints
    // Use a reasonable percentage of widget height since logo will be positioned absolutely
    const logoSize = Math.max(60, Math.min(200, containerHeight * 0.12)); // 12% of widget height, 60px min, 200px max
    
    // Debug logging
    console.log('[Logo Debug]', {
      containerWidth,
      containerHeight,
      logoSize,
      approach: 'widget-height-based'
    });
    
    return {
      height: `${logoSize}px`,
      width: 'auto',
      minWidth: '20px',
      minHeight: '20px',
      maxHeight: 'none',
    };
  };
  
  const logoSrc = `${getAssetBase()}TrevorLogo-${language}.svg`;
  const logoStyle = getLogoSize();
  
  return (
    <img
      className={cn(`block object-contain box-border visible opacity-100 flex-none max-w-none w-auto h-auto ${className || ""}`)}
      src={logoSrc}
      alt={t('LogoAlt')}
      style={logoStyle}
      data-testid="logo"
      onError={(e) => {
        console.error('[Logo] Failed to load:', logoSrc);
        // Fallback: try to load from a different path
        const target = e.target as HTMLImageElement;
        if (!target.src.includes('/src/assets/')) {
          target.src = `/src/assets/TrevorLogo-${language}.svg`;
        }
      }}
    />
  );
};

export default Logo;
