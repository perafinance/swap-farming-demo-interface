import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useFunctions } from "./useFunctions";
import { useRequest } from "./useReqest";

export const useSwapRequests = ({ setUSDC, setAVAX, calculateBalances }) => {
  const {
    swapExactAVAXForTokens,
    swapExactTokensForAVAX,
    swapAVAXForExactTokens,
    swapTokensForExactAVAX,
  } = useFunctions();

  const swapExactAvaxReq = useRequest(
    (...args) => swapExactAVAXForTokens(...args),
    {
      onStart: () => {
        toast("Swapping Exact AVAX for Tokens");
      },
      onFinished: () => {
        toast("Tokens swapped succesfully");
        calculateBalances?.();
        setAVAX("");
        setUSDC("");
      },
    }
  );

  const swapExactTokensReq = useRequest(
    (...args) => swapExactTokensForAVAX(...args),
    {
      onStart: () => {
        toast("Swapping Tokens for AVAX");
      },
      onFinished: () => {
        toast("Tokens swapped succesfully");
        calculateBalances?.();
        setAVAX("");
        setUSDC("");
      },
    }
  );

  const swapAvaxReq = useRequest((...args) => swapAVAXForExactTokens(...args), {
    onStart: () => {
      toast("Swapping AVAX for exact tokens");
    },
    onFinished: () => {
      toast("Tokens swapped succesfully");
      calculateBalances?.();
      setAVAX("");
      setUSDC("");
    },
  });

  const swapTokensReq = useRequest(
    (...args) => swapTokensForExactAVAX(...args),
    {
      onStart: () => {
        toast("Swapping tokens for exact AVAX");
      },
      onFinished: () => {
        toast("Tokens swapped succesfully");
        calculateBalances?.();
        setAVAX("");
        setUSDC("");
      },
    }
  );

  return {
    swapExactAvaxReq,
    swapExactTokensReq,
    swapAvaxReq,
    swapTokensReq,
  };
};

// swapExactAVAXForTokens("0", AVAX_TO_USDC, address, 99999999999, {
//   value: ethers.utils.parseEther("0.01"),
// }),
