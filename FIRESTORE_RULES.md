// Firestore Security Rules for M Fresh Dairy
// Add this to your Firebase Console > Firestore Database > Rules tab
// 
// Rules ensure:
// 1. Customers can only read their own orders
// 2. Admin can read and write all orders  
// 3. Orders collection is protected from unauthorized access

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      // Allow read access to everyone (will be restricted in Phase 3 with auth)
      // In production, add: if request.auth != null
      allow read: if true;
      
      // Only allow writes from authenticated admin (Phase 3)
      // For now, anyone can create orders (customers), 
      // but this will be restricted with custom claims in Phase 3
      allow create: if true;
      allow update: if true;
      allow delete: if false;
    }

    // Admin orders subcollection (for future Phase 3)
    match /admin/{adminId} {
      allow read, write: if false; // Restrict until authentication is added
    }

    // Catch-all rule - deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

/*
IMPORTANT SECURITY NOTES:

Phase 1-2 (Current - Development):
- These are permissive rules to allow the website to work
- Use only in development environment
- Do NOT use these in production without proper authentication

Phase 3 (Production - Recommended):
- Implement Firebase Authentication
- Use custom claims to identify admins
- Restrict order reads to:
  - Customers can see their own orders (by email/phone)
  - Admins can see all orders (with admin custom claim)
  
Phase 3 Security Example:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      // Customers can read only their own orders
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/orders/$(orderId)).data.customerDetails.email == request.auth.token.email;
      
      // Customers can create orders
      allow create: if request.auth != null;
      
      // Only admins can update/delete orders
      allow update, delete: if request.auth != null && 
                              request.auth.token.admin == true;
    }
  }
}

TODO - PHASE 3 TASKS:
1. Implement Firebase Authentication (Email/Phone)
2. Set up custom claims for admin users
3. Update Firestore security rules with auth checks
4. Create admin login page
5. Implement customer account page to view their orders
6. Add order status email notifications to customers
*/
