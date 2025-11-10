import { toast } from "react-toastify";

/**
 * Displays a success toast notification.
 * @param {string} msg - Success message to display
 */
export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * Displays an error toast notification.
 * @param {string} msg - Error message to display
 */
export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
