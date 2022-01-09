import { useSelector } from "react-redux";
import styles from "./Navbar.module.scss";
import { BsFillPersonFill } from "react-icons/bs";
import PeraFinanceLogo from "assets/images/perafinance.png";

import { Fragment, useEffect, useState } from "react";
import { useFunctions } from "hooks/useFunctions";
import { useRequest } from "hooks/useReqest";
import { Button } from "components/Button";
import { GoAlert } from "react-icons/go";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const Navbar = () => {
  const { address, isSignedIn } = useSelector((state) => state.account);

  const { calculateUserRewards, claimAllRewards, calcDay } = useFunctions();

  const calcDayReq = useRequest(calcDay);
  const calculateReq = useRequest(calculateUserRewards);
  const claimReq = useRequest(claimAllRewards, {
    onFinished: () => {
      toast("Awards claimed successfully!");
      setRewards("0");
    },
  });

  const [rewards, setRewards] = useState(0);
  const [day, setDay] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const fetch = async () => {
      const res = await calculateReq.exec();
      if (res) {
        setRewards(res?.toString());
      }
    };
    fetch();

    const calcDayFetch = async () => {
      const res = await calcDayReq.exec();
      if (res) {
        setDay(res.toNumber());
      }
    };
    calcDayFetch();
  }, [isSignedIn]);

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <img className={styles.logo} src={PeraFinanceLogo} />
          <h3>Pera Finance | Swap Farming - Day #{day}</h3>
        </div>

        <div className={styles.itemWrapper}>
          <Button
            disabled={!isSignedIn || rewards == "0" || !rewards}
            loading={claimReq.loading}
            onClick={() => claimReq.exec()}
            className={styles.claim}
            size="small"
            type="primary"
          >
            {isSignedIn && rewards != "0" && rewards ? (
              <span className="icon">
                <GoAlert />
              </span>
            ) : null}

            <span>
              {isSignedIn && rewards != "0" && rewards
                ? `Claim ${ethers.utils.formatEther(rewards)} tokens`
                : "No Rewards"}
            </span>
          </Button>

          {isSignedIn && <p className={styles.network}>Fuji</p>}
          {address && (
            <p className={styles.account}>
              <span className="icon">
                <BsFillPersonFill size={24} />
              </span>
              <span>
                {address?.substring?.(0, 4) +
                  "..." +
                  address?.substring?.(address?.length - 4)}
              </span>
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export { Navbar };
