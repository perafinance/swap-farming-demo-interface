import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  provider: null,
  signer: null,
  isSignedIn: null,
  balance: 0,
};

export const accountSlicer = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountData(state, action) {
      const { address, provider, isSignedIn, signer } = action.payload;
      state.address = address;
      state.provider = provider;
      state.isSignedIn = isSignedIn;
      state.signer = signer;
    },
    setBalance(state, action) {
      state.balance = action.payload;
    },
    setIsSignedIn(state, action) {
      state.isSignedIn = action.payload;
    },
  },
});

export const { setAccountData, setBalance, setIsSignedIn } =
  accountSlicer.actions;

export default accountSlicer.reducer;
