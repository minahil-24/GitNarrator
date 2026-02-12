/**
 * Storage Utility
 * 
 * Wrapper for Chrome storage API with error handling
 * 
 * Design Pattern: Utility/Helper
 * Responsibility: Storage operations
 */

class StorageUtils {
    /**
     * Get value from storage
     * @param {string} key - Storage key
     * @returns {Promise<any>}
     */
    static async get(key) {
        try {
            const result = await chrome.storage.local.get([key]);
            return result[key] || null;
        } catch (error) {
            Logger.error('Storage get error', error);
            return null;
        }
    }

    /**
     * Set value in storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {Promise<boolean>}
     */
    static async set(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
            return true;
        } catch (error) {
            Logger.error('Storage set error', error);
            return false;
        }
    }

    /**
     * Remove value from storage
     * @param {string} key - Storage key
     * @returns {Promise<boolean>}
     */
    static async remove(key) {
        try {
            await chrome.storage.local.remove([key]);
            return true;
        } catch (error) {
            Logger.error('Storage remove error', error);
            return false;
        }
    }

    /**
     * Clear all storage
     * @returns {Promise<boolean>}
     */
    static async clear() {
        try {
            await chrome.storage.local.clear();
            return true;
        } catch (error) {
            Logger.error('Storage clear error', error);
            return false;
        }
    }
}
