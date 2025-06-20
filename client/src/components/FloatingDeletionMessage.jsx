import FloatingConfirmationMessage from "./FloatingConfirmationMessage";

export default function FloatingDeletionMessage({ onConfirm, onCancel }) {
  return (
    <FloatingConfirmationMessage
      message="Are you sure you want to delete this item? This action cannot be undone."
      onConfirm={onConfirm}
      onCancel={onCancel}
      type="danger"
    />
  );
}
