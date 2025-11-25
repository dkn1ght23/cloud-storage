import type {
  ListFilesResponse,
  StoredFile,
  DeleteFileResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function listFiles(): Promise<StoredFile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/files`);

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const data: ListFilesResponse = await response.json();
    return data.files;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

export async function uploadFile(file: File): Promise<StoredFile> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    return data.file;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function deleteFile(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    const data: DeleteFileResponse = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export function getDownloadUrl(file: StoredFile): string {
  // Always go through the backend, NOT S3 directly
  return `${API_BASE_URL}/files/${file.id}/download`;
}
