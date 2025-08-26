// Test script to verify admin login functionality
import { authService, adminService } from '../api/appwrite/appwrite.js';

// Test admin login
export const testAdminLogin = async (email, password) => {
  try {
    console.log('Testing admin login...');
    
    // Step 1: Login to Appwrite Auth
    const session = await authService.login(email, password);
    console.log('✅ Auth login successful');
    
    // Step 2: Get current user
    const user = await authService.getCurrentUser();
    console.log('✅ Got current user:', user.email);
    
    // Step 3: Check admin status
    const isAdmin = await adminService.isAdmin(user.$id);
    console.log('✅ Admin status:', isAdmin);
    
    if (isAdmin) {
      console.log('🎉 Admin login test PASSED!');
      return true;
    } else {
      console.log('❌ User is not an admin');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Admin login test FAILED:', error);
    return false;
  }
};

// Run test - uncomment and replace with your credentials
// testAdminLogin('your-admin-email@example.com', 'your-password');
