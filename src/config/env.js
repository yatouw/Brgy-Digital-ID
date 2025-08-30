// Environment configuration
// This file reads from environment variables for security
// Fallback values are provided for development only

export const config = {
  // Primary configuration from environment variables
  APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT || "https://syd.cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID || "68ab6b7400264124f765",
  APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || "68ab6c3a0032aabf5c59"
};