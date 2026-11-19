import React, { useEffect, useState, useRef } from 'react';
import { 
  Truck, Navigation, MapPin, Phone, ShieldCheck, Compass, Radio, 
  Layers, ZoomIn, ZoomOut, Maximize2, RefreshCw, Eye, Battery, Gauge, Zap, CloudRain, Sun, Minimize2,
  Wind, Droplets, AlertTriangle
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { io } from 'socket.io-client';
import { decode } from '@googlemaps/polyline-codec';
import { motion } from 'framer-motion';

// Weather icons mapping
import { WiDaySunny, WiRain, WiCloudy, WiStrongWind, WiHumidity } from 'react-icons/wi';

export type MapStyle = 'dark' | 'satellite' | 'traffic';

export interface VehicleTelemetry {
  id: string;
  driverName: string;
  vehicleModel: string;
  type: string;
  lat: number;
  lng: number;
  speedMph: number;
  bearing: number;
  batteryPct: number;
  etaMins: number;
  statusText: string;
  pickup: string;
  destination: string;
}

interface InteractiveMapProps {
  pickupLocation?: string;
  destinationLocation?: string;
  driverName?: string;
  etaMinutes?: number;
  statusText?: string;
  showControls?: boolean;
}

const HYDERABAD_FLEET: VehicleTelemetry[] = [
  {
    id: 'TS-TOW-901',
    driverName: 'Marcus Vance',
    vehicleModel: 'Ashok Leyland Dost Flatbed',
    type: 'Heavy Flatbed Tow',
    lat: 17.3616, // Charminar
    lng: 78.4747,
    speedMph: 35,
    bearing: 45,
    batteryPct: 92,
    etaMins: 9,
    statusText: 'Captain Marcus is en route via PVNR Expressway',
    pickup: 'Charminar, Hyderabad',
    destination: 'Gachibowli IT Corridor, Hyderabad'
  },
  {
    id: 'TS-BAT-402',
    driverName: 'Elena Rostova',
    vehicleModel: 'Mahindra Supro Power Van',
    type: 'Battery & Tire Rescue',
    lat: 17.4483, // Hitec City Metro
    lng: 78.3815,
    speedMph: 28,
    bearing: 180,
    batteryPct: 87,
    etaMins: 11,
    statusText: 'Elena is en route to Hitec City Metro',
    pickup: 'Hitec City Metro Station, Hyderabad',
    destination: 'KBR Park, Banjara Hills'
  },
  {
    id: 'TS-EV-88',
    driverName: 'Devon Miles',
    vehicleModel: 'Tata Ace Electric Mobile Charger',
    type: 'Mobile EV Fast Charge',
    lat: 17.4246, // Jubilee Hills Check Post
    lng: 78.4116,
    speedMph: 40,
    bearing: 90,
    batteryPct: 98,
    etaMins: 14,
    statusText: 'Devon dispatched with 150kW DC Fast Charger unit',
    pickup: 'Jubilee Hills Check Post, Hyderabad',
    destination: 'Begumpet Airport, Hyderabad'
  }
];

const HYDERABAD_ROUTES: { [key: string]: { start: { lat: number; lng: number }; end: { lat: number; lng: number } } } = {
  'TS-TOW-901': {
    start: { lat: 17.3616, lng: 78.4747 },
    end: { lat: 17.4401, lng: 78.3489 }
  },
  'TS-BAT-402': {
    start: { lat: 17.4483, lng: 78.3815 },
    end: { lat: 17.4065, lng: 78.4116 }
  },
  'TS-EV-88': {
    start: { lat: 17.4246, lng: 78.4116 },
    end: { lat: 17.4475, lng: 78.4678 }
  }
};

const getCoordsFromLocation = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes("charminar")) return { lat: 17.3616, lng: 78.4747 };
  if (loc.includes("hitec")) return { lat: 17.4483, lng: 78.3815 };
  if (loc.includes("jubilee")) return { lat: 17.4246, lng: 78.4116 };
  if (loc.includes("gachibowli")) return { lat: 17.4401, lng: 78.3489 };
  if (loc.includes("kbr")) return { lat: 17.4065, lng: 78.4116 };
  if (loc.includes("begumpet")) return { lat: 17.4475, lng: 78.4678 };
  
  if (loc.includes("silicon valley")) return { lat: 37.3382, lng: -121.8863 };
  if (loc.includes("tesla service")) return { lat: 37.3450, lng: -121.8750 };
  
  return { lat: 17.3616, lng: 78.4747 };
};

