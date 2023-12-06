import { createSlice } from "@reduxjs/toolkit";

const themes = {
  dark: "dark",
  light: "light",
  christmas: "christmas",
};

const getTheme = () => {
  const theme = `${window?.localStorage?.getItem("theme")}`;
  if (Object.values(themes).includes(theme)) return theme;

  const userMedia = window.matchMedia("(prefers-color-scheme: light)");
  if (userMedia.matches) return themes.light;

  return themes.dark;
};

const initialState = getTheme();

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    change: (_state, action) => action.payload,
  },
});

export const { change } = themeSlice.actions;

export default themeSlice.reducer;
