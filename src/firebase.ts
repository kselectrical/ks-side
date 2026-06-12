import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, doc, getDoc, getDocs, setDoc, deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, GoogleAuthProvider, signOut
} from 'firebase/auth';
import type { TechnicalService } from './types';
import type { BusinessConfig } from './data';

export interface BookingData {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  selectedLocation: string;
  dateTime: string;
  items: {
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
  }[];
  subtotal: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface CustomerUser {
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  address: string;
  serviceHistory: {
    serviceId: string;
    serviceName: string;
    date: string;
    price: number;
  }[];
  lastBookingDate: string;
  totalBookings: number;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;      // e.g., 'service_created', 'service_edited', 'service_deleted', 'price_changed', 'invoice_created', 'branding_changed'
  details: string;
  changedBy: string;   // admin email
  timestamp: string;
}

export interface PriceHistory {
  id: string;
  serviceId: string;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  dateTime: string;
}

export interface InvoiceHistory {
  id: string;
  invoiceNumber: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    selectedLocation: string;
  };
  items: {
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
  }[];
  totalAmount: number;
  generatedDate: string;
  pdfMetadata: {
    printDate: string;
    operatorIdentity: string;
  };
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  timestamp: string;
  deviceInfo: string;
}

export interface CategoryData {
  id: string;
  name: string;
  desc: string;
  img: string;
  label: string;
}

// Check if Firebase credentials are fully configured in environmental variables
export const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project-id' &&
  import.meta.env.VITE_FIREBASE_API_KEY
);

// Asset path resolver for subdirectory hosting (e.g. GitHub Pages)
export const getAssetPath = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

// Firebase SDK App Instances
let app;
export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Enable persistent local cache with multi-tab support
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  console.log("🔥 Firebase Web Client initialized with Multi-Tab Offline Cache.");
} else {
  console.warn("⚠️ Firebase environment keys are missing. Running in Simulated LocalStorage Database Mode.");
}

export const signOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
      console.log("☁️ User signed out from Firebase Auth.");
    } catch (e) {
      console.error("Firebase SignOut error:", e);
    }
  }
};

/* ==========================================
   1. ADMINS COLLECTION & UTILS
   ========================================== */

/**
 * Checks if a specific email exists in the admins database log.
 * If the collection is completely empty, it seeds the first admin.
 */
export const isAdminEmail = async (email: string): Promise<boolean> => {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'admins', cleanEmail);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return true;
      }
      
      // Auto-seed default email if the collection is empty
      const adminsCol = await getDocs(collection(db, 'admins'));
      if (adminsCol.empty) {
        const defaultAdmin = 'kselectrical004@gmail.com';
        await setDoc(doc(db, 'admins', defaultAdmin), {
          role: 'admin',
          seededAt: new Date().toISOString()
        });
        if (cleanEmail === defaultAdmin) {
          return true;
        }
      }
    } catch (e) {
      console.error("Firestore Admin check failed:", e);
    }
  }

  // Simulated / Fallback local check
  return cleanEmail === 'kselectrical004@gmail.com';
};

/* ==========================================
   2. BRANDING SETTINGS COLLECTION
   ========================================== */

export const loadBusinessConfigFromDb = async (fallback: BusinessConfig): Promise<BusinessConfig> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'branding', 'current_branding');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as BusinessConfig;
      }
      
      // Seed initial configs
      await setDoc(docRef, fallback);
      return fallback;
    } catch (e) {
      console.error("Error loading branding from Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode (only used if migration is not complete and firebase not configured)
  if (localStorage.getItem('ks_migration_completed') !== 'true') {
    const local = localStorage.getItem('ks_business_config');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local business config:", e);
      }
    }
  }
  return fallback;
};

export const saveBusinessConfigToDb = async (config: BusinessConfig): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'branding', 'current_branding'), config);
      console.log("☁️ Branding synced to Firestore.");

      // Log to audit_logs
      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';
      const auditRef = doc(collection(db, 'audit_logs'));
      await setDoc(auditRef, {
        id: auditRef.id,
        action: 'branding_changed',
        details: `Updated company branding configuration. Name: ${config.name}, Phone: ${config.contacts[0]}`,
        changedBy: activeEmail,
        timestamp: new Date().toISOString()
      });
      return;
    } catch (e) {
      console.error("Error updating branding in Firestore:", e);
    }
  }

  // Fallback
  localStorage.setItem('ks_business_config', JSON.stringify(config));
  console.log("📁 Branding saved to LocalStorage.");
};

