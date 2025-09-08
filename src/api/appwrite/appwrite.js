import { Client, Databases, Account, Storage, ID, Query } from "appwrite";
import { config } from "../../config/env.js";

const client = new Client();
client
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID);

// Export the client for additional configuration if needed
export { client };

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

// Database and collection IDs
export const DATABASE_ID = config.APPWRITE_DATABASE_ID;

// Collection IDs (you'll need to create these in Appwrite)
export const COLLECTIONS = {
  RESIDENTS: "residents",
  USER_INFO: "user_info",
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
      // Don't log 401 errors as they're expected when user is not logged in
      if (error.code === 401 || error.type === 'general_unauthorized_scope') {
        return null;
      }
      console.error('Error getting current user:', error);
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
  },

  // Send email verification
  async sendEmailVerification(url) {
    try {
      return await account.createVerification(url);
    } catch (error) {
      throw error;
    }
  },

  // Verify email with secret
  async verifyEmail(userId, secret) {
    try {
      return await account.updateVerification(userId, secret);
    } catch (error) {
      throw error;
    }
  },

  // Check if email is verified
  async isEmailVerified() {
    try {
      const user = await account.get();
      return user.emailVerification;
    } catch (error) {
      return false;
    }
  }
};

// Database functions for residents
export const residentService = {
  // Check if email already exists
  async checkEmailExists(email) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESIDENTS,
        [Query.equal('email', email.toLowerCase())]
      );
      return response.documents.length > 0;
    } catch (error) {
      return false;
    }
  },

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

// Database functions for user info
export const userInfoService = {
  // Helper function to check available attributes for user_info collection
  async getUserInfoCollectionAttributes() {
    try {
      const collection = await databases.getCollection(DATABASE_ID, COLLECTIONS.USER_INFO);
      return collection.attributes.map(attr => attr.key);
    } catch (error) {
      return [];
    }
  },

  // Helper function to prepare user info data based on available attributes
  async prepareUserInfoData(baseData) {
    const availableAttributes = await this.getUserInfoCollectionAttributes();
    const preparedData = { ...baseData };
    
    // Add timestamp fields only if they exist in the collection
    const currentTime = new Date().toISOString();
    
    if (availableAttributes.includes('createdAt')) {
      preparedData.createdAt = currentTime;
    }
    
    return preparedData;
  },

  // Create user info profile
  async createUserInfo(userInfoData) {
    try {
      const preparedData = await this.prepareUserInfoData(userInfoData);
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_INFO,
        ID.unique(),
        preparedData
      );
    } catch (error) {
      throw error;
    }
  },

  // Get user info by user ID
  async getUserInfoByUserId(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_INFO,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Update user info
  async updateUserInfo(documentId, userInfoData) {
    try {
    // Add updatedAt if the attribute exists
    const availableAttributes = await this.getUserInfoCollectionAttributes();
    const updateData = { ...userInfoData };
      
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_INFO,
        documentId,
        updateData
      );
    } catch (error) {
      throw error;
    }
  },

  // Create or update user info (upsert operation)
  async upsertUserInfo(userId, userInfoData) {
    try {
      const existingInfo = await this.getUserInfoByUserId(userId);
      
      if (existingInfo) {
        // Update existing record
        return await this.updateUserInfo(existingInfo.$id, userInfoData);
      } else {
        // Create new record
        return await this.createUserInfo({
          userId,
          ...userInfoData
        });
      }
    } catch (error) {
      throw error;
    }
  }
};

