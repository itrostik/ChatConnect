import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.ts";
import userReducer from "./slices/userSlice.ts";
import dialogReducer from "./slices/dialogSlice.ts";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    dialog: dialogReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
