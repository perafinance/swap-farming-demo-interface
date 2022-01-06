import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setAccountData, setIsSignedIn } from "store/reducers/account";
import { checkIfRightNetwork } from "utils/checkIfRightNetwork";
import useContracts from "./useContracts";

/* const RINKEBY_NETWORK = {
  id: "0xa869",
  name: "Avalanche Fuji C Chain",
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" },
}; */

export default function useRequestAccounts() {
  checkIfRightNetwork();

  const dispatch = useDispatch();

  const { setContracts } = useContracts();

  const requestAccounts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    try {
      //await checkIfRightNetwork(AVALANCHE_NETWORK);
      await provider.send("eth_requestAccounts", []);
      let signer = await provider.getSigner();
      const address = await signer.getAddress();

      setContracts(provider);

      dispatch(
        setAccountData({
          address: address,
          isSignedIn: true,
          provider: provider,
          signer,
        })
      );

      return signer;
    } catch {
      setContracts(provider);
      dispatch(setIsSignedIn(false));
      return false;
    }
  };

  return { requestAccounts };
}
