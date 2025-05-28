import { axiosClient } from "@/lib/axiosClient";

/**
 * Uploads a file to the backend.
 * @param file The file or blob to upload.
 * @param folder The target S3 folder/prefix (e.g., 'audition_audio', 'resumes').
 * @param fileName Optional filename to use.
 * @returns The S3 key of the uploaded file.
 */
export const uploadFile = async (
  file: Blob | File,
  folder: string,
  fileName?: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file, fileName || (file instanceof File ? file.name : "blob.dat"));
  formData.append("folder", folder);

  try {
    const res = await axiosClient.post("/api/uploads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data && res.data.key) {
      return res.data.key;
    } else {
      throw new Error("Upload response did not contain a file key.");
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || `Failed to upload ${fileName || "file"}.`;
    console.error(`File upload to folder ${folder} failed:`, errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};