/* ==========================================
   3. SERVICES CATALOG & CATEGORIES COLLECTIONS
   ========================================== */

export const loadServicesFromDb = async (initialServices: TechnicalService[]): Promise<TechnicalService[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      if (!snap.empty) {
        const loaded: TechnicalService[] = [];
        snap.forEach(doc => {
          loaded.push(doc.data() as TechnicalService);
        });
        // Sort alphabetically by code
        return loaded.sort((a, b) => a.code.localeCompare(b.code));
      }
      
      // Auto-seed collection if empty
      console.log("🌱 Seeding default services in Firestore...");
      for (const service of initialServices) {
        await setDoc(doc(db, 'services', service.id), service);
      }
      return initialServices;
    } catch (e) {
      console.error("Error loading services from Firestore:", e);
    }
  }

  // Fallback
  if (localStorage.getItem('ks_migration_completed') !== 'true') {
    const local = localStorage.getItem('ks_services');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local services:", e);
      }
    }
  }
  return initialServices;
};

export const loadCategoriesFromDb = async (): Promise<CategoryData[]> => {
  const defaultCats: CategoryData[] = [
    { id: 'AC Services', name: 'AC Services', desc: 'Gas leaks, jet cleaning & install', img: '/ac_service.png', label: 'AC Services' },
    { id: 'Electrician Services', name: 'Electrician Services', desc: 'Wiring, MCBs, lighting fitting', img: '/electrical_safety_service.png', label: 'Electrician Services' },
    { id: 'Appliance Repair', name: 'RO & Appliance Repair', desc: 'RO servicing, fridges & geysers', img: '/refrigerator_service.png', label: 'RO & Appliance Repair' },
    { id: 'Home Installations', name: 'Home Installations', desc: 'Chimney wash, balcony nets, locks', img: '/geyser_service.png', label: 'Home Installations' }
  ];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        const loaded: CategoryData[] = [];
        snap.forEach(doc => {
          loaded.push(doc.data() as CategoryData);
        });
        return loaded;
      }
      
      // Auto-seed categories
      console.log("🌱 Seeding default categories in Firestore...");
      for (const cat of defaultCats) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      return defaultCats;
    } catch (e) {
      console.error("Error loading categories from Firestore:", e);
    }
  }
  return defaultCats;
};

/**
 * Updates services catalog and logs changes in the 'price_history' and 'audit_logs' collections.
 */
