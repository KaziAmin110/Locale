import { useState } from "react";
import { MapPin } from "lucide-react";

type LocationFormProps = {
  updateFormData: (
    field: "location" | "lat" | "lng",
    value: string | number
  ) => void;
  setCurrentStep: (step: number) => void;
};

const LocationForm = ({
  updateFormData,
  setCurrentStep,
}: LocationFormProps) => {
  const [locationInput, setLocationInput] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    updateFormData("location", value);
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setLocationInput(locationText);
          updateFormData("location", locationText);
          updateFormData("lat", latitude);
          updateFormData("lng", longitude);
          setIsLocating(false);
        },
        () => {
          alert("Failed to get your location. Please enable location services.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className="flex flex-col justify-between flex-1 w-full max-w-lg px-4 pt-4 pb-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center justify-between gap-4 mb-2 md:flex-row">
            <label
              htmlFor="location"
              className="text-lg font-semibold text-gray-800"
            >
              Where are you looking?
            </label>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
            id="location"
            placeholder="Enter a city, state, or zip code"
            value={locationInput}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
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
          disabled={!locationInput.trim()}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LocationForm;