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
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'dossier'>('overview');

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
    setActiveTab('overview');
  };

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Nav Bar */}
      <nav className="topbar" aria-label="Main navigation">
        <div className="topbar__brand">
          <span className="topbar__logo">+</span>
          <span className="topbar__title">MedBridge AI</span>
        </div>
        <div className="topbar__meta text-caption text-tertiary">
          {phase === 'output' && result ? (
            <span className={`topbar__status ${result.emergency.isEmergency ? 'topbar__status--critical' : 'topbar__status--ok'}`}>
              {result.emergency.isEmergency ? 'EMERGENCY' : 'STABLE'}
            </span>
          ) : null}
          <span>{timestamp}</span>
        </div>
      </nav>

      <main
        id="main-content"
        className="dashboard-container"
        role="main"
        aria-label="MedBridge Patient Dashboard"
      >
        {/* INPUT PHASE */}
        {phase === 'input' && (
          <div className="input-layout animate-fade-in-up">
            <div className="input-hero">
              <h1 className="text-display text-gradient">Emergency Intelligence</h1>
              <p className="text-body text-secondary">
                Upload photos and describe the situation. Our AI transforms chaotic inputs into structured clinical data.
              </p>
            </div>

            <div className="input-grid">
              <section className="glass-panel stack stack--md" aria-labelledby="upload-heading">
                <h2 id="upload-heading" className="text-overline text-secondary">
                  Medical Evidence
                </h2>
                <Dropzone onFilesSelected={setFiles} files={files} />
              </section>

              <section className="glass-panel stack stack--md" aria-labelledby="symptoms-heading">
                <h2 id="symptoms-heading" className="text-overline text-secondary">
                  Situation Description
                </h2>
                <textarea
                  className="input"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. 'He just collapsed... breathing heavy. Found pill bottles next to him.'"
                  aria-label="Describe the emergency situation"
                />
                <div className="row" style={{ gap: '12px' }}>
                  <button
                    className="btn btn--outline btn--sm"
                    onClick={requestLocation}
                    type="button"
                    aria-label="Share GPS location for nearby doctors and weather"
                  >
                    <span className="btn__icon">&#x1F4CD;</span>
                    {locationStatus || 'Share Location'}
                  </button>
                  {location && (
                    <span className="badge badge--success">GPS Active</span>
                  )}
                </div>
              </section>
            </div>

            {error && (
              <p className="text-body text-critical input-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn btn--primary btn--lg"
              onClick={handleAnalyze}
              type="button"
            >
              Analyze with Gemini AI
              <span className="btn__arrow">&rarr;</span>
            </button>
          </div>
        )}

        {/* LOADING PHASE */}
        {phase === 'loading' && <LoadingSpinner />}

        {/* OUTPUT PHASE — Patient Dashboard */}
        {phase === 'output' && result && (
          <div className="output-layout animate-fade-in">
            {/* Emergency Banner — top priority */}
            {result.emergency.isEmergency && (
              <EmergencyBanner
                isEmergency={result.emergency.isEmergency}
                severity={result.emergency.severity}
                keywords={result.emergency.keywords}
              />
            )}

            {/* Dashboard Header */}
            <header className="dash-header">
              <div className="dash-header__left">
                <h1 className="dash-header__title">Patient Dashboard</h1>
                <div className="dash-header__badges">
                  <span className={`badge ${result.emergency.isEmergency ? 'badge--critical' : 'badge--success'}`}>
                    {result.emergency.severity}
                  </span>
                  <span className="badge badge--info">{result.specialty}</span>
                </div>
              </div>
              <button className="btn btn--outline btn--sm" onClick={resetApp} type="button">
                New Analysis
              </button>
            </header>

            {/* Stats Bar */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-label">Severity</span>
                <span className={`stat-value ${result.emergency.isEmergency ? 'text-critical' : 'text-success'}`}>
                  {result.emergency.severity}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Specialty</span>
                <span className="stat-value">{result.specialty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Doctors Found</span>
                <span className="stat-value">{doctors.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Weather</span>
                <span className="stat-value">
                  {result.weatherContext ? `${result.weatherContext.temp}°C` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-nav" role="tablist" aria-label="Dashboard sections">
              {(['overview', 'doctors', 'dossier'] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`tab-btn ${activeTab === tab ? 'tab-btn--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === 'overview' && 'Clinical Overview'}
                  {tab === 'doctors' && `Nearby Doctors (${doctors.length})`}
                  {tab === 'dossier' && 'Dossier & QR'}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div role="tabpanel" aria-label={`${activeTab} panel`}>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="tab-content animate-fade-in">
                  <SoapNote soap={result.soap} />

                  <div className="grid-2">
                    {result.weatherContext && (
                      <WeatherCard weather={result.weatherContext} />
                    )}
                    <FirstAidSteps steps={result.firstAidSteps} />
                  </div>
                </div>
              )}

              {/* DOCTORS TAB */}
              {activeTab === 'doctors' && (
                <div className="tab-content animate-fade-in">
                  {location && doctors.length > 0 && (
                    <DoctorMap doctors={doctors} userLocation={location} />
                  )}

                  {doctors.length > 0 ? (
                    <div className="doctors-grid">
                      {doctors.map((doc) => (
                        <DoctorCard key={doc.placeId} doctor={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card empty-state">
                      <p className="text-body text-secondary">
                        {location
                          ? 'No nearby doctors found. Try expanding your search radius.'
                          : 'Enable location sharing to find nearby doctors.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* DOSSIER TAB */}
              {activeTab === 'dossier' && (
                <div className="tab-content animate-fade-in">
                  <div className="dossier-layout">
                    {dossierId && <QRCodeCard dossierId={dossierId} />}

                    <div className="glass-card">
                      <h3 className="data-card-title">FHIR DiagnosticReport</h3>
                      <p className="text-caption text-secondary" style={{ marginBottom: '12px' }}>
                        HL7 FHIR R4 compliant clinical data — ready for EHR integration
                      </p>
                      <pre className="fhir-json">
                        {JSON.stringify(result.fhir, null, 2)}
                      </pre>
                    </div>

                    <div className="glass-card">
                      <h3 className="data-card-title">Actions</h3>
                      <div className="stack stack--sm">
                        <button
                          className="btn btn--primary"
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(result.fhir, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `medbridge-dossier-${dossierId || 'report'}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          type="button"
                        >
                          Download FHIR Report
                        </button>
                        <button
                          className="btn btn--outline"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(result.fhir, null, 2));
                          }}
                          type="button"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
