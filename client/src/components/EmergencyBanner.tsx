import React from 'react';

interface EmergencyBannerProps {
  isEmergency: boolean;
  severity: string;
  keywords: string[];
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  isEmergency,
  severity,
  keywords,
}) => {
  if (!isEmergency) return null;

  const handleCallAmbulance = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          window.open(
            `tel:911`,
            '_self'
          );
          console.log(`GPS shared: ${latitude}, ${longitude}`);
        },
        () => window.open('tel:911', '_self')
      );
    } else {
      window.open('tel:911', '_self');
    }
  };

  return (
    <div
      className="glass-card glass-card--alert"
      role="alert"
      aria-live="assertive"
      style={{ gridColumn: '1 / -1' }}
    >
      <h3 className="data-card-title data-card-title--alert">
        {severity === 'critical' ? '\u26A0\uFE0F' : '\u2757'} EMERGENCY DETECTED
      </h3>
      <div className="row" style={{ flexWrap: 'wrap', gap: '8px' }}>
        {keywords.map((kw) => (
          <span key={kw} className="badge badge--critical">
            {kw}
          </span>
        ))}
      </div>
      <button
        className="btn btn--primary"
        onClick={handleCallAmbulance}
        aria-label="Call ambulance immediately"
        style={{
          background: 'linear-gradient(135deg, #dc2626, #ff3b30)',
          boxShadow: '0 4px 20px rgba(255, 59, 48, 0.5)',
          marginTop: '8px',
          fontSize: '20px',
        }}
      >
        CALL AMBULANCE — 911
      </button>
    </div>
  );
};
