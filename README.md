# MedBridge AI

**Universal Emergency Bridge: Chaos to Clinical Action**

MedBridge AI transforms chaotic emergency inputs -- blurry photos, panicked voice descriptions, PDF medical records, live camera captures -- into structured, actionable clinical data using Google Gemini 2.5 Flash multimodal AI.

---

## Vertical

**Healthcare / Emergency Medical Services (EMS)**

In emergencies, critical medical information is scattered, unstructured, and chaotic. A bystander may have photos of pill bottles, a vague description of symptoms, and no medical training. MedBridge AI bridges the gap between messy real-world medical situations and structured clinical workflows by accepting multimodal inputs from anyone and producing FHIR-compliant clinical data that EMTs, doctors, and EHR systems can consume immediately.

---

## Approach

MedBridge AI acts as a **Universal Bridge** between chaos and care:

1. **Ingest chaos** -- Accept multimodal inputs (photos, voice, camera, PDFs, text) from anyone at the scene
2. **Enrich with context** -- Fetch real-time weather data via Google Weather API and correlate environmental conditions with symptoms
3. **Synthesize with AI** -- Use Google Gemini 2.5 Flash to analyze all inputs simultaneously, producing a S.O.A.P. clinical note with weather-health correlation
4. **Connect to care** -- Find nearby specialty-matched doctors via Google Places API (New) and display them on Google Maps
5. **Enable handoff** -- Generate a QR-coded clinical dossier stored in Pinecone for instant doctor access

---

## How It Works

```
Step 1: INPUT                    Step 2: ANALYSIS                Step 3: DASHBOARD
-----------------------          -------------------------       -------------------------
 Voice (Web Speech API)           Gemini 2.5 Flash                Patient Dashboard
 Camera (MediaDevices)     --->   Multimodal AI Analysis   --->   Tabbed Interface:
 Photo Upload / PDF               + Weather Correlation            - Clinical Overview
 Text Description                  + Emergency Detection           - Nearby Doctors + Map
 GPS Location                      + FHIR Report Build             - Dossier & QR Code
```

**User Flow:**
1. User describes symptoms via **text**, **voice input**, or **camera capture**
2. User uploads medical evidence (photos, PDFs) via drag-and-drop
3. User optionally shares GPS location for weather context and doctor search
4. Click "Analyze with Gemini AI" -- server calls Gemini 2.5 Flash with all inputs + weather data
5. AI returns structured S.O.A.P. note, emergency flags, specialty recommendation, weather-health correlation, and first-aid steps
6. Results display in a **tabbed patient dashboard** with stats bar, doctor map, and downloadable FHIR report
7. Clinical dossier is stored in Pinecone with a QR code for doctor handoff

---

## Features

### Input Capabilities
| Feature | Technology | Description |
|---|---|---|
| Voice Input | Web Speech API | Continuous speech-to-text transcription appended to symptom field |
| Camera Capture | MediaDevices API | Live camera feed with rear-facing preference, captures JPEG at 0.85 quality |
| Photo Upload | Drag-and-drop / file picker | Up to 5 images (JPEG, PNG) with drag-and-drop and keyboard support |
| PDF Upload | File input with `accept="image/*,.pdf"` | Medical document upload support |
| GPS Location | Geolocation API | One-click location sharing for weather and doctor search |

### AI Analysis
| Feature | Description |
|---|---|
| Multimodal Analysis | Text + images analyzed simultaneously by Gemini 2.5 Flash |
| S.O.A.P. Note Generation | Structured Subjective, Objective, Assessment, Plan output |
| Emergency Detection | Keyword-based severity classification (critical/urgent/standard) |
| Weather-Health Correlation | AI analyzes how temperature, humidity, and conditions affect the patient's symptoms |
| Specialty Recommendation | AI suggests matched medical specialty (Dermatology, Cardiology, etc.) |
| First Aid Steps | Immediate actionable relief instructions |
| FHIR DiagnosticReport | HL7 FHIR R4 compliant output for EHR integration |

