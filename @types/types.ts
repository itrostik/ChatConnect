import React from "react";

export type Inputs = {
  avatarUrl: string;
  login: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
};

export type Auth = {
  theme: string;
  setToken: React.Dispatch<string>;
  setIsLoading: React.Dispatch<boolean>;
  token: string;
};

export type User = {
  avatar: string;
  firstName: string;
  lastName: string;
  login: string;
  passwordHash: string;
  username: string;
};