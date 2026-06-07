import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I book a doorstep technician?",
      a: "Simply browse our catalog from the homepage, click 'Add to Cart' next to the desired service details, specify your appliance brand, and proceed to book. Select your slot and location details to complete your order."
    },
    {
      q: "Is there a visiting or inspection charge?",
      a: "Inspection is completely free when you book service repairs with us. In case of inspection only with no repairs selected, a basic visitation charge of ₹99 may apply."
    },
    {
      q: "What is your repair warranty period?",
      a: "We offer a standard 30-Day service warranty on all electrical, plumbing, and appliance repair jobs. Any issues arising during this warranty slot are fixed free of charge."
    },
    {
      q: "How can I pay for the services?",
      a: "You can pay the technician directly via cash, credit cards, or UPI apps (Paytm, GPay, PhonePe). The invoice generated in the system will display payment details."
    },
    {
      q: "Can I cancel or reschedule my appointment?",
      a: "Yes, you can cancel or reschedule your booking slot up to 2 hours before the scheduled appointment by calling our helpline operator dispatch."
    }
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Compile JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Doorstep Help Center</title>
        <meta name="description" content="Find answers to common questions about doorstep service slot bookings, visitation fees, 30-day warranty coverage, and UPI payments." />
        <link rel="canonical" href="https://ks-demo.web.app/faq" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'FAQs' }]} />

      <section className="max-w-3xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed">
            Quick answers to help you navigate our services, booking details, and warranty terms.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5 select-none">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Header Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 font-bold text-gray-900 text-xs sm:text-sm hover:bg-gray-50/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <HelpCircle size={16} className="text-brand-blue shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                </button>

                {/* Content Panel */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 bg-gray-50/20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>
    </>
  );
};
