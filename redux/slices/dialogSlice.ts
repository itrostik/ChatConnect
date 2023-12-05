import { createSlice } from "@reduxjs/toolkit";
import { DialogType } from "../../@types/dialogType.ts";

const initialState: DialogType = {
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
