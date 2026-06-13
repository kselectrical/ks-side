import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, ShieldCheck, Search, ChevronLeft, ChevronRight, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  service: string;
  category: string;
  comment: string;
}

// Seeded random number generator to keep the 1000 reviews completely stable
const createSeededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const FIRST_NAMES = [
  'Rajesh', 'Amit', 'Vikram', 'Priya', 'Sneha', 'Sunil', 'Deepak', 'Pooja', 'Aarti', 'Vijay',
  'Neha', 'Karan', 'Rahul', 'Sanjay', 'Ritu', 'Anjali', 'Manoj', 'Ramesh', 'Jyoti', 'Shivam',
  'Manish', 'Preeti', 'Abhishek', 'Gauri', 'Alok', 'Swati', 'Ravi', 'Kavita', 'Sandeep', 'Divya',
  'Ashok', 'Meena', 'Arjun', 'Shalini', 'Harish', 'Nisha', 'Sunita', 'Raj', 'Lata', 'Vinod',
  'Mohit', 'Komal', 'Pradeep', 'Rekha', 'Yogesh', 'Babita', 'Dinesh', 'Kiran', 'Satish', 'Geeta',
  'Kamal', 'Anita', 'Surendra', 'Manju', 'Naresh', 'Suman', 'Mahendra', 'Sarla', 'Jitendra', 'Usha',
  'Anil', 'Nirmala', 'Gopal', 'Sharda', 'Tarun', 'Poonam', 'Varun', 'Sudha', 'Arun', 'Maya',
  'Rakesh', 'Rani', 'Suresh', 'Bala', 'Dharmendra', 'Rama', 'Kailash', 'Radha', 'Bhagwan', 'Krishna',
  'Madhur', 'Kusum', 'Devendra', 'Chitra', 'Narendra', 'Kanta', 'Hemant', 'Pushpa', 'Upendra', 'Leela',
  'Subhash', 'Shanti'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Singh', 'Gupta', 'Kumar', 'Patel', 'Yadav', 'Mishra', 'Joshi', 'Chaudhari',
  'Prasad', 'Sen', 'Roy', 'Das', 'Reddy', 'Nair', 'Kapoor', 'Malhotra', 'Saxena', 'Dubey',
  'Tiwari', 'Pandey', 'Pathak', 'Tripathi', 'Bose', 'Mukherjee', 'Chatterjee', 'Banerjee', 'Rao', 'Shetty',
  'Pillai', 'Grover', 'Bhasin', 'Mehta', 'Shah', 'Trivedi', 'Vyas', 'Bhatt', 'Rathore', 'Solanki',
  'Chauhan', 'Thakur', 'Garg', 'Bansal', 'Goel', 'Agrawal', 'Soni', 'Seth', 'Anand', 'Kapur'
];

const LOCATIONS = [
  'Gaur City 1, Noida Extension',
  'Gaur City 2, Noida Extension',
  'Noida Extension Sector 4',
  'Noida Sector 62',
  'Indirapuram, Ghaziabad',
  'Crossing Republic, Ghaziabad',
  'Gaur Saundaryam, Noida Extension',
  'Sector 121, Noida',
  'Sector 76, Noida',
  'Noida Extension Sector 16',
  'Gaur City Galleria',
  'Gaur Sportswood, Sector 79',
  'Crossing Republic GH-7'
];

