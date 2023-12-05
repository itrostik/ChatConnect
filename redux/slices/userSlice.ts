import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../@types/userType.ts";
import { jwtDecode } from "jwt-decode";

const getToken = () => {
  return window?.localStorage?.getItem("token");
};

const token: string | null = getToken();

let initialState: UserType | null = null;

if (token) {
  initialState = jwtDecode(getToken());
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    change: (_state, action) => action.payload,
  },
});

export const { change } = userSlice.actions;

export default userSlice.reducer;
