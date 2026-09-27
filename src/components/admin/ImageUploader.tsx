import React, { useState, useRef } from 'react';
import { uploadAsset } from '../../lib/supabase';

interface ImageUploaderProps {
  value: string; // Cover image URL or path
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Cover Image Asset',
  helperText = 'Recommended: 1600×1000px, WEBP, PNG, or JPG (max 10MB)',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    // Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, or GIF).');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const publicUrl = await uploadAsset(file);
      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-label-sm text-[11px] text-primary hover:underline"
          >
            Replace Asset
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {value ? (
        <div className="relative group w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/50 shadow-sm">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-full bg-white text-on-surface font-label-sm text-label-sm font-medium hover:bg-secondary-container transition-colors shadow-lg"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-full bg-error text-white hover:bg-error/90 transition-colors shadow-lg"
              title="Remove image"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full aspect-[16/10] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-secondary-container/40'
              : 'border-outline-variant/80 hover:border-primary/60 bg-surface-container-low/50 hover:bg-surface-container-low'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="font-label-sm text-label-sm text-primary font-medium">
                Uploading to Supabase Storage...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-primary flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <p className="font-headline-sm text-sm font-semibold text-on-surface">
                Drop image here or click to browse
              </p>
              <p className="font-label-sm text-[11px] text-secondary">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <span className="font-label-sm text-[11px] text-error flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  );
};
