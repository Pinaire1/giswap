"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface Props {
  onComplete: (urls: string[]) => void;
  onError?: (message: string) => void;
}

export default function ImageUploader({ onComplete, onError }: Props) {
  return (
    <UploadButton<OurFileRouter, "giImageUploader">
      endpoint="giImageUploader"
      onClientUploadComplete={(res) => {
        const urls = res.map((file) => file.url);
        onComplete(urls);
      }}
      onUploadError={(error) => {
        onError?.(error.message);
      }}
    />
  );
}
