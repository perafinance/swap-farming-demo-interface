import { useSelector } from "react-redux";
import styles from "./Navbar.module.scss";
import { BsFillPersonFill } from "react-icons/bs";
import PeraFinanceLogo from "assets/images/perafinance.png";

import { Fragment } from "react";

const Navbar = () => {
  const { address, isSignedIn } = useSelector((state) => state.account);

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <img className={styles.logo} src={PeraFinanceLogo} />
          <h3>Pera Fianance Swap Farming</h3>
        </div>

        <div className={styles.itemWrapper}>
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
