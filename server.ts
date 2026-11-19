import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Socket.IO server reference to be initialized in startServer()
let io: Server;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Data Store for Live App Simulation
const bookings: any[] = [
  {
    id: "BK-88219",
    type: "Flatbed Tow Truck",
    status: "EN_ROUTE",
    pickupLocation: "Charminar, Hyderabad, Telangana, India",
    destination: "Gachibowli IT Corridor, Hyderabad, Telangana, India",
    customerName: "Alex Rivera",
    customerPhone: "+91 98765 43210",
    driverName: "Marcus Vance",
    driverPhone: "+91 99887 76655",
    driverVehicle: "Ashok Leyland Dost Flatbed",
    licensePlate: "TS-09-UB-8821",
    rating: 4.95,
    etaMinutes: 8,
    lat: 17.3616,
    lng: 78.4747,
    driverLat: 17.4483,
    driverLng: 78.3815,
    amount: 3100.00,
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: "BK-71024",
    type: "EV Mobile Fast Charge",
    status: "COMPLETED",
    pickupLocation: "Jubilee Hills Check Post, Hyderabad, Telangana, India",
    destination: "Begumpet Airport, Hyderabad, Telangana, India",
    customerName: "Alex Rivera",
    customerPhone: "+91 98765 43210",
    driverName: "Elena Rostova",
    driverPhone: "+91 88877 66554",
    driverVehicle: "Mahindra Supro Power Van",
    licensePlate: "TS-10-EE-2041",
    rating: 5.0,
    etaMinutes: 0,
    lat: 17.4246,
    lng: 78.4116,
    driverLat: 17.4246,
    driverLng: 78.4116,
    amount: 1560.00,
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const walletBalance = {
  credits: 8500.00,
  currency: "INR",
  transactions: [
    { id: "TX-9901", type: "TOP_UP", amount: 5000.00, title: "Wallet Auto Top Up", date: "Jul 24, 2026" },
    { id: "TX-8822", type: "SERVICE", amount: -1560.00, title: "EV Fast Charging Service", date: "Jul 24, 2026" },
    { id: "TX-7719", type: "CASHBACK", amount: 500.00, title: "Membership Reward Cashback", date: "Jul 22, 2026" }
  ]
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "OMNIGO Platform Core", timestamp: new Date().toISOString() });
});

// AI Roadside Assistant & Diagnostic Endpoint
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { message, context, userLocation } = req.body;
    const ai = getGenAI();

    const systemPrompt = `You are OMNIGO AI, the high-tech roadside assistant for OMNIGO - a premium road rescue, towing, EV mobile charging, and fleet logistics platform.
Provide immediate, calm, highly precise automotive diagnostic help, safety instructions, and service recommendations.
Formatting rules:
- Keep answers structured, professional, reassuring, and concise.
- Highlight emergency steps if safety is compromised.
- Recommend standard OMNIGO services (Flatbed Towing, Wheel Lift, EV Fast Charge, Battery Jump Start, Tire Swap, Fuel Delivery, Lockout, Winching/Recovery).
- Estimate response time (usually 8-15 minutes across major corridors).`;

    let replyText = "";
    let suggestedActions = [
      { label: "Confirm Rescue Dispatch", type: "BOOK_TOW" },
      { label: "Request Battery Tech", type: "BOOK_BATTERY" },
      { label: "Talk to Live Human Dispatch", type: "LIVE_HUMAN" }
    ];

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `User report: ${message}\nLocation context: ${userLocation || 'GPS coordinates available'}`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        replyText = response.text || "";
      } catch (err) {
        console.error("Gemini API call failed, utilizing local fallback rules:", err);
      }
    }

    // If Gemini key is missing OR the API call failed/threw an error:
    if (!replyText) {
      const msgLower = (message || '').toLowerCase();
      suggestedActions = [
        { label: "Dispatch Flatbed Towing", type: "BOOK_TOW" },
        { label: "Battery / Jump Start Tech", type: "BOOK_BATTERY" },
        { label: "Emergency SOS Alert", type: "TRIGGER_SOS" }
      ];

      if (msgLower.includes("battery") || msgLower.includes("jump") || msgLower.includes("dead")) {
        replyText = `[OMNIGO AI Rescue Dispatch]\nI detected a battery issue. We recommend dispatching our **Mobile Tech PowerVan** with battery diagnostics and replacement units. Response time to ${userLocation || 'your location'} is ~8 minutes. Would you like me to book it?`;
      } else if (msgLower.includes("tire") || msgLower.includes("flat") || msgLower.includes("puncture")) {
        replyText = `[OMNIGO AI Rescue Dispatch]\nIt looks like you have a flat tire. We recommend our **Roadside Tire Rescue** to swap it with your spare or retrieve a patch. Safety warning: Stay clear of active traffic lanes. Would you like to book a dispatch?`;
      } else if (msgLower.includes("fare") || msgLower.includes("price") || msgLower.includes("cost") || msgLower.includes("quote")) {
        replyText = `[OMNIGO AI Rescue Dispatch]\nOur standard pricing for OMNIGO rescues is: \n• Flatbed Tow: ₹3,100 base + ₹50/km\n• Battery Jump: ₹1,500 flat\n• EV Mobile Charging: ₹2,000 base. Rates are currently standard (no rain surcharge).`;
      } else if (msgLower.includes("lock") || msgLower.includes("key") || msgLower.includes("inside")) {
        replyText = `[OMNIGO AI Rescue Dispatch]\nLocked out of your vehicle? We can dispatch our **Lockout Technician** with specialized lock-picks to open your car damage-free. Shall I dispatch one?`;
      } else {
        replyText = `[OMNIGO AI Rescue Dispatch]\nI'm ready to assist you! Based on your report "${message || 'vehicle breakdown support'}", our dispatch network recommends sending a **Flatbed Tow Unit** or **Mobile Tech Vehicle**. Immediate safety tip: Turn on hazard lights and stay inside your vehicle if safely parked. Would you like me to instantly book dispatch to ${userLocation || 'your current GPS location'}?`;
      }
    }

    const msgLowerText = (message || '').toLowerCase();
    const severity = msgLowerText.includes("accident") || msgLowerText.includes("smoke") || msgLowerText.includes("fire") ? "HIGH" : "NORMAL";

    res.json({
      reply: replyText,
      suggestedActions,
      severity
    });
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ error: "Failed to query OMNIGO AI Assistant", details: error.message });
  }
});

