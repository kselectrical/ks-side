import React, { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import type { TechnicalService } from '../../types';
import { saveServicesToDb } from '../../firebase';

interface CategoriesProps {
  services: TechnicalService[];
  onUpdateServices: (updated: TechnicalService[]) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ services, onUpdateServices }) => {
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [categoryNewName, setCategoryNewName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Derived list of unique categories
  const categoriesList = Array.from(new Set(services.map(s => s.category)));

  const handleCategoryRename = (oldName: string) => {
    if (!categoryNewName.trim()) return;
    const updated = services.map(s => {
      if (s.category === oldName) {
        return { ...s, category: categoryNewName };
      }
      return s;
    });
    onUpdateServices(updated);
    saveServicesToDb(updated);
    setEditingCategoryOldName(null);
    setCategoryNewName('');
    alert(`Category renamed from "${oldName}" to "${categoryNewName}" successfully!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    if (categoriesList.includes(newCategoryName)) {
      alert("Category already exists!");
      return;
    }

    // Creating initial placeholder service to initialize the category slug
    const placeholderService: TechnicalService = {
      id: 'srv-' + Math.floor(1000 + Math.random() * 9000),
      name: `Placeholder Service for ${newCategoryName}`,
      code: 'CAT-INIT',
      category: newCategoryName,
      subcategory: 'Service',
      description: `Placeholder listing created to initialize the ${newCategoryName} category. You can edit or delete this.`,
      price: 0,
      imageUrl: '/ac_service.png',
      warranty: '15 Days Warranty',
      duration: '30 mins',
      rating: '5.0 ★',
      iconName: 'Zap',
      specifications: []
    };

    const updated = [...services, placeholderService];
    onUpdateServices(updated);
    saveServicesToDb(updated);
    setNewCategoryName('');
    alert(`Category "${newCategoryName}" registered successfully with a placeholder service listing.`);
  };

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="bg-white border border-gray-250 rounded-xl p-4 shadow-sm flex items-end space-x-4 select-none">
        <div className="flex-1 space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Add New Category Name</label>
          <input
            type="text"
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Appliance Service / Cleaning Services"
            className="w-full bg-white text-gray-800 text-xs font-semibold px-3 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-brand-blue"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center space-x-1 transition-all shadow-sm cursor-pointer h-9 shrink-0"
        >
          <Plus size={14} />
          <span>Create Category</span>
        </button>
      </form>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                <th className="px-5 py-3.5">Category Name</th>
                <th className="px-5 py-3.5">Associated Services</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-semibold">
              {categoriesList.map((cat) => {
                const serviceCount = services.filter(s => s.category === cat).length;
                const isEditing = editingCategoryOldName === cat;

                return (
                  <tr key={cat} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={categoryNewName}
                          onChange={(e) => setCategoryNewName(e.target.value)}
                          className="bg-white text-gray-800 text-xs font-semibold px-2.5 py-1.5 border border-brand-blue rounded-lg focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-900 font-extrabold text-sm">{cat}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-blue-50 text-brand-blue font-bold px-2 py-0.5 rounded-full text-[10px] border border-blue-100 select-none">
                        {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center select-none">
                      {isEditing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleCategoryRename(cat)}
                            className="px-2.5 py-1.5 bg-brand-blue text-white rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategoryOldName(null);
                              setCategoryNewName('');
                            }}
                            className="px-2.5 py-1.5 border border-gray-200 text-gray-600 bg-white rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryOldName(cat);
                            setCategoryNewName(cat);
                          }}
                          className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:text-brand-blue hover:border-brand-blue bg-white shadow-sm transition-all cursor-pointer inline-flex items-center space-x-1"
                        >
                          <Edit3 size={11} />
                          <span className="text-[10px] font-bold">Rename Category</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Categories;
