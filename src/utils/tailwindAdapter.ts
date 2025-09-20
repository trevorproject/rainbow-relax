/**
 * Tailwind CSS Class Adapter
 * 
 * This utility automatically handles the Tailwind prefix differences between:
 * - Main app: unprefixed classes (e.g., "flex", "bg-red-500")
 * - Widget: rr- prefixed classes (e.g., "rr-flex", "rr-bg-red-500")
 * 
 * Usage:
 * const cn = useTailwindAdapter();
 * <div className={cn("flex items-center justify-center bg-blue-500")} />
 */

/**
 * Detect if we're running in widget mode
 */
export const isWidgetMode = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).myWidgetConfig;
};

/**
 * Convert unprefixed Tailwind classes to prefixed ones for widget mode
 */
export const adaptTailwindClasses = (classes: string): string => {
  if (!isWidgetMode()) {
    return classes;
  }

  // Split classes and add rr- prefix to each one
  return classes
    .split(' ')
    .filter(cls => cls.trim()) // Remove empty strings
    .map(cls => {
      // Don't prefix classes that already have rr- prefix
      if (cls.startsWith('rr-')) {
        return cls;
      }
      
      // Don't prefix non-Tailwind classes (custom classes, etc.)
      // This is a simple heuristic - you might want to expand this list
      const nonTailwindPrefixes = ['custom-', 'js-', 'data-'];
      if (nonTailwindPrefixes.some(prefix => cls.startsWith(prefix))) {
        return cls;
      }
      
      // Add rr- prefix
      return `rr-${cls}`;
    })
    .join(' ');
};

/**
 * React hook for Tailwind class adaptation
 */
export const useTailwindAdapter = () => {
  return adaptTailwindClasses;
};

/**
 * Template literal function for easier class composition
 * Usage: tw`flex items-center ${someCondition ? 'bg-red-500' : 'bg-blue-500'}`
 */
export const tw = (strings: TemplateStringsArray, ...values: any[]): string => {
  const combined = strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
  
  return adaptTailwindClasses(combined);
};

/**
 * Conditional class helper that works with the adapter
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  const validClasses = classes.filter(Boolean) as string[];
  return adaptTailwindClasses(validClasses.join(' '));
};

/**
 * Utility for dynamic class generation with conditions
 */
export const clsx = (classObj: Record<string, boolean> | string): string => {
  if (typeof classObj === 'string') {
    return adaptTailwindClasses(classObj);
  }
  
  const classes = Object.entries(classObj)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
    
  return adaptTailwindClasses(classes);
};