// Bookings API
app.get("/api/bookings", (req, res) => {
  res.json({ bookings });
});

app.post("/api/bookings", (req, res) => {
  const { type, pickupLocation, destination, customerName, customerPhone, vehicleModel, amount } = req.body;
  const newBooking = {
    id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
    type: type || "Flatbed Tow Truck",
    status: "SEARCHING_DRIVER",
    pickupLocation: pickupLocation || "Current GPS Location",
    destination: destination || "Nearest Authorized Repair Center",
    customerName: customerName || "Customer",
    customerPhone: customerPhone || "+1 (555) 019-2831",
    vehicleModel: vehicleModel || "Sedan / SUV",
    driverName: "Assigning OMNIGO Captain...",
    driverPhone: "+1 (800) 555-OMNI",
    driverVehicle: "OMNIGO Heavy Duty Fleet",
    licensePlate: "OMNI-RESCUE",
    rating: 4.95,
    etaMinutes: Math.floor(6 + Math.random() * 8),
    lat: 17.3616,
    lng: 78.4747,
    driverLat: 17.4483,
    driverLng: 78.3815,
    amount: amount || 2500.00,
    paymentStatus: "PENDING",
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  // Simulate driver accepting after 3 seconds
  setTimeout(() => {
    newBooking.status = "EN_ROUTE";
    newBooking.driverName = "Derrick Vance";
    newBooking.driverVehicle = "Ford F-550 Hydraulics";
    newBooking.licensePlate = "CA 9821-OM";
  }, 3000);

  res.status(201).json({ success: true, booking: newBooking });
});

// SOS Emergency Endpoint
app.post("/api/sos", (req, res) => {
  const { location, contact, notes } = req.body;
  const sosRecord = {
    id: `SOS-${Date.now()}`,
    status: "DISPATCHED_PRIORITY_HIGH",
    location: location || "GPS Auto-Detected",
    contact: contact || "+1 Emergency Priority",
    dispatchedUnit: "OMNIGO Rapid Intervention Vehicle #01 & First Responder Alerted",
    etaMinutes: 5,
    timestamp: new Date().toISOString()
  };

  res.json({ success: true, sos: sosRecord });
});

// Wallet API
app.get("/api/wallet", (req, res) => {
  res.json(walletBalance);
});

app.post("/api/wallet/topup", (req, res) => {
  const { amount } = req.body;
  const topAmount = parseFloat(amount) || 1000;
  walletBalance.credits += topAmount;
  walletBalance.transactions.unshift({
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "TOP_UP",
    amount: topAmount,
    title: "Instant Wallet Top-Up",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  res.json({ success: true, wallet: walletBalance });
});

// Real-time tracking Socket.IO simulation
interface SocketRouteState {
  coords: { lat: number; lng: number }[];
  progress: number;
  speed: number;
}

const activeTrackingRoutes = new Map<string, SocketRouteState>();

// Helper to interpolate along route path
function getCoordAlongRoute(route: { lat: number; lng: number }[], t: number) {
  if (!route || route.length === 0) return { lat: 0, lng: 0, bearing: 0 };
  if (route.length === 1) return { ...route[0], bearing: 0 };
  if (t <= 0) return { ...route[0], bearing: 0 };
  if (t >= 1) return { ...route[route.length - 1], bearing: 0 };

  const totalSegments = route.length - 1;
  const rawIndex = t * totalSegments;
  const index = Math.floor(rawIndex);
  const fraction = rawIndex - index;

  const startNode = route[index];
  const endNode = route[index + 1];

  const lat = startNode.lat + (endNode.lat - startNode.lat) * fraction;
  const lng = startNode.lng + (endNode.lng - startNode.lng) * fraction;

  const dy = endNode.lat - startNode.lat;
  const dx = Math.cos((startNode.lat * Math.PI) / 180) * (endNode.lng - startNode.lng);
  let bearing = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (bearing < 0) bearing += 360;

  return { lat, lng, bearing };
}

function setupSocketHandlers() {
  io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Client subscribes to tracking updates for a booking
    socket.on("subscribe_towing_route", (data: { bookingId: string; initialCoords?: { lat: number; lng: number }[] }) => {
      const { bookingId, initialCoords } = data;
      console.log(`Client subscribed to booking: ${bookingId}`);
      socket.join(bookingId);

      // Initialize simulation state if not exists
      if (!activeTrackingRoutes.has(bookingId) && initialCoords && initialCoords.length > 0) {
        activeTrackingRoutes.set(bookingId, {
          coords: initialCoords,
          progress: 0.1,
          speed: 45
        });
      }
    });

    // Client pushes actual Google Maps road polyline coordinate array to server
    socket.on("register_road_polyline", (data: { bookingId: string; coords: { lat: number; lng: number }[] }) => {
      const { bookingId, coords } = data;
      console.log(`Registered road polyline for booking ${bookingId} (${coords.length} coordinates)`);
      
      activeTrackingRoutes.set(bookingId, {
        coords,
        progress: 0.0,
        speed: 45
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });
}

// Periodic tracking update interval (runs every 1.5s)
setInterval(() => {
  if (!io) return;
  activeTrackingRoutes.forEach((state, bookingId) => {
    // Increment progress
    state.progress += 0.015;
    if (state.progress >= 1.0) {
      state.progress = 0.0; // Loop tracking back to start for demo flow
    }

    const { lat, lng, bearing } = getCoordAlongRoute(state.coords, state.progress);
    
    // Slight speed fluctuations
    const speedDelta = Math.floor(Math.random() * 7) - 3;
    state.speed = Math.max(15, Math.min(75, state.speed + speedDelta));

    const etaMins = Math.max(1, Math.round((1 - state.progress) * 12));

    // Broadcast tracking payload to subscribers in this booking room
    io.to(bookingId).emit("driver_location_update", {
      bookingId,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      bearing: Math.round(bearing),
      speedMph: state.speed,
      etaMins,
      progress: state.progress
    });
  });
}, 1500);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Intercept partner routes
    app.get(/^\/partner($|\/.*)/, async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let html = fs.readFileSync(path.resolve(__dirname, 'partner.html'), 'utf-8');
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });

    // Intercept admin routes
    app.get(/^\/admin($|\/.*)/, async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let html = fs.readFileSync(path.resolve(__dirname, 'admin.html'), 'utf-8');
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });

    app.use(vite.middlewares);

    // Fallback all other routes to index.html
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get(/^\/partner($|\/.*)/, (req, res) => {
      res.sendFile(path.join(distPath, 'partner.html'));
    });
    app.get(/^\/admin($|\/.*)/, (req, res) => {
      res.sendFile(path.join(distPath, 'admin.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`OMNIGO Server operational on http://0.0.0.0:${PORT}`);
  });

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  setupSocketHandlers();
}

startServer();