const GOOGLE_MAPS_DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#060f1e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#060f1e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#748BA7" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#00D4FF" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#748BA7" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#051A2E" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#10D98F" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#0f2038" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#173155" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#546E7A" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1a3b63" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#0A84FF" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#0a1b31" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#00D4FF" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#010712" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3D566E" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#010712" }] },
];

// Helper to calculate distance between two coordinates in degrees
const getDistanceToPolyline = (point: { lat: number; lng: number }, polyline: { lat: number; lng: number }[]) => {
  if (polyline.length === 0) return 0;
  let minDistance = Infinity;
  for (const p of polyline) {
    const d = Math.sqrt((point.lat - p.lat) ** 2 + (point.lng - p.lng) ** 2);
    if (d < minDistance) minDistance = d;
  }
  return minDistance;
};

// Traffic Layer component using react-google-maps hook
const TrafficLayer = ({ enabled }: { enabled: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const trafficLayer = new google.maps.TrafficLayer();
    if (enabled) {
      trafficLayer.setMap(map);
    }
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, enabled]);
  return null;
};

// Custom Google Maps Polyline Component
const CustomPolyline = ({ path, strokeColor = '#00D4FF' }: { path: { lat: number; lng: number }[], strokeColor?: string }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeOpacity: 0.9,
      strokeWeight: 6,
      map
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor]);

  return null;
};

