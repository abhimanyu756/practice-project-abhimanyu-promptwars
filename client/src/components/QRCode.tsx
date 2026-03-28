import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  dossierId: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ dossierId }) => {
  const dossierUrl = `${window.location.origin}/dossier/${dossierId}`;

  return (
    <div
      className="glass-card"
      aria-label="QR Code for clinical dossier"
      style={{ alignItems: 'center' }}
    >
      <h3 className="data-card-title">&#x1F4CB; Clinical Dossier QR</h3>
      <p className="text-caption text-secondary" style={{ textAlign: 'center' }}>
        Show this to the doctor for instant access
      </p>
      <div
        style={{
          background: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          display: 'inline-flex',
          marginTop: '8px',
        }}
      >
        <QRCodeSVG
          value={dossierUrl}
          size={140}
          level="M"
          aria-label={`QR code linking to dossier ${dossierId}`}
        />
      </div>
    </div>
  );
};
