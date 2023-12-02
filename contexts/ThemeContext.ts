import React from "react";
import { Theme } from "../@types/types.ts";

export const themes: Theme = {
  dark: "dark",
  light: "light",
};

export const ThemeContext = React.createContext(null);
