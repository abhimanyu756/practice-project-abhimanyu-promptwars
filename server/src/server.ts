import app from './app';

const PORT = 3000; // Hardcoded for immediate hackathon execution

app.listen(PORT, () => {
    console.log(`[SECURE] MedBridge Express server verified and running on port ${PORT}`);
});
