/**
 * Logger Utility
 * 
 * Centralized logging with levels and formatting
 * 
 * Design Pattern: Utility/Helper
 * Responsibility: Logging management
 */

class Logger {
    static levels = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    static currentLevel = Logger.levels.INFO;

    /**
     * Set logging level
     * @param {string} level - 'DEBUG', 'INFO', 'WARN', or 'ERROR'
     */
    static setLevel(level) {
        this.currentLevel = this.levels[level] || this.levels.INFO;
    }

    /**
     * Log debug message
     * @param {string} message - Log message
     * @param {any} data - Additional data
     */
    static debug(message, data = null) {
        if (this.currentLevel <= this.levels.DEBUG) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    }

    /**
     * Log info message
     * @param {string} message - Log message
     * @param {any} data - Additional data
     */
    static info(message, data = null) {
        if (this.currentLevel <= this.levels.INFO) {
            console.log(`[INFO] ${message}`, data || '');
        }
    }

    /**
     * Log warning message
     * @param {string} message - Log message
     * @param {any} data - Additional data
     */
    static warn(message, data = null) {
        if (this.currentLevel <= this.levels.WARN) {
            console.warn(`[WARN] ${message}`, data || '');
        }
    }

    /**
     * Log error message
     * @param {string} message - Log message
     * @param {Error} error - Error object
     */
    static error(message, error = null) {
        if (this.currentLevel <= this.levels.ERROR) {
            console.error(`[ERROR] ${message}`, error || '');
        }
    }
}
