// Complete Admin Setup Script
// This script will create both the auth user and admin record

import { authService, adminService, databases, ID, DATABASE_ID, COLLECTIONS } from '../api/appwrite/appwrite.js';

// REPLACE THESE WITH YOUR ACTUAL ADMIN CREDENTIALS
const ADMIN_CREDENTIALS = {
  email: "admin@ebrgy.gov.ph",  // Change this to your desired admin email
  password: "Admin123!",        // Change this to your desired admin password
  name: "System Administrator"  // Change this to the admin name
};

// Step 1: Create Admin Auth User
export const createAdminAuthUser = async () => {
  try {
    console.log('🔐 Creating admin auth user...');
    
    const newUser = await authService.createAccount(
      ADMIN_CREDENTIALS.email,
      ADMIN_CREDENTIALS.password,
      ADMIN_CREDENTIALS.name
    );
    
    console.log('✅ Admin auth user created:', newUser);
    return newUser;
  } catch (error) {
    if (error.code === 409 || error.type === 'user_already_exists') {
      console.log('ℹ️ Admin user already exists in auth');
      // Try to get the existing user
      try {
        await authService.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
        const existingUser = await authService.getCurrentUser();
        console.log('✅ Found existing admin user:', existingUser);
        await authService.logout(); // Logout after getting info
        return existingUser;
      } catch (loginError) {
        console.error('❌ Could not login to existing user:', loginError);
        throw loginError;
      }
    } else {
      console.error('❌ Error creating admin user:', error);
      throw error;
    }
  }
};

// Step 2: Create Admin Database Record
export const createAdminDatabaseRecord = async (userId) => {
  try {
    console.log('📊 Creating admin database record...');
    
    // Check if admin record already exists
    const existing = await adminService.getAdminByUserId(userId);
    if (existing) {
      console.log('ℹ️ Admin record already exists:', existing);
      return existing;
    }
    
    // Create new admin record
    const adminData = {
      userId: userId,
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const adminRecord = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ADMINS,
      ID.unique(),
      adminData
    );
    
    console.log('✅ Admin database record created:', adminRecord);
    return adminRecord;
  } catch (error) {
    console.error('❌ Error creating admin database record:', error);
    throw error;
  }
};

// Step 3: Test Admin Login
export const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing admin login...');
    
    // Login
    const session = await authService.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    console.log('✅ Login successful');
    
    // Get user
    const user = await authService.getCurrentUser();
    console.log('✅ Got user:', user.email);
    
    // Check admin status
    const isAdmin = await adminService.isAdmin(user.$id);
    console.log('✅ Is admin:', isAdmin);
    
    // Logout
    await authService.logout();
    console.log('✅ Logout successful');
    
    if (isAdmin) {
      console.log('🎉 ADMIN SETUP COMPLETE! You can now login with:');
      console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
      console.log(`   Password: ${ADMIN_CREDENTIALS.password}`);
      return true;
    } else {
      console.log('❌ Admin setup failed - user is not marked as admin');
      return false;
    }
  } catch (error) {
    console.error('❌ Admin login test failed:', error);
    return false;
  }
};

// Main Setup Function
export const setupCompleteAdmin = async () => {
  try {
    console.log('🚀 Starting complete admin setup...');
    console.log('=====================================');
    
    // Step 1: Create auth user
    const authUser = await createAdminAuthUser();
    
    // Step 2: Create database record
    await createAdminDatabaseRecord(authUser.$id);
    
    // Step 3: Test login
    const success = await testAdminLogin();
    
    console.log('=====================================');
    if (success) {
      console.log('🎉 ADMIN SETUP COMPLETED SUCCESSFULLY!');
      console.log(`✅ Admin Email: ${ADMIN_CREDENTIALS.email}`);
      console.log(`✅ Admin Password: ${ADMIN_CREDENTIALS.password}`);
      console.log('You can now login to the admin panel!');
    } else {
      console.log('❌ ADMIN SETUP FAILED');
    }
    
    return success;
  } catch (error) {
    console.error('💥 Fatal error during admin setup:', error);
    return false;
  }
};

// Instructions for running this script:
console.log(`
🔧 ADMIN SETUP INSTRUCTIONS:
============================

1. Update the ADMIN_CREDENTIALS object above with your desired admin email and password
2. Open browser console on your app (F12 → Console)
3. Run one of these commands:

   // For complete setup (recommended):
   import('./utils/setupAdmin.js').then(m => m.setupCompleteAdmin())
   
   // Or step by step:
   import('./utils/setupAdmin.js').then(m => m.createAdminAuthUser())
   import('./utils/setupAdmin.js').then(m => m.testAdminLogin())

4. After setup is complete, you can login with the admin credentials
`);

// Uncomment the line below to run automatically when imported
// setupCompleteAdmin();
