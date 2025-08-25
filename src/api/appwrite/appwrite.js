import { Client, Databases, Account, Storage, ID, Query } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://syd.cloud.appwrite.io/v1") // Sydney endpoint
  .setProject("68ab6b7400264124f765"); // Your project ID

// Export the client for additional configuration if needed
export { client };

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

// Database and collection IDs
export const DATABASE_ID = "68ab6c3a0032aabf5c59"; // Your database ID

// Collection IDs (you'll need to create these in Appwrite)
export const COLLECTIONS = {
  RESIDENTS: "residents",
  DIGITAL_IDS: "digital_ids", 
  SERVICES: "services",
  ADMINS: "admins"
};

// Storage bucket IDs (you'll need to create these in Appwrite)
export const BUCKETS = {
  PROFILE_PHOTOS: "profile_photos",
  DOCUMENTS: "documents",
  ID_PHOTOS: "id_photos"
};

// Authentication functions
export const authService = {
  // Create account
  async createAccount(email, password, name) {
    try {
      const newAccount = await account.create(ID.unique(), email, password, name);
      return newAccount;
    } catch (error) {
      throw error;
    }
  },

  // Login
  async login(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  async updateProfile(name) {
    try {
      return await account.updateName(name);
    } catch (error) {
      throw error;
    }
  }
};

// Database functions for residents
export const residentService = {
  // Create resident profile
  async createResident(residentData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.RESIDENTS,
        ID.unique(),
        residentData
      );
    } catch (error) {
      throw error;
    }
  },

  // Get resident by user ID
  async getResidentByUserId(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESIDENTS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Update resident profile
  async updateResident(documentId, residentData) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.RESIDENTS,
        documentId,
        residentData
      );
    } catch (error) {
      throw error;
    }
  },

  // Get all residents (for admin)
  async getAllResidents() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESIDENTS
      );
    } catch (error) {
      throw error;
    }
  }
};

// Database functions for digital IDs
export const digitalIdService = {
  // Create digital ID
  async createDigitalId(idData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        ID.unique(),
        idData
      );
    } catch (error) {
      throw error;
    }
  },

  // Get digital ID by resident ID
  async getDigitalIdByResident(residentId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        [Query.equal('residentId', residentId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Update digital ID
  async updateDigitalId(documentId, idData) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        documentId,
        idData
      );
    } catch (error) {
      throw error;
    }
  }
};

// Database functions for services
export const serviceRequestService = {
  // Create service request
  async createServiceRequest(serviceData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SERVICES,
        ID.unique(),
        serviceData
      );
    } catch (error) {
      throw error;
    }
  },

  // Get service requests by resident
  async getServiceRequestsByResident(residentId) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SERVICES,
        [Query.equal('residentId', residentId)]
      );
    } catch (error) {
      throw error;
    }
  },

  // Get all service requests (for admin)
  async getAllServiceRequests() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SERVICES
      );
    } catch (error) {
      throw error;
    }
  },

  // Update service request status
  async updateServiceStatus(documentId, status, adminNotes = '') {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.SERVICES,
        documentId,
        { status, adminNotes, updatedAt: new Date().toISOString() }
      );
    } catch (error) {
      throw error;
    }
  }
};

// Storage functions
export const storageService = {
  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      return await storage.createFile(
        BUCKETS.PROFILE_PHOTOS,
        ID.unique(),
        file
      );
    } catch (error) {
      throw error;
    }
  },

  // Upload document
  async uploadDocument(file) {
    try {
      return await storage.createFile(
        BUCKETS.DOCUMENTS,
        ID.unique(),
        file
      );
    } catch (error) {
      throw error;
    }
  },

  // Get file preview URL
  getFilePreview(bucketId, fileId, width = 400, height = 400) {
    return storage.getFilePreview(bucketId, fileId, width, height);
  },

  // Delete file
  async deleteFile(bucketId, fileId) {
    try {
      return await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      throw error;
    }
  }
};

// Admin functions
export const adminService = {
  // Check if user is admin
  async isAdmin(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        [Query.equal('userId', userId)]
      );
      return response.documents.length > 0;
    } catch (error) {
      return false;
    }
  },

  // Create admin account
  async createAdmin(adminData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        ID.unique(),
        adminData
      );
    } catch (error) {
      throw error;
    }
  }
};