import React from 'react';
import { Phone, Mail, MapPin, Star, Award } from 'lucide-react';
import { getAssetPath } from '../firebase';
import type { BusinessConfig } from '../data';

interface FooterProps {
  businessConfig: BusinessConfig;
}

export const Footer: React.FC<FooterProps> = ({ businessConfig }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Owner Profile Widget */}
          <div className="space-y-4 md:col-span-1 lg:col-span-1 text-left">
            <div className="flex items-center space-x-3">
              {/* Profile Photo */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                <img 
                  src={getAssetPath(businessConfig.profileUrl)} 
                  alt="Kaushindra Singh" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackText = document.createElement('span');
                      fallbackText.className = 'text-white text-xs font-bold font-sans';
                      fallbackText.innerText = 'KS';
                      parent.appendChild(fallbackText);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-white font-bold text-sm leading-tight">
                  {businessConfig.owner}
                </h4>
                <span className="text-brand-blue text-[10px] font-bold uppercase tracking-wider">
                  Lead HVAC & Electrician
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              "Certified contractor providing safety-focused home appliance repairs and electrical visits with 100% genuine spare parts."
            </p>

            <div className="flex flex-col space-y-1.5 text-[11px] font-semibold text-gray-300">
              <span className="flex items-center">
                <Award size={12} className="text-brand-blue mr-1.5 shrink-0" />
                10+ Years Experience
              </span>
              <span className="flex items-center">
                <Star size={12} className="text-yellow-500 mr-1.5 shrink-0" fill="currentColor" />
                4.9/5 Google Rating
              </span>
            </div>

            <div className="pt-1">
              <a 
                href={businessConfig.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Write a Google Review for KS Electrical"
                className="inline-flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <Star size={12} fill="currentColor" />
                <span>Review on Google</span>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="flex flex-col space-y-2.5 text-xs font-semibold">
              <li>
                <a 
                  href="/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Learn more about KS Electrical and AC Services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About us
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Read terms and conditions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & conditions
                </a>
              </li>
              <li>
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Read privacy policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a 
                  href="/privacy#anti-discrimination" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Read anti-discrimination policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Anti-discrimination policy
                </a>
              </li>
              <li>
                <a 
                  href="/contact?subject=careers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Join the KS Electrical team"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: For Customers */}
          <div className="space-y-4 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              For customers
            </h4>
            <ul className="flex flex-col space-y-2.5 text-xs font-semibold">
              <li>
                <a 
                  href="/reviews" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Read 1000+ verified customer reviews and ratings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  1000+ Customer reviews
                </a>
              </li>
              <li>
                <a 
                  href="/#services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Browse services categories near you"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Categories near you
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Contact our customer care"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a 
                  href="https://billing.kselectrical.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Open Billing Portal / Staff Portal"
                  className="inline-flex items-center space-x-1 text-brand-orange hover:text-white transition-all"
                >
                  <span className="w-1 h-1 bg-brand-orange rounded-full animate-pulse shrink-0" />
                  <span>Staff Portal / Billing</span>
                </a>
              </li>
            </ul>

            <div className="pt-2 border-t border-gray-800/60 space-y-2">
              <h5 className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Support Hotline</h5>
              <div className="flex flex-col space-y-1 text-xs">
                <a href={`tel:${businessConfig.contacts[0]}`} className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Phone size={10} className="text-brand-blue mr-1.5 shrink-0" />
                  <span>+91 {businessConfig.contacts[0]}</span>
                </a>
                <a href={`mailto:${businessConfig.email}`} className="text-gray-400 hover:text-white transition-colors flex items-center text-left">
                  <Mail size={10} className="text-brand-blue mr-1.5 shrink-0" />
                  <span className="truncate">{businessConfig.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: For Professionals */}
          <div className="space-y-4 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              For professionals
            </h4>
            <ul className="flex flex-col space-y-2.5 text-xs font-semibold">
              <li>
                <a 
                  href="/contact?subject=partner" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Register as an electrical professional partner"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Register as a professional
                </a>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-800/60 space-y-2.5">
              <h5 className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Service Coverage</h5>
              <div className="flex flex-col space-y-1.5 text-[11px] text-gray-400 font-medium leading-tight">
                <span className="flex items-start">
                  <MapPin size={11} className="text-brand-blue mt-0.5 mr-1.5 shrink-0" />
                  <span>Gaur City 1 & 2</span>
                </span>
                <span className="flex items-start">
                  <MapPin size={11} className="text-brand-blue mt-0.5 mr-1.5 shrink-0" />
                  <span>Noida Extension</span>
                </span>
                <span className="flex items-start">
                  <MapPin size={11} className="text-brand-blue mt-0.5 mr-1.5 shrink-0" />
                  <span>Ghaziabad Crossing</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Row */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-semibold select-none">
          <p className="mb-4 md:mb-0">
            © {currentYear} {businessConfig.name.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a 
              href={`http://${businessConfig.website}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors"
            >
              {businessConfig.website}
            </a>
            <span>|</span>
            <span>Owner supervised service guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