export const saveServicesToDb = async (services: TechnicalService[]): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      const oldServicesMap = new Map<string, TechnicalService>();
      snap.forEach(doc => {
        const data = doc.data() as TechnicalService;
        oldServicesMap.set(data.id, data);
      });

      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';
      const newIds = new Set(services.map(s => s.id));

      // 2. Scan for creations, edits, and price changes
      for (const newSrv of services) {
        const oldSrv = oldServicesMap.get(newSrv.id);
        
        if (!oldSrv) {
          // Log service creation
          const auditRef = doc(collection(db, 'audit_logs'));
          await setDoc(auditRef, {
            id: auditRef.id,
            action: 'service_created',
            details: `Created new service: ${newSrv.name} (${newSrv.code}) with price ₹${newSrv.price}`,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
        } else {
          // Check for price edits
          if (oldSrv.price !== newSrv.price) {
            // Write to price_history collection
            const priceRef = doc(collection(db, 'price_history'));
            await setDoc(priceRef, {
              id: priceRef.id,
              serviceId: newSrv.id,
              serviceName: newSrv.name,
              oldPrice: oldSrv.price,
              newPrice: newSrv.price,
              changedBy: activeEmail,
              dateTime: new Date().toISOString()
            });

            // Log price change in audit_logs collection
            const auditRef = doc(collection(db, 'audit_logs'));
            await setDoc(auditRef, {
              id: auditRef.id,
              action: 'price_changed',
              details: `Changed price of ${newSrv.name} from ₹${oldSrv.price} to ₹${newSrv.price}`,
              changedBy: activeEmail,
              timestamp: new Date().toISOString()
            });
            console.log(`📝 Price history & audit logged: ${newSrv.name} (₹${oldSrv.price} -> ₹${newSrv.price})`);
          } else if (JSON.stringify(oldSrv) !== JSON.stringify(newSrv)) {
            // Log general edit in audit_logs collection
            const auditRef = doc(collection(db, 'audit_logs'));
            await setDoc(auditRef, {
              id: auditRef.id,
              action: 'service_edited',
              details: `Edited service parameters for ${newSrv.name} (${newSrv.code})`,
              changedBy: activeEmail,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        // Save/Update in Firestore
        await setDoc(doc(db, 'services', newSrv.id), newSrv);
      }

      // 3. Scan for deleted services to remove them from Firestore
      for (const oldId of oldServicesMap.keys()) {
        if (!newIds.has(oldId)) {
          const oldSrv = oldServicesMap.get(oldId);
          await deleteDoc(doc(db, 'services', oldId));
          
          // Log deletion in audit_logs collection
          const auditRef = doc(collection(db, 'audit_logs'));
          await setDoc(auditRef, {
            id: auditRef.id,
            action: 'service_deleted',
            details: `Deleted service: ${oldSrv?.name || oldId} (${oldSrv?.code || ''})`,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
          console.log(`🗑️ Removed deleted service ${oldId} from Firestore.`);
        }
      }
      return;
    } catch (e) {
      console.error("Error saving services to Firestore:", e);
    }
  }

  // Fallback
  localStorage.setItem('ks_services', JSON.stringify(services));
  console.log("📁 Services saved to LocalStorage.");
};

/* ==========================================
   4. BOOKINGS COLLECTION (Online Reservations)
   ========================================== */

export const saveBookingToCloud = async (booking: Omit<BookingData, 'id' | 'createdAt' | 'status'>): Promise<BookingData> => {
  const newBooking: BookingData = {
    ...booking,
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      // 1. Save booking
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
      console.log(`☁️ Booking ${newBooking.id} saved to Firestore.`);
      
      // 2. Create/Update Customer Record
      const phoneKey = newBooking.phone.trim();
      if (phoneKey) {
        const custRef = doc(db, 'customers', phoneKey);
        const custSnap = await getDoc(custRef);
        
        const newServiceItems = newBooking.items.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          date: newBooking.createdAt,
          price: item.price
        }));

        const activeEmail = auth?.currentUser?.email || '';

        if (custSnap.exists()) {
          const existing = custSnap.data() as CustomerUser;
          const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
          await setDoc(custRef, {
            ...existing,
            name: newBooking.customerName,
            address: newBooking.address,
            serviceHistory: updatedHistory,
            lastBookingDate: newBooking.createdAt,
            totalBookings: (existing.totalBookings || 0) + 1
          }, { merge: true });
        } else {
          const newCustomer: CustomerUser = {
            name: newBooking.customerName,
            phone: phoneKey,
            email: activeEmail || undefined,
            address: newBooking.address,
            serviceHistory: newServiceItems,
            lastBookingDate: newBooking.createdAt,
            totalBookings: 1,
            joinedAt: new Date().toISOString()
          };
          await setDoc(custRef, newCustomer);
        }
        console.log(`☁️ Customer directory record synced for phone: ${phoneKey}`);
      }
      return newBooking;
    } catch (e) {
      console.error("Error saving booking to Firestore:", e);
    }
  }

  // Fallback
  const currentBookings = await getBookingsFromCloud();
  currentBookings.unshift(newBooking);
  localStorage.setItem('ks_bookings', JSON.stringify(currentBookings));
  return newBooking;
};

export const updateBookingStatusInCloud = async (bookingId: string, newStatus: 'Pending' | 'Completed' | 'Cancelled'): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) {
        await setDoc(bookingRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Booking ${bookingId} status updated to ${newStatus} in Firestore.`);
        
        // Log to audit
        const auditRef = doc(collection(db, 'audit_logs'));
        await setDoc(auditRef, {
          id: auditRef.id,
          action: 'booking_status_changed',
          details: `Updated booking ${bookingId} status to ${newStatus}`,
          changedBy: activeEmail,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      const invoiceRef = doc(db, 'invoices', bookingId);
      const invoiceSnap = await getDoc(invoiceRef);
      if (invoiceSnap.exists()) {
        await setDoc(invoiceRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Invoice ${bookingId} status updated to ${newStatus} in Firestore.`);
        
        // Log to audit
        const auditRef = doc(collection(db, 'audit_logs'));
        await setDoc(auditRef, {
          id: auditRef.id,
          action: 'invoice_status_changed',
          details: `Updated invoice ${bookingId} status to ${newStatus}`,
          changedBy: activeEmail,
          timestamp: new Date().toISOString()
        });
        return;
      }
    } catch (e) {
      console.error("Error updating booking/invoice status in Firestore:", e);
    }
  }

  // Fallback
  const localBookings = localStorage.getItem('ks_bookings');
  if (localBookings) {
    try {
      const list = JSON.parse(localBookings) as BookingData[];
      const updated = list.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
      localStorage.setItem('ks_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }
};

export const getBookingsFromCloud = async (): Promise<BookingData[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const bookings: BookingData[] = [];
      snap.forEach(doc => {
        bookings.push(doc.data() as BookingData);
      });
      // Sort newest first
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Error fetching bookings from Firestore:", e);
    }
  }

  // Fallback
  if (localStorage.getItem('ks_migration_completed') !== 'true') {
    const local = localStorage.getItem('ks_bookings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error parsing bookings:", e);
      }
    }
  }
  return [];
};

