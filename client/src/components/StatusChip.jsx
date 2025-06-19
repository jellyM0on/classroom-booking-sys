const colorMap = {
  grey: "#6c757d",
  yellow: "#f0ad4e",
  green: "#28a745",
  red: "#dc3545",
  black: "#000000"
};

export default function StatusChip({ label, type = "grey" }) {
  const dotColor = colorMap[type] || colorMap.grey;

  //   TODO: Refactor CSS
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        fontSize: "0.75rem",
        border: "0.25px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      <span
        style={{
          height: "8px",
          width: "8px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          marginRight: "6px",
        }}
      ></span>
      <span>{label}</span>
    </div>
  );
}
