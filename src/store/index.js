import { configureStore } from "@reduxjs/toolkit";
import contractSlice from "./reducers/contracts";
import accountSlicer from "./reducers/account";

export const store = configureStore({
  reducer: {
    contract: contractSlice,
    account: accountSlicer,
  },
  middleware: (getDefaultMiddleware) => {
    const customizedMiddleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    return customizedMiddleware;
  },
});
