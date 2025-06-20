import { FaInbox } from "react-icons/fa";

export default function NoDataFound({ message = "No data found." }) {
  return (
    <div
      className="no-data-found"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        width: "100%",
        textAlign: "center",
      }}
    >
      <FaInbox size={48} style={{ marginBottom: "0.5rem", color: "#999" }} />
      <p style={{ fontSize: "1.1rem", color: "#555" }}>{message}</p>
    </div>
  );
}
