import React, { useState, useEffect } from 'react';
import { Booking, WalletData } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { InvoiceModal } from '../components/InvoiceModal';
import { Truck, Wallet, ShieldCheck, Clock, MapPin, CreditCard, PlusCircle, AlertTriangle, FileText, Phone, CheckCircle, RefreshCw } from 'lucide-react';

interface CustomerDashboardViewProps {
  onOpenBookModal: () => void;
  onOpenSos: () => void;
  onOpenAi: () => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  onOpenBookModal,
  onOpenSos,
  onOpenAi
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('1000');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resB, resW] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/wallet')
      ]);
      const dataB = await resB.json();
      const dataW = await resW.json();
      setBookings(dataB.bookings || []);
      setWallet(dataW);
    } catch (e) {
      console.error("Failed loading customer data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: topUpAmount })
      });
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
        setIsTopUpOpen(false);
      }
    } catch (e) {
      console.error("Topup failed", e);
    }
  };

  const activeBooking = bookings.find((b) => b.status === 'EN_ROUTE' || b.status === 'SEARCHING_DRIVER');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Customer Header Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-white/10 bg-gradient-to-r from-[#081B33] via-[#0A2647] to-[#081B33]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Welcome back, Alex Rivera
            </h1>
            <span className="bg-[#10D98F]/20 text-[#10D98F] text-[10px] sm:text-xs font-bold font-num px-3 py-1 rounded-full border border-[#10D98F]/40">
              💎 DIAMOND MEMBER
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Registered Vehicle: <strong className="text-white">2024 Tesla Model Y Dual Motor</strong> (CA 9821-OM)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenBookModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#00D4FF] text-slate-950 font-extrabold text-sm shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Book Roadside Towing</span>
          </button>

          <button
            onClick={onOpenSos}
            className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg animate-pulse flex items-center space-x-1"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Mapbox Interactive Dispatch & Fleet Radar Map */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#10D98F] animate-ping"></span>
            <h3 className="font-heading font-bold text-xl text-white">
              {activeBooking ? 'Active Rescue Dispatch Tracker' : 'Mapbox Live Vehicle Radar & Dispatch Grid'}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs font-num">
            <span className="bg-[#0A84FF]/20 text-[#00D4FF] px-3 py-1 rounded-full border border-[#00D4FF]/40 font-bold">
              Mapbox SDK v3.4
            </span>
            {activeBooking && (
              <span className="text-xs text-[#00D4FF] font-bold">
                Booking #{activeBooking.id}
              </span>
            )}
          </div>
        </div>

        <InteractiveMap
          pickupLocation={activeBooking ? activeBooking.pickupLocation : "Charminar, Hyderabad"}
          destinationLocation={activeBooking ? activeBooking.destination : "Gachibowli IT Corridor, Hyderabad"}
          driverName={activeBooking ? activeBooking.driverName : "Marcus Vance (Ashok Leyland Dost Flatbed)"}
          etaMinutes={activeBooking ? activeBooking.etaMinutes : 9}
          statusText={activeBooking ? `Driver ${activeBooking.driverName} is en route to pickup` : "Captain Marcus Vance is on standby for dispatch"}
        />
      </div>

      {/* Grid: Wallet & Membership Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-[#00D4FF]" />
              <h3 className="font-heading font-bold text-lg text-white">OMNIGO Wallet Balance</h3>
            </div>
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#10D98F]/20 text-[#10D98F] border border-[#10D98F]/40 font-bold text-xs flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Top-Up</span>
            </button>
          </div>

          <div>
            <span className="text-4xl font-extrabold font-num text-white">₹{wallet?.credits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className="text-xs text-gray-400 font-num"> INR Available Credits</span>
          </div>

          {/* Transactions List */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <span className="text-[11px] text-gray-400 uppercase font-num font-bold block">Recent Activity</span>
            {wallet?.transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-xs py-1">
                <div>
                  <p className="font-medium text-white">{tx.title}</p>
                  <p className="text-[10px] text-gray-400 font-num">{tx.date}</p>
                </div>
                <span className={`font-num font-bold ${tx.amount > 0 ? 'text-[#10D98F]' : 'text-gray-300'}`}>
                  {tx.amount > 0 ? `+₹${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `-₹${Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Perks Overview */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#10D98F]" />
              <h3 className="font-heading font-bold text-lg text-white">Diamond Coverage Perks</h3>
            </div>
            <span className="text-xs text-[#00D4FF] font-num font-bold">Active Year-Round</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-num">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-gray-400 uppercase text-[10px]">Free Tow Allowance</span>
              <span className="font-bold text-white text-sm">Up to 150 Km / Incident</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-gray-400 uppercase text-[10px]">EV Mobile Charging</span>
              <span className="font-bold text-[#10D98F] text-sm">Unlimited Top-ups</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-gray-400 uppercase text-[10px]">Key Lockout Cover</span>
              <span className="font-bold text-white text-sm">Zero Deductible</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="block text-gray-400 uppercase text-[10px]">Concierge Hotline</span>
              <span className="font-bold text-[#00D4FF] text-sm">24/7 VIP Priority</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Bookings History Table */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xl text-white">Bookings & Invoice History</h3>
          <button onClick={fetchData} className="p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/10 text-gray-300 uppercase font-num">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Service Type</th>
                <th className="p-3">Route</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-right">Invoice Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-gray-200 font-num">
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-white/5">
                  <td className="p-3 font-bold text-white">{bk.id}</td>
                  <td className="p-3">{bk.type}</td>
                  <td className="p-3 max-w-xs truncate">{bk.pickupLocation} → {bk.destination}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10D98F]/20 text-[#10D98F]">
                      {bk.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">₹{bk.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedInvoiceBooking(bk)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#0A84FF] text-white font-bold transition-all flex items-center space-x-1 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm glass-card bg-[#081B33] border border-white/20 p-6 rounded-3xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Top Up OMNIGO Wallet</h3>
            <p className="text-xs text-gray-400">Select amount to instantly add credits to your wallet via Stripe/Razorpay.</p>

            <div className="grid grid-cols-3 gap-2 font-num">
              {['500', '1000', '2000'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl border text-sm font-bold ${
                    topUpAmount === amt ? 'bg-[#0A84FF] text-white border-[#0A84FF]' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUp}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#10D98F] text-slate-950 font-extrabold text-sm"
            >
              CONFIRM ADD ₹{parseFloat(topUpAmount).toLocaleString('en-IN')}
            </button>
            <button
              onClick={() => setIsTopUpOpen(false)}
              className="w-full text-xs text-gray-400 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
      />

    </div>
  );
};
