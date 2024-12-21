"use client";

import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  type: "file" | "image";
}

export const FileUpload = ({ onChange, type }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        toast.error("No file selected!");
        return;
      }

      setIsUploading(true);

      // Create FormData to send to your API route
      const formData = new FormData();
      formData.append("file", file);

      try {
        let url = type === "image" ? "/api/upload/image" : "/api/upload/file";
        // Send request to the Next.js API route
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;

        if (data.success) {
          onChange(data.cloudinaryResponse.secure_url);
          toast.success("File uploaded successfully!");
        } else {
          throw new Error(data.message || "File upload failed");
        }
      } catch (error: any) {
        toast.error(`Error uploading file: ${error?.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: type === "image" ? { "image/*": [] } : {}, // Fixed accept condition
  });

  return (
    <div
      {...getRootProps({
        className:
          "border-2 min-h-32 border-dashed border-gray-400 rounded-lg p-4 text-center",
      })}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p>Uploading...</p>
      ) : (
        <p>Drag &apos;n&apos; drop a file here, or click to select one</p>
      )}
    </div>
  );
};
