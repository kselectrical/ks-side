import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  loadServicesFromDb, getBookingsFromCloud, saveBookingToCloud,
  loadBusinessConfigFromDb, saveCustomerToCloud, getCustomersFromFirestore,
  getInvoicesFromCloud, signOutUser, auth, isFirebaseConfigured, isAdminEmail
} from './firebase';
import { servicesData, businessConfig } from './data';
import type { TechnicalService, CartItem } from './types';
import type { BookingData, CustomerUser } from './firebase';
import type { BusinessConfig } from './data';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Shared Components
import { LoginModal } from './components/LoginModal';

// Pages - Lazy loaded
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const LocalLandingPage = lazy(() => import('./pages/LocalLandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Service Pages - Lazy loaded
const ACService = lazy(() => import('./pages/services/ACService'));
const ROService = lazy(() => import('./pages/services/ROService'));
const ElectricianService = lazy(() => import('./pages/services/ElectricianService'));
const WashingMachineRepair = lazy(() => import('./pages/services/WashingMachineRepair'));
const RefrigeratorRepair = lazy(() => import('./pages/services/RefrigeratorRepair'));
const ChimneyService = lazy(() => import('./pages/services/ChimneyService'));

// Admin Dashboard Pages - Lazy loaded
const Login = lazy(() => import('./pages/admin/Login'));
const Catalog = lazy(() => import('./pages/admin/Catalog'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Branding = lazy(() => import('./pages/admin/Branding'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Requests = lazy(() => import('./pages/admin/Requests'));
const BillBook = lazy(() => import('./pages/admin/BillBook'));
const CreateManualInvoice = lazy(() => import('./pages/admin/CreateManualInvoice'));

// Ambient Loading Screen Placeholder
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-10 h-10 border-4 border-blue-150 border-t-brand-blue rounded-full animate-spin" />
      <span className="text-xs font-black text-gray-505 uppercase tracking-widest animate-pulse">Loading Portal...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // General App State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('Gaur City 1, Noida Extension, UP');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  
  // Dynamic Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; photoUrl: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTriggerSource, setLoginTriggerSource] = useState<'navbar' | 'checkout' | null>(null);

  // Sync / Real-time Datastores State
  const [services, setServices] = useState<TechnicalService[]>(servicesData);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [businessConfigState, setBusinessConfigState] = useState<BusinessConfig>(businessConfig);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);

  // Async load data from Firestore database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const srvs = await loadServicesFromDb(servicesData);
        setServices(srvs);

        const config = await loadBusinessConfigFromDb(businessConfig);
        setBusinessConfigState(config);

        const bks = await getBookingsFromCloud();
        const invs = await getInvoicesFromCloud();
        const combined = [...bks, ...invs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookings(combined);

        const custs = await getCustomersFromFirestore();
        setCustomers(custs);
      } catch (e) {
        console.error("Error loading initial data from Firestore:", e);
      }
    };

    loadInitialData();

    // Restore custom customer session from localStorage on mount
    const savedCustomer = localStorage.getItem('ks_customer_session');
    if (savedCustomer) {
      try {
        const parsed = JSON.parse(savedCustomer);
        setIsLoggedIn(true);
        setUserRole('customer');
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Error restoring customer session:", e);
      }
    }
  }, []);

  // Monitor Authentication Session Status dynamically (Admins Google OAuth)
  useEffect(() => {
    let unsubscribe = () => {};
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const email = firebaseUser.email || '';
          const name = firebaseUser.displayName || 'Google Admin';
          const photoUrl = firebaseUser.photoURL || '/profile.png';
          
          const isAdmin = await isAdminEmail(email);
          if (isAdmin) {
            setIsLoggedIn(true);
            setUserRole('admin');
            setCurrentUser({ name, email, photoUrl });
          } else {
            // Sign out customers from Google Auth to avoid conflicts
            await auth.signOut();
          }
        }
      });
    }
    return () => unsubscribe();
  }, []);

  // Extracted lists
  const categories = Array.from(new Set(services.map((s) => s.category)));

  // Filter service items
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'ALL' || 
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Cart Functions
  const handleAddToCart = (service: TechnicalService, brand?: string) => {
    const key = service.id + (brand ? `-${brand}` : '');
    setCart((prev) => {
      const existing = prev[key];
      if (existing) {
        return {
          ...prev,
          [key]: { ...existing, quantity: existing.quantity + 1 }
        };
      }
      return {
        ...prev,
        [key]: {
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          quantity: 1,
          brand
        }
      };
    });
  };

  const handleRemoveFromCart = (serviceId: string, brand?: string) => {
    const key = serviceId + (brand ? `-${brand}` : '');
    setCart((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { ...existing, quantity: existing.quantity - 1 }
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Auth Callbacks
  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setLoginTriggerSource('checkout');
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleLoginSuccess = (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string; phone?: string }) => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (user) {
      setCurrentUser(user);
      if (role === 'customer') {
        localStorage.setItem('ks_customer_session', JSON.stringify(user));
      }
      saveCustomerToCloud(user).then(() => {
        getCustomersFromFirestore().then(setCustomers);
      });
    }
    
    // Close modal immediately and run navigation check
    setShowLoginModal(false);
    setTimeout(() => {
      if (role === 'admin') {
        navigate('/admin/catalog');
      } else if (loginTriggerSource === 'checkout') {
        navigate('/checkout');
      }
      setLoginTriggerSource(null);
    }, 100);
  };

  const handleLogout = async () => {
    await signOutUser();
    localStorage.removeItem('ks_customer_session');
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    navigate('/');
  };

  const handleBookingSubmit = async (bookingDetails: Omit<BookingData, 'id' | 'createdAt' | 'status'>) => {
    const saved = await saveBookingToCloud(bookingDetails);
    setBookings(prev => [saved, ...prev]);
  };

  // Tax Invoice PDF Generation Logic
  const handleGenerateInvoice = (booking: BookingData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups in your browser to generate and download dynamic PDF bills.");
      return;
    }

    const totalAmount = booking.subtotal;
    const baseAmount = Math.round(totalAmount / 1.18);
    const gstTotal = totalAmount - baseAmount;
    const cgst = Math.round(gstTotal / 2);
    const sgst = gstTotal - cgst;

    const itemsRows = booking.items.map((item, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; font-weight: bold; color: #4b5563;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left;">
          <div style="font-weight: bold; color: #111827;">${item.serviceName}</div>
          ${item.brand ? `<span style="font-size: 9px; background: #eff6ff; color: #2563eb; padding: 2px 6px; border: 1px solid #bfdbfe; border-radius: 4px; display: inline-block; margin-top: 4px; font-weight: 850;">${item.brand}</span>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #111827;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 900; color: #1e3a8a;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const stampClass = booking.status === 'Completed' ? 'stamp' : booking.status === 'Cancelled' ? 'stamp-cancelled' : 'stamp-pending';
    const stampLabel = booking.status === 'Completed' ? 'PAID' : booking.status === 'Cancelled' ? 'CANCELLED' : 'PENDING';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${booking.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1f2937; margin: 40px; padding: 0; line-height: 1.5; background: #fff; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            .header-bar { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 24px; margin-bottom: 35px; position: relative; }
            .company-info { text-align: left; }
            .company-name { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.025em; }
            .company-tagline { font-size: 11px; color: #4b5563; font-weight: 750; text-transform: uppercase; margin-top: 2px; }
            .details-text { font-size: 12px; color: #4b5563; font-weight: 500; margin: 3px 0; }
            .invoice-details { text-align: right; }
            .invoice-title { font-size: 32px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; }
            .invoice-id { font-size: 16px; font-weight: 800; color: #2563eb; margin-top: 6px; }
            .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; margin-bottom: 35px; }
            .card-block { border: 1px solid #e5e7eb; padding: 18px; border-radius: 12px; background: #f9fafb; text-align: left; }
            .section-title { font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; letter-spacing: 0.05em; }
            .card-bold { font-size: 14px; font-weight: 900; color: #111827; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 35px; }
            th { background: #1f2937; color: white; padding: 12px 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
            
            .summary-payment-wrapper { display: flex; justify-content: space-between; margin-bottom: 45px; gap: 30px; }
            .payment-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #f9fafb; flex: 1; text-align: left; }
            .totals-container { width: 320px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #f9fafb; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; font-weight: 650; color: #4b5563; }
            .totals-final { border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 6px; font-size: 16px; font-weight: 900; color: #1e3a8a; }
            
            .signature { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-block { border-top: 1px solid #9ca3af; width: 180px; text-align: center; padding-top: 6px; font-size: 11px; font-weight: 750; color: #4b5563; }
            .footer { text-align: center; border-top: 1px dashed #d1d5db; padding-top: 24px; font-size: 10px; color: #9ca3af; font-weight: 600; margin-top: 70px; line-height: 1.6; }
            
            /* Stamp Styles */
            .stamp {
              position: absolute;
              top: 10px;
              right: 220px;
              border: 4px double #10b981;
              color: #10b981;
              font-size: 16px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 8px;
              transform: rotate(-8deg);
              letter-spacing: 2px;
              background: rgba(16, 185, 129, 0.05);
              box-shadow: 0 0 0 2px #10b981;
            }
            .stamp-pending {
              position: absolute;
              top: 10px;
              right: 220px;
              border: 4px double #d97706;
              color: #d97706;
              font-size: 16px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 8px;
              transform: rotate(-8deg);
              letter-spacing: 2px;
              background: rgba(217, 119, 6, 0.05);
              box-shadow: 0 0 0 2px #d97706;
            }
            .stamp-cancelled {
              position: absolute;
              top: 10px;
              right: 220px;
              border: 4px double #dc2626;
              color: #dc2626;
              font-size: 16px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 8px;
              transform: rotate(-8deg);
              letter-spacing: 2px;
              background: rgba(220, 38, 38, 0.05);
              box-shadow: 0 0 0 2px #dc2626;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div class="company-info">
              <div class="company-name">${businessConfigState.name}</div>
              <div class="company-tagline">${businessConfigState.tagline}</div>
              <div class="details-text" style="margin-top: 8px;">📧 Email: ${businessConfigState.email}</div>
              <div class="details-text">🌐 Web: ${businessConfigState.website}</div>
            </div>
            
            <div class="${stampClass}">${stampLabel}</div>
            
            <div class="invoice-details">
              <div class="invoice-title">Tax Invoice</div>
              <div class="invoice-id">BOOKING ID: ${booking.id}</div>
              <div class="details-text" style="margin-top: 8px;">Issue Date: ${new Date(booking.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div class="details-text">Order Status: <span style="color: ${booking.status === 'Completed' ? '#10b981' : booking.status === 'Cancelled' ? '#dc2626' : '#d97706'}; font-weight: 850;">${booking.status.toUpperCase()}</span></div>
            </div>
          </div>

          <div class="info-grid">
            <div class="card-block">
              <div class="section-title">Service Provider</div>
              <div class="card-bold">${businessConfigState.owner}</div>
              <div class="details-text">📞 Contact 1: +91 ${businessConfigState.contacts[0]}</div>
              <div class="details-text">📞 Contact 2: +91 ${businessConfigState.contacts[1] || ''}</div>
              <div class="details-text">📍 Coverage Zone: ${booking.selectedLocation}</div>
            </div>
            <div class="card-block">
              <div class="section-title">Bill To (Customer Details)</div>
              <div class="card-bold">${booking.customerName}</div>
              <div class="details-text">📞 Connection: +91 ${booking.phone}</div>
              <div class="details-text">📍 Address: ${booking.address}</div>
              <div class="details-text">📅 Schedule Slot: ${booking.dateTime}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 8%; text-align: left; padding: 12px 10px;">S.No</th>
                <th style="width: 52%; text-align: left; padding: 12px 10px;">Job / Service Description</th>
                <th style="width: 10%; text-align: center; padding: 12px 10px;">Qty</th>
                <th style="width: 15%; text-align: right; padding: 12px 10px;">Unit Rate</th>
                <th style="width: 15%; text-align: right; padding: 12px 10px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary-payment-wrapper">
            <div class="payment-card">
              <div class="section-title">Payment & UPI Settlement</div>
              <div class="details-text" style="font-weight: 700; color: #111827; margin-bottom: 8px;">Scan to Pay via UPI App:</div>
              <div style="font-size: 11px; font-weight: bold; color: #1e3a8a; background: #eff6ff; padding: 10px; border-radius: 8px; border: 1px solid #bfdbfe; font-family: monospace;">
                UPI ID: ${businessConfigState.contacts[0]}@paytm
              </div>
              <div class="details-text" style="margin-top: 10px; font-size: 10px; color: #6b7280; font-style: italic;">
                *Please share the payment transaction screenshot with the technician after successful verification.
              </div>
            </div>
            
            <div class="totals-container">
              <div class="totals-row">
                <span>Gross Subtotal (Excl. GST):</span>
                <span>₹${baseAmount}</span>
              </div>
              <div class="totals-row">
                <span>CGST (9%):</span>
                <span>₹${cgst}</span>
              </div>
              <div class="totals-row">
                <span>SGST (9%):</span>
                <span>₹${sgst}</span>
              </div>
              <div class="totals-row">
                <span>Visitation Charge:</span>
                <span style="color: #10b981; font-weight: 850;">FREE</span>
              </div>
              <div class="totals-row totals-final">
                <span>Grand Total (Incl. Tax):</span>
                <span>₹${totalAmount}</span>
              </div>
            </div>
          </div>

          <div class="signature">
            <div class="sig-block">Customer Signature</div>
            <div class="sig-block">Operator Stamp/Signature</div>
          </div>

          <div class="footer">
            Thank you for choosing ${businessConfigState.name} doorstep services!
            <br>All repair jobs are covered under our official 30-Days Warranty program.
            <br><span style="color: #9ca3af; font-size: 8px;">This is a computer generated invoice log and does not require physical signatures.</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 450);
  };

  // Cart totals
  const cartItems = Object.values(cart);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart checkout bar visibility checks
  const showMobileCartBar = cartCount > 0 && !location.pathname.startsWith('/admin') && location.pathname !== '/checkout';

  return (
    <div className="relative min-h-screen bg-white">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public customer pages layout */}
          <Route element={
            <PublicLayout 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              cartCount={cartCount}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              currentUser={currentUser}
              onLoginClick={() => { setLoginTriggerSource('navbar'); setShowLoginModal(true); }}
              onLogoutClick={handleLogout}
              businessConfig={businessConfigState}
            />
          }>
            <Route path="/" element={
              <HomePage 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filteredServices={filteredServices}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                businessConfig={businessConfigState}
              />
            } />
            
            <Route path="/services" element={
              <ServicesPage 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filteredServices={filteredServices}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                businessConfig={businessConfigState}
              />
            } />

            {/* Service Pages */}
            <Route path="/services/ac-service" element={
              <ACService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/ro-service" element={
              <ROService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/electrician-service" element={
              <ElectricianService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/washing-machine-repair" element={
              <WashingMachineRepair 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/refrigerator-repair" element={
              <RefrigeratorRepair 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/chimney-service" element={
              <ChimneyService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />

            {/* Checkout Page */}
            <Route path="/checkout" element={
              <CheckoutPage 
                cart={cart}
                onClearCart={handleClearCart}
                selectedLocation={selectedLocation}
                onSubmitBooking={handleBookingSubmit}
                businessConfig={businessConfigState}
              />
            } />

            {/* Informational Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage businessConfig={businessConfigState} />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms-and-cond" element={<TermsPage />} />

            {/* Dynamic Local City SEO Landing Page */}
            <Route path="/:serviceCitySlug" element={
              <LocalLandingPage 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />

            {/* Custom 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Admin Login Page */}
          <Route path="/admin/login" element={
            <Login 
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLoginSuccess={handleLoginSuccess}
            />
          } />

          {/* Admin Layout Scope */}
          <Route element={
            <AdminLayout 
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLogout={handleLogout}
              businessConfig={businessConfigState}
            />
          }>
            <Route path="/admin/catalog" element={
              <Catalog 
                services={services}
                onUpdateServices={setServices}
              />
            } />
            <Route path="/admin/categories" element={
              <Categories 
                services={services}
                onUpdateServices={setServices}
              />
            } />
            <Route path="/admin/branding" element={
              <Branding 
                businessConfig={businessConfigState}
                onUpdateBusinessConfig={setBusinessConfigState}
              />
            } />
            <Route path="/admin/customers" element={
              <Customers 
                customers={customers}
              />
            } />
            <Route path="/admin/requests" element={
              <Requests 
                bookings={bookings}
                onUpdateBookings={setBookings}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />
            <Route path="/admin/billbook" element={
              <BillBook 
                bookings={bookings}
                onUpdateBookings={setBookings}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />
            <Route path="/admin/billbook/create" element={
              <CreateManualInvoice 
                services={services}
                bookings={bookings}
                onUpdateBookings={setBookings}
                businessConfig={businessConfigState}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />
          </Route>
        </Routes>
      </Suspense>

      {/* Phone Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Mobile Sticky Bottom Checkout Bar */}
      {showMobileCartBar && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3.5 px-5 flex items-center justify-between z-45 shadow-lg md:hidden animate-in slide-in-from-bottom duration-250 font-sans select-none">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <ShoppingCart size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-tight">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartSubtotal}
              </span>
              <span className="text-[9px] text-green-600 font-bold leading-tight mt-0.5">
                Free visitation included
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-sm transition-all cursor-pointer active:scale-95 text-center"
          >
            <span>Proceed</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
