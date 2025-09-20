import { useState } from "react";
import { MapPin } from "lucide-react";

type LocationFormProps = {
  location: string;
  updateFormData: (
    field: "location" | "lat" | "lng",
    value: string | number
  ) => void;
  setCurrentStep: (step: number) => void;
};

const LocationForm = ({
  location,
  updateFormData,
  setCurrentStep,
}: LocationFormProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("location", e.target.value);
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateFormData("lat", latitude);
          updateFormData("lng", longitude);
          updateFormData("location", `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => {
          alert(
            "Failed to get your location. Please enable location services in your browser."
          );
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-4 pb-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="location" className="text-lg font-semibold text-gray-800">
              Where are you looking?
            </label>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                "Getting location..."
              ) : (
                <>
                  <MapPin className="mr-2" size={16} />
                  Use Current Location
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter city, state or zip code"
            value={location}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          />
          <p className="text-sm text-gray-600">
            Examples: "San Francisco, CA", "New York, NY", or "90210"
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          disabled={!location.trim()}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LocationForm;