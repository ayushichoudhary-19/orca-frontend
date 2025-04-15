import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Membership } from "@/types/membership";

interface MembershipState {
  data: Membership | null;
  businessId: string | null;
  membershipId: string | null;
  loading: boolean;
}

const initialState: MembershipState = {
  data: null,
  businessId: null,
  membershipId: null,
  loading: true,
};

export const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    setMembership: (state, action: PayloadAction<Membership>) => {
      state.data = action.payload;
      state.businessId = action.payload.businessId._id;
      state.membershipId = action.payload._id;
      state.loading = false;
    },
    clearMembership: (state) => {
      state.data = null;
      state.businessId = null;
      state.membershipId = null;
      state.loading = false;
    },
    setMembershipLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.onboardingStep = action.payload;
      }
    },
  },
});

export const { setMembership, clearMembership, setMembershipLoading, setOnboardingStep } = membershipSlice.actions;
export default membershipSlice.reducer;