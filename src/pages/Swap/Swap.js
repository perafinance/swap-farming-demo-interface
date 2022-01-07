import { Navbar } from "components/Navbar";
import { AVAX_TO_USDC, USDC_TO_AVAX } from "constants/paths";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useFunctions } from "hooks/useFunctions";
import { useRequest } from "hooks/useReqest";
import useRequestAccounts from "hooks/useRequestAccounts";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Swap.module.scss";
import { CgArrowsExchangeV } from "react-icons/cg";
import USDCLOGO from "assets/images/usdc.png";
import AVAXLOGO from "assets/images/avax.png";
import { Button } from "components/Button";
import { useDebounce } from "hooks/useDebounce";
import { useSwapRequests } from "hooks/useSwapRequests";
import PeraRoad from "assets/images/pera-road.png";
import Pangolin from "assets/images/pangolin.png";
import { ReactComponent as PangolinLogo } from "assets/images/pangolin.svg";

const Swap = () => {
  const [AVAX, setAVAX] = useState("");
  const [USDC, setUSDC] = useState("");
  const { isSignedIn, address } = useSelector((state) => state.account);
  const { requestAccounts } = useRequestAccounts();
  const [from, setFrom] = useState("avax");
  const [lastChange, setLastChange] = useState("avax");
  const [tolerance, setTolerance] = useState(2);
  const [deadline, setDeadline] = useState(30);
  const {
    isUSDCAllowed,
    isAVAXAllowed,
    approveAVAX,
    approveUSDC,
    getBlockTimestamp,
    getAmountsOut,
    getAmountsIn,
  } = useFunctions();

  const { swapExactAvaxReq, swapExactTokensReq, swapAvaxReq, swapTokensReq } =
    useSwapRequests({ setUSDC, setAVAX });

  const isAllowedReq = useRequest(isUSDCAllowed);
  const isAllowedAvaxReq = useRequest(isAVAXAllowed);
  const approveUSDCReq = useRequest(approveUSDC, {
    onFinished: () => {
      toast("Contract approved successfully");
    },
  });
  const approveAVAXReq = useRequest(approveAVAX, {
    onFinished: () => {
      toast("Contract approved successfully");
    },
  });

  const getBlockTimestampReq = useRequest(getBlockTimestamp);
  const getAmountsOutReq = useRequest((val, path) => getAmountsOut(val, path), {
    errorMsg: "Incorrect amount",
  });
  const getAmountsInReq = useRequest((val, path) => getAmountsIn(val, path), {
    errorMsg: "Incorrect amount",
  });

  useEffect(() => {
    if (!isSignedIn) {
      requestAccounts();
      return;
    }
  }, [isSignedIn]);

  const handleSwap = async () => {
    const timestamp = await getBlockTimestampReq.exec();
    const actualDeadline = timestamp + 60 * deadline;

    const swap = async () => {
      if (lastChange === "avax" && from === "avax") {
        let amountMin = Number(USDC);
        amountMin = String(amountMin * ((100 - tolerance) / 100));
        await swapExactAvaxReq.exec(
          ethers.utils.parseEther("0.1"),
          AVAX_TO_USDC,
          address,
          actualDeadline,
          { value: ethers.utils.parseEther(AVAX) }
        );
      } else if (lastChange === "usdc" && from === "avax") {
        let toleranceInput = Number(AVAX);
        toleranceInput = String(toleranceInput * ((100 + tolerance) / 100));
        await swapAvaxReq.exec(
          ethers.utils.parseEther(USDC),
          AVAX_TO_USDC,
          address,
          actualDeadline,
          { value: ethers.utils.parseEther(toleranceInput) }
        );
      } else if (lastChange === "usdc" && from === "usdc") {
        let amountMin = Number(AVAX);
        amountMin = String(amountMin * ((100 - tolerance) / 100));
        console.log(typeof AVAX, typeof amountMin);
        console.log(AVAX, amountMin);
        console.log(AVAX.length, amountMin.length);

        swapExactTokensReq.exec(
          ethers.utils.parseEther(USDC),
          ethers.utils.parseEther(amountMin?.substring(0, 20)),
          USDC_TO_AVAX,
          address,
          actualDeadline
        );
      } else if (lastChange === "avax" && from === "usdc") {
        let amountMax = Number(USDC);
        amountMax = String(amountMax * ((100 + tolerance) / 100));
        swapTokensReq.exec(
          ethers.utils.parseEther(AVAX),
          ethers.utils.parseEther(amountMax?.substring(0, 20)),
          USDC_TO_AVAX,
          address,
          actualDeadline
        );
      }
    };
    let res;
    if (from === "usdc") {
      res = await isAllowedReq.exec();
      if (res?.toString() == 0) {
        let approval = true;
        approval = await approveUSDCReq.exec();
        if (approval) {
          await swap();
        }
      } else {
        await swap();
      }
    } else {
      await swap();
    }
  };

  const getOutputAmount = async (amount, path) => {
    if (amount == 0 || !amount) {
      if (from === "avax") {
        setUSDC("");
      } else {
        setAVAX("");
      }

      return;
    }
    const res = await getAmountsOutReq.exec(
      ethers.utils.parseEther(amount),
      path
    );
    if (res?.[1]) {
      if (from === "avax") {
        setUSDC(formatEther(res[1]));
      } else {
        setAVAX(formatEther(res[1]));
      }
    }
  };

  const getInputAmount = async (amount, path) => {
    if (amount == "0" || !amount) {
      if (from === "avax") {
        setAVAX("");
      } else {
        setUSDC("");
      }
      return;
    }
    const res = await getAmountsInReq.exec(
      ethers.utils.parseEther(amount),
      path
    );
    if (res?.[1]) {
      if (from === "avax") {
        setAVAX(formatEther(res[0]));
      } else {
        setUSDC(formatEther(res[0]));
      }
    }
  };

  const outReq = useDebounce((amount, path) => getOutputAmount(amount, path));
  const inReq = useDebounce((amount, path) => getInputAmount(amount, path));

  const avaxInput = (
    <div className={styles.inputContainer}>
      <input
        placeholder="0.0"
        type="number"
        className={styles.input}
        value={AVAX}
        onChange={(e) => {
          setLastChange("avax");
          if (from === "avax") {
            outReq(e.target.value, AVAX_TO_USDC);
          } else {
            inReq(e.target.value, USDC_TO_AVAX);
          }
          setAVAX(e.target.value);
        }}
      />
      <img className={styles.logo} src={AVAXLOGO} />
    </div>
  );

  const usdcInput = (
    <div className={styles.inputContainer}>
      <input
        placeholder="0.0"
        type="number"
        className={styles.input}
        value={USDC}
        onChange={(e) => {
          setLastChange("usdc");
          if (from === "avax") {
            inReq(e.target.value, AVAX_TO_USDC);
          } else {
            outReq(e.target.value, USDC_TO_AVAX);
          }
          setUSDC(e.target.value);
        }}
      />
      <img className={styles.logo} src={USDCLOGO} />
    </div>
  );

  return (
    <Fragment>
      <img className={styles.road} src={PeraRoad} />
      <div className={styles.pangolin}>
        <span>Powered by Pangolin Liquidity Pools</span> <img src={Pangolin} />
      </div>
      <div className={styles.layout}>
        <Navbar />
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <h5>From</h5>
            {from === "avax" ? avaxInput : usdcInput}
            <div className={styles.swapWrapper}>
              <div
                onClick={() =>
                  from === "avax" ? setFrom("usdc") : setFrom("avax")
                }
                className={styles.swapIcon}
              >
                <CgArrowsExchangeV color="white" size={36} />
              </div>
            </div>
            <h5>To</h5>
            {from === "avax" ? usdcInput : avaxInput}
            <Button
              disabled={!AVAX || !USDC}
              loading={
                getAmountsInReq.loading ||
                getAmountsOutReq.loading ||
                swapExactAvaxReq.loading ||
                swapAvaxReq.loading ||
                swapExactTokensReq.loading ||
                approveAVAXReq.loading ||
                approveUSDCReq.loading ||
                swapTokensReq.loading
              }
              className={styles.button}
              type="tertiary"
              onClick={handleSwap}
            >
              Swap
            </Button>
            <div className={styles.metaWrapper}>
              <div>
                <p>Slippage tolerance (%)</p>
                <input
                  value={tolerance}
                  type="number"
                  onChange={(e) => setTolerance(e.target.value)}
                  placeholder={"Tolerance %"}
                />
              </div>
              <div>
                <p>Deadline (Minutes)</p>
                <input
                  type="number"
                  onChange={(e) => setDeadline(e.target.value)}
                  value={deadline}
                  placeholder={"Enter minutes"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Swap };

// slipage -> %2 -> USDC - 0.02%

// AVAX yazdigimda -> swapExactAvaxForTokens()
// A swapAvaxForExactTokens()
//                 -> swapAvaxForAVAX

/* swapExactAVAXForTokens("0", AVAX_TO_USDC, address, 99999999999, {
  value: ethers.utils.parseEther("0.01"),
}), */
