import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [27.8974, 78.088]; // Aligarh fallback
const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const destIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function FitRoute({ start, end }) {
  const map = useMap();
  useEffect(() => {
    if (start && end) map.fitBounds(L.latLngBounds([start, end]), { padding: [40, 40], maxZoom: 14 });
  }, [start, end, map]);
  return null;
}

async function geocode(address, signal) {
  if (!address) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Could not look up that address.");
  const results = await response.json();
  return results[0] ? [Number(results[0].lat), Number(results[0].lon)] : null;
}

function distanceMeters(a, b) {
  const radians = (degree) => degree * Math.PI / 180;
  const dLat = radians(b[0] - a[0]);
  const dLon = radians(b[1] - a[1]);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a[0])) * Math.cos(radians(b[0])) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export default function MapComponent({ startDest, destination, onRouteCalculated }) {
  const [startLocation, setStartLocation] = useState(DEFAULT_CENTER);
  const [destLocation, setDestLocation] = useState(null);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [routeSteps, setRouteSteps] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Waiting for GPS location…");
  const lastRoutedPosition = useRef(null);
  const destinationRef = useRef(null);
  const routeInFlight = useRef(false);
  const lastRouteTime = useRef(0);

  const requestRoute = useCallback(async (start, end) => {
    if (!end || routeInFlight.current) return;
    routeInFlight.current = true;
    setLoading(true);
    try {
      // ORS expects longitude,latitude; Leaflet and browser GPS use latitude,longitude.
      const query = new URLSearchParams({
        start: `${start[1]},${start[0]}`,
        end: `${end[1]},${end[0]}`,
      });
      const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${apiBase}/api/map/route?${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Route request failed.");
      const feature = data.features?.[0];
      if (!feature) throw new Error("No driving route was found for those locations.");
      const coordinates = feature.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
      const summary = feature.properties.summary;
      const steps = feature.properties.segments?.[0]?.steps || [];
      setRoutePolyline(coordinates);
      setRouteSteps(steps);
      const info = { distanceKm: (summary.distance / 1000).toFixed(2), durationMins: Math.round(summary.duration / 60) };
      setRouteInfo(info);
      onRouteCalculated?.(info);
      setMessage("GPS is active. Route updated.");
      lastRoutedPosition.current = start;
      lastRouteTime.current = Date.now();
    } catch (error) {
      setMessage(error.message || "Could not calculate route.");
    } finally {
      routeInFlight.current = false;
      setLoading(false);
    }
  }, [onRouteCalculated]);

  // Watch device GPS while this map is mounted. Route refreshes after 100 m movement,
  // with a 15 second minimum interval to avoid excessive provider requests.
  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage("This browser does not support GPS location.");
      return undefined;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const current = [position.coords.latitude, position.coords.longitude];
        setStartLocation(current);
        setMessage(`GPS active (about ${Math.round(position.coords.accuracy)} m accuracy).`);
        const previous = lastRoutedPosition.current;
        if (destinationRef.current && (!previous || (distanceMeters(previous, current) >= 100 && Date.now() - lastRouteTime.current >= 15000))) {
          requestRoute(current, destinationRef.current);
        }
      },
      (error) => setMessage(error.code === 1 ? "Allow location access to show your live position." : "GPS unavailable; showing the fallback location."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [requestRoute]);

  useEffect(() => {
    const controller = new AbortController();
    async function resolveDestination() {
      setRoutePolyline([]);
      setRouteSteps([]);
      setRouteInfo(null);
      if (!destination) {
        destinationRef.current = null;
        setDestLocation(null);
        return;
      }
      setLoading(true);
      try {
        const end = await geocode(destination, controller.signal);
        if (!end) throw new Error("Could not find that destination. Try a fuller address or place name.");
        destinationRef.current = end;
        setDestLocation(end);
        // Use GPS if available; otherwise geocode the supplied start address, then fall back.
        let start = startLocation;
        if (startDest && startLocation === DEFAULT_CENTER) {
          start = (await geocode(startDest, controller.signal)) || DEFAULT_CENTER;
          setStartLocation(start);
        }
        await requestRoute(start, end);
      } catch (error) {
        if (error.name !== "AbortError") setMessage(error.message || "Could not resolve the route.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    resolveDestination();
    return () => controller.abort();
    // Re-resolve when the requested places change; GPS refreshes are handled by the watcher.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDest, destination, requestRoute]);

  return (
    <div className="my-6 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Route map</p>
          <p className="text-sm font-semibold sm:text-base">{startDest || "Your current location"} → {destination || "Destination"}</p>
          <p className="mt-1 text-xs text-slate-300" aria-live="polite">{message}</p>
        </div>
        {loading ? <span className="animate-pulse rounded-full bg-blue-600/30 px-3 py-1 text-xs text-blue-200">Updating route…</span> : routeInfo ? (
          <div className="flex gap-4 text-xs sm:text-sm">
            <span>Distance: <strong className="text-emerald-400">{routeInfo.distanceKm} km</strong></span>
            <span>Est. time: <strong className="text-emerald-400">{routeInfo.durationMins} min</strong></span>
          </div>
        ) : null}
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <MapContainer center={startLocation} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {destLocation && <FitRoute start={startLocation} end={destLocation} />}
          <Marker position={startLocation} icon={startIcon}><Popup><strong>Current position</strong><br />{message}</Popup></Marker>
          {destLocation && <Marker position={destLocation} icon={destIcon}><Popup><strong>Destination:</strong> {destination}</Popup></Marker>}
          {routePolyline.length > 0 && <Polyline positions={routePolyline} color="#2563eb" weight={6} opacity={0.85} />}
        </MapContainer>
      </div>
      {routeSteps.length > 0 && <div className="max-h-48 overflow-y-auto border-t border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Turn-by-turn directions</h3>
        <ol className="space-y-1.5 text-xs text-slate-700 sm:text-sm">
          {routeSteps.map((step, index) => <li key={`${index}-${step.instruction}`} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2"><span className="min-w-5 font-bold text-blue-600">{index + 1}.</span><span>{step.instruction} <span className="text-xs text-slate-400">({Math.round(step.distance)} m)</span></span></li>)}
        </ol>
      </div>}
    </div>
  );
}
