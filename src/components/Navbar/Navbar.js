import { useSelector } from "react-redux";
import styles from "./Navbar.module.scss";
import { BsFillPersonFill, BsWallet } from "react-icons/bs";
import PeraFinanceLogo from "assets/images/perafinance.png";

import { Fragment, useEffect, useState } from "react";
import { useFunctions } from "hooks/useFunctions";
import { useRequest } from "hooks/useReqest";
import { Button } from "components/Button";
import { GoAlert } from "react-icons/go";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import useRequestAccounts from "hooks/useRequestAccounts";
import { useDropdownPopper } from "hooks/useDropdownPopper";
import { InfoTable } from "./InfoTable";

const Navbar = () => {
  const { address, isSignedIn } = useSelector((state) => state.account);
  const [isCalculatedValue, setIsCalculatedValue] = useState(false);

  const { calculateUserRewards, claimAllRewards, isCalculated } =
    useFunctions();
  const { requestAccounts } = useRequestAccounts();

  const calculateReq = useRequest(calculateUserRewards);
  const isCalculatedReq = useRequest(isCalculated);
  const claimReq = useRequest(claimAllRewards, {
    onFinished: () => {
      toast("Awards claimed successfully!");
      setRewards("0");
    },
  });

  const [rewards, setRewards] = useState(0);

  const {
    setReferenceElement,
    setPopperElement,
    popperStyles,
    setExpand,
    expand,
    attributes,
    closeRef,
  } = useDropdownPopper({ placement: "bottom-end" });

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
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    const fetch = async () => {
      const res = await isCalculatedReq.exec();
      if (res) {
        setIsCalculatedValue(res);
      }
    };
    fetch();
  }, []);

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <img className={styles.logo} src={PeraFinanceLogo} />
          <h3>Pera Finance | Swap Farming</h3>
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
            {isSignedIn && rewards != "0" && rewards && isCalculatedValue ? (
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
          {address ? (
            <div ref={closeRef}>
              <p
                onClick={() => setExpand(!expand)}
                className={styles.account}
                ref={setReferenceElement}
              >
                <span className="icon">
                  <BsFillPersonFill size={24} />
                </span>
                <span>
                  {address?.substring?.(0, 4) +
                    "..." +
                    address?.substring?.(address?.length - 4)}
                </span>
              </p>
              {expand && (
                <div
                  className={styles.popper}
                  ref={setPopperElement}
                  style={popperStyles.popper}
                  {...attributes.popper}
                >
                  <InfoTable />
                </div>
              )}
            </div>
          ) : (
            <p className={styles.account} onClick={() => requestAccounts(true)}>
              <span className="icon">
                <BsWallet size={24} />
              </span>
              <span>Connect Wallet</span>
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export { Navbar };
