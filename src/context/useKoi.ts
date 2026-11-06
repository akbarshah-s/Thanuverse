import { useContext } from 'react';
import { KoiContext } from './KoiContext';

export const useKoi = () => {
  const context = useContext(KoiContext);
  if (!context) {
    throw new Error('useKoi must be used within a KoiProvider');
  }
  return context;
};
