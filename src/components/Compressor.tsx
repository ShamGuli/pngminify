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

// Map compression slider (10–90%) → target maxSizeMB relative to original
// compression 90% → keep 10% of original (aggressive)
// compression 10% → keep 90% of original (light)
function compressionToMaxSizeMB(originalBytes: number, compression: number): number {
  const originalMB = originalBytes / 1024 / 1024;
  const keepFactor = 1 - compression; // compression 0.9 → keep 0.1
  return Math.max(0.01, originalMB * keepFactor);
}

const MAX_FILES = 20;
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
// Timeout scales with file size: 30s base + 10s per MB
function getTimeoutMs(sizeBytes: number): number {
  const sizeMB = sizeBytes / 1024 / 1024;
  return Math.max(30_000, Math.min(120_000, 30_000 + sizeMB * 10_000));
}

export default function Compressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compression, setCompression] = useState(0.6);
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
        const maxSizeMB = compressionToMaxSizeMB(item.originalSize, compression);
        const timeoutMs = getTimeoutMs(item.originalSize);

        // For aggressive compression on large files, also reduce dimensions
        const maxDimension = compression >= 0.8 && item.originalSize > 4 * 1024 * 1024
          ? 2048
          : 4096;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Compression timed out. Try a lower compression level or a smaller file.")), timeoutMs)
        );

        const result = await Promise.race([
          imageCompression(item.file, {
            maxSizeMB,
            maxWidthOrHeight: maxDimension,
            maxIteration: 20,
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
    [compression, updateItem],
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

  const hasItems = items.length > 0;

  /* ─── Upload zone (reusable in both layouts) ─── */
  const uploadZone = (
    <div
      className={`relative flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed text-center transition-colors ${hasItems ? "px-4 py-6" : "px-6 py-10 sm:px-8"} ${
        isDragging && isDragInvalid
          ? "border-red-400 bg-red-50"
          : isDragging
            ? "border-primary bg-primary/5"
            : hasItems
              ? "border-slate-200 bg-white/60 hover:border-primary/60 hover:bg-primary/5"
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

      {hasItems ? (
        /* Compact version when files are loaded */
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Add more files</p>
            <p className="mt-0.5 text-[11px] text-slate-400">PNG only • max 50 MB</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 py-2 text-xs font-medium text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90"
          >
            Choose PNG files
          </button>
        </div>
      ) : (
        /* Full version when empty */
        <>
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
                Max {MAX_FILES} files • PNG only • &lt; 50 MB each
              </p>
            </div>
          </div>
          {/* Compression slider — shown only in empty state */}
          <div className="mt-6 w-full max-w-md space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Compression</span>
              <span className="font-medium">
                {Math.round(compression * 100)}%{" "}
                {compression >= 0.7 ? "(aggressive)" : compression >= 0.4 ? "(medium)" : "(light)"}
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.05}
              value={compression}
              onChange={(e) => setCompression(parseFloat(e.target.value))}
              className="w-full accent-primary"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-[11px] text-slate-500">
              Higher = smaller file. Target ≈ {Math.round((1 - compression) * 100)}% of original size.
            </p>
          </div>
        </>
      )}

      {errorMessage && (
        <p className="mt-4 max-w-md text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-0">
      {!hasItems ? (
        /* ─── EMPTY STATE: full-width upload zone ─── */
        uploadZone
      ) : (
        /* ─── LOADED STATE: 40% left / 60% right ─── */
        <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 3fr" }}>
          {/* LEFT — compact upload zone (sticky) */}
          <div className="self-start sticky top-4">
            {uploadZone}
          </div>

          {/* RIGHT — results panel */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 sm:p-5" style={{ minWidth: 0 }}>
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-slate-800">
                  Files ({items.length})
                </p>
                {/* Compression slider — shown in results panel when files are loaded */}
                <div
                  className="flex items-center gap-2 text-xs text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="hidden sm:inline">Compression:</span>
                  <input
                    type="range"
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    value={compression}
                    onChange={(e) => setCompression(parseFloat(e.target.value))}
                    className="w-20 accent-primary"
                  />
                  <span className="font-medium text-primary">{Math.round(compression * 100)}%</span>
                </div>
              </div>
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

            {/* File list */}
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
                    className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs sm:grid-cols-[1fr_160px_100px] sm:items-center sm:gap-4 sm:text-sm"
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
                              {item.percentSaved != null && item.percentSaved > 0 && (
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

                    {/* Download button */}
                    <div className="flex items-center justify-stretch sm:justify-end">
                      <button
                        type="button"
                        disabled={(!isDone && !isWarn) || !item.downloadUrl}
                        onClick={() => {
                          if (!item.downloadUrl) return;
                          const a = document.createElement("a");
                          a.href = item.downloadUrl;
                          a.download = item.name.replace(/\.png$/i, "-min.png");
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[90px]"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
