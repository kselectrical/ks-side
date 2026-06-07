import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { BusinessConfig } from '../../data';
import { saveBusinessConfigToDb } from '../../firebase';

interface BrandingProps {
  businessConfig: BusinessConfig;
  onUpdateBusinessConfig: (config: BusinessConfig) => void;
}

export const Branding: React.FC<BrandingProps> = ({ businessConfig, onUpdateBusinessConfig }) => {
  const [brandName, setBrandName] = useState(businessConfig.name);
  const [brandTagline, setBrandTagline] = useState(businessConfig.tagline);
  const [brandOwner, setBrandOwner] = useState(businessConfig.owner);
  const [brandContact1, setBrandContact1] = useState(businessConfig.contacts[0] || '');
  const [brandContact2, setBrandContact2] = useState(businessConfig.contacts[1] || '');
  const [brandEmail, setBrandEmail] = useState(businessConfig.email);
  const [brandWebsite, setBrandWebsite] = useState(businessConfig.website);
  const [brandReviewLink, setBrandReviewLink] = useState(businessConfig.reviewLink);
  const [brandLogo, setBrandLogo] = useState(businessConfig.logoUrl);
  const [brandProfile, setBrandProfile] = useState(businessConfig.profileUrl);

  const handleBrandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: BusinessConfig = {
      name: brandName,
      tagline: brandTagline,
      owner: brandOwner,
      contacts: [brandContact1, brandContact2].filter(Boolean),
      email: brandEmail,
      website: brandWebsite,
      reviewLink: brandReviewLink,
      logoUrl: brandLogo,
      profileUrl: brandProfile,
      serviceAreas: businessConfig.serviceAreas
    };
    onUpdateBusinessConfig(updatedConfig);
    saveBusinessConfigToDb(updatedConfig);
    alert("Branding settings saved successfully and synced to website in real time!");
  };

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      <form onSubmit={handleBrandingSubmit} className="bg-white border border-gray-250 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <h3 className="font-extrabold text-gray-900 text-base leading-tight">Branding & Site Information Settings</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Customize company title, logo paths, contact details, and review badge links.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Company Name</label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Tagline Statement</label>
            <input
              type="text"
              required
              value={brandTagline}
              onChange={(e) => setBrandTagline(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Owner Name</label>
            <input
              type="text"
              required
              value={brandOwner}
              onChange={(e) => setBrandOwner(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Official Email Address</label>
            <input
              type="email"
              required
              value={brandEmail}
              onChange={(e) => setBrandEmail(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Contact Phone 1 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Primary Dispatch Contact (+91)</label>
            <input
              type="text"
              required
              value={brandContact1}
              onChange={(e) => setBrandContact1(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Contact Phone 2 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Backup Operator Contact (+91)</label>
            <input
              type="text"
              value={brandContact2}
              onChange={(e) => setBrandContact2(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Logo Path */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Branding Logo Path</label>
            <input
              type="text"
              required
              value={brandLogo}
              onChange={(e) => setBrandLogo(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Profile photo Path */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Owner Profile Photo Path</label>
            <input
              type="text"
              required
              value={brandProfile}
              onChange={(e) => setBrandProfile(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Website URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Official Web Domain URL</label>
            <input
              type="text"
              required
              value={brandWebsite}
              onChange={(e) => setBrandWebsite(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Google review link */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Google Business Profile Review Link</label>
            <input
              type="text"
              required
              value={brandReviewLink}
              onChange={(e) => setBrandReviewLink(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-150 select-none">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Save size={13} />
            <span>Save Branding Settings</span>
          </button>
        </div>
      </form>

    </div>
  );
};
export default Branding;
