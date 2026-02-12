/**
 * Error Handler Utility
 * 
 * Centralized error handling and user-friendly error messages
 * 
 * Design Pattern: Utility/Helper
 * Responsibility: Error formatting and user communication
 */

class ErrorHandler {
    /**
     * Get user-friendly error message
     * @param {Error} error - Error object
     * @returns {string}
     */
    static getUserMessage(error) {
        if (!error) {
            return 'An unknown error occurred.';
        }

        const message = error.message || error.toString();

        // GitHub API errors
        if (message.includes('rate limit')) {
            return 'GitHub API rate limit exceeded. Please wait a few minutes and try again.';
        }

        if (message.includes('404') || message.includes('not found')) {
            return 'Repository not found. Please check the repository URL.';
        }

        if (message.includes('private')) {
            return 'This repository is private. GitNarrator only works with public repositories.';
        }

        if (message.includes('Network error') || message.includes('Failed to fetch')) {
            return 'Network error. Please check your internet connection.';
        }

        // Return original message if no specific handler
        return message;
    }

    /**
     * Log error for debugging
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     */
    static logError(error, context = '') {
        console.error(`[ErrorHandler] ${context}:`, {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Handle error and show user notification
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     * @returns {string} User-friendly error message
     */
    static handle(error, context = '') {
        this.logError(error, context);
        return this.getUserMessage(error);
    }
}
