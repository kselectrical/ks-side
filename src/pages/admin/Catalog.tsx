import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, Image } from 'lucide-react';
import type { TechnicalService } from '../../types';
import { saveServicesToDb, getAssetPath } from '../../firebase';

interface CatalogProps {
  services: TechnicalService[];
  onUpdateServices: (updated: TechnicalService[]) => void;
}

const LOCAL_IMAGE_PRESETS = [
  { name: 'AC Service', path: '/ac_service.png' },
  { name: 'Electrician Safety', path: '/electrical_safety_service.png' },
  { name: 'Electric Switch', path: '/electric_switch.png' },
  { name: 'Ceiling Fan', path: '/fan_repair_service.png' },
  { name: 'Geyser Service', path: '/geyser_service.png' },
  { name: 'RO Purifier', path: '/ro_service.png' },
  { name: 'Washing Machine', path: '/washing_machine_service.png' },
  { name: 'Refrigerator', path: '/refrigerator_service.png' },
  { name: 'Microwave Oven', path: '/microwave_service.png' },
  { name: 'Tube Light', path: '/tube_light.jpg' }
];

export const Catalog: React.FC<CatalogProps> = ({ services, onUpdateServices }) => {
  // Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('AC Services');
  const [formSubcategory, setFormSubcategory] = useState('Service');
  const [formPrice, setFormPrice] = useState(0);
  const [formDesc, setFormDesc] = useState('');
  const [formImg, setFormImg] = useState('/ac_service.png');
  const [formWarranty, setFormWarranty] = useState('30 Days Warranty');

  const startEdit = (srv: TechnicalService) => {
    setEditingServiceId(srv.id);
    setIsAddingNew(false);
    setFormName(srv.name);
    setFormCategory(srv.category);
    setFormSubcategory(srv.subcategory);
    setFormPrice(srv.price);
    setFormDesc(srv.description);
    setFormImg(srv.imageUrl);
    setFormWarranty(srv.warranty);
  };

  const startAdd = () => {
    setEditingServiceId(null);
    setIsAddingNew(true);
    setFormName('');
    setFormCategory('AC Services');
    setFormSubcategory('Service');
    setFormPrice(199);
    setFormDesc('');
    setFormImg('/ac_service.png');
    setFormWarranty('30 Days Warranty');
  };

  const cancelForm = () => {
    setEditingServiceId(null);
    setIsAddingNew(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      const newService: TechnicalService = {
        id: 'srv-' + Math.floor(1000 + Math.random() * 9000),
        name: formName,
        code: 'NEW-' + Math.floor(100 + Math.random() * 900),
        category: formCategory,
        subcategory: formSubcategory,
        description: formDesc,
        price: Number(formPrice),
        imageUrl: formImg,
        warranty: formWarranty,
        duration: '45 mins',
        rating: '5.0 ★ (New)',
        iconName: 'Zap',
        specifications: [
          { label: 'Technician Skill', value: 'Certified Expert' },
          { label: 'Warranty Scope', value: formWarranty }
        ]
      };
      const updated = [...services, newService];
      onUpdateServices(updated);
      saveServicesToDb(updated);
    } else if (editingServiceId) {
      const updated = services.map(srv => {
        if (srv.id === editingServiceId) {
          return {
            ...srv,
            name: formName,
            category: formCategory,
            subcategory: formSubcategory,
            price: Number(formPrice),
            description: formDesc,
            imageUrl: formImg,
            warranty: formWarranty
          };
        }
        return srv;
      });
      onUpdateServices(updated);
      saveServicesToDb(updated);
    }
    cancelForm();
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to delete this service listing from the website?")) {
      const updated = services.filter(s => s.id !== id);
      onUpdateServices(updated);
      saveServicesToDb(updated);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Form Editor Overlay (Conditional Row) */}
      {(editingServiceId || isAddingNew) ? (
        <form onSubmit={handleFormSubmit} className="bg-white border border-gray-250 rounded-2xl p-5 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center space-x-1.5">
              <Edit3 size={15} className="text-brand-blue" />
              <span>{isAddingNew ? 'Create New Service Offering' : 'Edit Service Price & Details'}</span>
            </h3>
            <button 
              type="button" 
              onClick={cancelForm}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Service Title</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Split AC Condenser Repair"
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>

            {/* Pricing Tag */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Billing Rate (₹ Price)</label>
              <input
                type="number"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                placeholder="e.g. 399"
                className="w-full bg-white text-gray-800 text-xs font-black px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Major Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue transition-all"
              >
                <option value="AC Services">AC Services</option>
                <option value="Electrician Services">Electrician Services</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Home Installations">Home Installations</option>
              </select>
            </div>

            {/* Sub-Category Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Subcategory Label</label>
              <input
                type="text"
                required
                value={formSubcategory}
                onChange={(e) => setFormSubcategory(e.target.value)}
                placeholder="e.g. Fan / Wiring / Repair"
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Service Description Summary</label>
              <textarea
                required
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Detailed specifications to inform client about repair methods..."
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Service Photo Asset Choice */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block flex items-center space-x-1">
                <Image size={11} className="text-gray-400" />
                <span>Select Photo File Asset</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-1 select-none">
                {LOCAL_IMAGE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.path}
                    onClick={() => setFormImg(preset.path)}
                    className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer hover:border-brand-blue flex flex-col items-center justify-between ${
                      formImg === preset.path
                        ? 'bg-blue-50/30 border-brand-blue text-brand-blue ring-1 ring-blue-150'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                      <img src={getAssetPath(preset.path)} alt={preset.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-bold mt-1 truncate max-w-full leading-none block">{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue transition-all bg-white mt-1">
                <div className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 flex items-center">
                  Custom URL Path
                </div>
                <input
                  type="text"
                  required
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  placeholder="/ac_service.png"
                  className="flex-1 bg-white text-gray-800 text-xs font-semibold px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Warranty tag */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Warranty Period Statement</label>
              <input
                type="text"
                required
                value={formWarranty}
                onChange={(e) => setFormWarranty(e.target.value)}
                placeholder="e.g. 30 Days Warranty"
                className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2 select-none">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Save size={13} />
              <span>Save Listing</span>
            </button>
          </div>
        </form>
      ) : (
        /* Standard Top Button Bar */
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm select-none">
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm">Active Service Catalog</h3>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Control pricing, service summaries, and active offerings live on the home portal.</p>
          </div>
          <button
            type="button"
            onClick={startAdd}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2 px-3.5 text-xs font-black uppercase tracking-wider flex items-center space-x-1 transition-all shadow-sm cursor-pointer h-9"
          >
            <Plus size={14} />
            <span>Add New Service</span>
          </button>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                <th className="px-5 py-3.5">Image & Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Price</th>
                <th className="px-5 py-3.5">Warranty</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-3.5 flex items-center space-x-3 min-w-[280px]">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0 select-none">
                      <img src={getAssetPath(srv.imageUrl)} alt={srv.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-extrabold text-sm block leading-tight">{srv.name}</span>
                      <span className="text-[9px] text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded font-black tracking-wide uppercase inline-block mt-1 select-none">
                        {srv.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 min-w-[150px]">
                    <span className="text-gray-800 font-bold block">{srv.category}</span>
                    <span className="text-[10px] text-gray-450 font-semibold block mt-0.5">{srv.subcategory}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-black text-gray-950 text-sm min-w-[100px] select-none">
                    ₹{srv.price}
                  </td>
                  <td className="px-5 py-3.5 min-w-[150px] select-none">
                    <span className="inline-flex items-center text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-150">
                      {srv.warranty}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center min-w-[120px] select-none">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => startEdit(srv)}
                        className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:text-brand-blue hover:border-brand-blue bg-white shadow-sm transition-all cursor-pointer"
                        title="Edit listing details & price"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:text-red-650 hover:border-red-200 bg-white shadow-sm transition-all cursor-pointer"
                        title="Delete service offering"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Catalog;
