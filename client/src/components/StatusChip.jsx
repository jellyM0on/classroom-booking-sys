const colorMap = {
  grey: "#6c757d",
  yellow: "#f0ad4e",
  green: "#28a745",
  red: "#dc3545",
  black: "#000000",
};

export default function StatusChip({ label, type = "grey", size = "default" }) {
  const dotColor = colorMap[type] || colorMap.grey;
  const isSmall = size === "small";

  const formattedLabel =
    typeof label === "string" && label.length > 0
      ? label.charAt(0).toUpperCase() + label.slice(1)
      : label;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: isSmall ? "1px 6px" : "2px 8px",
        fontSize: isSmall ? "0.5rem" : "0.75rem",
        border: "0.25px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      <span
        style={{
          height: isSmall ? "6px" : "8px",
          width: isSmall ? "6px" : "8px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          marginRight: isSmall ? "4px" : "6px",
        }}
      ></span>
      <span>{formattedLabel}</span>
    </div>
  );
}
