'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Loader, SkipBack, SkipForward, Play, Pause } from 'lucide-react';
import { apiUpload } from '../lib/api';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

interface VideoThumbnailPickerProps {
  videoSrc: string;
  projectSlug: string;
  onThumbnailCaptured: (imageUrl: string) => void;
  onClose: () => void;
}

export default function VideoThumbnailPicker({
  videoSrc,
  projectSlug,
  onThumbnailCaptured,
  onClose,
}: VideoThumbnailPickerProps) {
  const { token } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Update preview whenever time changes (while paused)
  const updatePreview = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
  }, []);

  // Video loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setDuration(video.duration);
      setVideoReady(true);
      // Seek to 1s for initial preview
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    const onSeeked = () => {
      updatePreview();
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [updatePreview]);

  // Slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Play/Pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      updatePreview();
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  // Skip ±2s
  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Format time mm:ss
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Capture frame and upload
  const handleCapture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !token) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    }

    setCapturing(true);

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context failed');
      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Blob creation failed'))),
          'image/jpeg',
          0.92,
        );
      });

      const file = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectSlug', projectSlug);

      const result = await apiUpload<{ url: string }>('/media/upload', formData, token);
      onThumbnailCaptured(result.url);
      toast.success('تم التقاط الصورة المصغّرة ✅');
      onClose();
    } catch {
      toast.error('فشل التقاط الصورة المصغّرة');
    } finally {
      setCapturing(false);
    }
  }, [token, projectSlug, onThumbnailCaptured, onClose, isPlaying]);

  // Slider progress percentage for styling
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-overlay"
      onClick={onClose}
      style={{ zIndex: 200 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--admin-bg-card)',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-lg)',
          width: '100%',
          maxWidth: 720,
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--admin-border)',
        }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={18} style={{ color: 'var(--admin-accent)' }} />
            اختيار صورة مصغّرة من الفيديو
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'var(--admin-bg-elevated)',
              border: '1px solid var(--admin-border)',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Preview */}
        <div style={{ position: 'relative', background: '#000', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            src={videoSrc}
            crossOrigin="anonymous"
            preload="auto"
            muted
            playsInline
            style={{
              width: '100%',
              maxHeight: '45vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          {!videoReady && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)',
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Loader size={28} style={{ color: 'var(--admin-accent)' }} />
              </motion.div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Slider */}
          <div style={{ position: 'relative' }}>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.05}
              value={currentTime}
              onChange={handleSliderChange}
              disabled={!videoReady}
              style={{
                width: '100%',
                height: 6,
                appearance: 'none',
                WebkitAppearance: 'none',
                borderRadius: 3,
                outline: 'none',
                cursor: videoReady ? 'pointer' : 'not-allowed',
                background: `linear-gradient(to left, var(--admin-accent) 0%, var(--admin-accent) ${progress}%, var(--admin-bg-elevated) ${progress}%, var(--admin-bg-elevated) 100%)`,
              }}
            />
          </div>

          {/* Time + Playback Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {/* Time display */}
            <span style={{
              fontSize: '0.82rem',
              color: 'var(--admin-text-secondary)',
              fontVariantNumeric: 'tabular-nums',
              direction: 'ltr',
              minWidth: 80,
            }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Playback buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => skip(-2)}
                disabled={!videoReady}
                style={{
                  background: 'var(--admin-bg-elevated)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 8,
                  padding: 8,
                  cursor: 'pointer',
                  color: 'var(--admin-text-secondary)',
                  display: 'flex',
                }}
                title="-2 ثانية"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlayPause}
                disabled={!videoReady}
                style={{
                  background: 'var(--admin-accent-light)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 8,
                  padding: 8,
                  cursor: 'pointer',
                  color: 'var(--admin-accent)',
                  display: 'flex',
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={() => skip(2)}
                disabled={!videoReady}
                style={{
                  background: 'var(--admin-bg-elevated)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 8,
                  padding: 8,
                  cursor: 'pointer',
                  color: 'var(--admin-text-secondary)',
                  display: 'flex',
                }}
                title="+2 ثانية"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          {/* Capture Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCapture}
            disabled={!videoReady || capturing}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 20px',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm)',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: videoReady && !capturing ? 'pointer' : 'not-allowed',
              opacity: videoReady && !capturing ? 1 : 0.6,
              boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
            }}
          >
            {capturing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Loader size={18} />
                </motion.div>
                جاري الالتقاط...
              </>
            ) : (
              <>
                <Camera size={18} />
                التقاط هذا الفريم كصورة غلاف
              </>
            )}
          </motion.button>

          {/* Hint */}
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--admin-text-muted)',
            textAlign: 'center',
            margin: 0,
          }}>
            حرّك الشريط لاختيار اللقطة المناسبة ثم اضغط التقاط
          </p>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </motion.div>
    </motion.div>
  );
}
