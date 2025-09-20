import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

// Props no longer include 'location'
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
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
    libraries,
  });

  const containerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "0.75rem",
  };

  // This function now only updates the component's internal state
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    if (mapCenter) {
      setMapCenter(null);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          updateFormData("lat", latitude);
          updateFormData("lng", longitude);
          setMapCenter({ lat: latitude, lng: longitude });

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
            );
            const data = await response.json();
            let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            if (data.status === "OK" && data.results[0]) {
              address = data.results[0].formatted_address;
            }
            setLocationInput(address); // Update internal input state
            updateFormData("location", address); // Update parent form state
          } catch (error) {
            console.error("Error fetching address:", error);
            alert("Failed to fetch address from coordinates.");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          alert(
            "Failed to get your location. Please enable location services."
          );
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteInstance.setFields(["geometry", "formatted_address"]);
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      const latValue = place.geometry?.location?.lat();
      const lngValue = place.geometry?.location?.lng();

      if (address && latValue !== undefined && lngValue !== undefined) {
        setLocationInput(address); // Update internal input state
        updateFormData("location", address); // Update parent form state
        updateFormData("lat", latValue);
        updateFormData("lng", lngValue);
        setMapCenter({ lat: latValue, lng: lngValue });
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

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
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              id="location"
              placeholder="Enter a city, state, or zip code"
              value={locationInput}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </Autocomplete>

          {mapCenter && (
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
              >
                <MarkerF position={mapCenter} />
              </GoogleMap>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setCurrentStep(3)}
        disabled={!locationInput.trim()}
        className="w-full p-3 mt-8 font-medium text-white transition-colors bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
};

export default LocationForm;
