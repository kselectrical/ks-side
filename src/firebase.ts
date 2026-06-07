import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc 
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
  email: string;
  photoUrl: string;
  joinedAt: string;
  phone?: string; // Stored permanently
}

export interface AuditLog {
  id: string;
  action: string;      // e.g., 'price_change'
  serviceId: string;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;   // admin email
  timestamp: string;
}

// Check if Firebase credentials are fully configured in environmental variables
export const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project-id' &&
  import.meta.env.VITE_FIREBASE_API_KEY
);

// Firebase SDK App Instances
let app;
export let db: any = null;
export let auth: any = null;
export let googleProvider: any = null;

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
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  console.log("🔥 Firebase Web Client initialized. Connected to live Cloud services.");
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
      const docRef = doc(db, 'branding_settings', 'current_branding');
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

  // LocalStorage Fallback Mode
  const local = localStorage.getItem('ks_business_config');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local business config:", e);
    }
  }
  localStorage.setItem('ks_business_config', JSON.stringify(fallback));
  return fallback;
};

export const saveBusinessConfigToDb = async (config: BusinessConfig): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'branding_settings', 'current_branding'), config);
      console.log("☁️ Branding synced to Firestore.");
      return;
    } catch (e) {
      console.error("Error updating branding in Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
  localStorage.setItem('ks_business_config', JSON.stringify(config));
  console.log("📁 Branding saved to LocalStorage simulator.");
};

/* ==========================================
   3. SERVICES CATALOG COLLECTION
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

  // LocalStorage Fallback Mode
  const local = localStorage.getItem('ks_services');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local services:", e);
    }
  }
  localStorage.setItem('ks_services', JSON.stringify(initialServices));
  return initialServices;
};

/**
 * Updates services catalog and logs any price modifications in the 'audit_logs' collection.
 */
export const saveServicesToDb = async (services: TechnicalService[]): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      // 1. Fetch current services to compare prices
      const snap = await getDocs(collection(db, 'services'));
      const oldServicesMap = new Map<string, TechnicalService>();
      snap.forEach(doc => {
        const data = doc.data() as TechnicalService;
        oldServicesMap.set(data.id, data);
      });

      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      // 2. Scan for price changes
      for (const newSrv of services) {
        const oldSrv = oldServicesMap.get(newSrv.id);
        if (oldSrv && oldSrv.price !== newSrv.price) {
          // Log price change in audit_logs collection
          const auditRef = doc(collection(db, 'audit_logs'));
          await setDoc(auditRef, {
            id: auditRef.id,
            action: 'price_change',
            serviceId: newSrv.id,
            serviceName: newSrv.name,
            oldPrice: oldSrv.price,
            newPrice: newSrv.price,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
          console.log(`📝 Audit logged: Price of ${newSrv.name} changed from ₹${oldSrv.price} to ₹${newSrv.price}`);
        }
        // Save/Update in Firestore
        await setDoc(doc(db, 'services', newSrv.id), newSrv);
      }

      // 3. Scan for deleted services to remove them from Firestore
      const newIds = new Set(services.map(s => s.id));
      for (const oldId of oldServicesMap.keys()) {
        if (!newIds.has(oldId)) {
          await deleteDoc(doc(db, 'services', oldId));
          console.log(`🗑️ Removed deleted service ${oldId} from Firestore.`);
        }
      }
      return;
    } catch (e) {
      console.error("Error saving services to Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
  const oldLocal = localStorage.getItem('ks_services');
  if (oldLocal) {
    try {
      const oldList = JSON.parse(oldLocal) as TechnicalService[];
      const oldMap = new Map(oldList.map(s => [s.id, s]));
      const activeEmail = 'admin@kselectrical.in';

      for (const newSrv of services) {
        const oldSrv = oldMap.get(newSrv.id);
        if (oldSrv && oldSrv.price !== newSrv.price) {
          const audits = JSON.parse(localStorage.getItem('ks_audit_logs') || '[]');
          audits.push({
            id: 'audit-' + Date.now(),
            action: 'price_change',
            serviceId: newSrv.id,
            serviceName: newSrv.name,
            oldPrice: oldSrv.price,
            newPrice: newSrv.price,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('ks_audit_logs', JSON.stringify(audits));
        }
      }
    } catch (e) {
      console.error("LocalStorage audit compare failed:", e);
    }
  }
  localStorage.setItem('ks_services', JSON.stringify(services));
  console.log("📁 Services saved to LocalStorage simulator.");
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
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
      console.log(`☁️ Booking ${newBooking.id} saved to Firestore.`);
      
      // Update/Associate customer's permanent phone number if email is available
      const customerEmail = auth?.currentUser?.email;
      if (customerEmail && newBooking.phone) {
        await saveCustomerToCloud({
          name: newBooking.customerName,
          email: customerEmail,
          photoUrl: auth.currentUser.photoURL || '/profile.png',
          phone: newBooking.phone
        });
      }
      return newBooking;
    } catch (e) {
      console.error("Error saving booking to Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
  const currentBookings = await getBookingsFromCloud();
  currentBookings.unshift(newBooking);
  localStorage.setItem('ks_bookings', JSON.stringify(currentBookings));
  return newBooking;
};

export const updateBookingStatusInCloud = async (bookingId: string, newStatus: 'Pending' | 'Completed' | 'Cancelled'): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) {
        await setDoc(bookingRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Booking ${bookingId} status updated to ${newStatus} in Firestore.`);
        return;
      }
      
      const invoiceRef = doc(db, 'invoices', bookingId);
      const invoiceSnap = await getDoc(invoiceRef);
      if (invoiceSnap.exists()) {
        await setDoc(invoiceRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Invoice ${bookingId} status updated to ${newStatus} in Firestore.`);
        return;
      }
    } catch (e) {
      console.error("Error updating booking/invoice status in Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
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

  // LocalStorage Fallback Mode
  const local = localStorage.getItem('ks_bookings');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing bookings:", e);
    }
  }
  return [];
};

/* ==========================================
   5. INVOICES COLLECTION (Manual Invoices Ledger)
   ========================================== */

export const saveInvoiceToCloud = async (invoice: BookingData): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
      console.log(`☁️ Manual Invoice ${invoice.id} saved to Firestore.`);
      return;
    } catch (e) {
      console.error("Error saving invoice to Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
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

  // LocalStorage Fallback Mode
  const local = localStorage.getItem('ks_invoices');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local invoices:", e);
    }
  }
  return [];
};

/* ==========================================
   6. CUSTOMERS COLLECTION
   ========================================== */

/**
 * Saves or updates customer details in Firestore, preserving pre-existing values like phone numbers.
 */
export const saveCustomerToCloud = async (user: { name: string; email: string; photoUrl: string; phone?: string }): Promise<CustomerUser> => {
  const cleanEmail = user.email.trim().toLowerCase();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'customers', cleanEmail);
      const existing = await getDoc(docRef);
      
      const joinedAt = existing.exists() ? existing.data().joinedAt : new Date().toISOString();
      const phone = user.phone || (existing.exists() ? (existing.data().phone || '') : '');

      const customer: CustomerUser = {
        name: user.name,
        email: cleanEmail,
        photoUrl: user.photoUrl,
        joinedAt,
        phone
      };

      await setDoc(docRef, customer);
      console.log(`☁️ Customer ${cleanEmail} synced in Firestore (Phone: ${phone}).`);
      return customer;
    } catch (e) {
      console.error("Error saving customer to Firestore:", e);
    }
  }

  // LocalStorage Fallback Mode
  const currentCustomers = getCustomersFromCloud();
  const existingIdx = currentCustomers.findIndex(c => c.email === cleanEmail);
  const joinedAt = existingIdx >= 0 ? currentCustomers[existingIdx].joinedAt : new Date().toISOString();
  const phone = user.phone || (existingIdx >= 0 ? (currentCustomers[existingIdx].phone || '') : '');

  const customer: CustomerUser = {
    name: user.name,
    email: cleanEmail,
    photoUrl: user.photoUrl,
    joinedAt,
    phone
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
  if (isFirebaseConfigured && db) {
    // Note: Due to synchronous type return, real firestore fetch is backed by async triggers, 
    // but in component page lifecycle we fetch them via dedicated triggers. 
    // Fallback loads from cache, we will also fetch dynamically inside pages.
  }

  // LocalStorage Fallback Mode
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

/**
 * Dedicated Async retrieve all customer profiles from Firestore database
 */
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
   7. AUDIT LOGS RETRIEVAL
   ========================================== */

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

  // LocalStorage Fallback Mode
  const local = localStorage.getItem('ks_audit_logs');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local audit logs:", e);
    }
  }
  return [];
};
