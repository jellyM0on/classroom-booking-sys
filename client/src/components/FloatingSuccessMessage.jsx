import { useEffect, useState } from "react";

export default function FloatingSuccessMessage({ message, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="floating-success">
      <span className="success-icon">✓</span>
      <span className="success-text">{message}</span>
      <button className="success-close" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}