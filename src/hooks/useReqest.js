import { useState } from "react";
import { toast } from "react-toastify";

export const useRequest = (func, { errorMsg, onStart, onFinished } = {}) => {
  const [loading, setLoading] = useState(false);

  const notify = (msg) =>
    toast(msg || "Something went wrong", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: false,
    });

  const fn = {
    exec: async function (...args) {
      try {
        setLoading(true);
        onStart?.();
        const res = await func?.(...args);
        setLoading(false);
        onFinished?.(...args);
        return res;
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (err.code == 4001) {
          toast("Metamask transaciton rejected");
        } else {
          notify(errorMsg);
          if (process.env.NODE_ENV !== "production") {
            throw new Error(err);
          }
        }
      }
    },
    loading: loading,
  };

  return fn;
};
