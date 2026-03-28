import React from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

interface PlaceResult {
  name: string;
  rating: number;
  address: string;
  placeId: string;
  location: { lat: number; lng: number };
  totalRatings: number;
}

interface DoctorMapProps {
  doctors: PlaceResult[];
  userLocation: { lat: number; lng: number };
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const DoctorMap: React.FC<DoctorMapProps> = ({ doctors, userLocation }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  if (!API_KEY) {
    return (
      <div className="glass-card glass-card--full" aria-label="Map unavailable">
        <h3 className="data-card-title">&#x1F5FA; Nearby Doctors Map</h3>
        <p className="text-secondary">Map unavailable — Google Maps API key not configured.</p>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--full" aria-label="Map of nearby doctors">
      <h3 className="data-card-title">&#x1F5FA; Nearby Doctors</h3>
      <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', marginTop: '8px' }}>
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={userLocation}
            defaultZoom={13}
            mapId="medbridge-map"
            style={{ width: '100%', height: '100%' }}
          >
            <AdvancedMarker position={userLocation} title="Your Location" />

            {doctors.map((doc) => (
              <React.Fragment key={doc.placeId}>
                <AdvancedMarker
                  position={doc.location}
                  title={doc.name}
                  onClick={() => setSelectedId(doc.placeId)}
                />
                {selectedId === doc.placeId && (
                  <InfoWindow
                    position={doc.location}
                    onCloseClick={() => setSelectedId(null)}
                  >
                    <div style={{ color: '#000', padding: '4px' }}>
                      <strong>{doc.name}</strong>
                      <br />
                      {'\u2605'} {doc.rating} ({doc.totalRatings} reviews)
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