/* ==========================================
   5. INVOICES & INVOICE_HISTORY COLLECTIONS
   ========================================== */

export const saveInvoiceToCloud = async (invoice: BookingData): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      // 1. Save to 'invoices'
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
      console.log(`☁️ Manual Invoice ${invoice.id} saved to Firestore.`);

      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      // 2. Save to 'invoice_history'
      const historyRef = doc(collection(db, 'invoice_history'));
      const historyRecord: InvoiceHistory = {
        id: historyRef.id,
        invoiceNumber: invoice.id,
        customerDetails: {
          name: invoice.customerName,
          phone: invoice.phone,
          address: invoice.address,
          selectedLocation: invoice.selectedLocation
        },
        items: invoice.items,
        totalAmount: invoice.subtotal,
        generatedDate: invoice.createdAt,
        pdfMetadata: {
          printDate: new Date().toISOString(),
          operatorIdentity: activeEmail
        }
      };
      await setDoc(historyRef, historyRecord);
      console.log(`☁️ Invoice history record created: ${historyRef.id}`);

      // 3. Create/Update Customer Record
      const phoneKey = invoice.phone.trim();
      if (phoneKey) {
        const custRef = doc(db, 'customers', phoneKey);
        const custSnap = await getDoc(custRef);
        
        const newServiceItems = invoice.items.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          date: invoice.createdAt,
          price: item.price
        }));

        if (custSnap.exists()) {
          const existing = custSnap.data() as CustomerUser;
          const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
          await setDoc(custRef, {
            ...existing,
            name: invoice.customerName,
            address: invoice.address,
            serviceHistory: updatedHistory,
            lastBookingDate: invoice.createdAt,
            totalBookings: (existing.totalBookings || 0) + 1
          }, { merge: true });
        } else {
          const newCustomer: CustomerUser = {
            name: invoice.customerName,
            phone: phoneKey,
            address: invoice.address,
            serviceHistory: newServiceItems,
            lastBookingDate: invoice.createdAt,
            totalBookings: 1,
            joinedAt: new Date().toISOString()
          };
          await setDoc(custRef, newCustomer);
        }
        console.log(`☁️ Customer record updated via invoice for phone: ${phoneKey}`);
      }

      // 4. Log to 'audit_logs'
      const auditRef = doc(collection(db, 'audit_logs'));
      await setDoc(auditRef, {
        id: auditRef.id,
        action: 'invoice_created',
        details: `Created manual invoice ${invoice.id} for ${invoice.customerName} (Total: ₹${invoice.subtotal})`,
        changedBy: activeEmail,
        timestamp: new Date().toISOString()
      });

      return;
    } catch (e) {
      console.error("Error saving invoice to Firestore:", e);
    }
  }

  // Fallback
  const currentInvoices = await getInvoicesFromCloud();
  currentInvoices.unshift(invoice);
  localStorage.setItem('ks_invoices', JSON.stringify(currentInvoices));
};