### Patient Dashboard
| Feature | Description |
|---|---|
| Tabbed Interface | Three tabs: Clinical Overview, Nearby Doctors, Dossier & QR |
| Stats Bar | Live metrics: Severity, Specialty, Doctors Found, Weather temp |
| Emergency Banner | Prominent alert with 911 call button and GPS coordinates |
| Doctor Map | Interactive Google Map with markers for user and nearby doctors |
| Doctor Cards | Ratings, address, review summaries, Get Directions link |
| Weather Card | Temperature, humidity, conditions, and weather-health impact analysis |
| QR Code Dossier | Scannable QR linking to stored clinical summary for doctor handoff |
| FHIR Export | Download JSON or copy to clipboard |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + TypeScript | 19.2 |
| Build Tool | Vite | 8.0 |
| Backend | Express + TypeScript | 5.2 |
| Runtime | Node.js | 20 (Alpine) |
| AI Engine | Google Gemini 2.5 Flash | via @google/genai 1.46 |
| Vector DB | Pinecone | 7.1 |
| Maps | @vis.gl/react-google-maps | 1.8 |
| QR Generation | qrcode.react | 4.2 |
| HTTP Client | Axios | 1.14 |
| Server Testing | Jest 30 + Supertest 7 | -- |
| Client Linting | ESLint 9 + typescript-eslint | -- |
| Security | Helmet 8, CORS, express-rate-limit 8 | -- |
| Container | Docker multi-stage (node:20-alpine) | Cloud Run ready |

---

## Google Services Used

| Google Service | How It's Used |
|---|---|
| **Gemini 2.5 Flash** | Core multimodal AI engine -- analyzes text + images simultaneously, generates S.O.A.P. notes, detects emergencies, recommends specialties, correlates weather with health conditions |
| **Google Weather API** | Fetches real-time temperature, humidity, and conditions for the patient's location; data is injected into the Gemini prompt for weather-health correlation analysis |
| **Google Places API (New)** | Searches for nearby doctors and hospitals within 5km radius, using `X-Goog-Api-Key` header auth and field masking (`displayName`, `rating`, `formattedAddress`, `location`, `reviews`) |
| **Google Maps JavaScript SDK** | Interactive embedded map via `@vis.gl/react-google-maps` with `AdvancedMarker`, `InfoWindow`, and user location display |
| **Google Cloud Speech-to-Text** | Records audio from user's microphone, sends to Speech-to-Text API for transcription — enables voice-based symptom description in emergencies |
| **Google Geocoding API** | Reverse geocodes GPS coordinates to human-readable location names, displayed in patient dashboard stats bar and included in AI context |
| **FHIR R4 DiagnosticReport** | Healthcare interoperability standard -- AI output is wrapped in a compliant DiagnosticReport structure with base64-encoded S.O.A.P. data |

---

## Architecture

```
Client (React 19 + Vite 8)             Server (Express 5 + TypeScript)
==============================          ===================================

[Input Phase]                           POST /api/ai/analyze
  Voice (Web Speech API)                  -> Google Weather API (cached 10min)
  Camera (MediaDevices API)               -> Gemini 2.5 Flash (multimodal)
  Photo/PDF Upload       ------>          -> S.O.A.P. note + emergency flags
  Text Description                        -> Weather-health correlation
  GPS Location                            -> FHIR DiagnosticReport build

[Loading Phase]                         GET /api/doctors/nearby
  Synthesizing...                         -> Google Places API (New)
                                          -> Specialty-matched results
[Output Phase - Tabbed Dashboard]
  Tab 1: Clinical Overview             GET /api/weather
    S.O.A.P. Note                         -> Google Weather API
    Weather-Health Card                   -> 10min TTL cache
    First Aid Steps
  Tab 2: Nearby Doctors                 POST /api/dossier
    Interactive Map                       -> Pinecone vector storage
    Doctor Cards                        GET /api/dossier/:id
  Tab 3: Dossier & QR                    -> Secure retrieval by UUID
    QR Code
    FHIR JSON Export
```

---

## Security

| Measure | Implementation |
|---|---|
| HTTP Hardening | Helmet with strict CSP (whitelists only Google domains for scripts, images, connections) |
| CORS | Restricted to configured frontend origin |
| Rate Limiting | 100 req/15min global, 10 req/min on AI endpoints |
| Input Sanitization | HTML stripping, text length limit (5000 chars), base64 format validation |
| Image Limits | Maximum 5 images per request |
| Payload Size | 10MB maximum body size; 413 error on oversize |
| API Key Isolation | All API keys server-side only, never exposed to client bundle |
| UUID Validation | Regex pattern matching on dossier retrieval |
| Error Handling | Global error handler with safe fallback messages (no stack traces exposed) |

---

## Accessibility

