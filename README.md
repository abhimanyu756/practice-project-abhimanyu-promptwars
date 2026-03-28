# MedBridge AI

**Universal Emergency Bridge: Chaos to Action**

MedBridge AI transforms chaotic emergency inputs — blurry photos of pill bottles, panicked voice descriptions, messy symptom notes — into structured, actionable clinical data that saves lives.

---

## Chosen Vertical

**Healthcare / Emergency Medical Services**

MedBridge AI is a full-stack Healthcare Navigation System that bridges the gap between messy real-world medical situations and structured clinical workflows.

---

## Approach and Logic

### The Problem

In emergency situations, critical medical information is scattered, unstructured, and chaotic. A bystander may have photos of pill bottles, a vague description of symptoms, and no medical training. EMTs arrive without context. Doctors receive incomplete handoffs.

### The Solution

MedBridge AI acts as a **Universal Bridge** that:

1. **Ingests chaos** — Accepts multimodal inputs (photos + text descriptions) from anyone at the scene
2. **Synthesizes with AI** — Uses Google Gemini 2.5 Flash to analyze images and text simultaneously, detecting medications, symptoms, and emergency indicators
3. **Outputs structure** — Produces a standardized S.O.A.P. clinical note (Subjective, Objective, Assessment, Plan) in FHIR-compliant format
4. **Connects to care** — Finds nearby doctors matched to the detected specialty, shows directions on Google Maps, and provides immediate first-aid guidance
5. **Enables handoff** — Generates a QR code linking to the stored clinical dossier, so the patient can show it to any doctor for instant context

### Architecture

```
Client (React 19 + Vite)          Server (Express 5 + TypeScript)
==========================        ================================

[Input Phase]                     POST /api/ai/analyze
  Upload images ------>             Gemini 2.5 Flash (multimodal)
  Describe symptoms -->             SOAP note generation
  Share location ----->             Emergency detection
                                    FHIR DiagnosticReport output
[Loading Phase]
  Synthesizing...                 GET /api/doctors/nearby
                                    Google Places API (New)
[Output Phase]                      Specialty-matched results
  Emergency Banner
  SOAP Clinical Dossier           GET /api/weather
  Doctor Map + Cards                OpenWeatherMap API
  Weather Context                   Cached (10min TTL)
  First Aid Steps
  QR Code Dossier                 POST /api/dossier
                                    Pinecone vector storage
                                  GET /api/dossier/:id
                                    Secure retrieval by UUID
```

---

## How the Solution Works

### 1. Input Phase
The user uploads up to 3 medical images (pill bottles, injuries, IDs) and describes the situation in free text. They can optionally share GPS location for weather context and doctor search.

