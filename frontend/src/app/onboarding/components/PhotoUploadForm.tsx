import React, { useState, useRef } from "react";
import { Camera, X, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// Define the component's props
interface PhotoUploadFormProps {
  photos: string[];
  updateFormData: (field: "photos", value: string[]) => void;
  setCurrentStep: (step: number) => void;
}

const PhotoUploadForm = ({ photos, updateFormData, setCurrentStep }: PhotoUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 6 - photos.length);
    if (files.length === 0) return;

    setIsUploading(true);
    // In production, you'd upload to a cloud service. We simulate for effect.
    await new Promise(res => setTimeout(res, 1000));

    try {
      const newPhotos = await Promise.all(
        files.map((file) => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }))
      );
      
      updateFormData("photos", [...photos, ...newPhotos]);
    } catch (error) {
      console.error("Photo upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    updateFormData("photos", photos.filter((_, index) => index !== indexToRemove));
  };

  const canContinue = photos.length >= 1;

  // Animation variants for a powerful entrance/exit
  const variants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction * 100 }),
    visible: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction * -100 }),
  };

  return (
    <motion.div
      custom={1} // Forward direction
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col w-full h-full items-center justify-between"
    >
      <div className="w-full max-w-lg space-y-6 mt-4">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square group">
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 150px"
                className="object-cover rounded-lg border-2 border-white/20"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"/>
              <button
                onClick={() => removePhoto(index)}
                className="absolute flex items-center justify-center w-8 h-8 text-white transition-all duration-300 bg-red-600 rounded-full -top-3 -right-3 hover:bg-red-500 hover:scale-110 scale-0 group-hover:scale-100"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {/* Add Photo Button */}
          {photos.length < 6 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex flex-col items-center justify-center transition-all duration-300 border-2 border-dashed rounded-lg aspect-square border-white/30 hover:border-red-400 hover:bg-white/10 text-slate-400 hover:text-red-300 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 size={32} className="animate-spin text-red-400" />
              ) : (
                <>
                  <Plus size={32} />
                  <span className="mt-1 text-xs font-semibold tracking-wider uppercase">Upload</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Visual Data Protocol Box */}
        <div className="p-4 border border-white/20 rounded-lg bg-white/10">
          <div className="flex items-start space-x-3">
            <Camera size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-300">
              <p className="font-bold text-white">Visual Data Protocol:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside text-slate-400">
                <li>Utilize high-resolution images with clear lighting.</li>
                <li>Ensure primary subject (face) is clearly visible.</li>
                <li>Include visuals that define your personality matrix.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden"/>

      <div className="w-full max-w-lg flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-100"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!canContinue}
          className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100"
        >
          Proceed
        </button>
      </div>
    </motion.div>
  );
};

export default PhotoUploadForm;
