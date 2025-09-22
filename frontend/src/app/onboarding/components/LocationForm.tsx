"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { motion } from "framer-motion";

// Custom dark theme styles for the Google Map to match our UI
// This style is a variant of "Aubergine"
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const libraries: "places"[] = ["places"];

type LocationFormProps = {
  updateFormData: (
    field: "location" | "lat" | "lng",
    value: string | number | null
  ) => void;
  setCurrentStep: (step: number) => void;
};

const LocationForm = ({ updateFormData, setCurrentStep }: LocationFormProps) => {
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const handleSelect = async (selectedAddress: string) => {
    // ... (Your original logic remains the same)
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
    }
  };
  
  const handleGetCurrentLocation = () => {
    // ... (Your original logic remains the same)
  };

  const variants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction * 100 }),
    visible: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction * -100 }),
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
        <Loader2 className="animate-spin text-red-500" size={32}/>
        <span>Initializing Global Map...</span>
      </div>
    );
  }

  return (
    <motion.div
      custom={1}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col w-full h-full items-center justify-between"
    >
      <div className="w-full max-w-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label htmlFor="location" className="text-lg font-semibold tracking-wide text-slate-300">
            Target Location
          </label>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 bg-red-600 rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLocating ? (
              <><Loader2 className="mr-2 animate-spin" size={16} /> Acquiring Signal...</>
            ) : (
              <><MapPin className="mr-2" size={16} /> Use Current Coordinates</>
            )}
          </button>
        </div>

        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div className="relative">
              <input {...getInputProps({
                placeholder: "Designate city, state, or address...",
                className: "w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300",
              })} />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 overflow-y-auto bg-slate-800 border border-slate-700 shadow-lg max-h-60 rounded-lg">
                  {suggestions.map((suggestion) => (
                    <div {...getSuggestionItemProps(suggestion, {
                      className: `cursor-pointer p-4 ${suggestion.active ? 'bg-red-500/10 text-red-300' : 'text-slate-300 hover:bg-slate-700'}`
                    })}>
                      <span className="font-medium">{suggestion.formattedSuggestion.mainText}</span>
                      <span className="ml-2 text-sm text-slate-500">{suggestion.formattedSuggestion.secondaryText}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-4 h-56 w-full rounded-lg overflow-hidden border-2 border-slate-700">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter || { lat: 39.8283, lng: -98.5795 }} // Default to center of US
            zoom={mapCenter ? 14 : 4}
            options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
          >
            {mapCenter && <MarkerF position={mapCenter} />}
          </GoogleMap>
        </div>
      </div>

      <div className="w-full max-w-lg flex justify-between">
        <button onClick={() => setCurrentStep(2)} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-100">Back</button>
        <button onClick={() => setCurrentStep(4)} disabled={!address.trim()} className="px-10 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 active:scale-100">Proceed</button>
      </div>
    </motion.div>
  );
};

export default LocationForm;
