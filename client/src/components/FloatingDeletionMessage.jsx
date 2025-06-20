import FloatingConfirmationMessage from "./FloatingConfirmationMessage";

export default function FloatingDeletionMessage({ message, onConfirm, onCancel }) {
  return (
    <FloatingConfirmationMessage
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      type="danger"
    />
  );
}
