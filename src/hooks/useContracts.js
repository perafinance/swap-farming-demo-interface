import { useDispatch } from "react-redux";
import { ABI } from "constants/abi";
import { ERC20_ABI } from "constants/erc20_abi";
import { SWAP_CONTRACT, USDC, AVAX } from "constants/adresses";
import { ethers } from "ethers";
import { setContractData } from "store/reducers/contracts";

export default function useContracts(provider) {
  const dispatch = useDispatch();

  const setContracts = (provider) => {
    const USDC_CONTRACT = new ethers.Contract(USDC, ERC20_ABI, provider);
    const SWAP = new ethers.Contract(SWAP_CONTRACT, ABI, provider);
    const AVAX_CONTRACT = new ethers.Contract(AVAX, ERC20_ABI, provider);

    dispatch(
      setContractData({
        SWAP_CONTRACT: SWAP,
        USDC_CONTRACT: USDC_CONTRACT,
        AVAX_CONTRACT: AVAX_CONTRACT,
      })
    );
  };

  return { setContracts };
}
