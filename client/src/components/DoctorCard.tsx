import React from 'react';

interface PlaceResult {
  name: string;
  rating: number;
  address: string;
  placeId: string;
  location: { lat: number; lng: number };
  reviewSummary?: string;
  totalRatings: number;
}

interface DoctorCardProps {
  doctor: PlaceResult;
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return '\u2605'.repeat(full) + (half ? '\u00BD' : '') + '\u2606'.repeat(5 - full - half);
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${doctor.location.lat},${doctor.location.lng}&destination_place_id=${doctor.placeId}`;

  return (
    <div className="glass-card" aria-label={`Doctor: ${doctor.name}`}>
      <h3 className="data-card-title">&#x1F3E5; {doctor.name}</h3>
      <div className="text-body">
        <span aria-label={`Rating: ${doctor.rating} out of 5`}>
          {renderStars(doctor.rating)}{' '}
          <strong>{doctor.rating}</strong>
          <span className="text-tertiary"> ({doctor.totalRatings})</span>
        </span>
      </div>
      <p className="text-caption text-secondary">{doctor.address}</p>
      {doctor.reviewSummary && (
        <p className="text-caption text-tertiary" style={{ fontStyle: 'italic' }}>
          &ldquo;{doctor.reviewSummary}&rdquo;
        </p>
      )}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--outline"
        style={{ textDecoration: 'none', textAlign: 'center', marginTop: '8px' }}
        aria-label={`Get directions to ${doctor.name}`}
      >
        Get Directions
      </a>
    </div>
  );
};
