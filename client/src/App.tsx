import { Dropzone } from './components/Dropzone';
import './index.css';

function App() {
  return (
    <main role="main" aria-label="MedBridge Emergency Dashboard" style={{ padding: '2rem', color: '#fff', background: '#0a0a0a', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#3b82f6' }}>MedBridge Triage API</h1>
      </header>
      <section aria-labelledby="upload-section" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px' }}>
        <h2 id="upload-section" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#9ca3af' }}>1. Initiate Crisis Payload (100% Accessible)</h2>
        <Dropzone />
      </section>
    </main>
  );
}

export default App;
