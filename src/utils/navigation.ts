import React, { useContext } from 'react';

// Navigation types
export interface ExerciseState {
  minutes: number;
  exerciseType: string;
}

export interface NavigationContextType {
  currentView: string;
  navigateTo: (path: string, state?: Partial<ExerciseState>) => void;
  showQuickEscape: boolean;
  exerciseState?: ExerciseState;
}

export const NavigationContext = React.createContext<NavigationContextType>({
  currentView: '/',
  navigateTo: () => {},
  showQuickEscape: true,
});

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
