# Firestore Security Rules Configuration

Copy and paste the rules block below into your **Firestore Database -> Rules** tab on the Firebase Console to secure your database collections in production.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: checks if the client request is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper: verifies if the client user's Google email exists in the 'admins' collection
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }

    // 1. Admins Collection
    // Read: Any logged in user (to check their admin role status)
    // Write: Blocked on client (manage directly via Firebase Console console for security)
    match /admins/{email} {
      allow read: if isAuthenticated();
      allow write: if false; 
    }

    // 2. Services Catalog Collection
    // Read: Anyone (public catalog)
    // Write: Only registered administrators
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 3. Branding & Config Settings Collection
    // Read: Anyone (public business contact details, logo paths)
    // Write: Only registered administrators
    match /branding_settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 4. Bookings Collection
    // Read: Admins or the specific authenticated customer who placed it
    // Create: Anyone (guest checkout allowed) or authenticated users
    // Update/Delete: Only administrators
    match /bookings/{bookingId} {
      allow read: if isAdmin() || (isAuthenticated() && resource.data.email == request.auth.token.email);
      allow create: if true; 
      allow update, delete: if isAdmin();
    }

    // 5. Invoices Collection (Manual Ledger Invoices)
    // Read/Write: Only administrators
    match /invoices/{invoiceId} {
      allow read, write: if isAdmin();
    }

    // 6. Customers Collection
    // Read/Write: Admins or the owner customer matching their authenticated email
    match /customers/{email} {
      allow read: if isAdmin() || (isAuthenticated() && request.auth.token.email == email);
      allow write: if isAdmin() || (isAuthenticated() && request.auth.token.email == email);
    }

    // 7. Audit Logs Collection
    // Read/Write: Only administrators
    match /audit_logs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}
```
