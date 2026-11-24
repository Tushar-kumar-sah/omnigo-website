import React from 'react';
import { OmnigoLogo } from '../components/OmnigoLogo';
import { 
  ShieldCheck, Lock, MapPin, CreditCard, ArrowLeft, 
  Mail, Building, Smartphone, FileText, UserCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface PrivacyPolicyViewProps {
  onBackToHome?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBackToHome }) => {
  const handleBack = () => {
    sounds.playBlip();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#081B33] text-white selection:bg-[#0A84FF]/30 selection:text-[#00D4FF] font-sans antialiased text-left relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#0A84FF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#00D4FF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-[#061426]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div 
          onClick={handleBack}
          className="cursor-pointer group flex items-center space-x-3 select-none"
        >
          <OmnigoLogo size="sm" showText={true} showTagline={false} />
        </div>

        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 relative z-10">
        
        {/* Header Hero */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10D98F]/15 border border-[#10D98F]/30 text-[#10D98F] text-xs font-bold font-num uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Policy & Legal Compliance</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Privacy Policy for OmniGo
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-num text-gray-400">
            <div>
              <span className="text-gray-500 font-semibold uppercase">Last Updated:</span>{' '}
              <strong className="text-white">November 24, 2026</strong>
            </div>
            <span>•</span>
            <div>
              <span className="text-gray-500 font-semibold uppercase">Effective Date:</span>{' '}
              <strong className="text-[#00D4FF]">August 1, 2026</strong>
            </div>
            <span>•</span>
            <div className="text-[#10D98F] font-semibold">
              ● OmniGo - User App
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed pt-2">
            Welcome to <strong>OmniGo</strong> ("we," "our," or "us"). OmniGo is an on-demand vehicle towing and emergency roadside assistance platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (<strong>OmniGo - User App</strong>) and associated services.
          </p>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed italic">
            By accessing or using OmniGo, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Section 1 */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/20 border border-[#0A84FF]/40 flex items-center justify-center text-[#00D4FF] font-bold font-num">
              1
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Information We Collect
            </h2>
          </div>

          {/* Sub A */}
          <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#0A84FF]/40">
            <h3 className="font-heading font-semibold text-base text-[#00D4FF]">
              A. Personal Information You Provide
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-white">Account Registration:</strong> When creating an account or logging in (via phone OTP or Google Sign-In), we collect your name, phone number, and email address.
              </li>
              <li>
                <strong className="text-white">Vehicle Information:</strong> Make, model, vehicle category (e.g. Hatchback, Sedan, SUV, Commercial), and registration plate number to assign the appropriate tow truck.
              </li>
              <li>
                <strong className="text-white">Support & Feedback:</strong> Communications, ratings, reviews, and support inquiries submitted through the app.
              </li>
            </ul>
          </div>

          {/* Sub B */}
          <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#10D98F]/40">
            <h3 className="font-heading font-semibold text-base text-[#10D98F] flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#10D98F]" />
              <span>B. Automatically Collected Information</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-white">Location Information (Crucial for Service):</strong> We collect your precise real-time geographic location (GPS and network-based) when the app is active in the foreground to pinpoint your exact breakdown or pickup location, compute driving distance, estimate fares accurately, and dispatch the nearest available rescue vehicle.
              </li>
              <li>
                <strong className="text-white">Device Information:</strong> Device model, operating system version, unique device identifiers, and crash logs to optimize app performance and reliability.
              </li>
            </ul>
          </div>

          {/* Sub C */}
          <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-cyan-400/40">
            <h3 className="font-heading font-semibold text-base text-cyan-300 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>C. Financial & Transaction Data</span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Payment Processing:</strong> When you pay online, payment transactions are securely handled by <strong className="text-white">Cashfree Payments India Private Limited</strong> (an RBI-authorized Payment Aggregator).
              </p>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300">
                OmniGo does <strong className="text-[#10D98F]">not</strong> store or process raw credit/debit card numbers, CVVs, or bank PINs on its servers. We only receive payment confirmation tokens, transaction IDs, payment methods (UPI, Card, NetBanking), and payment status (<code className="text-[#10D98F]">PAID</code> / <code className="text-amber-400">PENDING</code>).
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center text-[#00D4FF] font-bold font-num">
              2
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              How We Use Your Information
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-300">
            We use the collected information for the following specific purposes:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-white">Core Service Delivery:</strong> To locate your vehicle, calculate transparent upfront pricing, and dispatch towing and roadside assistance partners to your location.
            </li>
            <li>
              <strong className="text-white">Live GPS Tracking:</strong> To allow you to track the approaching rescue driver in real-time with live ETAs.
            </li>
            <li>
              <strong className="text-white">Payment & Invoicing:</strong> To generate digital receipts, compute distance-based fares, and settle service orders.
            </li>
            <li>
              <strong className="text-white">Customer Safety & SOS:</strong> To dispatch emergency rescue services to your exact coordinates when an emergency SOS alert is triggered.
            </li>
            <li>
              <strong className="text-white">Service Improvements:</strong> To diagnose application bugs, monitor uptime, and enhance UI responsiveness.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#10D98F]/20 border border-[#10D98F]/40 flex items-center justify-center text-[#10D98F] font-bold font-num">
              3
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              How We Share Your Information
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-300">
            We only share information necessary to fulfill your roadside assistance request:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-white">With Assigned Towing Drivers & Partners:</strong> When a rescue request is accepted, we share your first name, vehicle details, contact phone number, and pickup/drop-off coordinates so the partner can locate and assist you.
            </li>
            <li>
              <strong className="text-white">With Payment Service Providers:</strong> Secure payment data is transmitted directly to Cashfree Payments via encrypted SSL connections.
            </li>
            <li>
              <strong className="text-white">Legal & Regulatory Obligations:</strong> We may disclose your information if required to do so by applicable law, regulation, legal process, or governmental request.
            </li>
          </ul>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-[#10D98F]/30 text-xs sm:text-sm text-emerald-300 flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[#10D98F] shrink-0" />
            <div>
              <strong className="text-white font-bold">No Selling of Data:</strong> We do <strong>NOT</strong> sell, rent, or trade your personal information to third parties for advertising or commercial marketing purposes.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/20 border border-[#0A84FF]/40 flex items-center justify-center text-[#0A84FF] font-bold font-num">
              4
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Data Security
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            We implement industry-standard administrative, technical, and physical security measures to protect your personal information:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed list-disc list-inside">
            <li>
              All data transmission between the app and our backend servers (Supabase & Cashfree) is encrypted using <strong className="text-white">256-bit Transport Layer Security (TLS/SSL)</strong>.
            </li>
            <li>
              Sensitive credentials and API tokens are securely managed using cloud vault protocols.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-num">
              5
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Data Retention and Account Deletion
            </h2>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <li>
              We retain your personal data and booking history only for as long as necessary to provide services and comply with tax and legal requirements.
            </li>
            <li className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-1">Account & Data Deletion Rights:</strong>
              You have the right to request deletion of your account and all associated personal data at any time. You can initiate account deletion directly within the app under <strong className="text-[#00D4FF]">Settings → Account → Delete Account</strong>, or by emailing our privacy team at <a href="mailto:privacy@omnigo.in" className="text-[#10D98F] font-bold underline">privacy@omnigo.in</a> with your registered phone number. Your account and associated personal identifiers will be permanently removed within 30 days.
            </li>
          </ul>
        </section>

        {/* Section 6 & 7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-white font-heading font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-num">6</span>
              <h3>Children's Privacy</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              OmniGo does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18 years of age.
            </p>
          </section>

          <section className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-white font-heading font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-num">7</span>
              <h3>Changes to This Policy</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We may update our Privacy Policy periodically. We will notify you of any significant changes by posting the new Privacy Policy within the app and updating the "Last Updated" date at the top.
            </p>
          </section>
        </div>

        {/* Section 8: Contact Us */}
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-[#00D4FF]/30 space-y-4 bg-gradient-to-br from-[#061426] via-[#0A2647] to-[#061426]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center text-[#00D4FF] font-bold font-num">
              8
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Contact Us
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-300">
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Team at:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-num text-gray-400 uppercase font-bold">Email Inquiries</span>
              <a href="mailto:sdrstech@gmail.com" className="block text-xs sm:text-sm text-[#00D4FF] font-bold hover:underline truncate">
                sdrstech@gmail.com
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-num text-gray-400 uppercase font-bold">Developer Name</span>
              <div className="text-xs sm:text-sm text-white font-bold">
                Sdrs meta rise tech
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-num text-gray-400 uppercase font-bold">Platform</span>
              <div className="text-xs sm:text-sm text-[#10D98F] font-bold">
                OmniGo
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© 2026 OmniGo • Sdrs meta rise tech. All rights reserved.</p>
          <button
            onClick={handleBack}
            className="text-[#00D4FF] hover:underline flex items-center space-x-1"
          >
            <span>Return to OmniGo Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
