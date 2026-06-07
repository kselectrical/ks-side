import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, ShieldCheck, Heart, Award } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Professional Doorstep Services</title>
        <meta name="description" content="Discover our story, values, and commitment to providing top-quality certified home repair and maintenance services." />
        <link rel="canonical" href="https://ks-demo.web.app/about" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <section className="max-w-4xl mx-auto px-6 py-12 text-left font-sans">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none mb-3">
            About Our Company
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed">
            Delivering trusted, certified, and hassle-free home services at your doorstep.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="space-y-4">
            <h2 className="text-gray-800 font-extrabold text-xl">Our Mission & Goal</h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              We strive to redefine home maintenance by delivering highly reliable, expert technical services. From air conditioning installations to RO filter replacements, electrical panel installations, and refrigerator maintenance, our qualified experts handle everything with efficiency and precision.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Our business is built on transparency, fair pricing, and absolute reliability. All repairs are covered under our official 30-Day Warranty program, giving you complete peace of mind.
            </p>
          </div>
          <div className="w-full h-64 rounded-2xl overflow-hidden shadow-dropdown bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center p-6 text-white text-center">
            <div>
              <Award size={48} className="mx-auto mb-4 animate-bounce" />
              <span className="font-black text-xl block leading-none">5+ Years of Trust</span>
              <span className="text-[10px] uppercase font-bold tracking-widest block mt-2 opacity-80">Serving 10,000+ Happy Customers</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-gray-800 font-black text-2xl text-center sm:text-left">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center"><ShieldCheck size={20} /></div>
              <h3 className="font-extrabold text-sm text-gray-900">Certified Experts</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">We only dispatch fully background-verified and expert technicians certified for specialized repair assignments.</p>
            </div>
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Shield size={20} /></div>
              <h3 className="font-extrabold text-sm text-gray-900">100% Transparency</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">No hidden charges. Clear, upfront itemized service rates are updated dynamically and shared prior to dispatch.</p>
            </div>
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><Heart size={20} /></div>
              <h3 className="font-extrabold text-sm text-gray-900">Customer Centricity</h3>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Dedicated support panels, custom slots booking, and instant invoice downloads make repairs incredibly simple.</p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};
