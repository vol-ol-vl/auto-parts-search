import { configureStore } from "@reduxjs/toolkit";
import { favoriteApi } from "../api/favoritApiSlice";

export const store = configureStore({
  reducer: {
    [favoriteApi.reducerPath]: favoriteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(favoriteApi.middleware),
});

export default store;
