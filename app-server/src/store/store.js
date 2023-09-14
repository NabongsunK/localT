import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";

const store = configureStore({
  reducer: {
    myLoginSlice : loginSlice.reducer
  }
});

export default store;