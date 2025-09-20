import { createContext } from 'react';

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

export const NavigationContext = createContext<NavigationContextType>({
  currentView: '/',
  navigateTo: () => {},
  showQuickEscape: true,
});
