import React from "react";

export type Inputs = {
  login: string
  password: string
  username: string,
  firstName: string,
  lastName: string
}

export type Auth = {
  theme: string
  setToken: React.Dispatch<string>
  setIsLoading: React.Dispatch<boolean>
  token: string
}
