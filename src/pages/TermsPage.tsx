import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const TermsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | doorstep service Policy</title>
        <meta name="description" content="Read our terms and conditions for booking technicians, warranty eligibility, cancellations, and service liability terms." />
        <link rel="canonical" href="https://ks-demo.web.app/terms-and-conditions" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

      <section className="max-w-3xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        <h1 className="text-gray-900 font-black text-3xl tracking-tight leading-none mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
          <p>Welcome to our doorstep service portal. By booking services with our technicians, you agree to comply with the terms of service outlined below.</p>
          
          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">1. Service Booking and Dispatch</h2>
            <p>Our dispatch operators will assign certified experts based on the requested slot and location coverage. While we strive to maintain perfect schedule timings, minor variations may occur due to traffic or technical complexities on previous sites.</p>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">2. Pricing, Materials, and GST</h2>
            <p>All prices displayed in our active catalog are estimates based on standard repairs. Final billing rates are inclusive of GST (18%). Materials, spare parts, and custom copper tubings added during repairs are billed extra at actual cost.</p>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">3. 30-Day Service Warranty Policy</h2>
            <p>We provide a 30-day warranty coverage on all completed repairs. The warranty covers only the specific parts repaired or services booked. It does not cover secondary problems or third-party interventions within the 30-day window.</p>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">4. Cancellations and Rescheduling</h2>
            <p>Cancellations can be requested up to 2 hours before the service slot without charge. Late cancellations or empty site visits may incur a nominal visitation fee of ₹99 to compensate the technician's transit expenses.</p>
          </div>
        </div>
      </section>
    </>
  );
};
