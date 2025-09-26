"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SlothUploadForm() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [dragImage, setDragImage] = useState(false);
  const [dragAudio, setDragAudio] = useState(false);

  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputAudioRef = useRef<HTMLInputElement>(null);

  const uploadSong = async (formData: FormData) => {
    const res = await fetch("/api/songs/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  };

  const {
    mutate: upload,
    isPending: loading,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: uploadSong,
    onSuccess: () => {
      setTitle("");
      setArtist("");
      setImageFile(null);
      setAudioFile(null);
      setImagePreview(null);
      setAudioPreview(null);
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  function handleDrag(e: React.DragEvent, forImage: boolean) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      forImage ? setDragImage(true) : setDragAudio(true);
    } else if (e.type === "dragleave") {
      forImage ? setDragImage(false) : setDragAudio(false);
    }
  }

  function handleDrop(e: React.DragEvent, forImage: boolean) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (forImage) {
      if (!file.type.startsWith("image/")) return;
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDragImage(false);
    } else {
      if (!file.type.startsWith("audio/")) return;
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setDragAudio(false);
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    reset();

    if (!title.trim() || !artist.trim() || !imageFile || !audioFile) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("image", imageFile);
    formData.append("audio", audioFile);

    upload(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-[#121212] rounded-[24px] p-10 font-satoshi space-y-8 text-gray-300"
      noValidate
    >
      <h1 className="text-[32px] font-semibold text-center leading-[40px] text-white">
        Upload Your Music
      </h1>

      {(isError || isSuccess) && (
        <p
          className={`text-center font-semibold py-2 rounded-lg ${
            isError
              ? "bg-[#5c1f19] text-[#ff4c1e]"
              : "bg-[#003822] text-[#00A63E]"
          }`}
        >
          {isError
            ? (error as Error)?.message || "Upload failed"
            : "Song uploaded successfully!"}
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-[14px] font-semibold uppercase text-gray-400 tracking-[1.2px]">
              Song Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your song title"
              className="w-full px-6 py-4 rounded-[12px] border border-gray-700 bg-[#181818] text-white placeholder-gray-500 focus:outline-none focus:border-[#00A63E] focus:ring-1 focus:ring-[#00A63E] transition"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold uppercase text-gray-400 tracking-[1.2px]">
              Artist Name
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name"
              className="w-full px-6 py-4 rounded-[12px] border border-gray-700 bg-[#181818] text-white placeholder-gray-500 focus:outline-none focus:border-[#00A63E] focus:ring-1 focus:ring-[#00A63E] transition"
              maxLength={100}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[20px] bg-[#00A63E] text-white text-[16px] font-semibold tracking-wide hover:bg-[#008330] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Song"}
          </button>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Image */}
          <div
            onDragEnter={(e) => handleDrag(e, true)}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, true)}
            onDrop={(e) => handleDrop(e, true)}
            className={`relative cursor-pointer rounded-[20px] border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 transition-colors ${
              dragImage
                ? "border-[#00A63E] bg-[#003822]"
                : "border-gray-700 bg-[#181818]"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
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
                  className="stroke-[#00A63E]"
                >
                  <circle cx="28" cy="28" r="27" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 28l10 10 18-18"
                  />
                </svg>
                <p className="text-[#00A63E] font-semibold text-[14px] text-center tracking-[1.2px] uppercase select-none">
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

          {/* Audio */}
          <div
            onDragEnter={(e) => handleDrag(e, false)}
            onDragOver={(e) => handleDrag(e, false)}
            onDragLeave={(e) => handleDrag(e, false)}
            onDrop={(e) => handleDrop(e, false)}
            className={`relative cursor-pointer rounded-[20px] border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 transition-colors ${
              dragAudio
                ? "border-[#00A63E] bg-[#003822]"
                : "border-gray-700 bg-[#181818]"
            }`}
          >
            {audioPreview ? (
              <audio controls className="w-full max-w-xs outline-none">
                <source src={audioPreview} />
              </audio>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  fill="none"
                  viewBox="0 0 56 56"
                  className="stroke-[#00A63E]"
                >
                  <circle cx="28" cy="28" r="27" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 22v12l12-6-12-6z"
                  />
                </svg>
                <p className="text-[#00A63E] font-semibold text-[14px] text-center tracking-[1.2px] uppercase select-none">
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
        </div>
      </div>
    </form>
  );
}
