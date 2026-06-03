"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface Props {
  onComplete: (urls: string[]) => void;
}

export default function ImageUploader({ onComplete }: Props) {
  return (
    <UploadButton<OurFileRouter, "giImageUploader">
      endpoint="giImageUploader"
      onClientUploadComplete={(res) => {
        const urls = res.map((file) => file.url);
        onComplete(urls);
      }}
      onUploadError={(error) => {
        alert(error.message);
      }}
    />
  );
}