import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CampaignState {
  campaignId: string | null;
}

const initialState: CampaignState = {
  campaignId: null,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaignId: (state, action: PayloadAction<string>) => {
      state.campaignId = action.payload;
    },
  },
});

export const { setCampaignId } = campaignSlice.actions;
export default campaignSlice.reducer;
