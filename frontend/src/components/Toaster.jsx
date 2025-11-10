import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = () => (
  <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
);

export default Toaster;
