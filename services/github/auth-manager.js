/**
 * Authentication Manager Service
 * 
 * Handles GitHub Personal Access Token management
 * Provides secure storage and retrieval of authentication tokens
 * 
 * Design Pattern: Singleton
 * Responsibility: Single responsibility for authentication management
 */

class AuthManager {
    constructor() {
        this.storageKey = 'github_token';
        this.token = null;
    }

    /**
     * Initialize and load token from storage
     */
    async initialize() {
        try {
            const result = await chrome.storage.local.get([this.storageKey]);
            this.token = result[this.storageKey] || null;
            return this.token;
        } catch (error) {
            console.error('AuthManager: Failed to initialize', error);
            return null;
        }
    }

    /**
     * Set and store GitHub token
     * @param {string} token - GitHub Personal Access Token
     */
    async setToken(token) {
        try {
            // Validate token format (basic check)
            if (token && token.trim().length > 0) {
                this.token = token.trim();
                await chrome.storage.local.set({ [this.storageKey]: this.token });
                return true;
            } else {
                // Clear token if empty
                await this.clearToken();
                return false;
            }
        } catch (error) {
            console.error('AuthManager: Failed to set token', error);
            throw new Error('Failed to save authentication token');
        }
    }

    /**
     * Get current token
     * @returns {string|null} GitHub token or null
     */
    getToken() {
        return this.token;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.token !== null && this.token.length > 0;
    }

    /**
     * Clear stored token
     */
    async clearToken() {
        try {
            this.token = null;
            await chrome.storage.local.remove([this.storageKey]);
        } catch (error) {
            console.error('AuthManager: Failed to clear token', error);
        }
    }

    /**
     * Get authorization header for API requests
     * @returns {Object} Headers object with Authorization if token exists
     */
    getAuthHeaders() {
        if (this.isAuthenticated()) {
            return {
                'Authorization': `token ${this.token}`
            };
        }
        return {};
    }
}

// Export singleton instance
const authManager = new AuthManager();
