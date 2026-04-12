import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Loader2, Sparkles, Camera, ArrowLeft, RefreshCw } from 'lucide-react';

interface UploadBoxProps {
  onAnalyze: (image: string) => void;
  isAnalyzing: boolean;
}

type Mode = 'select' | 'upload' | 'scan';

export default function UploadBox({ onAnalyze, isAnalyzing }: UploadBoxProps) {
  const [mode, setMode] = useState<Mode>('select');
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('Permission dismissed') || errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setCameraError("Camera permission was dismissed or denied. Please allow camera access in your browser settings and try again.");
      } else {
        setCameraError("Could not access camera. Please ensure no other app is using it and try again.");
      }
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (mode === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  const clearImage = () => {
    setPreview(null);
    setMode('select');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-navy/5 border border-light-gray/30">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="aspect-video rounded-[1.5rem] overflow-hidden border border-light-gray/50 shadow-xl bg-light-gray/10">
                <img 
                  src={preview} 
                  alt="Food preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={clearImage}
                disabled={isAnalyzing}
                className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-navy hover:text-red-500 transition-colors disabled:opacity-50 hover:scale-110 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mt-8 flex flex-col gap-4">
                <button
                  onClick={() => onAnalyze(preview)}
                  disabled={isAnalyzing}
                  className="w-full btn-gradient py-4 rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Analyze Food
                    </>
                  )}
                </button>
                <button
                  onClick={clearImage}
                  disabled={isAnalyzing}
                  className="w-full py-3 text-sm text-medium-gray font-bold hover:text-navy transition-colors disabled:opacity-50"
                >
                  Choose a different option
                </button>
              </div>
            </motion.div>
          ) : mode === 'select' ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <button
                onClick={() => setMode('scan')}
                className="group p-8 rounded-[1.5rem] border-2 border-dashed border-light-gray hover:border-primary hover:bg-primary-light/20 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-navy">Scan Food</h3>
                <p className="text-xs text-medium-gray font-medium">
                  Use your camera to take a real-time photo of your meal
                </p>
              </button>

              <button
                onClick={() => setMode('upload')}
                className="group p-8 rounded-[1.5rem] border-2 border-dashed border-light-gray hover:border-primary hover:bg-primary-light/20 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-navy">Upload Photo</h3>
                <p className="text-xs text-medium-gray font-medium">
                  Select an existing photo from your device gallery
                </p>
              </button>
            </motion.div>
          ) : mode === 'scan' ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="aspect-video rounded-[1.5rem] overflow-hidden border border-light-gray/50 shadow-xl bg-black relative">
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-900">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-white font-medium mb-6">{cameraError}</p>
                    <button
                      onClick={() => startCamera()}
                      className="px-6 py-2 bg-white text-navy font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry Camera
                    </button>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    {!isCameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => setMode('select')}
                  className="p-4 rounded-xl bg-light-gray/30 text-navy hover:bg-light-gray/50 transition-all"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!isCameraReady || !!cameraError}
                  className="flex-1 btn-gradient py-4 rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Camera className="w-6 h-6" />
                  Capture Photo
                </button>
                <button
                  onClick={() => { stopCamera(); startCamera(); }}
                  disabled={!!cameraError}
                  className="p-4 rounded-xl bg-light-gray/30 text-navy hover:bg-light-gray/50 transition-all disabled:opacity-50"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload-area"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`relative group cursor-pointer rounded-[1.5rem] border-2 border-dashed transition-all duration-300 ${
                dragActive ? 'border-primary bg-primary-light/50 orange-glow' : 'border-light-gray hover:border-primary/50 hover:bg-primary-light/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              <div className="p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-navy">Upload Food Image</h3>
                <p className="text-sm text-medium-gray mb-8 font-medium">
                  Drag and drop your meal photo here, or click to browse
                </p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-light-gray/40 text-xs font-bold text-navy uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4" />
                  Supports JPG, PNG, HEIC
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setMode('select'); }}
                className="absolute top-4 left-4 p-2 text-medium-gray hover:text-navy transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
