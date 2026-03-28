import React, { useState, useCallback } from 'react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  files: File[];
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, files }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const selected = Array.from(fileList).slice(0, 3);
      onFilesSelected(selected);
    },
    [onFilesSelected]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('fileUpload')?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const filled = files.length > 0;
  const className = [
    'dropzone',
    isDragging ? 'dropzone--active' : '',
    filled ? 'dropzone--filled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-label="Upload secure medical images by dropping or clicking"
      onKeyDown={handleKeyDown}
      onClick={() => document.getElementById('fileUpload')?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="fileUpload"
        className="sr-only"
        aria-hidden="true"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="dropzone__icon" aria-hidden="true">
        {filled ? '\u2705' : '\u{1F4F8}'}
      </span>
      <p className="text-body">
        {filled
          ? <strong>{files.length} evidence file(s) attached</strong>
          : <>Drag & drop evidence here, or press <strong>Space</strong> / <strong>Click</strong> to upload</>
        }
      </p>
    </div>
  );
};
