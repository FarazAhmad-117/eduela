"use client";

import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

interface VideoUploadProps {
  onChange: (url?: string) => void;
}

export const VideoUpload = ({ onChange }: VideoUploadProps) => {
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
      formData.append("video", file); // Changed to "video"

      try {
        const url = "/api/upload/video";
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;

        if (data.success) {
          onChange(data.cloudinaryResponse.secure_url); // Adjust to get video URL
          toast.success("Video uploaded successfully!");
        } else {
          throw new Error(data.message || "Video upload failed");
        }
      } catch (error: any) {
        toast.error(`Error uploading video: ${error?.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "video/*": [] }, // Accept video files only
  });

  return (
    <div
      {...getRootProps({
        className:
          "border-2 border-dashed border-gray-400 rounded-lg p-4 text-center",
      })}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p>Uploading...</p>
      ) : (
        <p>Drag &apos;n&apos; drop a video here, or click to select one</p>
      )}
    </div>
  );
};
