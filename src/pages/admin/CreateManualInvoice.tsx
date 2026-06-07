import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, FileText } from 'lucide-react';
import type { TechnicalService } from '../../types';
import { saveInvoiceToCloud } from '../../firebase';
import type { BookingData } from '../../firebase';
import type { BusinessConfig } from '../../data';

interface CreateManualInvoiceProps {
  services: TechnicalService[];
  bookings: BookingData[];
  onUpdateBookings: (updated: BookingData[]) => void;
  businessConfig: BusinessConfig;
  handleGenerateInvoice: (booking: BookingData) => void;
}

export const CreateManualInvoice: React.FC<CreateManualInvoiceProps> = ({
  services,
  bookings,
  onUpdateBookings,
  businessConfig,
  handleGenerateInvoice
}) => {
  const navigate = useNavigate();

  // Form Inputs
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualLocation, setManualLocation] = useState(businessConfig.serviceAreas[0] || 'Delhi NCR');
  const [manualDateTime, setManualDateTime] = useState('');
  
  const [manualItems, setManualItems] = useState<{
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
  }[]>([]);

  // Item Selector Inputs
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedServiceQty, setSelectedServiceQty] = useState(1);
  const [selectedServiceBrand, setSelectedServiceBrand] = useState('Generic');

  // Custom Item Inputs
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  // Form Event Handlers
  const handleAddStandardService = () => {
    if (!selectedServiceId) {
      alert("Please select a service from the catalog first.");
      return;
    }
    const found = services.find(s => s.id === selectedServiceId);
    if (!found) return;

    const existingIdx = manualItems.findIndex(
      item => item.serviceId === found.id && item.brand === selectedServiceBrand
    );
    
    if (existingIdx >= 0) {
      const updatedItems = [...manualItems];
      updatedItems[existingIdx].quantity += Number(selectedServiceQty);
      setManualItems(updatedItems);
    } else {
      setManualItems([
        ...manualItems,
        {
          serviceId: found.id,
          serviceName: found.name,
          price: found.price,
          quantity: Number(selectedServiceQty),
          brand: selectedServiceBrand
        }
      ]);
    }

    // Reset standard service selectors
    setSelectedServiceId('');
    setSelectedServiceQty(1);
    setSelectedServiceBrand('Generic');
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) {
      alert("Please enter a name for the custom charge.");
      return;
    }
    const priceNum = Number(customItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    setManualItems([
      ...manualItems,
      {
        serviceId: 'custom-' + Date.now(),
        serviceName: customItemName,
        price: priceNum,
        quantity: Number(customItemQty),
        brand: 'Custom'
      }
    ]);

    // Reset custom item selectors
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
  };

  const handleRemoveManualItem = (index: number) => {
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (!manualPhone.trim()) {
      alert("Please enter customer phone.");
      return;
    }
    if (!manualAddress.trim()) {
      alert("Please enter customer address.");
      return;
    }
    if (manualItems.length === 0) {
      alert("Please add at least one item or service to the invoice.");
      return;
    }

    const subtotal = manualItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newBooking: BookingData = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      customerName: manualCustomerName,
      phone: manualPhone,
      address: manualAddress,
      selectedLocation: manualLocation,
      dateTime: manualDateTime || 'Instant Handover',
      items: manualItems.map(item => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        price: Number(item.price),
        quantity: Number(item.quantity),
        brand: item.brand
      })),
      subtotal: subtotal,
      status: 'Completed',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    onUpdateBookings(updated);
    await saveInvoiceToCloud(newBooking);

    alert(`Manual invoice ${newBooking.id} created successfully! Triggering PDF printout...`);

    // Trigger PDF download popup
    setTimeout(() => {
      handleGenerateInvoice(newBooking);
    }, 100);

    // Redirect back to bill book page
    navigate('/admin/billbook');
  };

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* Back button header */}
      <div className="flex items-center space-x-3 select-none">
        <button
          onClick={() => navigate('/admin/billbook')}
          className="p-2 bg-white hover:bg-gray-150 border border-gray-200 rounded-xl text-gray-650 transition-all cursor-pointer shadow-xs hover:text-gray-900 active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm">Create Manual Client Invoice</h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Generate tax invoice ledger records manually for walk-in or offline bookings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
          <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <FileText size={14} className="text-emerald-600" />
            <span>Invoice Information</span>
          </h4>
          <span className="text-[9px] font-black tracking-wider uppercase text-emerald-650 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 select-none">
            Tax Invoice Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Customer Name *</label>
            <input
              type="text"
              required
              value={manualCustomerName}
              onChange={(e) => setManualCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Phone Number (+91) *</label>
            <input
              type="text"
              required
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Coverage Zone / Location */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Coverage Zone *</label>
            <select
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            >
              {businessConfig.serviceAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Customer Service Address *</label>
            <textarea
              required
              rows={2}
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Detailed apartment number, street details..."
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>

          {/* Slot Time */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Schedule Slot / Date-Time</label>
            <input
              type="text"
              value={manualDateTime}
              onChange={(e) => setManualDateTime(e.target.value)}
              placeholder="e.g. Instant / Today (4 PM)"
              className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* LINE ITEMS BUILDER */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-1.5 select-none">Add Line Items & Charges</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Catalog Services selection */}
            <div className="space-y-3 pb-4 lg:pb-0">
              <span className="text-[10px] font-black text-gray-450 uppercase tracking-wider block select-none">Option A: Select From Active Catalog Service</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 block">Service Name</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs font-semibold px-2 py-1.5 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">-- Choose Catalog Service --</option>
                    {services.map(srv => (
                      <option key={srv.id} value={srv.id}>{srv.name} (₹{srv.price})</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 block">Select Brand</label>
                  <select
                    value={selectedServiceBrand}
                    onChange={(e) => setSelectedServiceBrand(e.target.value)}
                    className="w-full bg-white text-gray-800 text-xs font-semibold px-2 py-1.5 border border-gray-250 rounded-lg focus:outline-none"
                  >
                    <option value="Generic">Generic</option>
                    <option value="LG">LG</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Daikin">Daikin</option>
                    <option value="Voltas">Voltas</option>
                    <option value="Havells">Havells</option>
                    <option value="Custom Brand">Custom Brand</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-2">
                  <label className="text-[10px] font-bold text-gray-500 shrink-0">Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    value={selectedServiceQty}
                    onChange={(e) => setSelectedServiceQty(Number(e.target.value))}
                    className="w-16 bg-white text-gray-800 text-xs font-semibold px-2 py-1 border border-gray-250 rounded-lg focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddStandardService}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Add Catalog Service
                </button>
              </div>
            </div>

            {/* Custom Charges selection */}
            <div className="space-y-3 pt-4 lg:pt-0 lg:pl-6">
              <span className="text-[10px] font-black text-gray-450 uppercase tracking-wider block select-none">Option B: Add Custom Charge / Extra Spare Parts</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 block">Custom Item Name / Material</label>
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="e.g. Copper Pipe (Extra 3m)"
                    className="w-full bg-white text-gray-800 text-xs font-semibold px-2 py-1.5 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 block">Billing Price (₹ Rate)</label>
                  <input
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    placeholder="e.g. 750"
                    className="w-full bg-white text-gray-800 text-xs font-semibold px-2 py-1.5 border border-gray-250 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-2">
                  <label className="text-[10px] font-bold text-gray-500 shrink-0">Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    value={customItemQty}
                    onChange={(e) => setCustomItemQty(Number(e.target.value))}
                    className="w-16 bg-white text-gray-800 text-xs font-semibold px-2 py-1 border border-gray-250 rounded-lg focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Add Custom Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ADDED ITEMS MATRIX */}
        <div className="border border-gray-250 rounded-xl overflow-hidden bg-white">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-black text-gray-400 uppercase tracking-wider select-none">
                <th className="px-4 py-2.5">S.No</th>
                <th className="px-4 py-2.5">Item / Service Details</th>
                <th className="px-4 py-2.5 text-center">Qty</th>
                <th className="px-4 py-2.5 text-right">Rate</th>
                <th className="px-4 py-2.5 text-right">Total Price</th>
                <th className="px-4 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-[11px] font-semibold text-gray-700">
              {manualItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic font-medium select-none">
                    No services or items added to invoice yet. Add standard or custom items above.
                  </td>
                </tr>
              ) : (
                manualItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-55 transition-colors">
                    <td className="px-4 py-2.5 text-gray-450 font-bold select-none">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-extrabold text-gray-900 block">{item.serviceName}</span>
                      {item.brand && (
                        <span className="text-[8px] bg-blue-50 text-brand-blue px-1.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wide inline-block mt-0.5 select-none">
                          {item.brand}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-right">₹{item.price}</td>
                    <td className="px-4 py-2.5 text-right font-black text-gray-900">₹{item.price * item.quantity}</td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveManualItem(idx)}
                        className="text-red-500 hover:text-red-750 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Totals Computation Breakdown */}
          {manualItems.length > 0 && (() => {
            const subtotal = manualItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const base = Math.round(subtotal / 1.18);
            const gst = subtotal - base;
            const cgst = Math.round(gst / 2);
            const sgst = gst - cgst;

            return (
              <div className="bg-gray-50 border-t border-gray-250 p-4 flex justify-end select-none">
                <div className="w-64 space-y-1.5 text-xs text-left font-bold text-gray-550">
                  <div className="flex justify-between">
                    <span>Total Excl. GST:</span>
                    <span className="text-gray-900 font-extrabold">₹{base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span className="text-gray-900 font-extrabold">₹{cgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span className="text-gray-900 font-extrabold">₹{sgst}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-1.5 text-sm font-black text-emerald-600">
                    <span>Grand Invoice Total:</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-150 select-none">
          <button
            type="button"
            onClick={() => navigate('/admin/billbook')}
            className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Generate & Download Invoice
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateManualInvoice;
