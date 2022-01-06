import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AVAX_CONTRACT: null,
  USDC_CONTRACT: null,
  SWAP_CONTRACT: null,
};

export const contractSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setContractData(state, action) {
      state.SWAP_CONTRACT = action.payload.SWAP_CONTRACT;
      state.USDC_CONTRACT = action.payload.USDC_CONTRACT;
      state.AVAX_CONTRACT = action.payload.AVAX_CONTRACT;
    },
  },
});

export const { setContractData } = contractSlice.actions;

export default contractSlice.reducer;
