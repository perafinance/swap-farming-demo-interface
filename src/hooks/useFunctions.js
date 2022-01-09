import { MaxUint256 } from "@ethersproject/constants";
import { useSelector } from "react-redux";

export const useFunctions = () => {
  const { provider, address, signer } = useSelector((state) => state.account);
  const { USDC_CONTRACT, SWAP_CONTRACT, AVAX_CONTRACT } = useSelector(
    (state) => state.contract
  );

  const getBlockTimestamp = async () => {
    let block_number, block, block_timestamp;

    block_number = await provider.getBlockNumber();
    block = await provider.getBlock(block_number);
    block_timestamp = block.timestamp;

    return block_timestamp;
  };

  const approveUSDC = async () => {
    const txn = await USDC_CONTRACT?.connect(signer).approve(
      SWAP_CONTRACT?.address,
      MaxUint256
    );
    await txn.wait();
    return txn;
  };

  const approveAVAX = async () => {
    const txn = await AVAX_CONTRACT?.connect(signer).approve(
      SWAP_CONTRACT?.address,
      MaxUint256
    );
    await txn.wait();
    return txn;
  };

  const isUSDCAllowed = async () => {
    const res = await USDC_CONTRACT?.allowance(address, SWAP_CONTRACT.address);
    return res;
  };

  const balanceOfUSDC = async (addr) => {
    const res = await USDC_CONTRACT?.balanceOf(addr);
    return res;
  };

  const isAVAXAllowed = async () => {
    const res = await AVAX_CONTRACT?.allowance(address, SWAP_CONTRACT.address);
    return res;
  };

  const swapExactAVAXForTokens = async (...args) => {
    const txn = await SWAP_CONTRACT.connect(signer).swapExactAVAXForTokens(
      ...args
    );
    await txn.wait();
  };

  const swapExactTokensForAVAX = async (...args) => {
    const txn = await SWAP_CONTRACT.connect(signer).swapExactTokensForAVAX(
      ...args
    );
    await txn.wait();
  };

  const swapTokensForExactAVAX = async (...args) => {
    const txn = await SWAP_CONTRACT.connect(signer).swapTokensForExactAVAX(
      ...args
    );
    await txn.wait();
  };

  const swapAVAXForExactTokens = async (...args) => {
    const txn = await SWAP_CONTRACT.connect(signer).swapAVAXForExactTokens(
      ...args
    );
    await txn.wait();
  };

  const getAmountsOut = async (...args) => {
    const res = await SWAP_CONTRACT.getAmountsOut(...args);
    return res;
  };

  const getAmountsIn = async (...args) => {
    const res = await SWAP_CONTRACT.getAmountsIn(...args);
    return res;
  };

  const claimAllRewards = async () => {
    const res = await SWAP_CONTRACT.connect(signer).claimAllRewards();
    return res;
  };

  const calculateUserRewards = async () => {
    const res = await SWAP_CONTRACT.connect(signer).calculateUserRewards();
    return res;
  };

  const calcDay = async () => {
    const res = await SWAP_CONTRACT.calcDay();
    return res;
  };

  const totalDays = async () => {
    const res = await SWAP_CONTRACT.connect(signer).totalDays();
    return res;
  };

  const dailyVolumes = async (day) => {
    const res = await SWAP_CONTRACT.connect(signer).dailyVolumes(day);
    return res;
  };

  const volumeRecords = async (addr, day) => {
    const res = await SWAP_CONTRACT.connect(signer).volumeRecords(addr, day);
    return res;
  };

  const totalRewardBalance = async () => {
    const res = await SWAP_CONTRACT.connect(signer).totalRewardBalance();
    return res;
  };

  const isCalculated = async () => {
    const res = await SWAP_CONTRACT.isCalculated();
    return res;
  };

  const calculateDailyUserReward = async (day) => {
    const res = await SWAP_CONTRACT.connect(signer).calculateDailyUserReward(
      day
    );
    return res;
  };

  return {
    totalRewardBalance,
    swapExactAVAXForTokens,
    isUSDCAllowed,
    swapExactAVAXForTokens,
    swapExactTokensForAVAX,
    swapAVAXForExactTokens,
    swapTokensForExactAVAX,
    approveUSDC,
    getBlockTimestamp,
    getAmountsOut,
    getAmountsIn,
    isAVAXAllowed,
    approveAVAX,
    calculateUserRewards,
    claimAllRewards,
    calcDay,
    totalDays,
    dailyVolumes,
    volumeRecords,
    calculateDailyUserReward,
    balanceOfUSDC,
    isCalculated,
  };
};
