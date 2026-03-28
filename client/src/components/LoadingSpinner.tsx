import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="glass-panel text-center stack stack--md"
      role="status"
      aria-live="polite"
      style={{ padding: '64px 32px', alignItems: 'center' }}
    >
      <div className="spinner" />
      <p className="loading-text">Synthesizing Clinical Dossier...</p>
      <p className="text-caption text-tertiary">
        Cross-referencing symptoms, images, and medical databases
      </p>
    </div>
  );
};
