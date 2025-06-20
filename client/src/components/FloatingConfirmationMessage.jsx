export default function FloatingConfirmationMessage({
  message = "Are you sure?",
  onConfirm,
  onCancel,
  type = "default",
}) {
  const boxStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const confirmButtonClass = type === "danger" ? "reject-btn" : "submit-btn";

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <p>{message}</p>
        <br />
        <div>
          <button
            className={confirmButtonClass}
            style={{ width: "fit-content" }}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="transparent-btn"
            style={{ width: "fit-content" }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
