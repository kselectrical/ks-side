import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { BusinessConfig } from '../data';

interface ContactPageProps {
  businessConfig: BusinessConfig;
}

export const ContactPage: React.FC<ContactPageProps> = ({ businessConfig }) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formName}! Your query has been logged. Our dispatch operator will call you back shortly.`);
    setFormName('');
    setFormEmail('');
    setFormMessage('');
  };

  // Compile JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessConfig.name,
    "image": businessConfig.logoUrl,
    "telephone": `+91-${businessConfig.contacts[0]}`,
    "email": businessConfig.email,
    "url": businessConfig.website,
    "priceRange": "₹49 - ₹2500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gaur City 1, Greater Noida West",
      "addressLocality": "Noida Extension",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "areaServed": businessConfig.serviceAreas
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | helpline & Service Dispatch Centers</title>
        <meta name="description" content={`Connect with ${businessConfig.name} operators. Call +91-${businessConfig.contacts[0]} or log service dispatch queries.`} />
        <link rel="canonical" href="https://ks-demo.web.app/contact" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <section className="max-w-4xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        
        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none mb-3">
            Contact Support & Dispatch
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed">
            Need urgent technicians or customized service pricing? Write to us or call our operators directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Info Side */}
          <div className="space-y-6">
            <h2 className="text-gray-800 font-extrabold text-xl mb-4">Official Channels</h2>
            
            <div className="space-y-4">
              
              {/* Phone cards */}
              <div className="flex items-start space-x-3.5 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Helpline Dispatch</span>
                  <a href={`tel:${businessConfig.contacts[0]}`} className="text-gray-900 font-extrabold text-sm sm:text-base hover:text-brand-blue block mt-0.5">
                    +91 {businessConfig.contacts[0]}
                  </a>
                  {businessConfig.contacts[1] && (
                    <a href={`tel:${businessConfig.contacts[1]}`} className="text-gray-900 font-extrabold text-sm sm:text-base hover:text-brand-blue block mt-0.5">
                      +91 {businessConfig.contacts[1]}
                    </a>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Official Mail</span>
                  <a href={`mailto:${businessConfig.email}`} className="text-gray-900 font-extrabold text-sm sm:text-base hover:text-brand-blue block mt-0.5 truncate">
                    {businessConfig.email}
                  </a>
                </div>
              </div>

              {/* Head Office */}
              <div className="flex items-start space-x-3.5 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Service Coverage Zone</span>
                  <span className="text-gray-900 font-extrabold text-sm block mt-0.5">
                    Noida Extension, Gurgaon, Delhi NCR, India
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold block mt-1 leading-normal">
                    Servicing over 10 zones dynamically with expert dispatch teams.
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white border border-gray-250 rounded-2xl p-6 shadow-sm">
            <h2 className="text-gray-800 font-extrabold text-lg mb-4">Request Callback</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh Singh"
                  className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Explain Requirement</label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Explain service required, appliance details, or bulk booking requests..."
                  className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Send size={13} />
                <span>Submit Query</span>
              </button>
            </form>
          </div>

        </div>

      </section>
    </>
  );
};