| WCAG Criterion | Implementation |
|---|---|
| Contrast (AAA) | Primary text #FFFFFF on #000000 (21:1 ratio) |
| Semantic HTML | `<main>`, `<header>`, `<nav>`, `<section>` with `aria-labelledby` |
| Skip Navigation | Skip-to-content link as first focusable element |
| Keyboard Support | Dropzone responds to Enter/Space; all buttons focusable; tab navigation on dashboard |
| ARIA Roles | `role="alert"` on emergency banner, `role="tablist"` / `role="tab"` on dashboard tabs, `role="dialog"` on camera overlay, `aria-live="assertive"` for dynamic updates |
| Focus Indicators | 2px solid blue outline with 2px offset on `:focus-visible` |
| Reduced Motion | `prefers-reduced-motion` disables all animations |
| High Contrast | `prefers-contrast: more` thickens borders, boosts text contrast |
| Touch Targets | Minimum 44x44px on all interactive elements |
| Screen Readers | Hidden file input uses `.sr-only`; all interactive elements have `aria-label` |

---

## Testing

### Server Tests (Jest 30 + Supertest)
18 tests across 4 suites with mocked external services:

| Suite | Tests | Coverage |
|---|---|---|
| `api.test.ts` | 6 | Gemini analysis, FHIR output structure, JSON parse fallback |
| `doctors.test.ts` | 4 | Places API search, empty results, error handling |
| `weather.test.ts` | 3 | Weather fetch, cache behavior, missing API key |
| `dossier.test.ts` | 5 | Pinecone CRUD, UUID validation, 404 on missing |

**Security tests included:** Payload size limits, XSS prevention (script tags in base64), image count enforcement, missing parameter 400s, invalid UUID 400s.

### Client Tests (Vitest + React Testing Library)
36 tests across 7 component test suites:

| Suite | Tests | Coverage |
|---|---|---|
| `EmergencyBanner.test.tsx` | 5 | Emergency alert rendering, severity badges, aria-live, 911 button |
| `SoapNote.test.tsx` | 4 | All SOAP sections, plan ordered list, semantic dl/dt/dd |
| `WeatherCard.test.tsx` | 6 | Temperature/humidity display, weather-health impact, humidity levels |
| `FirstAidSteps.test.tsx` | 5 | Empty state, ordered list, step count, aria-label |
| `LoadingSpinner.test.tsx` | 4 | Spinner element, role=status, aria-live polite, loading text |
| `Dropzone.test.tsx` | 6 | Upload prompt, file counts, PDF/image support, aria-label |
| `DoctorCard.test.tsx` | 6 | Doctor name/rating/address, review summary, Google Maps link |

**Total: 54 tests (18 server + 36 client)**

```bash
# Run all tests
cd server && npm test        # 18 Jest tests
cd client && npm test        # 36 Vitest tests
```

---

## Setup

### Prerequisites
- Node.js 20+
- npm

### 1. Install

```bash
git clone <repository-url>
cd medbridge-ai
cd server && npm install --legacy-peer-deps
cd ../client && npm install --legacy-peer-deps
```

### 2. Environment Variables

**`server/.env`**
```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=medbridge-dossiers
GOOGLE_PLACES_API_KEY=your_google_api_key
CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> Note: `GOOGLE_PLACES_API_KEY` is used for both Google Places API (New) and Google Weather API on the server side.

### 3. Run

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Open `http://localhost:5173`

### 4. Docker (Cloud Run)

```bash
docker build -t medbridge-ai .
docker run -p 8080:8080 --env-file server/.env medbridge-ai
```

Multi-stage build: client build -> server compile -> production image (~50MB). Express serves the React SPA from `/public` with catch-all routing for client-side navigation.

---

## Assumptions

1. This application is for demonstration purposes and is not intended for actual medical diagnosis or emergency use
2. Users have a modern browser supporting `backdrop-filter`, Web Speech API, and MediaDevices API
3. Google API keys have the necessary APIs enabled: Gemini, Places (New), Maps JavaScript, Weather
4. The Pinecone index (`medbridge-dossiers`) is pre-created with 1024 dimensions
5. Emergency phone number is 911 (US-centric)
6. The `GOOGLE_PLACES_API_KEY` must have no HTTP referrer restrictions (server-side usage)
7. Weather data is used as supplementary context -- the AI correlates environmental conditions with the patient's symptoms in the S.O.A.P. note

---

## License

ISC