### 2. AI Analysis (Google Gemini 2.5 Flash)
Images are sent as base64 to the server, which constructs a multimodal prompt for Gemini. The AI produces:
- **S.O.A.P. Note** — Subjective (patient's words), Objective (photo analysis + weather), Assessment (clinical evaluation), Plan (action steps)
- **Emergency Flag** — Detects critical keywords (chest pain, difficulty breathing, stroke symptoms) and sets severity level
- **Specialty Recommendation** — Suggests the right type of doctor (Dermatologist, Cardiologist, etc.)
- **First Aid Steps** — Immediate actionable relief instructions

### 3. Doctor Matchmaker (Google Places API)
Using the patient's location and the AI-recommended specialty, the app searches for nearby doctors and hospitals via Google Places API (New). Results include ratings, addresses, review summaries, and a "Get Directions" link.

### 4. Interactive Map (Google Maps JavaScript SDK)
An embedded Google Map displays markers for the user's location and all nearby doctors. Clicking a marker shows the doctor's name and rating.

### 5. Clinical Dossier Storage (Pinecone)
The complete analysis is stored in Pinecone with a UUID. A QR code is generated that the patient can show to any doctor for instant access to the structured clinical summary.

### 6. Emergency Protocol
If the AI detects life-threatening conditions, a prominent emergency banner appears with a "CALL AMBULANCE — 911" button that shares GPS coordinates.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19, TypeScript, Vite 8 | SPA with 3-phase UI |
| Styling | Vanilla CSS, Custom Properties | Apple-inspired glassmorphism design system |
| Backend | Express 5, TypeScript, Node.js | REST API with controller-service pattern |
| AI | Google Gemini 2.5 Flash | Multimodal analysis (text + images) |
| Vector DB | Pinecone | Clinical dossier storage and retrieval |
| Maps | Google Maps JavaScript SDK | Interactive doctor location map |
| Places | Google Places API (New) | Nearby doctor/hospital search |
| Weather | OpenWeatherMap API | Environmental context for diagnosis |
| Data Standard | FHIR R4 DiagnosticReport | Healthcare interoperability |
| Testing | Jest 30, Supertest | 18 unit/integration tests |
| Security | Helmet, CORS, express-rate-limit | HTTP hardening, rate limiting |
| Container | Docker (nginx:alpine) | Lightweight deployment |

---

## Project Structure

```
medbridge-ai/
├── client/                           # React frontend
│   ├── src/
│   │   ├── App.tsx                   # 3-phase state machine (Input/Loading/Output)
│   │   ├── App.css                   # Glass component class library
│   │   ├── index.css                 # Design system tokens + base styles
│   │   └── components/
│   │       ├── Dropzone.tsx          # Drag-and-drop image upload (a11y)
│   │       ├── EmergencyBanner.tsx   # Critical alert with 911 call + GPS
│   │       ├── SoapNote.tsx          # S.O.A.P. clinical note display
│   │       ├── DoctorMap.tsx         # Google Maps with doctor markers
│   │       ├── DoctorCard.tsx        # Individual doctor info + directions
│   │       ├── WeatherCard.tsx       # Environmental context display
│   │       ├── FirstAidSteps.tsx     # Ordered immediate relief steps
│   │       ├── QRCode.tsx            # Dossier QR code for doctor handoff
│   │       └── LoadingSpinner.tsx    # Loading state with shimmer animation
│   └── vite.config.ts               # Dev proxy to backend
│
├── server/                           # Express backend
│   ├── src/
│   │   ├── app.ts                    # Express app + middleware + route mounting
│   │   ├── server.ts                 # Server entry point
│   │   ├── routes/
│   │   │   ├── ai.ts                 # POST /api/ai/analyze (Gemini multimodal)
│   │   │   ├── doctors.ts           # GET /api/doctors/nearby (Google Places)
│   │   │   ├── weather.ts           # GET /api/weather (OpenWeatherMap)
│   │   │   └── dossier.ts           # POST + GET /api/dossier (Pinecone)
│   │   ├── services/
│   │   │   ├── pinecone.ts          # Pinecone singleton + upsert/fetch
│   │   │   ├── places.ts            # Google Places API wrapper
│   │   │   ├── weather.ts           # OpenWeatherMap with 10min cache
│   │   │   └── dossier.ts           # Dossier storage business logic
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts       # API rate limiting (100/15min, 10/min AI)
│   │   │   └── validateInput.ts     # Input sanitization + validation
│   │   └── types/
│   │       └── fhir.ts              # TypeScript interfaces (SOAP, FHIR, etc.)
│   └── test/
│       ├── api.test.ts              # AI route tests (6 tests)
│       ├── doctors.test.ts          # Doctor search tests (4 tests)
│       ├── weather.test.ts          # Weather route tests (3 tests)
│       └── dossier.test.ts          # Dossier CRUD tests (5 tests)
│
├── DESIGN_GUIDELINES.md              # Design system reference document
├── Dockerfile                        # Container deployment config
└── README.md                         # This file
```

---

## Setup and Running

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and Install

```bash
git clone <repository-url>
cd medbridge-ai

# Install server dependencies
cd server && npm install --legacy-peer-deps

# Install client dependencies
cd ../client && npm install --legacy-peer-deps
```

### 2. Configure Environment Variables

Create `server/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=medbridge-dossiers
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open `http://localhost:5173`

### 4. Run Tests

```bash
cd server && npm test
```

All 18 tests should pass.

---

## Evaluation Criteria Coverage

### Code Quality
- **TypeScript strict mode** across both client and server
- **Controller-service pattern** — routes handle HTTP, services handle business logic
- **Separated concerns** — types, middleware, services, routes in distinct directories
- **CSS design system** — 30+ design tokens as CSS custom properties, composable utility classes
- **No inline styles** in production components — all styling via design system classes

### Security
- **Helmet** with strict Content Security Policy (whitelists only Google domains)
- **CORS** restricted to frontend origin
- **Rate limiting** — 100 req/15min global, 10 req/min on AI endpoints
- **Input sanitization** — HTML stripping, text length limits (5000 chars), base64 format validation
- **Image count limit** — Maximum 3 images per request
- **Payload size limit** — 10MB maximum body size
- **API keys server-side only** — never exposed to the client bundle
- **UUID validation** — Regex pattern matching on dossier retrieval

### Efficiency
- **Pinecone connection singleton** — O(1) connection reuse, no redundant initialization
- **Weather cache** — 10-minute TTL keyed by rounded coordinates, prevents redundant API calls
- **Gemini Flash model** — Optimized for speed over capability (2.5 Flash vs Pro)
- **Parallel API calls** — Doctor search and dossier storage fire simultaneously after analysis
- **Minimal dependencies** — No utility libraries (lodash, etc.), lean bundle

### Testing
- **18 tests across 4 test suites** covering all API endpoints
- **Mocked external services** — Google GenAI, Axios (Places/Weather), Pinecone
- **Security tests** — Payload size limits, XSS prevention (script tag in base64), image count enforcement
- **Validation tests** — Missing params return 400, invalid UUIDs return 400, missing dossiers return 404
- **FHIR compliance tests** — Verify DiagnosticReport structure in response
- **Jest 30 + Supertest** — Modern testing stack with TypeScript support

### Accessibility
- **WCAG AAA contrast** — Primary text #FFFFFF on #000000 (21:1 ratio)
- **Semantic HTML** — `<main>`, `<header>`, `<section>` with `aria-labelledby`
- **Skip-to-content link** — First focusable element for keyboard users
- **Keyboard navigation** — Dropzone responds to Enter/Space, all buttons focusable
- **ARIA attributes** — `role="alert"` on emergency banner, `aria-live="assertive"` for dynamic updates, `aria-label` on all interactive elements
- **Focus indicators** — 2px solid blue outline with 2px offset on `:focus-visible`
- **Reduced motion** — `prefers-reduced-motion` disables all animations
- **High contrast mode** — `prefers-contrast: more` thickens borders, boosts text contrast
- **Touch targets** — Minimum 44x44px on all interactive elements
- **Screen reader support** — Hidden file input uses `.sr-only`, status badges use semantic text

### Google Services
- **Google Gemini 2.5 Flash** — Core AI engine for multimodal medical analysis (text + images)
- **Google Places API (New)** — Doctor/hospital search with `X-Goog-Api-Key` header authentication, field masking for efficient responses
- **Google Maps JavaScript SDK** — Interactive embedded map with `AdvancedMarker`, `InfoWindow`, and user location display via `@vis.gl/react-google-maps`
- **FHIR DiagnosticReport** — Structured healthcare data format for interoperability

---

## Assumptions

1. The application is designed for demonstration purposes and is not intended for actual medical diagnosis or emergency use
2. Users have a modern browser with support for `backdrop-filter` (glassmorphism falls back to solid backgrounds on unsupported browsers)
3. Google API keys have the necessary APIs enabled (Gemini, Places, Maps JavaScript)
4. The Pinecone index (`medbridge-dossiers`) is pre-created with 1536 dimensions
5. Emergency phone number is 911 (US-centric, configurable for other regions)
6. Images are in JPEG format for Gemini multimodal processing
7. Weather data is used as supplementary context for diagnosis (e.g., high pollen count affecting respiratory symptoms)

---

## License

ISC
