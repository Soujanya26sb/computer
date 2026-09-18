"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/types";

interface Props {
  existingImages: ProductImage[];
  newFiles: File[];
  removeIds: string[];
  onRemoveExisting: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
}

export default function ImageUploader({
  existingImages,
  newFiles,
  removeIds,
  onRemoveExisting,
  onAddFiles,
  onRemoveNew,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onAddFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  }

  const activeExisting = existingImages.filter((img) => !removeIds.includes(img.id));

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Product Images</label>

      {/* Existing images */}
      {activeExisting.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Current images (click × to remove)</p>
          <div className="flex flex-wrap gap-3">
            {activeExisting.map((img) => (
              <div key={img.id} className="relative group">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src={img.url} alt="product" fill className="object-cover" sizes="80px" />
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-center text-xs py-0.5">
                      Primary
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img.id)}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New files preview */}
      {newFiles.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">New images to upload</p>
          <div className="flex flex-wrap gap-3">
            {newFiles.map((file, idx) => (
              <div key={idx} className="relative group">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-blue-300 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt="new"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNew(idx)}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFiles}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Images (JPEG, PNG, WebP, GIF — max 5MB each)
        </label>
      </div>
    </div>
  );
}
