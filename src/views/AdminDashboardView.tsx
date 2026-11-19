import React, { useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { LayoutDashboard, Users, Truck, DollarSign, Activity, AlertTriangle, ShieldCheck, Search, Filter, RefreshCw } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CUSTOMERS' | 'PARTNERS' | 'TICKETS'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  const mockCustomers = [
    { id: "CUST-101", name: "Alex Rivera", email: "alex@tesla.com", tier: "Diamond", totalRescues: 4, spent: "₹51,800.00", status: "VERIFIED" },
    { id: "CUST-102", name: "Samantha Hayes", email: "sam@uber.com", tier: "Fleet Corporate", totalRescues: 18, spent: "₹2,38,000.00", status: "VERIFIED" },
    { id: "CUST-103", name: "Michael Chang", email: "m.chang@gmail.com", tier: "Essential", totalRescues: 1, spent: "₹12,100.00", status: "VERIFIED" }
  ];

  const mockPartners = [
    { id: "PTR-801", name: "Marcus Vance", vehicle: "Ashok Leyland Dost Flatbed", rating: 4.98, tripsToday: 6, earningsToday: "₹28,500.00", status: "ON_JOB" },
    { id: "PTR-802", name: "Elena Rostova", vehicle: "Mahindra Supro PowerVan", rating: 5.0, tripsToday: 8, earningsToday: "₹40,200.00", status: "AVAILABLE" },
    { id: "PTR-803", name: "David Miller", vehicle: "Heavy Winch Recovery Truck", rating: 4.92, tripsToday: 3, earningsToday: "₹24,300.00", status: "AVAILABLE" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-white/10 bg-gradient-to-r from-[#081B33] via-[#0A2647] to-[#081B33]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              OMNIGO Command Center
            </h1>
            <span className="bg-[#10D98F]/20 text-[#10D98F] text-[10px] sm:text-xs font-bold font-num px-3 py-1 rounded-full border border-[#10D98F]/40">
              SYSTEM HEALTH 100%
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Global Dispatch Telemetry, Operator Compliance & Revenue Analytics
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-semibold max-w-full overflow-x-auto custom-scrollbar whitespace-nowrap shrink-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${activeTab === 'OVERVIEW' ? 'bg-[#0A84FF] text-white shadow' : 'text-gray-400'}`}
          >
            Overview & Live Map
          </button>
          <button
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${activeTab === 'CUSTOMERS' ? 'bg-[#00D4FF] text-slate-950 font-bold shadow' : 'text-gray-400'}`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('PARTNERS')}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${activeTab === 'PARTNERS' ? 'bg-[#10D98F] text-slate-950 font-bold shadow' : 'text-gray-400'}`}
          >
            Partners
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-num">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Gross Monthly Revenue</span>
          <div className="text-3xl font-extrabold text-[#10D98F]">₹1,24,10,000.00</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Active Tow Trucks</span>
          <div className="text-3xl font-extrabold text-white">4,810 Units</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Avg Network SLA</span>
          <div className="text-3xl font-extrabold text-[#00D4FF]">7.8 Mins</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Active Incidents</span>
          <div className="text-3xl font-extrabold text-amber-400">12 Live</div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white">Live Global Dispatch Radar Map</h3>
            <span className="text-xs text-[#00D4FF] font-num font-bold">● Automatic Telemetry Sync</span>
          </div>

          <InteractiveMap
            pickupLocation="Charminar, Hyderabad (Incident #12)"
            destinationLocation="Gachibowli IT Corridor"
            driverName="Marcus Vance (Flatbed #04)"
            etaMinutes={6}
            statusText="Dispatch Command Monitoring Active Incident #12"
          />
        </div>
      )}

      {activeTab === 'CUSTOMERS' && (
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white">Registered Customer Accounts</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-num">
              <thead className="bg-white/10 text-gray-300 uppercase">
                <tr>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Name & Email</th>
                  <th className="p-3">Membership Tier</th>
                  <th className="p-3">Total Rescues</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200">
                {mockCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{c.id}</td>
                    <td className="p-3 font-medium">{c.name} <span className="text-gray-400 font-normal">({c.email})</span></td>
                    <td className="p-3 font-bold text-[#00D4FF]">{c.tier}</td>
                    <td className="p-3">{c.totalRescues}</td>
                    <td className="p-3 font-bold text-white">{c.spent}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-[#10D98F]/20 text-[#10D98F] font-bold text-[10px]">{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'PARTNERS' && (
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-xl text-white">Certified Tow Operators & Fleet Partners</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-num">
              <thead className="bg-white/10 text-gray-300 uppercase">
                <tr>
                  <th className="p-3">Operator ID</th>
                  <th className="p-3">Driver Name</th>
                  <th className="p-3">Vehicle Assigned</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Today's Earnings</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200">
                {mockPartners.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{p.id}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.vehicle}</td>
                    <td className="p-3 font-bold text-amber-400">★ {p.rating}</td>
                    <td className="p-3 font-bold text-[#10D98F]">{p.earningsToday}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'ON_JOB' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#10D98F]/20 text-[#10D98F]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