// Database functions for digital IDs
export const digitalIdService = {
  // Helper function to check available attributes
  async getCollectionAttributes() {
    try {
      const collection = await databases.getCollection(DATABASE_ID, COLLECTIONS.DIGITAL_IDS);
      return collection.attributes.map(attr => attr.key);
    } catch (error) {
      return [];
    }
  },

  // Helper function to prepare data based on available attributes
  async prepareDigitalIdData(baseData) {
    const availableAttributes = await this.getCollectionAttributes();
    const preparedData = { ...baseData };
    
    // Add timestamp fields only if they exist in the collection
    const currentTime = new Date().toISOString();
    
    if (availableAttributes.includes('createdAt')) {
      preparedData.createdAt = currentTime;
    }
    
    return preparedData;
  },

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

  // Get digital ID by document ID
  async getDigitalIdById(documentId) {
    try {
      const result = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        documentId
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get digital ID by user ID
  async getDigitalIdByUserId(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      // Handle specific error cases
      if (error.code === 404) {
        // Collection doesn't exist
        throw new Error('Collection with the requested ID could not be found. Please contact administrator.');
      } else if (error.code === 401 || error.type === 'user_unauthorized') {
        // Permission issue
        throw error;
      }
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
      if (!documentId) {
        throw new Error('Document ID is required for update operation')
      }
      
      // First verify the document exists and get current state
      let currentDoc
      try {
        currentDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DIGITAL_IDS, documentId)
      } catch (fetchError) {
        throw new Error(`Document ${documentId} does not exist`)
      }
      
      // Check if the update would actually change anything
      let hasChanges = false
      for (const [key, value] of Object.entries(idData)) {
        if (currentDoc[key] !== value) {
          hasChanges = true
          break
        }
      }
      
      if (!hasChanges) {
        return currentDoc
      }
      
      // Attempt the direct update
      const result = await databases.updateDocument(DATABASE_ID, COLLECTIONS.DIGITAL_IDS, documentId, idData)
      
      // Verify the update was successful by checking key fields
      const keyUpdatesApplied = Object.entries(idData).every(([key, value]) => result[key] === value)
      if (!keyUpdatesApplied) {
        console.warn('Warning: Some updates may not have been applied properly')
      }
      
      return result
      
    } catch (error) {
      // If it's a unique constraint error, try the safe update method
      if (error.code === 409 || error.message?.includes('already exists')) {
        try {
          const { updateDigitalIdSafe } = await import('../../utils/appwriteHelper.js')
          return await updateDigitalIdSafe(documentId, idData)
        } catch (safeUpdateError) {
          throw safeUpdateError
        }
      }
      
      throw error
    }
  },

  // Generate ID number
  generateIdNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    return `BRG-${year}-${timestamp}`;
  },

  // Generate QR code data
  generateQRCode(userData, idNumber) {
    const birthYear = new Date(userData.birthDate).getFullYear();
    const genderCode = userData.gender === 'Male' ? 'M' : userData.gender === 'Female' ? 'F' : 'O';
    const age = new Date().getFullYear() - birthYear;
    
    return `EBRGY${idNumber.replace(/[^0-9]/g, '')}${userData.firstName.toUpperCase()}${userData.lastName.toUpperCase()}${birthYear}${age.toString().padStart(2, '0')}${genderCode}`;
  },

  // Request ID generation
  async requestIdGeneration(userId, residentId, userData, userInfoData) {
    try {
      // Check if user already has a digital ID
      const existingId = await this.getDigitalIdByUserId(userId);
      if (existingId) {
        throw new Error('Digital ID already exists for this user');
      }

      // Generate ID number
      const idNumber = this.generateIdNumber();
      
      // Generate QR code
      const qrCode = this.generateQRCode({
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userInfoData.gender
      }, idNumber);

      // Create base digital ID data
      const baseData = {
        userId,
        residentId,
        idNumber,
        status: 'pending_generation',
        qrCode
      };

    // Prepare data with available attributes only
    const digitalIdData = await this.prepareDigitalIdData(baseData);

      return await this.createDigitalId(digitalIdData);
    } catch (error) {
      throw error;
    }
  },

  // Request verification (user action after ID generation)
  async requestVerification(digitalIdDocumentId) {
    try {
      const updateData = {
        status: 'pending_verification'
      };

      // Add verificationRequestDate if the attribute exists
      const availableAttributes = await this.getCollectionAttributes();
      
      if (availableAttributes.includes('verificationRequestDate')) {
        updateData.verificationRequestDate = new Date().toISOString();
      }

      return await this.updateDigitalId(digitalIdDocumentId, updateData);
    } catch (error) {
      throw error;
    }
  },

  // Approve verification (admin action)
  async approveVerification(digitalIdDocumentId, adminUserId) {
    try {
      if (!digitalIdDocumentId) {
        throw new Error('Digital ID document ID is required')
      }
      
      if (!adminUserId) {
        throw new Error('Admin user ID is required')
      }
      
      // First, check if the document exists and get its current state
      let existingDoc
      try {
        existingDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DIGITAL_IDS, digitalIdDocumentId)
        
        if (existingDoc.status === 'active') {
          return existingDoc // Return existing document if already approved
        }
        
        if (existingDoc.status !== 'pending_verification') {
          throw new Error(`Cannot approve document with status: ${existingDoc.status}. Only documents with 'pending_verification' status can be approved.`)
        }
      } catch (getError) {
        throw new Error(`Document ${digitalIdDocumentId} not found or inaccessible: ${getError.message}`)
      }
      
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setFullYear(currentDate.getFullYear() + 5); // 5 years validity

      const updateData = {
        status: 'active',
        verifiedBy: adminUserId,
        verifiedDate: currentDate.toISOString(),
        issuedDate: currentDate.toISOString(),
        expiryDate: expiryDate.toISOString()
      };
      
      // Use the updated updateDigitalId method
      const result = await this.updateDigitalId(digitalIdDocumentId, updateData);
      
      // Validate the update was successful
      if (result.status !== 'active') {
        throw new Error(`Approval failed: Expected status 'active', but got '${result.status}'`)
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Reject verification (admin action)
  async rejectVerification(digitalIdDocumentId, adminUserId, rejectionReason) {
    try {
      if (!digitalIdDocumentId) {
        throw new Error('Digital ID document ID is required')
      }
      
      if (!adminUserId) {
        throw new Error('Admin user ID is required')
      }
      
      if (!rejectionReason || !rejectionReason.trim()) {
        throw new Error('Rejection reason is required')
      }
      
      // First, check if the document exists and get its current state
      let existingDoc
      try {
        existingDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DIGITAL_IDS, digitalIdDocumentId)
        
        if (existingDoc.status === 'rejected') {
          return existingDoc // Return existing document if already rejected
        }
        
        if (existingDoc.status !== 'pending_verification') {
          throw new Error(`Cannot reject document with status: ${existingDoc.status}. Only documents with 'pending_verification' status can be rejected.`)
        }
      } catch (getError) {
        throw new Error(`Document ${digitalIdDocumentId} not found or inaccessible: ${getError.message}`)
      }
      
      const updateData = {
        status: 'rejected',
        verifiedBy: adminUserId,
        rejectionReason: rejectionReason.trim()
      };
      
      // Use the updated updateDigitalId method
      const result = await this.updateDigitalId(digitalIdDocumentId, updateData);
      
      // Validate the update was successful
      if (result.status !== 'rejected') {
        throw new Error(`Rejection failed: Expected status 'rejected', but got '${result.status}'`)
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get all pending verifications (for admin)
  async getPendingVerifications() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        [Query.equal('status', 'pending_verification')]
      );
    } catch (error) {
      throw error;
    }
  },

  // Get all digital IDs with various filters (for admin)
  async getAllDigitalIds(statusFilter = null) {
    try {
      const queries = [];
      if (statusFilter && statusFilter !== 'all') {
        queries.push(Query.equal('status', statusFilter));
      }
      
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DIGITAL_IDS,
        queries
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
        { status, adminNotes }
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
      console.error('Error checking admin status:', error);
      // Return false instead of throwing to prevent app crashes
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
  },

  // Get admin by user ID
  async getAdminByUserId(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error getting admin:', error);
      return null;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ADMINS
      );
    } catch (error) {
      throw error;
    }
  },

  // Update admin status
  async updateAdminStatus(documentId, isActive) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ADMINS,
        documentId,
        { isActive }
      );
    } catch (error) {
      throw error;
    }
  }
};