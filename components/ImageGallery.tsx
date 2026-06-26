"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="aspect-square bg-[#111] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1e2a4a] flex items-center justify-center text-8xl opacity-20">
        🥋
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-[#111] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1e2a4a] relative">
        <Image
          src={images[active]}
          alt={`${title} photo ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-200"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border relative transition-all ${
                i === active
                  ? "border-blue-500 ring-2 ring-blue-500/40"
                  : "border-[#1e2a4a] hover:border-[#3a4a6a]"
              }`}
            >
              <Image
                src={img}
                alt={`${title} photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
