import { useState, useCallback } from "react";

let _setToasts = null;

export function useToast() {
  const toast = useCallback((msg, type = "info") => {
    if (_setToasts) {
      const id = Date.now();
      _setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => {
        _setToasts(prev => prev.filter(t => t.id !== id));
      }, 3500);
    }
  }, []);
  return { toast };
}

const icons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
