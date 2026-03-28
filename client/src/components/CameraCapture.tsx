import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setIsOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      alert('Camera access denied or not available.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        closeCamera();
      }
    }, 'image/jpeg', 0.85);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="btn btn--outline btn--sm"
        onClick={openCamera}
        type="button"
        aria-label="Take a photo with camera"
      >
        <span className="btn__icon">&#x1F4F7;</span>
        Take Photo
      </button>

      {isOpen && (
        <div className="camera-overlay" role="dialog" aria-modal="true" aria-label="Camera capture">
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="camera-controls">
              <button
                className="btn btn--outline btn--sm"
                onClick={closeCamera}
                type="button"
                aria-label="Close camera"
              >
                Cancel
              </button>
              <button
                className="camera-shutter"
                onClick={capturePhoto}
                type="button"
                aria-label="Capture photo"
              />
              <div style={{ width: '80px' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
