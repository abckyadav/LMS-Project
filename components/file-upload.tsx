"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

type FileUploadProps = {
  onChange: (url?: string) => void;
  endPoint: keyof typeof ourFileRouter;
};

export default function FileUpload({ onChange, endPoint }: FileUploadProps) {
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        toast.success("Upload completed");
      }}
      onUploadError={(error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  );
}
