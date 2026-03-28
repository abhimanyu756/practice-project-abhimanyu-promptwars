# Skill-Specific Implementation Prompts (R.I.C.E. Framework)

Use these targeted skill prompts to execute specific, complex functions within the MedBridge AI application while satisfying the Hackathon Judges.

---

## Skill: Google Services Integration (Gemini Multimodal Auth)
**[R]ole:** Act as a Google Cloud Solutions Architect.
**[I]nstructions:** Write the Express route that seamlessly and securely integrates the `@google/genai` SDK. You must take a base64 image and text from the frontend, stream it to `gemini-2.5-flash`, and return structured JSON.
**[C]ontext:** This is the core "Universal Bridge" of the hackathon. It must score perfectly on the "Google Services" judging criterion. Do not expose API keys to the frontend.
**[E]xamples:**
*Output Format:* A well-commented Node.js route `/api/analyze`. It must use `try/catch` and cleanly parse Google's JSON response format.

---

## Skill: Maximum Security Hardening
**[R]ole:** Act as a DevSecOps Engineer.
**[I]nstructions:** Review all Express code and React inputs to eliminate vulnerabilities. Implement Input Sanitization to prevent XSS and SQL/NoSQL Injection. Set up strict CORS policies.
**[C]ontext:** The app handles sensitive health data (PII/HIPAA-adjacent). It must score perfectly on the "Security" hackathon criterion (safe practices, zero vulnerabilities).
**[E]xamples:**
*Input:* "Provide the security middleware."
*Output:* Includes `helmet()`, rigorous regex validation on input strings, and rate-limiting middleware to prevent DDoS architectures.

---

## Skill: TDD (Test-Driven Development) Setup
**[R]ole:** Act as a Lead Software Developer in Test (SDET).
**[I]nstructions:** Generate the unit testing suite configured to run instantly. Write tests for standard edge cases (e.g., Pinecone returning no matches, Google API rate limitations). 
**[C]ontext:** Satisfies the "Testing" judging criterion. The code must be easily tested, validated, and maintained. 
**[E]xamples:**
*Output format:* Provides a Jest configuration file and a sample `api.test.ts` showing a mocked Google Gemini SDK response.
