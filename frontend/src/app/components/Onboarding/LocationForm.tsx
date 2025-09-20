import { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import LoadingSpinner from "../LoadingSpinner";
import { MapPin } from "lucide-react";

type LocationFormProps = {
  location: string;
  updateFormData: (
    field: "location" | "lat" | "lng",
    value: string | number
  ) => void;
  setCurrentStep: (step: number) => void;
};

type Coordinates = {
  lat: number;
  lng: number;
};

const LocationForm = ({
  location,
  updateFormData,
  setCurrentStep,
}: LocationFormProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null
  );

  const [isLocating, setIsLocating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "geocoding"], // Add "geocoding" library
  });

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const formattedAddress = place.formatted_address || "";

      if (lat && lng) {
        updateFormData("location", formattedAddress);
        updateFormData("lat", lat);
        updateFormData("lng", lng);
        setSelectedLocation({ lat, lng });
      }
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                const formattedAddress = results[0].formatted_address;
                updateFormData("location", formattedAddress);
                updateFormData("lat", latitude);
                updateFormData("lng", longitude);
                setSelectedLocation({ lat: latitude, lng: longitude });

                if (inputRef.current) {
                  inputRef.current.value = formattedAddress;
                }
              } else {
                alert("Reverse geocoding failed.");
              }
              setIsLocating(false);
            }
          );
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

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col justify-evenly w-full max-w-lg px-4 pt-8 pb-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="location" className="text-lg text-black">
              Location:
            </label>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="bg-[#333333] text-white px-4 py-2 rounded-full font-bold transition mt-6 text-sm
                   hover:bg-[#444444] 
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isLocating ? (
                <LoadingSpinner />
              ) : (
                <>
                  <MapPin className="inline mr-2" size={20} />
                  Use Current Location
                </>
              )}
            </button>
          </div>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your location"
              defaultValue={location}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </Autocomplete>
        </div>

        {selectedLocation && (
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={selectedLocation}
              zoom={14}
            >
              <Marker position={selectedLocation} />
            </GoogleMap>
          </div>
        )}
      </div>

      <button
        onClick={() => setCurrentStep(3)}
        disabled={!location || !selectedLocation}
        className="w-full bg-[#333333] text-white p-3 rounded-full font-bold transition mt-6
                   hover:bg-[#444444] hover:cursor-pointer
                   disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
};

export default LocationForm;
