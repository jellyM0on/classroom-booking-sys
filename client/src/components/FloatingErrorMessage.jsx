import { useEffect, useState } from "react";

export default function FloatingErrorMessage({ message, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="floating-error">
      <span className="error-icon">✖</span>
      <span className="error-text">{message}</span>
      <button className="error-close" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
