# OMNIGO — Next-Gen AI Roadside & Towing Dispatch Platform

> **Every Journey. Every Move. Every Rescue.**  
> Next-generation intelligent mobility assistance, on-demand towing, mobile EV fast charging, battery diagnostics, and commercial fleet recovery.

---

## ⚡ Highlights & Key Features

- **Autonomous Roadside Dispatch**: Sub-8 minute average emergency dispatch across major transit corridors.
- **AI Cyber Diagnostics HUD**: Acoustic engine & vehicle symptom scanner decoding automotive trouble codes (`DTC-P0562`, `TPMS-C0077`, `BMS-P0A7F`, etc.) with 1-click rescue booking.
- **Interactive Live Fare Calculator**: Dynamic distance slider (2 km – 120 km), multi-vehicle classification, priority rush toggles, and itemized transparent pricing.
- **Live Rescue Command HUD**: 5-stage real-time mission pipeline, animated Cyber Vector Radar Map, interactive VoIP call simulator, and in-app captain messaging.
- **Tactile Web Audio Synthesizer**: Pure Web Audio API futuristic sound effects (clicks, scans, warp chimes, and SOS alerts) with toggle controls.
- **Native-App Mobile Experience**: Bottom navigation bar, bottom-sheet responsive modals, and zero-overflow touch optimization.
- **Multi-Role Cockpit**:
  - 🌐 **Public Website** (Guest booking & service catalog)
  - 👤 **Customer Fleet Pass Portal** (Active bookings, invoices & wallet)
  - 🚛 **Tow Captain Cockpit** (Job dispatch, telemetry & OTP verification)
  - 🛡️ **Admin Incident Command Center** (SLA metrics, partner compliance & fleet audit)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion, GSAP, Lenis Smooth Scroll
- **Mapping & Telemetry**: Google Maps JavaScript API, Cyber Vector Radar Engine, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, Google GenAI SDK (Gemini 3.6 Flash)
- **Tooling**: Vite 6, TSX, esbuild

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Tushar-kumar-sah/omnigo-website.git
cd omnigo-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_key_here"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Run the development server
```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 📄 License & Compliance

Developed by **SDRS META RISE TECH PVT LTD** • [omnigomobility.com](https://omnigomobility.com)  
All rights reserved © 2026.
