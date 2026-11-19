import React from 'react';
import { Booking } from '../types';
import { OmnigoLogo } from './OmnigoLogo';
import { Download, Printer, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  booking,
  isOpen,
  onClose
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-2xl p-4 overflow-y-auto">
      <div className="w-full max-w-xl glass-modal rounded-3xl p-6 relative text-white space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <OmnigoLogo size="md" showText={true} showTagline={false} />
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 font-num">
                PAID RECEIPT
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-num mt-1">SDRS META RISE TECH PVT LTD • omnigomobility.com</p>
            <p className="text-[11px] text-gray-400 font-num">Invoice ID: INV-{booking.id}</p>
          </div>

          <div className="text-right">
            <p className="text-xs font-num text-gray-300">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
            <p className="text-[10px] font-num text-gray-400">GSTIN: 27AABCS9921D1Z0</p>
          </div>
        </div>

        {/* Invoice Details Body */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="block text-gray-400 font-bold uppercase mb-1">Customer Details</span>
              <p className="font-medium text-white">{booking.customerName}</p>
              <p className="text-gray-300 font-num">{booking.customerPhone}</p>
              <p className="text-gray-400">{booking.vehicleModel || "Vehicle Passenger Unit"}</p>
            </div>
            <div>
              <span className="block text-gray-400 font-bold uppercase mb-1">Dispatched Captain</span>
              <p className="font-medium text-white">{booking.driverName}</p>
              <p className="text-gray-300">{booking.driverVehicle}</p>
              <p className="text-gray-400 font-num">Plate: {booking.licensePlate}</p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
            <div>
              <span className="text-gray-400 font-bold uppercase block mb-1">Rescue Route</span>
              <p className="text-gray-200">📍 <strong>Pickup:</strong> {booking.pickupLocation}</p>
              <p className="text-gray-200">🏁 <strong>Dropoff:</strong> {booking.destination}</p>
            </div>
          </div>

          {/* Itemized Charges */}
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/10 text-gray-300 uppercase font-num">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200 font-num">
                <tr>
                  <td className="p-3">{booking.type} - Base Dispatch Fee</td>
                  <td className="p-3 text-right">₹{(booking.amount * 0.7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="p-3">GPS Mileage & Roadside Incident Clearing</td>
                  <td className="p-3 text-right">₹{(booking.amount * 0.3).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="p-3 text-emerald-400 font-semibold">OMNIGO Diamond Member Discount</td>
                  <td className="p-3 text-right text-emerald-400 font-semibold">-₹0.00 (Covered)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0A84FF]/10 rounded-2xl border border-[#0A84FF]/30">
            <span className="font-heading font-bold text-sm text-white">TOTAL AMOUNT PAID</span>
            <span className="text-2xl font-extrabold font-num text-[#00D4FF]">₹{booking.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Payment Verified</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
