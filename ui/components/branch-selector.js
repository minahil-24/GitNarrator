/**
 * Branch Selector Component
 * 
 * Displays and manages branch selection
 * 
 * Design Pattern: Component
 * Responsibility: Branch selection UI
 */

class BranchSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.branches = [];
        this.selectedBranch = null;
        this.onChangeCallback = null;
    }

    /**
     * Set branches
     * @param {Array} branches - Array of branch objects
     */
    setBranches(branches) {
        this.branches = branches;
        this.render();
    }

    /**
     * Render branch selector
     */
    render() {
        if (!this.container) return;

        this.container.innerHTML = '';

        if (this.branches.length === 0) {
            this.container.innerHTML = '<select disabled><option>No branches available</option></select>';
            return;
        }

        const select = document.createElement('select');
        select.id = 'branch-select';
        select.className = 'branch-select';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a branch...';
        select.appendChild(defaultOption);

        // Add branches
        this.branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.name;
            option.textContent = `${branch.name}${branch.protected ? ' (protected)' : ''}`;
            if (branch.name === this.selectedBranch) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Add event listener
        select.addEventListener('change', (e) => {
            this.selectedBranch = e.target.value;
            if (this.onChangeCallback) {
                this.onChangeCallback(this.selectedBranch);
            }
        });

        this.container.appendChild(select);
    }

    /**
     * Set selected branch
     * @param {string} branchName - Branch name
     */
    setSelected(branchName) {
        this.selectedBranch = branchName;
        const select = this.container.querySelector('select');
        if (select) {
            select.value = branchName;
        }
    }

    /**
     * Get selected branch
     * @returns {string|null}
     */
    getSelected() {
        return this.selectedBranch;
    }

    /**
     * Set change callback
     * @param {Function} callback - Callback function
     */
    onChange(callback) {
        this.onChangeCallback = callback;
    }
}
