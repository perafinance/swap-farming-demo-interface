import { Swap } from "pages/Swap";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "store";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <Swap />

      <ToastContainer
        position="top-right"
        draggable={true}
        hideProgressBar={false}
        theme="dark"
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </Provider>
  );
}

export default App;
