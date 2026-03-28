export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string[];
}

export interface EmergencyFlag {
  isEmergency: boolean;
  severity: 'critical' | 'urgent' | 'standard';
  keywords: string[];
}

export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  uvIndex?: number;
}

export interface PlaceResult {
  name: string;
  rating: number;
  address: string;
  placeId: string;
  location: { lat: number; lng: number };
  reviewSummary?: string;
  totalRatings: number;
}

export interface FHIRDiagnosticReport {
  resourceType: 'DiagnosticReport';
  status: 'final';
  code: { text: string };
  conclusion: string;
  issued: string;
  presentedForm: Array<{ contentType: string; data: string }>;
}

export interface AnalysisResult {
  soap: SOAPNote;
  emergency: EmergencyFlag;
  specialty: string;
  firstAidSteps: string[];
  weatherImpact?: string;
}

export interface DossierRecord {
  id: string;
  soap: SOAPNote;
  emergency: EmergencyFlag;
  specialty: string;
  firstAidSteps: string[];
  weatherContext?: WeatherData;
  fhir: FHIRDiagnosticReport;
  createdAt: string;
}
