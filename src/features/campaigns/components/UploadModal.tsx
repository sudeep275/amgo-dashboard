interface UploadModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UploadModal({
  isOpen,
  onConfirm,
  onCancel,
}: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "white", padding: "20px" }}>
        <h3>Confirm Upload</h3>
        <p>Are you sure you want to upload this file?</p>

        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
