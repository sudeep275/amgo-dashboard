import { useState } from "react";
import UploadModal from "./UploadModal";
import { simulateUpload, type Asset } from "../services/assetService";

export default function AssetsTab() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const startUpload = async () => {
    if (!selectedFile) return;

    setIsModalOpen(false);
    setError("");

    const tempAsset: Asset = {
      id: Date.now(),
      name: selectedFile.name,
      progress: 0,
      status: "uploading",
    };

    setAssets((prev) => [...prev, tempAsset]);

    try {
      const result = await simulateUpload(selectedFile.name, (progress) => {
        setAssets((prev) =>
          prev.map((a) => (a.id === tempAsset.id ? { ...a, progress } : a)),
        );
      });

      setAssets((prev) =>
        prev.map((a) => (a.id === tempAsset.id ? result : a)),
      );
    } catch (err: any) {
      setError(err.message);

      setAssets((prev) =>
        prev.map((a) =>
          a.id === tempAsset.id ? { ...a, status: "failed" } : a,
        ),
      );
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: "2px dashed gray",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Drag & Drop File Here
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {assets.map((asset) => (
        <div key={asset.id} style={{ marginBottom: "10px" }}>
          <p>{asset.name}</p>
          <div
            style={{
              height: "8px",
              background: "#eee",
              width: "100%",
            }}
          >
            <div
              style={{
                width: `${asset.progress}%`,
                height: "8px",
                background: asset.status === "failed" ? "red" : "green",
              }}
            />
          </div>
          <p>Status: {asset.status}</p>
        </div>
      ))}

      <UploadModal
        isOpen={isModalOpen}
        onConfirm={startUpload}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
