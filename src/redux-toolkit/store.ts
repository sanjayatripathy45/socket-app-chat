import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@/redux-toolkit/slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
