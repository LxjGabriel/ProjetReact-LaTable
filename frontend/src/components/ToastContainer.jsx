import { useEffect, useState } from "react";

let toastCallback = null;

export function showToast(message, type = "success", duration = 3000) {
  if (toastCallback) toastCallback({ message, type, duration });
}

export default function ToastContainer() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastCallback = setToast;
    return () => { toastCallback = null; };
  }, []);

  useEffect(() => {
    if (toast && toast.duration !== 0) {
      const timer = setTimeout(() => setToast(null), toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.message}
    </div>
  );
}