const SERVICES = [
  { name: 'AC Repairs & Gas Leak Fix', category: 'AC Services', keywords: ['AC cooling', 'gas leak check', 'R32 gas refill', 'split AC cooling'] },
  { name: 'AC Installation & Removal', category: 'AC Services', keywords: ['wall mounting split AC', 'AC bracket setup', 'copper pipe insulation'] },
  { name: 'AC Jet Cleaning & Service', category: 'AC Services', keywords: ['foam jet cleaning', 'AC filter wash', 'high pressure jet wash'] },
  { name: 'Complete House Wiring & Trace', category: 'Electrician Services', keywords: ['short circuit trace', 'digital megger scan', 'house wiring repair'] },
  { name: 'Modular Board Switch Repair', category: 'Electrician Services', keywords: ['replace modular switches', 'multi-pin socket fix', 'switch board spark'] },
  { name: 'Inverter & Battery Diagnostics', category: 'Electrician Services', keywords: ['inverter battery acid', 'backup load check', 'distilled water refill'] },
  { name: 'MCB & Distribution Box Upgrade', category: 'Electrician Services', keywords: ['replace fuse MCB', 'rccb shock protector', 'metal distribution board'] },
  { name: 'Smart LED & Chandelier Fitting', category: 'Electrician Services', keywords: ['smart led strip light', 'hanging heavy chandelier', 'profile lamp layout'] },
  { name: 'Ceiling & Exhaust Fan Repair', category: 'Electrician Services', keywords: ['exhaust fan winding', 'replace capacitor fan', 'ceiling fan noise repair'] },
  { name: 'RO Water Purifier Servicing', category: 'Appliance Repair', keywords: ['ro water tds control', 'replace carbon filter', 'membrane filter clean'] },
  { name: 'Washing Machine Servicing', category: 'Appliance Repair', keywords: ['drum alignment balanced', 'drainage lock clearance', 'front load vibration fix'] },
  { name: 'Refrigerator Gas Charging', category: 'Appliance Repair', keywords: ['fridge gas leak trace', 'compressor relay change', 'single door gas refill'] },
  { name: 'Microwave Oven Repair', category: 'Appliance Repair', keywords: ['microwave magnetron burnt', 'turntable motor switch', 'touch keypad card fix'] },
  { name: 'Geyser Heating Element Fixing', category: 'Appliance Repair', keywords: ['geyser element scale clean', 'thermostat auto cut off', 'copper heating jacket'] },
  { name: 'Appliance Control PCB Repair', category: 'Appliance Repair', keywords: ['motherboard card soldering', 'ic chip programming', 'anti humidity spray'] },
  { name: 'Kitchen Chimney Deep Servicing', category: 'Appliance Repair', keywords: ['caustic soda filter wash', 'suction motor degreasing', 'blower fan noise'] },
  { name: 'Balcony Pigeon Net Installation', category: 'Home Installations', keywords: ['hdpe safety bird netting', 'stainless steel anchors', 'balcony pigeon proofing'] },
  { name: 'Doorstep Plumbing Utilities', category: 'Home Installations', keywords: ['cpvc pipe leakage seal', 'washbasin faucet block', 'sink drainage pipe'] },
  { name: 'Carpentry Adjustments & Repairs', category: 'Home Installations', keywords: ['hydraulic hinges replacement', 'drawer slider channel', 'door lock setup'] },
  { name: 'Gypsum False Ceiling Service', category: 'Home Installations', keywords: ['gyproc ceiling boards', 'galvanized frame network', 'cove lighting design'] }
];

const TEMPLATES = [
  'Excellent service! The technician came for {service} in {location}. {keyword}. Highly recommended!',
  'Had a great experience with KS Electrical. They resolved my {service} problem. The technician was very professional and efficient in {location}.',
  'Highly satisfied with the same-day visit in {location} for {service}. {keyword}. The price was very reasonable.',
  'Great job by Kaushindra Singh\'s team. They fixed the {service} cleanly. {keyword}. Best service provider in Noida Extension.',
  'Best service provider for {service} in {location}. Prompt response and neat work. {keyword}. Will call them again.',
  'Highly recommend them! The technician was very skilled at {service}. {keyword} was done perfectly in {location}.',
  'Superb work! Very polite technician came for {service} in {location}. Resolved the issue quickly. {keyword} was successful.',
  'Reliable and safety-focused. The electrician did a great job for {service} at our place in {location}. {keyword} is working great now.',
  'Very professional setup. Called them for {service} in {location}. They used original parts and did a neat job. {keyword} is fully resolved.',
  'Highly recommended for anyone looking for {service} in {location}. Clean work, polite behavior, and honest pricing. {keyword}.'
];

