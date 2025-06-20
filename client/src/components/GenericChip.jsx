export default function GenericChip({ label, size = "default" }) {
  const isSmall = size === "small";

  const formattedLabel =
    typeof label === "string" && /^[a-zA-Z]/.test(label)
      ? label.charAt(0).toUpperCase() + label.slice(1)
      : label;

  return (
    <div
      style={{
        display: "inline-flex",
        width: "fit-content",
        alignItems: "center",
        padding: isSmall ? "1px 6px" : "2px 8px",
        fontSize: isSmall ? "0.5rem" : "0.75rem",
        border: "0.25px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      <span>{formattedLabel}</span>
    </div>
  );
}
