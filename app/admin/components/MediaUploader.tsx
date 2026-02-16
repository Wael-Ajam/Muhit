'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader } from 'lucide-react';
import { apiUpload } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import toast from 'react-hot-toast';

interface MediaUploaderProps {
  projectSlug: string;
  onUploadComplete: (url: string, originalName: string) => void;
}

export default function MediaUploader({ projectSlug, onUploadComplete }: MediaUploaderProps) {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!token) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectSlug', projectSlug);

      setProgress((prev) => [...prev, file.name]);

      try {
        const result = await apiUpload<{ url: string; originalName: string }>(
          '/media/upload',
          formData,
          token,
        );
        onUploadComplete(result.url, result.originalName);
        toast.success(`تم رفع ${file.name}`);
        addNotification('success', 'رفع ملف', `تم رفع "${file.name}" بنجاح`);
      } catch (err) {
        toast.error(`فشل رفع ${file.name}`);
        addNotification('error', 'فشل الرفع', `فشل رفع "${file.name}": ${err instanceof Error ? err.message : 'خطأ'}`);
      } finally {
        setProgress((prev) => prev.filter((n) => n !== file.name));
      }
    },
    [token, projectSlug, onUploadComplete, addNotification],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        await uploadFile(file);
      }
    },
    [uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div>
      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        animate={{
          borderColor: isDragging ? 'var(--admin-accent)' : 'var(--admin-border)',
          background: isDragging ? 'var(--admin-accent-light)' : 'transparent',
        }}
        whileHover={{ borderColor: 'var(--admin-text-muted)' }}
        style={{
          border: '2px dashed var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          padding: '32px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--admin-accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--admin-accent)',
          }}
        >
          <Upload size={22} />
        </motion.div>

        <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 4 }}>
          {isDragging ? 'أفلت الملفات هنا' : 'اسحب وأفلت ملفات هنا'}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
          أو اضغط لاختيار ملفات — صور (JPG, PNG, WebP) وفيديو (MP4, MOV)
        </p>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 12 }}
          >
            {progress.map((name) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: 'var(--admin-bg-elevated)',
                  borderRadius: 'var(--admin-radius-sm)',
                  marginBottom: 6,
                  fontSize: '0.82rem',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Loader size={14} style={{ color: 'var(--admin-accent)' }} />
                </motion.div>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                  جاري الرفع...
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
