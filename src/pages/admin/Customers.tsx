import React from 'react';
import { Users } from 'lucide-react';
import { getAssetPath } from '../../firebase';
import type { CustomerUser } from '../../firebase';

interface CustomersProps {
  customers: CustomerUser[];
}

export const Customers: React.FC<CustomersProps> = ({ customers }) => {
  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-extrabold text-gray-900 text-sm">Customer Accounts Log Directory</h3>
        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Logs all registered customer profiles.</p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 px-4 text-center shadow-sm select-none">
          <Users size={44} className="text-gray-300 stroke-1 mx-auto" />
          <h3 className="text-gray-900 font-extrabold text-sm mt-3">No customers logged in yet</h3>
          <p className="text-[10px] text-gray-450 mt-1 max-w-xs mx-auto font-medium">When customers log in, their details will be logged here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                  <th className="px-5 py-3.5">Customer Details</th>
                  <th className="px-5 py-3.5">Email Address</th>
                  <th className="px-5 py-3.5">Phone Number</th>
                  <th className="px-5 py-3.5">Active Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-semibold">
                {customers.map((c) => (
                  <tr key={c.email} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 select-none">
                        <img src={getAssetPath(c.photoUrl)} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-900 font-extrabold text-sm block">{c.name}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-655 font-bold">
                      {c.email}
                    </td>
                    <td className="px-5 py-4 text-gray-655 font-bold">
                      {c.phone ? `+91 ${c.phone}` : <span className="text-gray-300 italic">No phone saved</span>}
                    </td>
                    <td className="px-5 py-4 text-gray-455 font-bold select-none">
                      {new Date(c.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
export default Customers;