export const getInvoicesFromCloud = async (): Promise<BookingData[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'invoices'));
      const invoices: BookingData[] = [];
      snap.forEach(doc => {
        invoices.push(doc.data() as BookingData);
      });
      return invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Error fetching invoices from Firestore:", e);
    }
  }

  // Fallback
  if (localStorage.getItem('ks_migration_completed') !== 'true') {
    const local = localStorage.getItem('ks_invoices');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local invoices:", e);
      }
    }
  }
  return [];
};

/* ==========================================
   6. CUSTOMERS COLLECTION
   ========================================== */

export const saveCustomerToCloud = async (user: { name: string; email: string; photoUrl: string; phone?: string }): Promise<CustomerUser> => {
  const phoneKey = user.phone || user.email.split('@')[0];

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'customers', phoneKey);
      const existing = await getDoc(docRef);
      
      const joinedAt = existing.exists() ? existing.data().joinedAt : new Date().toISOString();
      const address = existing.exists() ? (existing.data().address || '') : '';
      const serviceHistory = existing.exists() ? (existing.data().serviceHistory || []) : [];
      const totalBookings = existing.exists() ? (existing.data().totalBookings || 0) : 0;
      const lastBookingDate = existing.exists() ? (existing.data().lastBookingDate || joinedAt) : joinedAt;

      const customer: CustomerUser = {
        name: user.name,
        phone: phoneKey,
        email: user.email,
        photoUrl: user.photoUrl,
        joinedAt,
        address,
        serviceHistory,
        totalBookings,
        lastBookingDate
      };

      await setDoc(docRef, customer);
      console.log(`☁️ Customer ${phoneKey} synced in Firestore.`);
      return customer;
    } catch (e) {
      console.error("Error saving customer to Firestore:", e);
    }
  }

  // Fallback
  const currentCustomers = getCustomersFromCloud();
  const existingIdx = currentCustomers.findIndex(c => c.phone === phoneKey);
  const joinedAt = existingIdx >= 0 ? currentCustomers[existingIdx].joinedAt : new Date().toISOString();
  const address = existingIdx >= 0 ? (currentCustomers[existingIdx].address || '') : '';
  const serviceHistory = existingIdx >= 0 ? (currentCustomers[existingIdx].serviceHistory || []) : [];
  const totalBookings = existingIdx >= 0 ? (currentCustomers[existingIdx].totalBookings || 0) : 0;
  const lastBookingDate = existingIdx >= 0 ? (currentCustomers[existingIdx].lastBookingDate || joinedAt) : joinedAt;

  const customer: CustomerUser = {
    name: user.name,
    phone: phoneKey,
    email: user.email,
    photoUrl: user.photoUrl,
    joinedAt,
    address,
    serviceHistory,
    totalBookings,
    lastBookingDate
  };

  if (existingIdx >= 0) {
    currentCustomers[existingIdx] = customer;
  } else {
    currentCustomers.push(customer);
  }

  localStorage.setItem('ks_registered_customers', JSON.stringify(currentCustomers));
  return customer;
};

export const getCustomersFromCloud = (): CustomerUser[] => {
  const local = localStorage.getItem('ks_registered_customers');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local customer directory:", e);
    }
  }
  return [];
};

export const getCustomersFromFirestore = async (): Promise<CustomerUser[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      const customers: CustomerUser[] = [];
      snap.forEach(doc => {
        customers.push(doc.data() as CustomerUser);
      });
      return customers;
    } catch (e) {
      console.error("Error fetching customers from Firestore:", e);
    }
  }
  return getCustomersFromCloud();
};

