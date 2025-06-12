import { showToast } from "../components/ToastContainer";

const ToastService = {
  success: (msg, duration) => showToast(msg, "success", duration),
  danger: (msg, duration) => showToast(msg, "danger", duration),
  warn: (msg, duration) => showToast(msg, "warn", duration),
};

export default ToastService;