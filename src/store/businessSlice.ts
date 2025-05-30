import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessState {
  _id: string;
  name: string;
  onboardingStep: number;
  companySize?: string;
  referralSource?: string;
  createdAt?: string;
}

interface SliceState {
  data: BusinessState | null;
  loading: boolean;
}

const initialState: SliceState = {
  data: null,
  loading: false,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action: PayloadAction<BusinessState>) => {
      state.data = action.payload;
      state.loading = false;
    },
    updateStep: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.onboardingStep = action.payload;
      }
    },
    clearBusiness: (state) => {
      state.data = null;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setBusiness, updateStep, clearBusiness, setLoading } = businessSlice.actions;
export default businessSlice.reducer;
