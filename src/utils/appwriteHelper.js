// Appwrite Helper Functions
// This file contains utility functions to handle common Appwrite operations and error scenarios

import { databases, DATABASE_ID, COLLECTIONS } from '../api/appwrite/appwrite'

/**
 * Safe update function that handles unique constraint violations
 * @param {string} collectionId - The collection ID
 * @param {string} documentId - The document ID to update
 * @param {object} updateData - The data to update
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<object>} - The updated document
 */
export async function safeUpdateDocument(collectionId, documentId, updateData, maxRetries = 3) {
  let lastError = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First, get the current document to verify it exists and check current state
      const currentDoc = await databases.getDocument(DATABASE_ID, collectionId, documentId)
      
      // Check if the update would actually change anything
      let hasChanges = false
      for (const [key, value] of Object.entries(updateData)) {
        if (currentDoc[key] !== value) {
          hasChanges = true
          break
        }
      }
      
      if (!hasChanges) {
        return currentDoc
      }
      
      // Attempt the update
      const result = await databases.updateDocument(DATABASE_ID, collectionId, documentId, updateData)
      return result
      
    } catch (error) {
      lastError = error
      
      // Handle specific error cases
      if (error.code === 409 || error.message?.includes('already exists')) {
        try {
          // Fetch the document again to see if it was updated by another process
          const updatedDoc = await databases.getDocument(DATABASE_ID, collectionId, documentId)
          
          // Check if the document now has the desired state
          let isInDesiredState = true
          for (const [key, value] of Object.entries(updateData)) {
            if (updatedDoc[key] !== value) {
              isInDesiredState = false
              break
            }
          }
          
          if (isInDesiredState) {
            return updatedDoc
          }
          
        } catch (fetchError) {
          // Continue with retry logic
        }
        
        // If not the last attempt, wait and retry
        if (attempt < maxRetries) {
          const delay = attempt * 1000 // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // If it's not a conflict error or we've reached max retries, break
      if (!error.message?.includes('already exists') || attempt === maxRetries) {
        break
      }
      
      // Wait before retry
      const delay = attempt * 500
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Get collection attributes safely
 * @param {string} collectionId - The collection ID
 * @returns {Promise<Array>} - Array of attribute keys
 */
export async function getCollectionAttributes(collectionId) {
  try {
    const collection = await databases.getCollection(DATABASE_ID, collectionId)
    return collection.attributes.map(attr => attr.key)
  } catch (error) {
    return []
  }
}

/**
 * Prepare data with only available attributes
 * @param {object} data - The data to prepare
 * @param {Array} availableAttributes - Array of available attribute keys
 * @returns {object} - Filtered data object
 */
export function prepareDataWithAttributes(data, availableAttributes) {
  const preparedData = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (availableAttributes.includes(key)) {
      preparedData[key] = value
    }
  }
  
  return preparedData
}

/**
 * Digital ID specific update function that handles the unique constraint issues
 * @param {string} documentId - The document ID
 * @param {object} updateData - The data to update
 * @returns {Promise<object>} - The updated document
 */
export async function updateDigitalIdSafe(documentId, updateData) {
  try {
    // First, let's try the direct update without filtering to see if the attributes exist
    try {
      const directResult = await databases.updateDocument(DATABASE_ID, COLLECTIONS.DIGITAL_IDS, documentId, updateData)
      return directResult
    } catch (directError) {
      // If direct update fails due to attribute issues, fall back to filtered approach
      if (directError.message?.includes('attribute') || directError.code === 400) {
        // Get available attributes for the collection
        const availableAttributes = await getCollectionAttributes(COLLECTIONS.DIGITAL_IDS)
        
        // Prepare the update data with only available attributes
        const preparedData = prepareDataWithAttributes(updateData, availableAttributes)
        
        if (Object.keys(preparedData).length === 0) {
          throw new Error('No valid attributes found in update data')
        }
        
        // Use the safe update function with prepared data
        const result = await safeUpdateDocument(COLLECTIONS.DIGITAL_IDS, documentId, preparedData)
        return result
      } else {
        // For other errors, use the safe update function
        const result = await safeUpdateDocument(COLLECTIONS.DIGITAL_IDS, documentId, updateData)
        return result
      }
    }
    
  } catch (error) {
    throw error
  }
}

/**
 * Check if a document exists
 * @param {string} collectionId - The collection ID
 * @param {string} documentId - The document ID
 * @returns {Promise<boolean>} - True if document exists
 */
export async function documentExists(collectionId, documentId) {
  try {
    await databases.getDocument(DATABASE_ID, collectionId, documentId)
    return true
  } catch (error) {
    if (error.code === 404) {
      return false
    }
    throw error
  }
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} - The result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}
