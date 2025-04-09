import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Feature {
  id: string;
  name: string;
  category: string;
}

interface FeatureState {
  features: Feature[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  features: [],
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.features = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setFeatures, setLoading, setError } = featureSlice.actions;
export default featureSlice.reducer;