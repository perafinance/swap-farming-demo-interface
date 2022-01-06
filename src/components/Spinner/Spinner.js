import styles from "./Spinner.module.scss";

const Spinner = ({ size = 32 }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={styles.loader}
    ></div>
  );
};

export { Spinner };