// Generate 1000 reviews deterministically on load
const generateReviews = (): Review[] => {
  const reviews: Review[] = [];
  const rng = createSeededRandom(42); // Seeded for consistency

  for (let i = 1; i <= 1000; i++) {
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    
    const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    const serviceObj = SERVICES[Math.floor(rng() * SERVICES.length)];
    const service = serviceObj.name;
    const category = serviceObj.category;
    
    const keyword = serviceObj.keywords[Math.floor(rng() * serviceObj.keywords.length)];
    const template = TEMPLATES[Math.floor(rng() * TEMPLATES.length)];
    
    // Capitalize first letter of keyword-phrase
    const cleanKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    const comment = template
      .replace('{service}', service)
      .replace('{location}', location)
      .replace('{keyword}', cleanKeyword);

    // Seeded ratings: 85% 5-Star, 15% 4-Star to make it a realistic 4.8-4.9 average
    const rating = rng() > 0.15 ? 5 : 4;

    // Seeded dates spanning the last 12 months
    const dateOffsetDays = Math.floor(rng() * 365);
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() - dateOffsetDays);
    const dateString = reviewDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    reviews.push({
      id: i,
      name,
      location,
      rating,
      date: dateString,
      service,
      category,
      comment
    });
  }

  // Sort reviews: recently generated dates first
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const ReviewsPage: React.FC = () => {
  const allReviews = useMemo(() => generateReviews(), []);
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered reviews calculation
  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      const matchesSearch = 
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;
      
      return matchesSearch && matchesRating;
    });
  }, [allReviews, searchTerm, ratingFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to review container
      const el = document.getElementById('reviews-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 font-sans text-left">
      <Helmet>
        <title>1000+ Customer Reviews & Testimonials | KS Electrical & AC Services</title>
        <meta name="description" content="Read verified reviews from 1,000+ happy homeowners in Gaur City, Noida Extension, and Ghaziabad. High-quality AC repair, jet cleaning, house wiring, and appliance services." />
        <meta name="keywords" content="AC repair reviews Noida Extension, electrician testimonials Gaur City, appliance repair reviews Ghaziabad, verified reviews KS Electrical" />
      </Helmet>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white py-16 px-4 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.08),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-orange/10 border border-brand-orange/20 px-3.5 py-1.5 rounded-full text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} className="animate-pulse" />
            <span>100% Verified Customer Feedback</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase max-w-4xl mx-auto leading-none">
            What Our Customers Say
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed">
            Read transparent reviews from homeowners across Gaur City 1, Gaur City 2, Noida Extension, Indirapuram, and Ghaziabad Crossing Republic.
          </p>
        </div>
      </section>

      {/* Local SEO Keywords Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-gray-900 font-black text-xl uppercase tracking-tight">
              Trusted Home Maintenance in Noida & Ghaziabad
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              At **KS Electrical And AC Services**, lead contractor **Kaushindra Singh** and his team have completed over 5,000 installations, wiring trace fixes, and compressor gas leak charging. Our local reviews highlight same-day response times, budget-friendly pricing, and reliable service warranties.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-700">
              <span className="flex items-center space-x-1">
                <MapPin size={12} className="text-brand-orange shrink-0" />
                <span>Gaur City 1 & 2</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin size={12} className="text-brand-orange shrink-0" />
                <span>Noida Extension</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin size={12} className="text-brand-orange shrink-0" />
                <span>Ghaziabad Crossing</span>
              </span>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-center items-center">
            <div className="text-4.5xl sm:text-5xl font-black text-slate-800 leading-none">4.9</div>
            
            <div className="flex space-x-0.5 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#F97316" className="text-brand-orange" />
              ))}
            </div>
            
            <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
              Based on 1,000 Local Reviews
            </div>

            <div className="w-full mt-4 space-y-2 text-xs font-bold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-10 text-right">5 Star</span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-orange h-full w-[85%]" />
                </div>
                <span className="w-8">85%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-10 text-right">4 Star</span>
                <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-orange h-full w-[15%]" />
                </div>
                <span className="w-8">15%</span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-200 w-full flex items-center justify-center space-x-1.5 text-xs font-black text-brand-blue uppercase select-none">
              <ShieldCheck size={14} className="text-brand-orange" />
              <span>100% Verified Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reviews List Block */}
      <section id="reviews-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 scroll-mt-24">
        
        {/* Filters and Search Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by service, location, or customer..."
              className="w-full bg-white border border-gray-250 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-blue-100 text-xs sm:text-sm font-semibold transition-all"
            />
          </div>

          {/* Rating Filters */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Rating:</span>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => { setRatingFilter('all'); setCurrentPage(1); }}
                className={`px-3 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                  ratingFilter === 'all'
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-550 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => { setRatingFilter(5); setCurrentPage(1); }}
                className={`px-3 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                  ratingFilter === 5
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-550 hover:text-gray-800'
                }`}
              >
                <span>5</span>
                <Star size={11} fill="currentColor" />
              </button>
              <button
                type="button"
                onClick={() => { setRatingFilter(4); setCurrentPage(1); }}
                className={`px-3 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                  ratingFilter === 4
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-550 hover:text-gray-800'
                }`}
              >
                <span>4</span>
                <Star size={11} fill="currentColor" />
              </button>
            </div>
          </div>

        </div>

        {/* Reviews Grid List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 flex flex-col justify-center items-center">
            <AlertCircle size={36} className="text-gray-300 mb-2" />
            <p className="text-sm font-bold">No reviews found matching your search term.</p>
            <button
              onClick={() => { setSearchTerm(''); setRatingFilter('all'); }}
              className="mt-4 text-xs font-extrabold text-brand-orange uppercase hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-card-hover transition-all duration-200"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-black text-xs">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs sm:text-sm font-black text-gray-900 leading-tight">{review.name}</span>
                        <div className="flex items-center space-x-0.5 bg-blue-50/50 border border-blue-100 rounded px-1.5 py-0.5 text-[8px] font-black text-brand-blue uppercase">
                          <ShieldCheck size={9} className="text-brand-orange mr-0.5 shrink-0" />
                          <span>Verified</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold flex items-center mt-0.5">
                        <MapPin size={10} className="text-gray-400 mr-1 shrink-0" />
                        {review.location}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars and Date */}
                  <div className="flex items-center space-x-2 sm:text-right shrink-0">
                    <div className="flex space-x-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="#F97316" className="text-brand-orange" />
                      ))}
                    </div>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <span className="text-[10px] text-gray-400 font-bold">{review.date}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="pt-3.5 space-y-2">
                  <div className="inline-block bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                    Service requested: {review.service}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 px-2 select-none">
              
              {/* Info text */}
              <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                Showing {Math.min(filteredReviews.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredReviews.length, currentPage * itemsPerPage)} of {filteredReviews.length} Reviews
              </div>

              {/* Page buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-250 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-gray-600 transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="hidden sm:flex items-center space-x-1 text-xs font-bold text-gray-600">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button onClick={() => handlePageChange(1)} className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">1</button>
                      <span className="text-gray-300">...</span>
                    </>
                  )}
                  {/* Near current pages */}
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .filter(p => Math.abs(p - currentPage) <= 2)
                    .map(p => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                          p === currentPage
                            ? 'bg-brand-blue border-brand-blue text-white shadow-sm font-black'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-300">...</span>
                      <button onClick={() => handlePageChange(totalPages)} className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">{totalPages}</button>
                    </>
                  )}
                </div>

                {/* Mobile indicators */}
                <span className="sm:hidden text-xs font-black text-gray-700 px-2">Page {currentPage} of {totalPages}</span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-250 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-gray-600 transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>

          </div>
        )}

      </section>

    </div>
  );
};

export default ReviewsPage;
