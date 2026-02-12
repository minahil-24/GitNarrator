/**
 * Rate Limiter Service
 * 
 * Handles GitHub API rate limiting for unauthenticated requests
 * GitHub allows 60 requests/hour for unauthenticated API calls
 * 
 * Design Pattern: Singleton
 * Responsibility: Rate limit management and request queuing
 */

class RateLimiter {
    constructor() {
        this.maxRequests = 60; // GitHub's limit for unauthenticated requests
        this.windowMs = 60 * 60 * 1000; // 1 hour in milliseconds
        this.requests = [];
        this.queue = [];
        this.processing = false;
    }

    /**
     * Check if we can make a request now
     * @returns {boolean}
     */
    canMakeRequest() {
        const now = Date.now();
        // Remove requests older than the window
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        
        return this.requests.length < this.maxRequests;
    }

    /**
     * Record a request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }

    /**
     * Calculate time until next request can be made
     * @returns {number} Milliseconds until next request
     */
    getTimeUntilNextRequest() {
        if (this.canMakeRequest()) {
            return 0;
        }

        const now = Date.now();
        const oldestRequest = Math.min(...this.requests);
        const timeSinceOldest = now - oldestRequest;
        
        return this.windowMs - timeSinceOldest;
    }

    /**
     * Wait until we can make a request
     * @returns {Promise<void>}
     */
    async waitForAvailability() {
        while (!this.canMakeRequest()) {
            const waitTime = this.getTimeUntilNextRequest();
            if (waitTime > 0) {
                console.warn(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime + 1000)); // Add 1s buffer
            }
        }
    }

    /**
     * Execute a request with rate limiting
     * @param {Function} requestFn - Function that returns a Promise
     * @returns {Promise<any>}
     */
    async execute(requestFn) {
        await this.waitForAvailability();
        this.recordRequest();
        return await requestFn();
    }
}

// Export singleton instance
const rateLimiter = new RateLimiter();
