import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold select-none py-3.5 px-4 sm:px-6 bg-gray-50/50 border-b border-gray-200 shrink-0 font-sans text-left">
      <Link to="/" className="hover:text-brand-blue flex items-center space-x-1 transition-colors">
        <Home size={13} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={12} className="text-gray-400" />
          {item.path ? (
            <Link to={item.path} className="hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-extrabold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
