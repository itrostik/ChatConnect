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
  setUser: React.Dispatch<any>
  setIsLoading: React.Dispatch<boolean>
}
