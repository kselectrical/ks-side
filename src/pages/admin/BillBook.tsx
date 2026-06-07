import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Printer } from 'lucide-react';
import { updateBookingStatusInCloud } from '../../firebase';
import type { BookingData } from '../../firebase';

interface BillBookProps {
  bookings: BookingData[];
  onUpdateBookings: (updated: BookingData[]) => void;
  handleGenerateInvoice: (booking: BookingData) => void;
}

export const BillBook: React.FC<BillBookProps> = ({
  bookings,
  onUpdateBookings,
  handleGenerateInvoice
}) => {
  const navigate = useNavigate();
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [billStatusFilter, setBillStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Cancelled'>('All');

  const handleStatusChange = async (bookingId: string, newStatus: 'Pending' | 'Completed' | 'Cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    onUpdateBookings(updated);
    await updateBookingStatusInCloud(bookingId, newStatus);
  };

  // Calculations
  const totalBilledVal = bookings
    .filter(b => b.status === 'Completed' || b.status === 'Pending')
    .reduce((sum, b) => sum + b.subtotal, 0);

  const pendingBillsCount = bookings.filter(b => b.status === 'Pending').length;

  const filteredBillbook = bookings.filter(b => {
    const q = billSearchQuery.toLowerCase().trim();
    const matchesQuery = q === '' ||
      b.id.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.address.toLowerCase().includes(q);
      
    const matchesStatus = billStatusFilter === 'All' || b.status === billStatusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 select-none">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 sm:p-4 flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm sm:text-base">₹</div>
          <div>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-wider block">Total Invoiced</span>
            <span className="text-gray-900 font-black text-sm sm:text-lg">₹{totalBilledVal}</span>
          </div>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 sm:p-4 flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center text-gray-500"><FileText size={16} /></div>
          <div>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-wider block">Total Invoices</span>
            <span className="text-gray-900 font-black text-sm sm:text-lg">{bookings.length} Bills</span>
          </div>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 sm:p-4 flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs sm:text-sm">!</div>
          <div>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-wider block">Pending Bills</span>
            <span className="text-gray-900 font-black text-sm sm:text-lg">{pendingBillsCount} Unpaid</span>
          </div>
        </div>
        <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 sm:p-4 flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-black text-xs sm:text-sm">✓</div>
          <div>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-wider block">Paid Invoices</span>
            <span className="text-gray-900 font-black text-sm sm:text-lg">{bookings.filter(b => b.status === 'Completed').length} Paid</span>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm flex items-center space-x-2">
            <FileText size={16} className="text-emerald-600 animate-pulse" />
            <span>Live Invoice Ledger (Bill Book)</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Generate, track, and download official PDF tax invoices for both online and walk-in/manual service clients.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/billbook/create')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer h-9 shrink-0 active:scale-95"
        >
          <Plus size={14} />
          <span>Create Manual Invoice</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Search Query */}
        <div className="flex-1 flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue transition-all bg-white w-full">
          <div className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-gray-400 flex items-center shrink-0">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={billSearchQuery}
            onChange={(e) => setBillSearchQuery(e.target.value)}
            placeholder="Search bills by ID, customer name, phone, or address..."
            className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44 shrink-0 flex items-center space-x-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Status:</label>
          <select
            value={billStatusFilter}
            onChange={(e) => setBillStatusFilter(e.target.value as any)}
            className="flex-1 bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Invoices</option>
            <option value="Completed">Paid / Completed</option>
            <option value="Pending">Unpaid / Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      {filteredBillbook.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 px-4 text-center shadow-sm select-none">
          <FileText size={44} className="text-gray-300 stroke-1 mx-auto" />
          <h3 className="text-gray-900 font-extrabold text-sm mt-3">No matching invoices found</h3>
          <p className="text-[10px] text-gray-455 mt-1 max-w-xs mx-auto font-medium">Verify your search queries or create a new manual invoice above.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                  <th className="px-5 py-3.5">Invoice ID</th>
                  <th className="px-5 py-3.5">Bill Date</th>
                  <th className="px-5 py-3.5">Client Information</th>
                  <th className="px-5 py-3.5">Billing Breakdowns</th>
                  <th className="px-5 py-3.5 text-right">Net Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-semibold">
                {filteredBillbook.map((b) => {
                  const base = Math.round(b.subtotal / 1.18);
                  const gst = b.subtotal - base;

                  return (
                    <tr key={b.id} className="hover:bg-gray-50/40 transition-colors">
                      {/* ID */}
                      <td className="px-5 py-4 font-black text-gray-950 select-none">
                        {b.id}
                      </td>
                      
                      {/* Date */}
                      <td className="px-5 py-4 select-none">
                        {new Date(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="text-[9px] text-gray-400 block font-medium mt-0.5">
                          {new Date(b.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 text-left">
                        <span className="text-gray-900 font-extrabold text-sm block">{b.customerName}</span>
                        <span className="text-gray-600 block text-[10px] mt-0.5">📞 +91 {b.phone}</span>
                        <span className="text-gray-450 font-medium text-[9px] block truncate max-w-[150px]">📍 {b.address}</span>
                      </td>

                      {/* Items & Brand tags */}
                      <td className="px-5 py-4">
                        <div className="space-y-1 max-w-[200px]">
                          {b.items.map((item, idx) => (
                            <div key={idx} className="flex items-center text-[9px] font-bold text-gray-600 bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5 w-max max-w-full">
                              <span className="truncate">{item.serviceName}</span>
                              {item.brand && <span className="text-[8px] bg-blue-50 text-brand-blue border border-blue-100 rounded px-1 ml-1 font-black shrink-0">{item.brand}</span>}
                              <span className="text-[8px] text-gray-450 font-bold ml-1.5 shrink-0">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Price and Tax summary */}
                      <td className="px-5 py-4 text-right select-none">
                        <span className="text-gray-950 font-black text-sm block">₹{b.subtotal}</span>
                        <span className="text-[9px] text-gray-400 block font-semibold mt-0.5">GST (18%): ₹{gst}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center select-none">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${
                          b.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : b.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {b.status === 'Completed' ? 'Paid' : b.status === 'Cancelled' ? 'Cancelled' : 'Unpaid'}
                        </span>
                      </td>

                      {/* Action - Download PDF (Green button) */}
                      <td className="px-5 py-4 text-center select-none">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleGenerateInvoice(b)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg flex items-center space-x-1 transition-all text-xs cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                            title="Download PDF Invoice"
                          >
                            <Printer size={12} />
                            <span>Download PDF</span>
                          </button>
                          
                          {b.status === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(b.id, 'Completed')}
                              className="px-2 py-1 bg-blue-50 text-brand-blue hover:bg-blue-100 border border-blue-100 rounded text-[9px] font-black uppercase cursor-pointer"
                              title="Mark as Paid"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default BillBook;
