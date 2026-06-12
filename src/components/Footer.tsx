import React from 'react';
import { Phone, Mail, MapPin, Star, Award, ShieldAlert } from 'lucide-react';
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
          
          {/* Owner Profile Widget */}
          <div className="space-y-4 md:col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 text-left">
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
                <h4 className="text-white font-bold text-base leading-tight">
                  {businessConfig.owner}
                </h4>
                <span className="text-brand-blue text-[11px] font-bold uppercase tracking-wider">
                  Lead HVAC & Electrical Contractor
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed text-left max-w-sm">
              "Providing transparent, certified, and safety-focused home appliance repairs and electrical installation visits across Gaur City, Noida, and Ghaziabad. We guarantee 100% genuine spare parts."
            </p>

            <div className="flex items-center space-x-4 text-xs font-semibold text-gray-300">
              <span className="flex items-center">
                <Award size={13} className="text-brand-blue mr-1.5" />
                10+ Years Experience
              </span>
              <span className="flex items-center">
                <Star size={13} className="text-yellow-500 mr-1.5" fill="currentColor" />
                4.9/5 Rating
              </span>
            </div>

            <div className="pt-2">
              <a 
                href={businessConfig.reviewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <Star size={14} fill="currentColor" />
                <span>Review Us on Google</span>
              </a>
            </div>
          </div>

          {/* Quick Support Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Secure Direct Lines
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs font-semibold">
              <a 
                href={`tel:${businessConfig.contacts[0]}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={13} className="text-brand-blue" />
                <span>+91 {businessConfig.contacts[0]}</span>
              </a>
              <a 
                href={`tel:${businessConfig.contacts[1]}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={13} className="text-brand-blue" />
                <span>+91 {businessConfig.contacts[1]}</span>
              </a>
              <a 
                href={`mailto:${businessConfig.email}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={13} className="text-brand-blue" />
                <span>{businessConfig.email}</span>
              </a>
              <a 
                href={businessConfig.reviewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-700 rounded px-2.5 py-1.5 bg-gray-950/30"
              >
                <Star size={13} className="text-yellow-500" fill="currentColor" />
                <span>Submit Feedback Review</span>
              </a>
              <a 
                href="http://ksbilling.lovestoblog.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-brand-orange hover:text-white transition-all border border-gray-800 hover:border-gray-700 rounded px-2.5 py-1.5 bg-brand-orange/5 hover:bg-brand-orange/15 font-bold"
              >
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse shrink-0" />
                <span>Staff Portal / Billing System</span>
              </a>
            </div>
          </div>

          {/* Location / Area Coverage */}
          <div className="space-y-4 text-left">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Service Area Scope
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-semibold">
              <span className="flex items-start space-x-2">
                <MapPin size={13} className="text-brand-blue mt-0.5 shrink-0" />
                <span>Gaur City 1 & Gaur City 2</span>
              </span>
              <span className="flex items-start space-x-2">
                <MapPin size={13} className="text-brand-blue mt-0.5 shrink-0" />
                <span>Noida Extension (Greater Noida West)</span>
              </span>
              <span className="flex items-start space-x-2">
                <MapPin size={13} className="text-brand-blue mt-0.5 shrink-0" />
                <span>Ghaziabad Crossing Republic</span>
              </span>
              <span className="flex items-start space-x-2">
                <ShieldAlert size={13} className="text-brand-blue mt-0.5 shrink-0" />
                <span>45-Min Emergency Visit Dispatch</span>
              </span>
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
