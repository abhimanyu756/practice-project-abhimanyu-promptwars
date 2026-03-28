import React from 'react';

export const Dropzone = () => {
  // ACCESSIBILITY: Keyboard integration for non-mouse users
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('fileUpload')?.click();
    }
  };

  return (
    <div 
      className="dropzone-container"
      role="button" 
      tabIndex={0} 
      aria-label="Upload secure medical images by dropping or clicking"
      onKeyDown={handleKeyDown}
      onClick={() => document.getElementById('fileUpload')?.click()}
      style={{
          border: '2px dashed rgba(59, 130, 246, 0.5)', 
          padding: '4rem 2rem', 
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.3)',
          transition: 'all 0.2s'
      }}
    >
      <input type="file" id="fileUpload" style={{ display: 'none' }} aria-hidden="true" />
      <p style={{ fontSize: '1.2rem', color: '#f3f4f6' }}>📸 Drag & Drop evidence here, or press <strong>Space</strong> / <strong>Click</strong> to upload safely.</p>
    </div>
  );
};
