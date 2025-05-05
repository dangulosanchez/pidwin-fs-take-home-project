import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let toastId = 0;

const toastOptions: ToastOptions = {
  position: "bottom-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  toastId,
};


export const success = (message: string) => 
  toast.success(message, {...toastOptions, toastId: ++toastId});

export const error = (message: string) =>
  toast.error(message, {...toastOptions, toastId: ++toastId});

export const warning = (message: string) =>
  toast.warning(message, {...toastOptions, toastId: ++toastId});

export const info = (message: string) =>
  toast(message, {...toastOptions, toastId: ++toastId});