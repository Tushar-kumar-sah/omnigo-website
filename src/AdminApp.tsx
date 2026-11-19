import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AdminDashboardView } from './views/AdminDashboardView';
import { OmnigoLogo } from './components/OmnigoLogo';
import { ShieldAlert, LogOut, Lock, UserCheck, ShieldCheck } from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('ADMIN-OMNIGO-99');
  const [password, setPassword] = useState('••••••••••••');
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize Lenis smooth scroll
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    showNotification('Access granted. System telemetry operational.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050C14] text-white flex flex-col items-center justify-center p-4 selection:bg-[#10D98F]/30 selection:text-[#10D98F] relative overflow-hidden font-sans antialiased">
        {/* Cyberpunk grid background glow */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#10D98F]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-[140px]" />

        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <OmnigoLogo size="lg" showText={true} showTagline={false} />
            <div className="bg-[#10D98F]/15 text-[#10D98F] text-[10px] font-bold font-num px-3 py-1 rounded-full border border-[#10D98F]/30 tracking-widest uppercase">
              Admin Command Center
            </div>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Restricted system access. Authorized operations personnel only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 font-num uppercase mb-1">
                Command Station ID
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-[#10D98F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 font-num uppercase mb-1">
                Security Access Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-[#10D98F] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#10D98F] to-[#00D4FF] text-slate-950 font-extrabold text-xs tracking-wider transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>ENTER SECURE TERMINAL</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[10px] text-gray-500 font-num uppercase">SDRS META RISE TECH PVT LTD SECURE ACCESS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081B33] text-white selection:bg-[#10D98F]/30 selection:text-[#10D98F] font-sans antialiased flex flex-col justify-between">
      
      {/* Admin Custom Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#051326]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 select-none">
            <OmnigoLogo size="md" showText={true} showTagline={false} />
            <span className="hidden sm:inline-block bg-[#10D98F]/10 text-[#10D98F] text-[9px] font-bold px-2 py-0.5 rounded border border-[#10D98F]/30 uppercase tracking-widest font-num">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-[#10D98F]/10 px-3 py-1 rounded-xl border border-[#10D98F]/20">
              <span className="h-2 w-2 rounded-full bg-[#10D98F] animate-pulse" />
              <span className="text-xs text-gray-300 font-num">SYSTEM ONLINE (100%)</span>
            </div>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                showNotification('Terminal session closed.');
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 hover:border-red-500/80 text-xs text-red-400 hover:text-white transition-all shadow-md group font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Terminal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10D98F] text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl glow-emerald flex items-center space-x-2 animate-bounce">
          <span>⚡ {notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AdminDashboardView />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#051326] text-center text-xs text-gray-400">
        <p className="font-num">© 2026 OMNIGO Mobility Network — Admin Command Center. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
