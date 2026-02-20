export type UploadStatus = "uploading" | "completed" | "failed";

export interface Asset {
  id: number;
  name: string;
  progress: number;
  status: UploadStatus;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldFail = () => Math.random() < 0.2;

export const simulateUpload = async (
  fileName: string,
  onProgress: (progress: number) => void,
): Promise<Asset> => {
  let progress = 0;

  while (progress < 100) {
    await delay(300);
    progress += 20;
    onProgress(progress);
  }

  if (shouldFail()) {
    throw new Error("Upload failed. Try again.");
  }

  return {
    id: Date.now(),
    name: fileName,
    progress: 100,
    status: "completed",
  };
};
