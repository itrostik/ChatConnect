import { createSlice } from "@reduxjs/toolkit";
import { Dialog } from "../../@types/dialogType.ts";

const initialState: Dialog = {
  id: "",
  messages: [],
  user2_id: "",
  user_id: "",
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    choose: (_state, action) => action.payload,
  },
});

export const { choose } = dialogSlice.actions;

export default dialogSlice.reducer;
