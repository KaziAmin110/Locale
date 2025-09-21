"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// ---------- Types ----------
export type MapItem = {
  id: string;
  title?: string;
  address: string;
};

type LatLng = { lat: number; lng: number };

// ---------- Bright "roadmap" style (clean & light) ----------
const BRIGHT_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "geometry", stylers: [{ saturation: 0 }, { lightness: 20 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#2797ddff" }, { lightness: -40 }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f6f8fb" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 40 }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
];

// ---------- Small utils ----------
function cacheGet(addr: string): LatLng | null {
  try {
    const raw = localStorage.getItem("geo:" + addr);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function cacheSet(addr: string, latlng: LatLng) {
  try {
    localStorage.setItem("geo:" + addr, JSON.stringify(latlng));
  } catch {}
}

function onceIdle(m: google.maps.Map) {
  return new Promise<void>((resolve) => {
    google.maps.event.addListenerOnce(m, "idle", () => resolve());
  });
}

export default function BackgroundMap({
  items,
  activeId,
  dim = 0.25,
  fitKey,
  focusZoom = 16,
  minZoom = 11,
  maxZoom = 17,
  // Positive x shifts the viewport to the right, revealing more of the left (where your card is)
  focusOffsetPx = { x: 240, y: 0 },
  // Leave space on the RIGHT for the centered card
  fitPadding = { top: 60, right: 280, bottom: 60, left: 60 },
}: {
  items: MapItem[];
  activeId?: string | null;
  dim?: number;
  fitKey?: string | number | null;
  focusZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  focusOffsetPx?: { x: number; y: number };
  fitPadding?: { top: number; right: number; bottom: number; left: number };
}) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const didFitRef = useRef<boolean>(false);

  const [resolved, setResolved] = useState<
    { id: string; title?: string; address: string; latlng: LatLng }[]
  >([]);

  // Map type toggle state — use string literal so we don't touch google.* before it loads
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(
    "roadmap" as google.maps.MapTypeId
  );

  // Reset the "fit only once" gate when the area changes
  useEffect(() => {
    didFitRef.current = false;
  }, [fitKey]);

  // Load Maps JS & init the map
  useEffect(() => {
    let cancelled = false;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    if (!apiKey) {
      console.error("[BackgroundMap] Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
    }

    const loader = new Loader({ apiKey, libraries: [] });

    loader
      .load()
      .then(() => {
        if (cancelled || !mapEl.current) return;

        mapRef.current = new google.maps.Map(mapEl.current, {
          center: { lat: 28.5383, lng: -81.3792 }, // Orlando fallback
          zoom: 12,
          mapTypeId: mapType,
          styles: mapType === "roadmap" ? BRIGHT_STYLES : undefined,
          backgroundColor: "#FFFFFF",
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: "none",
          draggable: false,
          keyboardShortcuts: false,
        });
      })
      .catch((e) => {
        console.error("[BackgroundMap] Failed to load Google Maps:", e);
      });

    return () => {
      cancelled = true;
      Object.values(markersRef.current).forEach((m) => m.setMap(null));
      markersRef.current = {};
      mapRef.current = null;
    };
  }, []); // once

  // React to map type changes (apply/remove styles appropriately)
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.setMapTypeId(mapType);
    m.setOptions({ styles: mapType === "roadmap" ? BRIGHT_STYLES : undefined });
  }, [mapType]);

  // Geocode all addresses (with localStorage cache)
  useEffect(() => {
    let cancelled = false;

    async function waitForGoogle() {
      return new Promise<void>((res) => {
        const tick = () => {
          // @ts-ignore
          if (window.google && window.google.maps) res();
          else setTimeout(tick, 30);
        };
        tick();
      });
    }

    async function geocodeAll() {
      await waitForGoogle();
      if (cancelled) return;

      const geocoder = new google.maps.Geocoder();
      const out: { id: string; title?: string; address: string; latlng: LatLng }[] = [];

      const list = items.slice(0, 75); // soft cap for quota

      for (const it of list) {
        const addr = it.address?.trim();
        if (!addr) continue;

        const cached = cacheGet(addr);
        if (cached) {
          out.push({ ...it, latlng: cached });
          continue;
        }

        try {
          const { results } = await geocoder.geocode({ address: addr });
          const loc = results?.[0]?.geometry?.location;
          if (loc) {
            const latlng = { lat: loc.lat(), lng: loc.lng() };
            cacheSet(addr, latlng);
            out.push({ ...it, latlng });
            await new Promise((r) => setTimeout(r, 110)); // gentle throttle
          } else {
            console.warn("[BackgroundMap] No geocode result for:", addr);
          }
        } catch (err: any) {
          console.error("[BackgroundMap] Geocode failed for:", addr, err?.message || err);
        }

        if (cancelled) return;
      }

      setResolved(out);
    }

    geocodeAll();

    return () => {
      cancelled = true;
    };
  }, [items]);

  // Create/update markers and fit bounds once
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove stale markers
    const valid = new Set(resolved.map((r) => r.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!valid.has(id) && id !== "__test__") {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });

    // Add / update markers (default red pin)
    resolved.forEach((r) => {
      if (!markersRef.current[r.id]) {
        markersRef.current[r.id] = new google.maps.Marker({
          position: r.latlng,
          map,
          title: r.title || r.address,
        });
      } else {
        markersRef.current[r.id].setPosition(r.latlng);
      }
    });

    // Test pin if nothing yet
    if (!resolved.length && !markersRef.current["__test__"]) {
      markersRef.current["__test__"] = new google.maps.Marker({
        position: { lat: 28.5383, lng: -81.3792 },
        map,
        title: "Test Pin (Orlando)",
      });
    } else if (resolved.length && markersRef.current["__test__"]) {
      markersRef.current["__test__"].setMap(null);
      delete markersRef.current["__test__"];
    }

    // Fit bounds once per "area"
    if (!didFitRef.current && resolved.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      resolved.forEach((r) => bounds.extend(r.latlng as any));
      map.fitBounds(bounds, fitPadding);

      google.maps.event.addListenerOnce(map, "idle", () => {
        const z = map.getZoom();
        if (typeof z === "number") {
          if (z < minZoom) map.setZoom(minZoom);
          if (z > maxZoom) map.setZoom(maxZoom);
        }
      });

      didFitRef.current = true;
    }
  }, [resolved, fitKey, minZoom, maxZoom, fitPadding]);

  // Focus active marker with retry + stable sequence (zoom -> panTo -> panBy)
  useEffect(() => {
    if (!mapRef.current) return;
    const m = mapRef.current; // stable, non-null

    let cancelled = false;
    const targetId = activeId ?? "";

    // Ensure visibility & z-order
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (id === "__test__") return;
      marker.setVisible(true);
      if (id === targetId) {
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        marker.setIcon(undefined as any); // default red pin
      } else {
        marker.setZIndex(undefined as any);
        marker.setIcon(undefined as any);
      }
    });

    async function focusActiveWithRetry(map: google.maps.Map, deadlineMs = 1400) {
      const start = performance.now();

      while (!cancelled && performance.now() - start < deadlineMs) {
        const marker = targetId ? markersRef.current[targetId] : undefined;
        const pos = marker?.getPosition();
        if (marker && pos) {
          const current = map.getZoom();
          const want = Math.min(maxZoom, focusZoom);
          if (typeof current === "number" && current < want) {
            map.setZoom(want);
            await onceIdle(map);
            if (cancelled) return;
          }

          map.panTo(pos);
          await onceIdle(map);
          if (cancelled) return;

          map.panBy(focusOffsetPx.x, focusOffsetPx.y);
          return; // success
        }
        await new Promise((r) => setTimeout(r, 60));
      }
    }

    focusActiveWithRetry(m);

    return () => {
      cancelled = true;
    };
  }, [activeId, focusZoom, maxZoom, focusOffsetPx.x, focusOffsetPx.y]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Map canvas */}
      <div ref={mapEl} className="absolute inset-0" />

      {/* Dim overlay (set dim={0} to disable) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(0,0,0,${dim})` }}
      />

      {/* Map/Satellite toggle */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setMapType("roadmap" as google.maps.MapTypeId)}
          className={`px-3 py-1 rounded-lg text-sm font-medium shadow
            ${mapType === "roadmap" ? "bg-pink-500 text-white" : "bg-white text-gray-800"}`}
          aria-pressed={mapType === "roadmap"}
        >
          Map
        </button>
        <button
          onClick={() => setMapType("satellite" as google.maps.MapTypeId)}
          className={`px-3 py-1 rounded-lg text-sm font-medium shadow
            ${mapType === "satellite" ? "bg-pink-500 text-white" : "bg-white text-gray-800"}`}
          aria-pressed={mapType === "satellite"}
        >
          Satellite
        </button>
      </div>
    </div>
  );
}
