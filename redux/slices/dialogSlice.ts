import { createSlice } from "@reduxjs/toolkit";
import { DialogType } from "../../@types/dialogType.ts";
import { MateType } from "../../@types/mateType.ts";

const initialState: DialogType & MateType = {
  id: "",
  messages: [],
  user2_id: "",
  user_id: "",
  mate: null,
  countNotRead: 0,
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
