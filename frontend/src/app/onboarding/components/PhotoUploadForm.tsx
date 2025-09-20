import React, { useState, useRef } from "react";
import { Camera, X, Plus } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

interface PhotoUploadFormProps {
  photos: string[];
  updateFormData: (field: string, value: any) => void;
  setCurrentStep: (step: number) => void;
}

const PhotoUploadForm = ({
  photos,
  updateFormData,
  setCurrentStep,
}: PhotoUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Convert files to base64 for demo purposes
      // In production, you'd upload to a cloud service like Cloudinary or AWS S3
      const newPhotos = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const updatedPhotos = [...photos, ...newPhotos];
      updateFormData("photos", updatedPhotos);
    } catch (error) {
      console.error("Photo upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    updateFormData("photos", newPhotos);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const canContinue = photos.length >= 1;

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Add Your Photos</h3>
          <p className="text-sm text-gray-600">
            Add at least 1 photo so people can get to know you better
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Add Photo Button */}
          {photos.length < 6 && (
            <button
              onClick={openFileSelector}
              disabled={isUploading}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Plus size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Camera Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Camera size={16} className="text-blue-500 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Tips for great photos:</p>
              <ul className="mt-1 space-y-1">
                <li>• Use good lighting</li>
                <li>• Show your face clearly</li>
                <li>• Include photos that show your personality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!canContinue}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PhotoUploadForm;
