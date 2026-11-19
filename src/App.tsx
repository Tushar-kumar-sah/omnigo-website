import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AppRole } from './types';
import { RoleBar } from './components/RoleBar';
import { Header } from './components/Header';
import { LiveTelemetryTicker } from './components/LiveTelemetryTicker';
import { LiveDispatchTrackerModal } from './components/LiveDispatchTrackerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AiAssistantModal } from './components/AiAssistantModal';
import { QuickBookingModal } from './components/QuickBookingModal';
import { EmergencySosModal } from './components/EmergencySosModal';
import { HomeView } from './views/HomeView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { PartnerDashboardView } from './views/PartnerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AuthModal } from './views/AuthModal';
import { OmniMascotWidget } from './components/OmniMascotWidget';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppRole>('GUEST');
  const [activeTab, setActiveTab] = useState('home');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [selectedService, setSelectedService] = useState('TOW_FLATBED');
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize Lenis smooth scrolling engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenBookModal = (serviceId?: string) => {
    sounds.playBlip();
    if (serviceId) setSelectedService(serviceId);
    setIsBookModalOpen(true);
  };

  const handleBookingSuccess = (booking: any) => {
    setActiveBooking(booking);
    setIsLiveTrackerOpen(true);
    showNotification(`Dispatch confirmed! Booking #${booking.id} assigned to ${booking.driverName}.`);
  };

  const handleSosDispatched = (emergencyBooking: any) => {
    setActiveBooking(emergencyBooking);
    setIsLiveTrackerOpen(true);
    showNotification(`EMERGENCY SOS: Priority Rescue Dispatched!`);
  };

  const handleRoleChange = (role: AppRole) => {
    sounds.playBlip();
    setCurrentRole(role);
    showNotification(`Switched portal view to ${role}`);
  };

  return (
    <div className="min-h-screen bg-[#081B33] text-white selection:bg-[#0A84FF]/30 selection:text-[#00D4FF] font-sans antialiased flex flex-col justify-between pb-16 lg:pb-0">
      
      {/* Top Universal Role Switcher Bar */}
      <RoleBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenSos={() => {
          sounds.playSosSiren();
          setIsSosModalOpen(true);
        }}
        onOpenAi={() => {
          sounds.playBlip();
          setIsAiModalOpen(true);
        }}
      />

      {/* Main Header & Live Radar Ticker */}
      {currentRole === 'GUEST' && (
        <>
          <Header
            currentRole={currentRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenBookModal={() => handleOpenBookModal()}
            onOpenAi={() => setIsAiModalOpen(true)}
            onOpenSos={() => setIsSosModalOpen(true)}
            onOpenTracker={() => setIsLiveTrackerOpen(true)}
            onRoleChange={handleRoleChange}
          />
          <LiveTelemetryTicker
            onOpenLiveTracker={() => setIsLiveTrackerOpen(true)}
            onOpenSos={() => setIsSosModalOpen(true)}
          />
        </>
      )}

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-[#0A84FF] via-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl glow-blue flex items-center space-x-2 animate-bounce">
          <span>⚡ {notification}</span>
        </div>
      )}

      {/* Multi-Role View Content Renderer */}
      <main className="flex-1">
        {currentRole === 'GUEST' && (
          <HomeView
            onOpenBookModal={handleOpenBookModal}
            onOpenAi={() => setIsAiModalOpen(true)}
            onOpenSos={() => setIsSosModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {currentRole === 'CUSTOMER' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-num font-bold text-[#00D4FF]">CUSTOMER FLEET PASS PORTAL</span>
              <button
                onClick={() => handleRoleChange('GUEST')}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200"
              >
                ← Return to Public Website
              </button>
            </div>
            <CustomerDashboardView
              onOpenBookModal={() => handleOpenBookModal()}
              onOpenSos={() => setIsSosModalOpen(true)}
              onOpenAi={() => setIsAiModalOpen(true)}
            />
          </div>
        )}

        {currentRole === 'PARTNER' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-num font-bold text-[#10D98F]">COMMERCIAL TOW CAPTAIN DISPATCH COCKPIT</span>
              <button
                onClick={() => handleRoleChange('GUEST')}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200"
              >
                ← Return to Public Website
              </button>
            </div>
            <PartnerDashboardView />
          </div>
        )}

        {currentRole === 'ADMIN' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-num font-bold text-amber-400">GLOBAL INCIDENT & TELEMETRY COMMAND CENTER</span>
              <button
                onClick={() => handleRoleChange('GUEST')}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200"
              >
                ← Return to Public Website
              </button>
            </div>
            <AdminDashboardView />
          </div>
        )}
      </main>

      {/* Modals & Live Drawers */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectBookingType={(srv) => handleOpenBookModal(srv)}
      />

      <QuickBookingModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preSelectedService={selectedService}
        onBookingSuccess={handleBookingSuccess}
      />

      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onSosDispatched={handleSosDispatched}
      />

      <LiveDispatchTrackerModal
        isOpen={isLiveTrackerOpen}
        onClose={() => setIsLiveTrackerOpen(false)}
        booking={activeBooking}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginRoleSuccess={(role) => {
          setCurrentRole(role);
          showNotification(`Authenticated successfully as ${role}`);
        }}
      />

      {/* Persistent Animated OMNI-AI Mascot Widget */}
      <OmniMascotWidget
        onOpenAi={() => {
          sounds.playBlip();
          setIsAiModalOpen(true);
        }}
        onOpenSos={() => {
          sounds.playSosSiren();
          setIsSosModalOpen(true);
        }}
        onOpenBookModal={(srv) => handleOpenBookModal(srv)}
      />

      {/* Native App-Style Mobile Bottom Navigation Bar */}
      {currentRole === 'GUEST' && (
        <MobileBottomNav
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const el = document.getElementById(tab);
              if (el) {
                const yOffset = -100;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          }}
          onOpenBookModal={() => handleOpenBookModal()}
          onOpenAi={() => setIsAiModalOpen(true)}
          onOpenSos={() => setIsSosModalOpen(true)}
          onOpenTracker={() => setIsLiveTrackerOpen(true)}
        />
      )}

    </div>
  );
}
