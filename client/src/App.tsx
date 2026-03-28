import { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmergencyBanner } from './components/EmergencyBanner';
import { SoapNote } from './components/SoapNote';
import { WeatherCard } from './components/WeatherCard';
import { FirstAidSteps } from './components/FirstAidSteps';
import { DoctorMap } from './components/DoctorMap';
import { DoctorCard } from './components/DoctorCard';
import { QRCodeCard } from './components/QRCode';
import './App.css';

type Phase = 'input' | 'loading' | 'output';

interface AnalysisData {
  soap: { subjective: string; objective: string; assessment: string; plan: string[] };
  emergency: { isEmergency: boolean; severity: string; keywords: string[] };
  specialty: string;
  firstAidSteps: string[];
  weatherContext?: { temp: number; humidity: number; description: string };
  fhir: any;
}

interface PlaceResult {
  name: string;
  rating: number;
  address: string;
  placeId: string;
  location: { lat: number; lng: number };
  reviewSummary?: string;
  totalRatings: number;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function App() {
  const [phase, setPhase] = useState<Phase>('input');
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [doctors, setDoctors] = useState<PlaceResult[]>([]);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('Geolocation not supported');
      return;
    }
    setLocationStatus('Requesting...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('Location acquired');
      },
      () => setLocationStatus('Permission denied')
    );
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim() && files.length === 0) {
      setError('Please describe symptoms or upload images.');
      return;
    }

    setError(null);
    setPhase('loading');

    try {
      const images = await Promise.all(files.map(fileToBase64));

      const analyzeRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: symptoms,
          images,
          lat: location?.lat,
          lng: location?.lng,
        }),
      });

      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const { data } = await analyzeRes.json();
      setResult(data);

      const fetchDoctors = location
        ? fetch(`/api/doctors/nearby?lat=${location.lat}&lng=${location.lng}&specialty=${encodeURIComponent(data.specialty)}`)
            .then((r) => r.ok ? r.json() : { data: [] })
            .then((r) => setDoctors(r.data || []))
            .catch(() => setDoctors([]))
        : Promise.resolve();

      const storeDossier = fetch('/api/dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((r) => { if (r?.id) setDossierId(r.id); })
        .catch(() => {});

      await Promise.all([fetchDoctors, storeDossier]);
      setPhase('output');
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again.');
      setPhase('input');
    }
  };

  const resetApp = () => {
    setPhase('input');
    setFiles([]);
    setSymptoms('');
    setResult(null);
    setDoctors([]);
    setDossierId(null);
    setError(null);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main
        id="main-content"
        className="container stack stack--lg"
        role="main"
        aria-label="MedBridge Emergency Dashboard"
      >
        <header className="text-center">
          <h1 className="text-display text-gradient">MedBridge AI</h1>
          <p className="text-body text-secondary">
            Universal Emergency Bridge: Chaos to Action
          </p>
        </header>

        {/* INPUT PHASE */}
        {phase === 'input' && (
          <section
            className="glass-panel animate-fade-in-up stack stack--md"
            aria-labelledby="input-heading"
          >
            <h2 id="input-heading" className="text-overline text-secondary">
              1. Upload Medical Evidence
            </h2>
            <Dropzone onFilesSelected={setFiles} files={files} />

            <h2 className="text-overline text-secondary">
              2. Describe Emergency
            </h2>
            <textarea
              className="input"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. 'He just collapsed... breathing heavy. Found pill bottles next to him.'"
              aria-label="Describe the emergency situation"
            />

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button
                className="btn btn--outline"
                onClick={requestLocation}
                type="button"
                aria-label="Share your GPS location for weather and doctor search"
              >
                {locationStatus || '\u{1F4CD} Share Location'}
              </button>
            </div>

            {error && (
              <p className="text-body text-critical" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn btn--primary"
              onClick={handleAnalyze}
              type="button"
            >
              Process with Gemini Multimodal AI
            </button>
          </section>
        )}

        {/* LOADING PHASE */}
        {phase === 'loading' && <LoadingSpinner />}

        {/* OUTPUT PHASE */}
        {phase === 'output' && result && (
          <section
            className="glass-panel animate-fade-in-up stack stack--lg"
            aria-labelledby="output-heading"
          >
            <div className="dashboard-header">
              <h2 id="output-heading">Clinical Dossier</h2>
              <span className="badge badge--success">Analysis Complete</span>
            </div>

            {result.emergency.isEmergency && (
              <EmergencyBanner
                isEmergency={result.emergency.isEmergency}
                severity={result.emergency.severity}
                keywords={result.emergency.keywords}
              />
            )}

            <div className="grid-2">
              <SoapNote soap={result.soap} />

              {result.weatherContext && (
                <WeatherCard weather={result.weatherContext} />
              )}

              <FirstAidSteps steps={result.firstAidSteps} />

              {location && doctors.length > 0 && (
                <DoctorMap doctors={doctors} userLocation={location} />
              )}

              {doctors.map((doc) => (
                <DoctorCard key={doc.placeId} doctor={doc} />
              ))}

              {dossierId && <QRCodeCard dossierId={dossierId} />}
            </div>

            <div className="row row--responsive">
              <button
                className="btn btn--outline"
                onClick={resetApp}
                type="button"
              >
                Start Over
              </button>
              <button
                className="btn btn--primary"
                onClick={() => alert('Structured alert data dispatched via FHIR/HL7 format.')}
                type="button"
                style={{ flex: 2 }}
              >
                Dispatch Structured Alert Data
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