/* ==========================================
   7. LOGS & HISTORY RETRIEVALS
   ========================================== */

export const saveAdminLogToCloud = async (adminEmail: string, action: 'admin_login' | 'admin_logout' | 'admin_refresh'): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const logRef = doc(collection(db, 'admin_logs'));
      const logRecord: AdminLog = {
        id: logRef.id,
        adminEmail,
        action,
        timestamp: new Date().toISOString(),
        deviceInfo: navigator.userAgent
      };
      await setDoc(logRef, logRecord);
      console.log(`☁️ Admin log created: ${action} for ${adminEmail}`);
    } catch (e) {
      console.error("Error saving admin log to Firestore:", e);
    }
  }
};

export const getAuditLogsFromCloud = async (): Promise<AuditLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'audit_logs'));
      const logs: AuditLog[] = [];
      snap.forEach(doc => {
        logs.push(doc.data() as AuditLog);
      });
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.error("Error fetching audit logs from Firestore:", e);
    }
  }

  // Fallback
  if (localStorage.getItem('ks_migration_completed') !== 'true') {
    const local = localStorage.getItem('ks_audit_logs');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Error parsing local audit logs:", e);
      }
    }
  }
  return [];
};

export const getPriceHistoryFromCloud = async (): Promise<PriceHistory[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'price_history'));
      const loaded: PriceHistory[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as PriceHistory);
      });
      return loaded.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } catch (e) {
      console.error("Error fetching price history:", e);
    }
  }
  return [];
};

export const getInvoiceHistoryFromCloud = async (): Promise<InvoiceHistory[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'invoice_history'));
      const loaded: InvoiceHistory[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as InvoiceHistory);
      });
      return loaded.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
    } catch (e) {
      console.error("Error fetching invoice history:", e);
    }
  }
  return [];
};

export const getAdminLogsFromCloud = async (): Promise<AdminLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'admin_logs'));
      const loaded: AdminLog[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as AdminLog);
      });
      return loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.error("Error fetching admin logs:", e);
    }
  }
  return [];
};

/* ==========================================
   8. MIGRATION UTILITY
   ========================================== */

