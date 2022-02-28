import { Spinner } from "components/Spinner";
import { ethers } from "ethers";
import { useFunctions } from "hooks/useFunctions";
import { useRequest } from "hooks/useReqest";
import { Fragment, useEffect, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { useSelector } from "react-redux";
import { clsnm } from "utils/clsnm";
import styles from "./Navbar.module.scss";

const InfoTable = () => {
  const { address, isSignedIn } = useSelector((state) => state.account);
  const [day, setDay] = useState(0);
  const [totalDay, setTotalDay] = useState(0);
  const [dailyVolume, setDailyVolume] = useState(0);
  const [volumeRecord, setVolumeRecord] = useState(0);
  const [controllerDay, setControllerDay] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [dailyUserRew, setDailyUserRew] = useState(0);
  const {
    calcDay,
    totalDays,
    dailyVolumes,
    volumeRecords,
    totalRewardBalance,
    calculateDailyUserReward,
  } = useFunctions();

  const calcDayReq = useRequest(calcDay);
  const totalDayReq = useRequest(totalDays);
  const dailyVolumeReq = useRequest(dailyVolumes);
  const volumeRecordReq = useRequest(volumeRecords);
  const totalRewardReq = useRequest(totalRewardBalance);
  const dailyUserRewardReq = useRequest(calculateDailyUserReward);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const calcDayFetch = async () => {
      let _d, _td;
      let res = await calcDayReq.exec();
      if (res) {
        const number = res?.toNumber();
        _d = number;
        setDay(number);
        setControllerDay(number);
      }
      res = await totalDayReq.exec();
      if (res) {
        const number = res?.toNumber();
        _td = number;
        setTotalDay(number - 1);
        dailyVolumeReq.exec(number - 1);
      }
      if (_d > _td) {
        setControllerDay(_td)
      }
      res = await totalRewardReq.exec();
      if (res) {
        const number = ethers.utils.formatEther(res)?.split?.(".")?.[0];
        setTotalReward(number);
      }
    };
    calcDayFetch();
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    const fetch = async () => {
      if (controllerDay || controllerDay == 0) {
        const res = await dailyVolumeReq.exec(controllerDay);
        setDailyVolume(ethers.utils.formatEther(res)?.split(".")?.[0]);
        const volumeRes = await volumeRecordReq.exec(address, controllerDay);
        setVolumeRecord(ethers.utils.formatEther(volumeRes)?.split(".")?.[0]);
        const totalDailyRew = await dailyUserRewardReq.exec(controllerDay);
        setDailyUserRew(
          ethers.utils.formatEther(totalDailyRew)?.split(".")?.[0]
        );
      }
    };
    fetch();
  }, [isSignedIn, controllerDay]);

  return (
    <Fragment>
      {calcDayReq.loading || totalDayReq.loading ? (
        <div className={clsnm(styles.infoTable, styles.fixed)}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.infoTable}>
          <div className={styles.row}>
            <p>Day:</p>
            <p>
              {day + 1} / {totalDay + 1}
            </p>
          </div>
          <div className={styles.rowWrapper}>
            <div className={styles.rows}>
              <div className={styles.row}>
                <p>Total Daily Volume:</p>

                {dailyVolumeReq.loading ? (
                  <p>Calculating...</p>
                ) : (
                  <p>{dailyVolume} tokens</p>
                )}
              </div>
              <div className={styles.row}>
                <p>Your Daily Volume:</p>
                {volumeRecordReq.loading ? (
                  <p>Calculating...</p>
                ) : (
                  <p>{volumeRecord} tokens</p>
                )}
              </div>
              <div className={styles.row}>
                <p>Daily User Reward:</p>
                <p>
                  {dailyUserRewardReq.loading ? (
                    <p>Calculating...</p>
                  ) : (
                    <p>{dailyUserRew} tokens</p>
                  )}
                </p>
              </div>
            </div>

            <div className={styles.controller}>
              <div
                onClick={() => {
                  if (controllerDay + 1 > day || controllerDay + 1 > totalDay) {
                    setControllerDay(0);
                  } else {
                    setControllerDay(controllerDay + 1);
                  }
                }}
                className={styles.icon}
              >
                <BsArrowUp size={24} />
              </div>
              <div className={styles.box}>
                <p>{controllerDay+1}</p>
              </div>
              <div
                onClick={() => {
                  if (controllerDay - 1 < 0) {
                    setControllerDay(day);
                  } else {
                    setControllerDay(controllerDay - 1);
                  }
                }}
                className={styles.icon}
              >
                <BsArrowDown size={24} />
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <p>Undistributed Reward:</p>
            <p>
              {" "}
              {totalRewardReq.loading ? (
                <p>Calculating...</p>
              ) : (
                <p>{totalReward} tokens</p>
              )}
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export { InfoTable };
