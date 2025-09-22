"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

// The Google Maps API library to load.
const libraries: "places"[] = ["places"];

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
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Load the Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
    libraries,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "0.75rem",
  };

  /**
   * Handles selecting a location from the autocomplete suggestions.
   */
  const handleSelect = async (selectedAddress: string) => {
    setAddress(selectedAddress);
    setError(null);
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      updateFormData("location", results[0].formatted_address);
      updateFormData("lat", latLng.lat);
      updateFormData("lng", latLng.lng);
      setMapCenter(latLng);
    } catch (error) {
      console.error("Error selecting address:", error);
      setError("Could not get location details. Please try again.");
    }
  };

  /**
   * Reverse geocodes coordinates to a human-readable address.
   */
  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results[0]) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        updateFormData("location", formattedAddress);
        updateFormData("lat", lat);
        updateFormData("lng", lng);
        setMapCenter({ lat, lng });
      } else {
        throw new Error("No address found for these coordinates.");
      }
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      setError("Failed to determine address from your location.");
    }
  };

  /**
   * Fallback method to get approximate location via IP address using Google's Geolocation API.
   */
  const getLocationByIp = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleMapsApiKey}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (data.location) {
        await getAddressFromLatLng(data.location.lat, data.location.lng);
      } else {
        throw new Error("IP-based geolocation failed.");
      }
    } catch (err) {
      console.error("IP Geolocation Error:", err);
      setError(
        "Could not determine your location automatically. Please type it manually."
      );
    } finally {
      setIsLocating(false);
    }
  };

  /**
   * Fetches the user's current geolocation and reverse-geocodes it to an address.
   */
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await getAddressFromLatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setIsLocating(false);
        },
        (geoError) => {
          console.warn("Geolocation Error:", geoError.message);
          // If permission is denied, show a specific message. Otherwise, try the IP fallback.
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setError(
              "Location access was denied. Please enable it in your browser settings."
            );
            setIsLocating(false);
          } else {
            setError(
              "Browser location failed. Trying to find location by network..."
            );
            getLocationByIp(); // Fallback to IP Geolocation
          }
        },
        // Options to improve accuracy and prevent timeouts
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Trying fallback..."
      );
      getLocationByIp(); // Fallback to IP Geolocation
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
        <Loader2 className="animate-spin" />
        <span>Loading Maps...</span>
      </div>
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
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 md:w-auto hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2" size={16} />
                  Use Current Location
                </>
              )}
            </button>
          </div>

          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="relative">
                <input
                  {...getInputProps({
                    placeholder: "Enter a city, state, or address",
                    className:
                      "w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent",
                  })}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 shadow-lg max-h-60 rounded-xl">
                    {loading && (
                      <div className="p-4 text-sm text-gray-500">
                        Loading...
                      </div>
                    )}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "bg-red-100 cursor-pointer p-4"
                        : "bg-white cursor-pointer p-4";

                      const { key, ...suggestionProps } = getSuggestionItemProps(
                        suggestion,
                        {
                          className,
                        }
                      );

                      return (
                        <div key={suggestion.placeId} {...suggestionProps}>
                          <span className="font-medium">
                            {suggestion.formattedSuggestion.mainText}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {suggestion.formattedSuggestion.secondaryText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {mapCenter && (
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
              >
                <MarkerF position={mapCenter} />
              </GoogleMap>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 p-3 font-medium text-gray-700 transition-colors bg-gray-200 hover:bg-gray-300 rounded-xl"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          disabled={!address.trim()}
          className="flex-1 p-3 font-medium text-white transition-colors bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LocationForm;
