import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotesState {
  notes: { [callId: string]: string };
}

const initialState: NotesState = {
  notes: {},
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNote: (state, action: PayloadAction<{ callId: string; note: string }>) => {
      state.notes[action.payload.callId] = action.payload.note;
    },
    removeNote: (state, action: PayloadAction<string>) => {
      delete state.notes[action.payload];
    },
    hydrateNotes: (state, action: PayloadAction<{ [callId: string]: string }>) => {
      state.notes = action.payload;
    },
  },
});

export const { setNote, removeNote, hydrateNotes } = notesSlice.actions;
export default notesSlice.reducer;