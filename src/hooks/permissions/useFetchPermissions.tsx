"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeatures, setLoading, setError } from '@/store/featureSlice';
import { RootState } from '@/store/store';

interface Feature {
  id: string;
  name: string;
  category: string;
}

const fetchUserFeatures = async (roleId: string): Promise<Feature[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const featuresMap: { [key: string]: Feature[] } = {
    'admin': [
      { id: 'upload_contact_csv', name: 'Upload Contacts CSV', category: 'Contacts' },
      { id: 'view_contacts', name: 'View Contacts', category: 'Contacts' },
      { id: 'edit_contacts', name: 'Edit Contacts', category: 'Contacts' },
    ],
    'sales_rep': [
      { id: 'view_contacts', name: 'View Contacts', category: 'Contacts' },
    ],
  };

  return featuresMap[roleId] || [];
};

export const useFetchPermissions = (roleId: string) => {
  const dispatch = useDispatch();
  const features = useSelector((state: RootState) => state.features.features);
  const loading = useSelector((state: RootState) => state.features.loading);
  const error = useSelector((state: RootState) => state.features.error);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!roleId) return;

      dispatch(setLoading());
      try {
        const features = await fetchUserFeatures(roleId);
        dispatch(setFeatures(features));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch features'));
      }
    };

    fetchFeatures();
  }, [roleId, dispatch]);

  return { features, loading, error };
};