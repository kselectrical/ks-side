import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Data Protection Policies</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your address and profile details for booking dispatches." />
        <link rel="canonical" href="https://ks-demo.web.app/privacy-policy" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="max-w-3xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        <h1 className="text-gray-900 font-black text-3xl tracking-tight leading-none mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
          <p>We respect your privacy and are committed to protecting the personal data you share with our service platform. This policy explains our data management practices.</p>
          
          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">1. Information We Collect</h2>
            <p>When you book services or authenticate via Google Sign-In, we record your verified name, email address, profile avatar, service address, and connection contact. This is required exclusively to coordinate booking dispatches and invoice generation.</p>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">2. Data Security & Storage</h2>
            <p>Customer data is logged directly into our cloud database repository to enable persistent booking histories and invoice records. We use security controls to protect your data from unauthorized access or breaches.</p>
          </div>

          <div className="space-y-2 text-left">
            <h2 className="text-gray-800 font-extrabold text-sm uppercase tracking-wide">3. Sharing of Information</h2>
            <p>We do not sell, rent, or lease your personal data. We only share dispatch address and contact phone details with the certified technician assigned to handle your booking service request.</p>
          </div>
        </div>
      </section>
    </>
  );
};
