import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useIsFeatureAccessible = (featureId: string): boolean => {
  const features = useSelector((state: RootState) => state.features.features);
  return features.some(feature => feature.id === featureId);
};