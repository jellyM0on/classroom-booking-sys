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
    borderLeft: type === "danger" ? "5px solid red" : "5px solidrgb(0, 0, 0)",
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

  const buttonStyle = {
    margin: "10px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <p>{message}</p>
        <div>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: type === "danger" ? "#e53e3e" : "#38a169",
            }}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#718096" }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
