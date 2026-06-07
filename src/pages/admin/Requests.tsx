import React from 'react';
import { DollarSign, ShoppingBag, ShieldCheck } from 'lucide-react';
import { updateBookingStatusInCloud } from '../../firebase';
import type { BookingData } from '../../firebase';

interface RequestsProps {
  bookings: BookingData[];
  onUpdateBookings: (updated: BookingData[]) => void;
  handleGenerateInvoice: (booking: BookingData) => void;
}

export const Requests: React.FC<RequestsProps> = ({
  bookings,
  onUpdateBookings,
  handleGenerateInvoice
}) => {

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

  // Stats Calculations
  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.subtotal, 0);

  const successRate = bookings.length > 0
    ? Math.round((bookings.filter(b => b.status === 'Completed').length / bookings.length) * 100)
    : 100;

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* Top Metric Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left select-none shadow-sm shrink-0">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center"><DollarSign size={18} /></div>
          <div>
            <span className="text-[9px] text-gray-450 font-black uppercase tracking-wider block">Completed Revenue</span>
            <span className="text-gray-900 font-black text-base">₹{totalRevenue}</span>
          </div>
        </div>
        <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center"><ShoppingBag size={18} /></div>
          <div>
            <span className="text-[9px] text-gray-450 font-black uppercase tracking-wider block">Total Bookings</span>
            <span className="text-gray-900 font-black text-base">{bookings.length} orders</span>
          </div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><ShieldCheck size={18} /></div>
          <div>
            <span className="text-[9px] text-gray-450 font-black uppercase tracking-wider block">Success Rate</span>
            <span className="text-gray-900 font-black text-base">{successRate}%</span>
          </div>
        </div>
      </div>

      {/* Requests table */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 px-4 text-center shadow-sm select-none">
          <ShoppingBag size={44} className="text-gray-300 stroke-1 mx-auto" />
          <h3 className="text-gray-900 font-extrabold text-sm mt-3">No bookings received yet</h3>
          <p className="text-[10px] text-gray-455 mt-1 max-w-xs mx-auto font-medium">When customers make doorstep service requests, their detailed invoices will synchronize here live.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                  <th className="px-5 py-3.5">Booking / Date</th>
                  <th className="px-5 py-3.5">Customer details</th>
                  <th className="px-5 py-3.5">Services ordered</th>
                  <th className="px-5 py-3.5 text-right">Invoice Sum</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    {/* Booking ID */}
                    <td className="px-5 py-3.5 text-left min-w-[130px] select-none">
                      <span className="text-gray-950 font-black block">{booking.id}</span>
                      <span className="text-[9px] text-gray-455 font-bold block mt-1">
                        {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3.5 text-left min-w-[200px]">
                      <span className="text-gray-900 font-extrabold block text-sm">{booking.customerName}</span>
                      <span className="text-gray-655 font-bold block mt-0.5">📞 +91 {booking.phone}</span>
                      <p className="text-[10px] text-gray-400 font-medium leading-normal mt-1 max-w-[180px]">
                        📍 {booking.address}
                      </p>
                    </td>

                    {/* Services */}
                    <td className="px-5 py-3.5 text-left min-w-[220px]">
                      <div className="space-y-1">
                        {booking.items.map((item, idx) => (
                          <div key={idx} className="flex items-center text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5 w-max max-w-full">
                            <span className="truncate">{item.serviceName}</span>
                            {item.brand && <span className="text-[8px] bg-blue-50 text-brand-blue border border-blue-100 rounded px-1 ml-1 font-black shrink-0">{item.brand}</span>}
                            <span className="text-[9px] text-gray-450 font-black ml-1.5 shrink-0">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold mt-1.5 block leading-none">
                        Schedule: <span className="text-gray-700">{booking.dateTime}</span>
                      </div>
                    </td>

                    {/* Sum */}
                    <td className="px-5 py-3.5 text-right font-black text-gray-950 text-sm min-w-[100px] select-none">
                      ₹{booking.subtotal}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center min-w-[110px] select-none">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${
                        booking.status === 'Completed'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : booking.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-center min-w-[200px] select-none">
                      <div className="flex items-center justify-center space-x-1.5">
                        
                        {/* Green print bill button */}
                        <button
                          type="button"
                          onClick={() => handleGenerateInvoice(booking)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded text-[10px] font-black uppercase transition-all shadow-sm cursor-pointer active:scale-95"
                          title="Generate PDF Receipt"
                        >
                          Bill
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, 'Completed')}
                          disabled={booking.status === 'Completed'}
                          className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                            booking.status === 'Completed'
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                              : 'bg-green-650 hover:bg-green-700 text-white shadow-sm'
                          }`}
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                          disabled={booking.status === 'Cancelled'}
                          className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                            booking.status === 'Cancelled'
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                              : 'bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 shadow-sm'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default Requests;
