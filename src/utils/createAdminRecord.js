// Utility script to create admin record in Admins collection
// Run this once after setting up the collection attributes

import { databases, ID, DATABASE_ID, COLLECTIONS, Query } from '../api/appwrite/appwrite.js';

// Admin user details - UPDATE THESE WITH YOUR ACTUAL ADMIN DETAILS
const ADMIN_USER_DATA = {
  userId: "YOUR_ADMIN_USER_ID_FROM_AUTH", // Get this from Appwrite Auth console
  email: "admin@ebrgy.gov.ph", // Your admin email
  name: "System Administrator", // Admin name
  role: "admin",
  isActive: true,
  createdAt: new Date().toISOString()
};

// Function to create admin record
export const createAdminRecord = async () => {
  try {
    console.log('Creating admin record...');
    
    const adminRecord = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ADMINS,
      ID.unique(),
      ADMIN_USER_DATA
    );
    
    console.log('Admin record created successfully:', adminRecord);
    return adminRecord;
  } catch (error) {
    console.error('Error creating admin record:', error);
    throw error;
  }
};

// Function to check if admin already exists
export const checkAdminExists = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMINS,
      [Query.equal('userId', userId)]
    );
    
    return response.documents.length > 0;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

// Main function to run the setup
export const setupAdmin = async () => {
  try {
    const exists = await checkAdminExists(ADMIN_USER_DATA.userId);
    
    if (exists) {
      console.log('Admin record already exists');
      return;
    }
    
    await createAdminRecord();
    console.log('Admin setup completed successfully!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
};

// Uncomment the line below and run this file to create the admin record
// setupAdmin();