// Directions routing and geocoding logic (fetching real road navigation)
const DirectionsComponent = ({
  origin,
  destination,
  onRouteResolved
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  onRouteResolved: (coords: { lat: number; lng: number }[], distance: string, duration: string) => void;
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');

  useEffect(() => {
    if (!routesLib || !map) return;
    const directionsService = new routesLib.DirectionsService();

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false,
    }, (result: any, status: any) => {
      if (status === 'OK' && result) {
        const route = result.routes[0];
        const pointsStr = route.overview_polyline.points;
        const decodedCoords = decode(pointsStr).map(([lat, lng]) => ({ lat, lng }));
        
        const leg = route.legs[0];
        onRouteResolved(decodedCoords, leg.distance.text, leg.duration.text);

        // Fit map bounds to show full route geometry
        const bounds = new google.maps.LatLngBounds();
        decodedCoords.forEach((pt: any) => bounds.extend(pt));
        map.fitBounds(bounds);
      } else {
        console.warn("Google Directions API routing failed:", status);
      }
    });
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickupLocation = "Charminar, Hyderabad",
  destinationLocation = "Gachibowli IT Corridor, Hyderabad",
  driverName = "Marcus Vance (Ashok Leyland Dost Flatbed)",
  etaMinutes = 9,
  statusText = "Captain Marcus is en route via PVNR Expressway",
  showControls = true
}) => {
  const [fleet, setFleet] = useState<VehicleTelemetry[]>(HYDERABAD_FLEET);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('TS-TOW-901');
  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  
  // Real-time weather info
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [weather, setWeather] = useState<{
    temp: number;
    humidity: number;
    wind: number;
    description: string;
    isRaining: boolean;
    alert: string | null;
  } | null>(null);
  
  // Fullscreen states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [googleMapsError, setGoogleMapsError] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>(null);

  // Active route coordinates and telemetry
  const [activeRouteCoords, setActiveRouteCoords] = useState<{ lat: number; lng: number }[]>([]);
  const [routeDistance, setRouteDistance] = useState<string>('Calculating...');
  const [routeDuration, setRouteDuration] = useState<string>('Calculating...');

  // Smooth position interpolation states
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number; bearing: number }>({ lat: 0, lng: 0, bearing: 0 });
  const [targetPos, setTargetPos] = useState<{ lat: number; lng: number; bearing: number } | null>(null);

  // Origin coordinate for routing (dynamic to support off-route rerouting)
  const resolvedOrigin = getCoordsFromLocation(pickupLocation);
  const resolvedDestination = getCoordsFromLocation(destinationLocation);
  const [currentOrigin, setCurrentOrigin] = useState<{ lat: number; lng: number }>(resolvedOrigin);

  // Selected telemetry details
  const activeVehicle = fleet.find(v => v.id === selectedVehicleId) || fleet[0];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Reset origin coordinates when props change
  useEffect(() => {
    setCurrentOrigin(resolvedOrigin);
  }, [pickupLocation]);

  // 1. Fetch weather telemetry
  useEffect(() => {
    const lat = activeVehicle.lat;
    const lng = activeVehicle.lng;
    
    const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    
    if (openWeatherKey) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherKey}&units=metric`;
    }

    fetch(weatherUrl)
      .then(res => res.json())
      .then(data => {
        if (openWeatherKey) {
          const isRain = data.weather?.[0]?.main?.toLowerCase().includes("rain") || data.weather?.[0]?.main?.toLowerCase().includes("storm");
          setWeather({
            temp: Math.round(data.main?.temp || 27),
            humidity: data.main?.humidity || 65,
            wind: Math.round((data.wind?.speed || 4.2) * 3.6),
            description: data.weather?.[0]?.description || 'Cloudy',
            isRaining: isRain,
            alert: isRain ? "SURGE ALERT: 1.5x Weather delay surge active" : null
          });
          setIsRaining(isRain);
        } else {
          const code = data.current?.weather_code || 0;
          const temp = Math.round(data.current?.temperature_2m || 28);
          const humidity = data.current?.relative_humidity_2m || 60;
          const wind = Math.round(data.current?.wind_speed_10m || 12);
          const isRain = code >= 51;
          
          let desc = 'Cloudy';
          if (code === 0) desc = 'Clear Sky (Sunny)';
          else if (code <= 3) desc = 'Partly Cloudy';
          else if (code >= 51 && code <= 67) desc = 'Monsoon Rainfall';
          else if (code >= 80 && code <= 82) desc = 'Rain Showers';
          else if (code >= 95) desc = 'Heavy Thunderstorm Warning';

          setWeather({
            temp,
            humidity,
            wind,
            description: desc,
            isRaining: isRain,
            alert: isRain ? "TRAFFIC SURGE: Weather delay active. Rates adjusted by 1.5x." : null
          });
          setIsRaining(isRain);
        }
      })
      .catch(err => {
        console.error("Weather fetch failed, utilizing fallbacks", err);
        setWeather({
          temp: 28,
          humidity: 60,
          wind: 14,
          description: "Overcast",
          isRaining: false,
          alert: null
        });
        setIsRaining(false);
      });
  }, [selectedVehicleId, activeVehicle.lat, activeVehicle.lng]);

  // 2. Simulated monsoon rain particle storm overlay
  useEffect(() => {
    if (!isRaining) return;
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const maxDrops = 100;
    const raindrops: { x: number; y: number; l: number; ys: number }[] = [];

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();

    for (let i = 0; i < maxDrops; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 15 + 8,
        ys: Math.random() * 10 + 8
      });
    }

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      raindrops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.l);
        ctx.stroke();

        drop.y += drop.ys;
        drop.x -= 2;

        if (drop.y > canvas.height) {
          drop.y = -drop.l;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(drawRain);
    };

    drawRain();

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRaining]);

  // 3. Socket.IO live driver tracking client setup
  useEffect(() => {
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.emit("subscribe_towing_route", {
      bookingId: selectedVehicleId,
      initialCoords: activeRouteCoords.length > 0 ? activeRouteCoords : [HYDERABAD_ROUTES[selectedVehicleId].start, HYDERABAD_ROUTES[selectedVehicleId].end]
    });

    socket.on("driver_location_update", (data: any) => {
      if (data.bookingId === selectedVehicleId) {
        setTargetPos({ lat: data.lat, lng: data.lng, bearing: data.bearing });
        
        // Update local fleet telemetry state
        setFleet(prevFleet =>
          prevFleet.map(v => {
            if (v.id === selectedVehicleId) {
              return {
                ...v,
                lat: data.lat,
                lng: data.lng,
                bearing: data.bearing,
                speedMph: data.speedMph,
                etaMins: data.etaMins
              };
            }
            return v;
          })
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedVehicleId, activeRouteCoords]);

  // 4. Smooth coordinate interpolation LERP glide loop
  useEffect(() => {
    if (!targetPos) {
      const initial = HYDERABAD_ROUTES[selectedVehicleId]?.start || { lat: 17.3616, lng: 78.4747 };
      setMarkerPos({ lat: initial.lat, lng: initial.lng, bearing: 0 });
      return;
    }

    let animFrame: number;
    const duration = 1500;
    const startTime = performance.now();
    const startPos = { ...markerPos };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = startPos.lat + (targetPos.lat - startPos.lat) * progress;
      const lng = startPos.lng + (targetPos.lng - startPos.lng) * progress;

      let diff = targetPos.bearing - startPos.bearing;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const bearing = startPos.bearing + diff * progress;

      setMarkerPos({ lat, lng, bearing: (bearing + 360) % 360 });

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetPos]);

  // 5. Automatic Rerouting detection when driver moves off route
  useEffect(() => {
    if (activeRouteCoords.length === 0 || !markerPos.lat) return;

    const distanceToRoute = getDistanceToPolyline(
      { lat: markerPos.lat, lng: markerPos.lng },
      activeRouteCoords
    );

    // If driver deviates by more than ~150 meters (approx 0.0015 degrees), trigger route recalculation
    if (distanceToRoute > 0.0015) {
      console.log("REROUTING: Driver has moved off route. Redrawing polyline...");
      setCurrentOrigin({ lat: markerPos.lat, lng: markerPos.lng });
    }
  }, [markerPos.lat, markerPos.lng, activeRouteCoords]);

  // Callback when actual Google Maps directions are resolved
  const handleRouteResolved = (coords: { lat: number; lng: number }[], distanceStr: string, durationStr: string) => {
    setActiveRouteCoords(coords);
    setRouteDistance(distanceStr);
    setRouteDuration(durationStr);

    if (socketRef.current) {
      socketRef.current.emit("register_road_polyline", {
        bookingId: selectedVehicleId,
        coords
      });
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const activeWeatherIcon = () => {
    const Rain = WiRain as any;
    const Cloudy = WiCloudy as any;
    const DaySunny = WiDaySunny as any;
    if (isRaining) return <Rain className="w-8 h-8 text-cyan-400" />;
    if (weather?.description.toLowerCase().includes("cloud")) return <Cloudy className="w-8 h-8 text-gray-300" />;
    return <DaySunny className="w-8 h-8 text-amber-400" />;
  };

  // Internal map wrapper to pan camera smoothly to tow truck
  const MapCameraController = ({ markerPos }: { markerPos: { lat: number; lng: number } }) => {
    const map = useMap();
    useEffect(() => {
      if (map && markerPos.lat) {
        map.panTo({ lat: markerPos.lat, lng: markerPos.lng });
      }
    }, [map, markerPos.lat, markerPos.lng]);
    return null;
  };

  return (
    <div 
      ref={containerRef}
      id="interactive-map-container"
      className="relative w-full rounded-3xl overflow-hidden glass-card border border-[#00D4FF]/30 shadow-2xl bg-[#061426] p-1 transition-all"
    >
      
      {/* Weather Alert banner */}
      {isRaining && weather?.alert && (
        <div className="absolute top-2.5 inset-x-2.5 z-30 bg-amber-500/90 backdrop-blur-xl py-2 px-4 rounded-xl border border-amber-400 shadow-xl flex items-center justify-between text-xs text-slate-950 font-bold animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{weather.alert}</span>
          </div>
        </div>
      )}

      {/* Map Control Info Overlay Header */}
      <div className={`absolute left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#081B33]/90 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 shadow-xl transition-all ${
        isRaining ? 'top-14' : 'top-4'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/20 border border-[#0A84FF]/50 flex items-center justify-center">
            <Radio className="w-5 h-5 text-[#00D4FF] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-sm text-white">
                {activeVehicle.statusText}
              </span>
              <span className="bg-[#10D98F]/20 text-[#10D98F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#10D98F]/40 font-num flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10D98F] animate-ping"></span>
                <span>GOOGLE MAPS LIVE</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 font-num mt-0.5">
              Operator: <strong className="text-white">{activeVehicle.driverName}</strong> • {activeVehicle.vehicleModel}
            </p>
          </div>
        </div>

        {/* Real-time Weather dashboard widget */}
        <div className="flex items-center space-x-4">
          {weather && (
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs font-num">
              {activeWeatherIcon()}
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-gray-400 uppercase">Weather</span>
                <span className="font-bold text-white text-xs">{weather.temp}°C • {weather.description}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 border-l border-white/10 pl-2 ml-2 text-gray-400">
                <span className="flex items-center space-x-0.5"><Wind className="w-3 h-3 text-[#00D4FF]" /><span>{weather.wind} km/h</span></span>
                <span className="flex items-center space-x-0.5"><Droplets className="w-3 h-3 text-[#10D98F]" /><span>{weather.humidity}%</span></span>
              </div>
            </div>
          )}

          <div className="text-right">
            <span className="block text-[10px] font-num text-gray-400 uppercase tracking-wider">Distance / Duration</span>
            <span className="text-sm sm:text-base font-extrabold font-num text-[#00D4FF] block">
              {routeDistance} ({routeDuration})
            </span>
          </div>
        </div>
      </div>

      {/* Map style selection overlays */}
      <div className={`absolute left-4 z-20 flex flex-wrap items-center gap-2 transition-all ${
        isRaining ? 'top-36' : 'top-24'
      }`}>
        <div className="flex items-center space-x-1 p-1 bg-[#081B33]/90 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl">
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'dark' ? 'bg-[#0A84FF] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
            title="Dark Vector Theme"
          >
            Dark Map
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'satellite' ? 'bg-[#0A84FF] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
            title="Satellite HD Maps"
          >
            Satellite
          </button>
          <button
            onClick={() => setMapStyle('traffic')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'traffic' ? 'bg-[#0A84FF] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
            title="Night Traffic Map"
          >
            Traffic Grid
          </button>
        </div>
      </div>

      {/* Map zoom and compass widgets */}
      <div className={`absolute right-4 z-20 flex flex-col space-y-2 transition-all ${
        isRaining ? 'top-36' : 'top-24'
      }`}>
        <div className="bg-[#081B33]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl flex flex-col space-y-1 text-white">
          <button
            onClick={() => setZoomLevel(z => Math.min(19, z + 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-[#00D4FF]" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(10, z - 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-[#00D4FF]" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-all text-[#10D98F]"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-[#081B33]/90 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-xl flex items-center justify-center text-[#00D4FF]">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>

      {/* Map Canvas (Google Maps SDK implementation or vector fallback) */}
      <div className={`map-canvas-div w-full relative overflow-hidden bg-[#060f1e] transition-all duration-300 ${
        isFullscreen ? 'h-full' : 'h-[440px] md:h-[480px]'
      }`}>
        
        {apiKey && !googleMapsError ? (
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={currentOrigin}
              zoom={zoomLevel}
              disableDefaultUI={true}
              mapTypeId={mapStyle === 'satellite' ? 'satellite' : 'roadmap'}
              styles={mapStyle === 'dark' || mapStyle === 'traffic' ? GOOGLE_MAPS_DARK_STYLE : []}
              className="w-full h-full absolute inset-0 z-10"
            >
              {/* Actual road polylines from directions components */}
              <DirectionsComponent
                origin={currentOrigin}
                destination={resolvedDestination}
                onRouteResolved={handleRouteResolved}
              />

              {/* Draw road-aligned polyline exactly as returned by Directions API */}
              <CustomPolyline path={activeRouteCoords} />

              {/* Camera pan component to track the truck smoothly */}
              <MapCameraController markerPos={markerPos} />

              {/* Dynamic Traffic flow layers */}
              <TrafficLayer enabled={mapStyle === 'traffic'} />

              {/* Custom SVG Pickup Marker */}
              <AdvancedMarker position={resolvedOrigin}>
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#0A84FF]/30 animate-ping"></span>
                  <div className="w-9 h-9 rounded-2xl bg-[#081B33] border-2 border-[#0A84FF] shadow-2xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Custom SVG Destination Marker */}
              <AdvancedMarker position={resolvedDestination}>
                <div className="w-9 h-9 rounded-2xl bg-[#081B33] border-2 border-[#10D98F] shadow-2xl flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-[#10D98F] transform rotate-45" />
                </div>
              </AdvancedMarker>

              {/* Custom SVG Animated Tow Truck Driver Marker */}
              <AdvancedMarker position={markerPos}>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  style={{
                    transform: `rotate(${markerPos.bearing}deg)`,
                    transformOrigin: 'center center',
                    cursor: 'pointer'
                  }}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="44" height="44">
                    <circle cx="20" cy="20" r="18" fill="rgba(10, 132, 255, 0.22)" stroke="#00D4FF" strokeWidth="1.8" />
                    <circle cx="20" cy="20" r="6" fill="#10D98F" />
                    {/* Tiny Tow Truck SVG */}
                    <g transform="translate(11, 11) scale(0.75)">
                      <path d="M20,8 L16,8 L16,5 L3,5 L3,14 L21,14 L21,11 L20,8 Z" fill="#0A84FF" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="7" cy="14" r="2.5" fill="#081B33" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="16" cy="14" r="2.5" fill="#081B33" stroke="#FFFFFF" strokeWidth="1" />
                    </g>
                  </svg>
                </motion.div>
              </AdvancedMarker>

            </Map>
          </APIProvider>
        ) : (
          /* Robust offline fallback vector telemetry grid */
          <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #081B33 0%, #040F1D 100%), repeating-linear-gradient(0deg, rgba(0,212,255,0.04) 0px, rgba(0,212,255,0.04) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(0,212,255,0.04) 0px, rgba(0,212,255,0.04) 1px, transparent 1px, transparent 30px)',
              }}
            ></div>
            
            <div className="z-20 space-y-4">
              <Radio className="w-14 h-14 text-cyan-400 animate-pulse mx-auto" />
              <p className="text-base font-bold text-white">Offline Vector Telemetry Active</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No Maps API credentials detected. Operating in simulated offline telemetry sync mode.
              </p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-2 text-[10px] text-[#00D4FF] font-num">
                <span>ETA: {activeVehicle.etaMins} mins</span>
                <span>•</span>
                <span>Driver: {markerPos.lat.toFixed(4)}° N, {Math.abs(markerPos.lng).toFixed(4)}° E</span>
              </div>
            </div>
          </div>
        )}

        {/* Rain storm canvas overlay */}
        {isRaining && (
          <canvas 
            ref={rainCanvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />
        )}

        {/* Mapbox scale banner */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center space-x-3 text-[10px] text-gray-400 font-num">
          <div className="flex items-center space-x-1 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10 font-bold text-white">
            <span className="text-[#00D4FF]">mapbox</span>
            <span className="text-gray-400">| © OpenStreetMap</span>
          </div>
          <span className="hidden sm:inline bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">Scale 500m</span>
        </div>
      </div>

      {/* Operator controls drawer */}
      {showControls && (
        <div className="p-4 bg-[#081B33] border-t border-white/15 space-y-4 font-sans text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold font-num text-gray-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#10D98F]" />
              <span>Assigned Fleet Vehicle Telemetry (Surge Adjusted)</span>
            </span>
            <span className="text-xs text-[#00D4FF] font-num font-bold">
              3 Active Command Units
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {fleet.map((veh) => (
              <button
                key={veh.id}
                onClick={() => setSelectedVehicleId(veh.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedVehicleId === veh.id
                    ? 'bg-[#0A2647] border-[#00D4FF] shadow-lg glow-blue'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-num">{veh.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedVehicleId === veh.id ? 'bg-[#10D98F]/20 text-[#10D98F]' : 'bg-white/10 text-gray-400'
                  }`}>
                    {veh.etaMins}m ETA
                  </span>
                </div>
                <p className="text-xs font-bold text-white mt-1 truncate">{veh.driverName}</p>
                <p className="text-[10px] text-gray-400 truncate">{veh.vehicleModel}</p>

                <div className="mt-2 flex items-center justify-between text-[10px] font-num text-gray-400">
                  <span className="text-[#00D4FF] font-bold">{veh.speedMph} KM/H</span>
                  <span className="flex items-center space-x-1">
                    <Battery className="w-3 h-3 text-[#10D98F]" />
                    <span>{veh.batteryPct}%</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#10D98F]" />
                <span>Telemetry sync operational (1500ms heartbeat)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="tel:18005556664"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Call Driver ({activeVehicle.driverName.split(' ')[0]})</span>
              </a>
              <button 
                onClick={toggleFullscreen}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-bold shadow transition-all flex items-center space-x-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
