"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";

type FileStatus = "idle" | "processing" | "done" | "error" | "warn";

type Item = {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  percentSaved?: number;
  status: FileStatus;
  error?: string;
  progress: number;
  downloadUrl?: string;
  compressedBlob?: Blob;
  thumbnailUrl?: string;
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 || units[i] === "B" ? 0 : 1)} ${units[i]}`;
}

function calcPercent(original: number, compressed: number): number {
  if (!original || !compressed) return 0;
  return Math.max(0, Math.round(((original - compressed) / original) * 100));
}

// Map quality slider (0.1–1.0) → target maxSizeMB relative to original
// Wider range: quality 1.0 → 85% of original, quality 0.1 → 5% of original
function qualityToMaxSizeMB(originalBytes: number, quality: number): number {
  const originalMB = originalBytes / 1024 / 1024;
  // Exponential curve for better perceptual control:
  // quality 1.0 → factor 0.85 (light compression)
  // quality 0.5 → factor 0.25 (moderate)
  // quality 0.1 → factor 0.05 (aggressive)
  const factor = 0.05 + 0.80 * Math.pow(quality, 1.8);
  return Math.max(0.01, originalMB * factor);
}

const MAX_FILES = 20;
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const COMPRESSION_TIMEOUT_MS = 20_000; // 20 seconds max per file

export default function Compressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateItem = useCallback(
    (id: string, patch: Partial<Item>) =>
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      ),
    [],
  );

  const resetAll = useCallback(() => {
    setItems((current) => {
      current.forEach((item) => {
        if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
        if (item.thumbnailUrl) URL.revokeObjectURL(item.thumbnailUrl);
      });
      return [];
    });
    setErrorMessage(null);
  }, []);

  const compressFile = useCallback(
    async (item: Item) => {
      try {
        const maxSizeMB = qualityToMaxSizeMB(item.originalSize, quality);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Compression timed out. Try a higher quality setting.")), COMPRESSION_TIMEOUT_MS)
        );

        const result = await Promise.race([
          imageCompression(item.file, {
            maxSizeMB,
            maxWidthOrHeight: 4096,
            maxIteration: 15,
            useWebWorker: true,
            fileType: "image/png",
            onProgress: (pct) => {
              updateItem(item.id, { progress: Math.max(10, Math.round(pct * 0.9)) });
            },
          }),
          timeoutPromise,
        ]);

        // Warn if compressed result is larger than original
        if (result.size >= item.originalSize) {
          const url = URL.createObjectURL(item.file);
          updateItem(item.id, {
            status: "warn",
            compressedSize: result.size,
            percentSaved: 0,
            progress: 100,
            downloadUrl: url,
            compressedBlob: item.file,
            error:
              "Compressed file is not smaller than original. Original will be downloaded.",
          });
          return;
        }

        const downloadUrl = URL.createObjectURL(result);
        updateItem(item.id, {
          status: "done",
          compressedSize: result.size,
          percentSaved: calcPercent(item.originalSize, result.size),
          progress: 100,
          downloadUrl,
          compressedBlob: result,
        });
      } catch (err) {
        updateItem(item.id, {
          status: "error",
          error: (err as Error)?.message ?? "Compression failed.",
          progress: 100,
        });
      }
    },
    [quality, updateItem],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setErrorMessage(null);

      const selected = Array.from(files);
      const valid: File[] = [];
      const errors: string[] = [];

      if (selected.length + items.length > MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} files allowed at once.`);
      }

      for (const file of selected) {
        if (file.type !== "image/png") {
          const ext = file.name.split(".").pop()?.toUpperCase() ?? "unknown";
          if (["WEBP", "WEBM"].includes(ext)) {
            errors.push(
              `Only PNG files are supported. Try miniwebp.com for WEBP files.`,
            );
          } else {
            errors.push(
              `Only PNG files are supported. "${file.name}" (${ext}) is not a PNG file.`,
            );
          }
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          errors.push(`"${file.name}" exceeds the 50 MB limit.`);
          continue;
        }
        valid.push(file);
      }

      if (errors.length) setErrorMessage([...new Set(errors)].join(" "));
      if (!valid.length) return;

      const newItems: Item[] = valid.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        file,
        name: file.name,
        originalSize: file.size,
        status: "processing",
        progress: 5,
        thumbnailUrl: URL.createObjectURL(file),
      }));

      setItems((prev) => [...prev, ...newItems]);

      // compress each sequentially to avoid saturating device memory
      for (const item of newItems) {
        await compressFile(item);
      }
    },
    [items.length, compressFile],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
      event.target.value = "";
    },
    [handleFiles],
  );

  const [isDragInvalid, setIsDragInvalid] = useState(false);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      setIsDragInvalid(false);

      const files = event.dataTransfer.files;
      // Immediately reject if ALL files are non-PNG
      const allNonPng =
        files.length > 0 &&
        Array.from(files).every((f) => f.type !== "image/png");
      if (allNonPng) {
        const ext =
          files[0].name.split(".").pop()?.toUpperCase() ?? "unknown";
        const msg = ["WEBP", "WEBM"].includes(ext)
          ? "Only PNG files are supported. Try miniwebp.com for WEBP files."
          : "Only PNG files are supported. Please drop PNG images.";
        setErrorMessage(msg);
        return;
      }

      handleFiles(files);
    },
    [handleFiles],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Check if dragged items contain non-PNG files
    const hasNonPng = Array.from(event.dataTransfer.items).some(
      (item) => item.kind === "file" && item.type !== "image/png",
    );
    setIsDragInvalid(hasNonPng);
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setIsDragInvalid(false);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const completed = items.filter(
      (item) =>
        (item.status === "done" || item.status === "warn") &&
        item.compressedBlob,
    );
    if (!completed.length) return;

    const zip = new JSZip();
    setIsZipping(true);
    try {
      completed.forEach((item) => {
        if (item.compressedBlob) {
          zip.file(
            item.name.replace(/\.png$/i, "-min.png"),
            item.compressedBlob,
          );
        }
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pngminify-compressed.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage((err as Error)?.message ?? "Failed to create ZIP.");
    } finally {
      setIsZipping(false);
    }
  }, [items]);

  const anyDone = useMemo(
    () => items.some((i) => i.status === "done" || i.status === "warn"),
    [items],
  );

  return (
    <div className="space-y-6">
      {/* ─── Upload zone ─── */}
      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors sm:px-8 ${
          isDragging && isDragInvalid
            ? "border-red-400 bg-red-50"
            : isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-300 bg-white/60 hover:border-primary/60 hover:bg-primary/5"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnd={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          multiple
          className="hidden"
          onChange={onInputChange}
        />

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Drop PNG files here to start
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-600">
            Drag &amp; drop PNG images or click to browse.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
            >
              Choose PNG files
            </button>
            <p className="text-xs text-slate-500">
              Max {MAX_FILES} files • PNG only • &lt; 50 MB each.
            </p>
          </div>
        </div>

        {/* Quality slider */}
        <div className="mt-6 w-full max-w-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Quality</span>
            <span className="font-medium">{Math.round(quality * 100)}% {quality >= 0.7 ? "(light)" : quality >= 0.4 ? "(medium)" : "(aggressive)"}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full accent-primary"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-[11px] text-slate-500">
            Lower = smaller output. Results vary by PNG content.
          </p>
        </div>

        {errorMessage && (
          <p className="mt-4 max-w-md text-xs text-red-600">{errorMessage}</p>
        )}
      </div>

      {/* ─── File list ─── */}
      {items.length > 0 && (
        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm shadow-slate-100 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-800">
              Files ({items.length})
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={!anyDone || isZipping}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isZipping ? "Preparing ZIP…" : "Download all"}
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Compress another
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isDone = item.status === "done";
              const isWarn = item.status === "warn";
              const isError = item.status === "error";
              const isProcessing = item.status === "processing";

              const barColor = isError
                ? "bg-red-500"
                : isWarn
                  ? "bg-amber-400"
                  : isDone
                    ? "bg-emerald-500"
                    : "bg-primary";

              const statusText = isError
                ? item.error ?? "Compression failed."
                : isWarn
                  ? item.error ?? "Could not reduce file size."
                  : isDone
                    ? "Compressed successfully."
                    : "Compressing…";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs sm:grid-cols-[1fr_180px_120px] sm:items-center sm:gap-4 sm:text-sm"
                >
                  {/* Thumbnail + name + sizes */}
                  <div className="flex min-w-0 items-center gap-3">
                    {item.thumbnailUrl && (
                      <div className="hidden h-12 w-12 flex-none overflow-hidden rounded-md bg-white shadow-sm sm:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {formatBytes(item.originalSize)}
                        {item.compressedSize != null && (
                          <>
                            {" → "}
                            <span
                              className={
                                isDone
                                  ? "font-medium text-emerald-600"
                                  : isWarn
                                    ? "font-medium text-amber-600"
                                    : ""
                              }
                            >
                              {formatBytes(item.compressedSize)}
                            </span>
                            {item.percentSaved != null &&
                              item.percentSaved > 0 && (
                                <span className="ml-1 text-emerald-600">
                                  ({item.percentSaved}% smaller)
                                </span>
                              )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar + status */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p
                      className={`text-[11px] ${
                        isError
                          ? "text-red-600"
                          : isWarn
                            ? "text-amber-600"
                            : isProcessing
                              ? "text-slate-500"
                              : "text-emerald-600"
                      }`}
                    >
                      {statusText}
                    </p>
                  </div>

                  {/* Download button — separate column, never clipped */}
                  <div className="flex items-center justify-stretch sm:justify-end">
                    <button
                      type="button"
                      disabled={
                        (!isDone && !isWarn) || !item.downloadUrl
                      }
                      onClick={() => {
                        if (!item.downloadUrl) return;
                        const a = document.createElement("a");
                        a.href = item.downloadUrl;
                        a.download = item.name.replace(/\.png$/i, "-min.png");
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[100px]"
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
