import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import resourceReducer from "./resource.slice";

const store = configureStore({
  reducer: {
    authSlice: authReducer,
    resourceSlice: resourceReducer,
  },
});

export default store;
