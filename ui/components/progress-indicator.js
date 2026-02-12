/**
 * Progress Indicator Component
 * 
 * Displays analysis progress with visual feedback
 * 
 * Design Pattern: Component
 * Responsibility: Progress visualization
 */

class ProgressIndicator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.totalSteps = 10;
    }

    /**
     * Show progress indicator
     */
    show() {
        if (!this.container) return;
        this.container.style.display = 'block';
        this.update(0, 'Starting analysis...');
    }

    /**
     * Hide progress indicator
     */
    hide() {
        if (!this.container) return;
        this.container.style.display = 'none';
    }

    /**
     * Update progress
     * @param {number} step - Current step (0-100)
     * @param {string} message - Progress message
     */
    update(step, message) {
        if (!this.container) return;
        
        this.currentStep = step;
        const percentage = Math.min(100, Math.max(0, step));

        const progressBar = this.container.querySelector('.progress-bar');
        const progressText = this.container.querySelector('.progress-text');
        const progressMessage = this.container.querySelector('.progress-message');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}%`;
        }

        if (progressMessage) {
            progressMessage.textContent = message || '';
        }
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        if (!this.container) return;
        
        const progressBar = this.container.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.backgroundColor = '#d1242f';
        }

        const progressMessage = this.container.querySelector('.progress-message');
        if (progressMessage) {
            progressMessage.textContent = message || 'An error occurred';
            progressMessage.style.color = '#d1242f';
        }
    }

    /**
     * Show success state
     * @param {string} message - Success message
     */
    showSuccess(message) {
        if (!this.container) return;
        
        const progressBar = this.container.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.backgroundColor = '#1a7f37';
        }

        const progressMessage = this.container.querySelector('.progress-message');
        if (progressMessage) {
            progressMessage.textContent = message || 'Analysis complete!';
            progressMessage.style.color = '#1a7f37';
        }
    }
}
