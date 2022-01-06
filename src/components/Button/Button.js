import React from "react";
import styles from "./Button.module.scss";
import { Spinner } from "components/Spinner";
import { clsnm } from "utils/clsnm";

/**
 * type = "primary" | "secondary"
 * size = "small" | "medium" | "large" | "xlarge"
 * laading = true | false
 */

const Button = React.forwardRef(
  (
    {
      children,
      type = "primary",
      size = "medium",
      loading = false,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const variant = ["small", "medium"].includes(size) ? "body2" : "body1";

    return (
      <button
        className={clsnm(
          styles["button"],
          styles[type],
          styles[size],
          disabled && styles.disabled,
          loading && styles["loading"],
          className
        )}
        ref={ref}
        {...rest}
      >
        <h6
          weight="medium"
          variant={variant}
          className={clsnm(styles.content, loading && styles.loading)}
        >
          {children}
        </h6>
        <div className={styles.loadingIndicator}>
          {loading && <Spinner size={18} />}
        </div>
      </button>
    );
  }
);

export { Button };
