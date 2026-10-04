"use client";

import { useState } from "react";
import { uploadFile } from "@/frontend/lib/apiClient";

interface FileUploadFieldProps {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
}

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return Promise.resolve(file);

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" }
          );
          resolve(compressed);
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => resolve(file);
    img.src = objectUrl;
  });
}

export function FileUploadField({
  label,
  accept,
  value,
  onChange,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const toUpload = await compressImage(file);
      const url = await uploadFile(toUpload);
      onChange(url);
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="font-mono text-xs text-ink-muted block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={accept}
          onChange={handleFile}
          className="flex-1 text-xs font-mono text-ink-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-panel-deep file:text-ink file:font-mono file:text-xs hover:file:bg-panel file:cursor-pointer"
        />
        {uploading && (
          <span className="font-mono text-xs text-marigold animate-pulse shrink-0">
            subiendo...
          </span>
        )}
      </div>
      {value && !uploading && (
        <p className="font-mono text-[10px] text-teal mt-1 truncate">
          ✓ archivo cargado
        </p>
      )}
      {error && <p className="font-mono text-[10px] text-rose mt-1">{error}</p>}
    </div>
  );
}