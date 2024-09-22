"use client";

import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
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
                // Send request to the Next.js API route
                const response = await axios.post("/api/upload/file", formData, {
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
        accept: { "image/*": [] } as Accept,
    });

    return (
        <div
            {...getRootProps({
                className: "border-2 border-dashed border-gray-400 rounded-lg p-4 text-center",
            })}
        >
            <input {...getInputProps()} />
            {isUploading ? <p>Uploading...</p> : <p>Drag 'n' drop a file here, or click to select one</p>}
        </div>
    );
};