export const runMigrationToFirestore = async (): Promise<{ success: boolean; migratedCount: number }> => {
  if (!isFirebaseConfigured || !db) {
    return { success: false, migratedCount: 0 };
  }

  // If already migrated, skip
  if (localStorage.getItem('ks_migration_completed') === 'true') {
    return { success: true, migratedCount: 0 };
  }

  console.log("🚀 Starting LocalStorage to Firestore data migration...");
  let count = 0;

  try {
    // 1. Migrate Branding Configuration
    const localConfig = localStorage.getItem('ks_business_config');
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      await setDoc(doc(db, 'branding', 'current_branding'), parsed);
      count++;
      console.log("✅ Config migrated.");
    }

    // 2. Migrate Services Catalog
    const localServices = localStorage.getItem('ks_services');
    if (localServices) {
      const parsed = JSON.parse(localServices) as TechnicalService[];
      for (const service of parsed) {
        await setDoc(doc(db, 'services', service.id), service);
        count++;
      }
      console.log(`✅ ${parsed.length} services migrated.`);
    }

    // 3. Migrate Bookings & populate customers
    const localBookings = localStorage.getItem('ks_bookings');
    if (localBookings) {
      const parsed = JSON.parse(localBookings) as BookingData[];
      for (const booking of parsed) {
        await setDoc(doc(db, 'bookings', booking.id), booking);
        count++;
        
        // Populate customer record for booking if possible
        const phoneKey = booking.phone.trim();
        if (phoneKey) {
          const custRef = doc(db, 'customers', phoneKey);
          const custSnap = await getDoc(custRef);
          const newServiceItems = booking.items.map(item => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            date: booking.createdAt,
            price: item.price
          }));
          if (custSnap.exists()) {
            const existing = custSnap.data() as CustomerUser;
            const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
            await setDoc(custRef, {
              ...existing,
              serviceHistory: updatedHistory,
              totalBookings: (existing.totalBookings || 0) + 1
            }, { merge: true });
          } else {
            await setDoc(custRef, {
              name: booking.customerName,
              phone: phoneKey,
              address: booking.address,
              serviceHistory: newServiceItems,
              lastBookingDate: booking.createdAt,
              totalBookings: 1,
              joinedAt: new Date().toISOString()
            });
          }
        }
      }
      console.log(`✅ ${parsed.length} bookings migrated.`);
    }

    // 4. Migrate Invoices
    const localInvoices = localStorage.getItem('ks_invoices');
    if (localInvoices) {
      const parsed = JSON.parse(localInvoices) as BookingData[];
      for (const invoice of parsed) {
        await setDoc(doc(db, 'invoices', invoice.id), invoice);
        count++;

        // Add history log in invoice_history
        const historyRef = doc(collection(db, 'invoice_history'));
        const historyRecord: InvoiceHistory = {
          id: historyRef.id,
          invoiceNumber: invoice.id,
          customerDetails: {
            name: invoice.customerName,
            phone: invoice.phone,
            address: invoice.address,
            selectedLocation: invoice.selectedLocation
          },
          items: invoice.items,
          totalAmount: invoice.subtotal,
          generatedDate: invoice.createdAt,
          pdfMetadata: {
            printDate: new Date().toISOString(),
            operatorIdentity: 'system_migration'
          }
        };
        await setDoc(historyRef, historyRecord);
        count++;
      }
      console.log(`✅ ${parsed.length} invoices migrated.`);
    }

    // 5. Migrate Registered Customers
    const localCustomers = localStorage.getItem('ks_registered_customers');
    if (localCustomers && db) {
      const parsed = JSON.parse(localCustomers) as Partial<CustomerUser>[];
      for (const customer of parsed) {
        const phoneKey = customer.phone || (customer.email ? customer.email.split('@')[0] : '');
        if (phoneKey) {
          const custRef = doc(db, 'customers', phoneKey);
          const snap = await getDoc(custRef);
          if (!snap.exists()) {
            await setDoc(custRef, {
              name: customer.name,
              phone: phoneKey,
              email: customer.email,
              photoUrl: customer.photoUrl,
              address: customer.address || 'Address migrated',
              serviceHistory: customer.serviceHistory || [],
              lastBookingDate: customer.lastBookingDate || customer.joinedAt,
              totalBookings: customer.totalBookings || 1,
              joinedAt: customer.joinedAt || new Date().toISOString()
            });
            count++;
          }
        }
      }
      console.log(`✅ ${parsed.length} customers migrated.`);
    }

    // 6. Migrate Audit Logs
    const localAudits = localStorage.getItem('ks_audit_logs');
    if (localAudits && db) {
      const parsed = JSON.parse(localAudits) as Partial<AuditLog & { serviceName?: string; oldPrice?: number; newPrice?: number }>[];
      for (const log of parsed) {
        const docRef = doc(collection(db, 'audit_logs'));
        await setDoc(docRef, {
          id: docRef.id,
          action: log.action || 'price_changed',
          details: log.details || `Price of ${log.serviceName || ''} changed from ₹${log.oldPrice || 0} to ₹${log.newPrice || 0}`,
          changedBy: log.changedBy || 'admin@kselectrical.in',
          timestamp: log.timestamp || new Date().toISOString()
        });
        count++;
      }
      console.log(`✅ ${parsed.length} audit logs migrated.`);
    }

    // Set migration complete
    localStorage.setItem('ks_migration_completed', 'true');
    console.log("🎉 Migration completed successfully!");

    // Clean up old items to stop using localStorage permanently
    localStorage.removeItem('ks_business_config');
    localStorage.removeItem('ks_services');
    localStorage.removeItem('ks_bookings');
    localStorage.removeItem('ks_invoices');
    localStorage.removeItem('ks_registered_customers');
    localStorage.removeItem('ks_audit_logs');
    
    return { success: true, migratedCount: count };
  } catch (e) {
    console.error("❌ Migration failed:", e);
    return { success: false, migratedCount: count };
  }
};
