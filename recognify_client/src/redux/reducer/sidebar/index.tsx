import { createSlice } from "@reduxjs/toolkit";

const initialState = { open: false };

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    sidebarToggle(state, action) {
      state.open = action.payload;
    },
  },
});

export const { sidebarToggle } = sidebarSlice.actions;
export default sidebarSlice.reducer;
