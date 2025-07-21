'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

export default function SlothUploadForm() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [dragImage, setDragImage] = useState(false);
  const [dragAudio, setDragAudio] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputAudioRef = useRef<HTMLInputElement>(null);

  // Drag handlers simplified for clarity
  function handleDrag(e: React.DragEvent, forImage: boolean) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      forImage ? setDragImage(true) : setDragAudio(true);
    } else if (e.type === 'dragleave') {
      forImage ? setDragImage(false) : setDragAudio(false);
    }
  }
  function handleDrop(e: React.DragEvent, forImage: boolean) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files.length) return;
    const file = files[0];
    if (forImage) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDragImage(false);
    } else {
      if (!file.type.startsWith('audio/')) {
        setError('Please upload a valid audio file');
        return;
      }
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setDragAudio(false);
    }
    setError('');
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };
  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !artist.trim() || !imageFile || !audioFile) {
      setError('All fields and files are required.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('image', imageFile);
    formData.append('audio', audioFile);

    try {
      const res = await fetch('/api/songs/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        setSuccess('Song uploaded successfully!');
        setTitle('');
        setArtist('');
        setImageFile(null);
        setAudioFile(null);
        setImagePreview(null);
        setAudioPreview(null);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[520px] mx-auto bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.1)] p-8 space-y-8 font-satoshi"
      noValidate
    >
      <h1 className="text-[32px] font-semibold text-center leading-[40px] text-[#242424]">
        Upload Your Music
      </h1>

      {(error || success) && (
        <p
          className={`text-center font-semibold py-2 rounded-lg ${
            error ? 'bg-[#FFEEE6] text-[#FF4C1E]' : 'bg-[#E6FAF9] text-[#16A085]'
          }`}
        >
          {error || success}
        </p>
      )}

      <div className="space-y-6">
        <label
          htmlFor="title"
          className="block text-[14px] font-semibold uppercase text-[#8B8B8B] tracking-[1.2px]"
        >
          Song Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your song title"
          className="w-full px-6 py-4 rounded-[12px] border border-[#E1E1E1] text-[16px] placeholder:text-[#C1C1C1] focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition"
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-6">
        <label
          htmlFor="artist"
          className="block text-[14px] font-semibold uppercase text-[#8B8B8B] tracking-[1.2px]"
        >
          Artist Name
        </label>
        <input
          id="artist"
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
          className="w-full px-6 py-4 rounded-[12px] border border-[#E1E1E1] text-[16px] placeholder:text-[#C1C1C1] focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition"
          maxLength={100}
          required
        />
      </div>

      {/* Image Dropzone */}
      <div
        onDragEnter={(e) => handleDrag(e, true)}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, true)}
        onDrop={(e) => handleDrop(e, true)}
        onClick={() => inputImageRef.current?.click()}
        className={`relative cursor-pointer rounded-[20px] border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 transition-colors ${
          dragImage ? 'border-[#6C63FF] bg-[#F7F6FF]' : 'border-[#DFDFDF]'
        }`}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Cover preview"
            className="max-h-[150px] rounded-lg object-contain"
          />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="none"
              viewBox="0 0 56 56"
              className="stroke-[#6C63FF]"
            >
              <circle cx="28" cy="28" r="27" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 28l10 10 18-18"
              />
            </svg>
            <p className="text-[#6C63FF] font-semibold text-[14px] tracking-[1.2px] uppercase select-none">
              Drag & drop cover image or click to upload
            </p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          ref={inputImageRef}
          onChange={handleImageChange}
          required={!imagePreview}
        />
      </div>

      {/* Audio Dropzone */}
      <div
        onDragEnter={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, false)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={(e) => handleDrop(e, false)}
        onClick={() => inputAudioRef.current?.click()}
        className={`relative cursor-pointer rounded-[20px] border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 transition-colors ${
          dragAudio ? 'border-[#6C63FF] bg-[#F7F6FF]' : 'border-[#DFDFDF]'
        }`}
      >
        {audioPreview ? (
          <audio controls className="w-full max-w-xs outline-none">
            <source src={audioPreview} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="none"
              viewBox="0 0 56 56"
              className="stroke-[#6C63FF]"
            >
              <circle cx="28" cy="28" r="27" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 22v12l12-6-12-6z"
              />
            </svg>
            <p className="text-[#6C63FF] font-semibold text-[14px] tracking-[1.2px] uppercase select-none">
              Drag & drop audio file or click to upload
            </p>
          </>
        )}
        <input
          type="file"
          accept="audio/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          ref={inputAudioRef}
          onChange={handleAudioChange}
          required={!audioPreview}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-[20px] bg-[#6C63FF] text-white text-[16px] font-semibold tracking-wide hover:bg-[#574fd9] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload Song'}
      </button>
    </form>
  );
}
