export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`loading-wrapper ${className}`}>
      <div className="spinner" />
    </div>
  );
}
