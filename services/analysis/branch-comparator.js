/**
 * Branch Comparator Service
 * 
 * Compares branches and analyzes differences
 * 
 * Design Pattern: Service Layer
 * Responsibility: Branch comparison and diff analysis
 */

class BranchComparator {
    /**
     * Compare two branches
     * @param {Object} comparison - GitHub API comparison result
     * @returns {Object} Comparison analysis
     */
    static analyze(comparison) {
        if (!comparison || !comparison.files) {
            return {
                status: 'unknown',
                ahead: 0,
                behind: 0,
                files: {
                    added: [],
                    modified: [],
                    removed: [],
                    renamed: []
                },
                summary: 'No differences found'
            };
        }

        const files = {
            added: [],
            modified: [],
            removed: [],
            renamed: []
        };

        comparison.files.forEach(file => {
            if (file.status === 'added') {
                files.added.push({
                    path: file.filename,
                    additions: file.additions,
                    deletions: file.deletions
                });
            } else if (file.status === 'modified') {
                files.modified.push({
                    path: file.filename,
                    additions: file.additions,
                    deletions: file.deletions,
                    changes: file.changes
                });
            } else if (file.status === 'removed') {
                files.removed.push({
                    path: file.filename,
                    additions: file.additions,
                    deletions: file.deletions
                });
            } else if (file.status === 'renamed') {
                files.renamed.push({
                    oldPath: file.previous_filename,
                    newPath: file.filename,
                    additions: file.additions,
                    deletions: file.deletions
                });
            }
        });

        const totalChanges = comparison.additions + comparison.deletions;
        const summary = this.generateSummary(files, totalChanges, comparison);

        return {
            status: comparison.status,
            ahead: comparison.ahead_by,
            behind: comparison.behind_by,
            files,
            totalChanges,
            additions: comparison.additions,
            deletions: comparison.deletions,
            summary
        };
    }

    /**
     * Generate human-readable summary
     * @param {Object} files - File changes
     * @param {number} totalChanges - Total line changes
     * @param {Object} comparison - Full comparison object
     * @returns {string} Summary text
     */
    static generateSummary(files, totalChanges, comparison) {
        const parts = [];

        if (files.added.length > 0) {
            parts.push(`${files.added.length} file${files.added.length > 1 ? 's' : ''} added`);
        }

        if (files.modified.length > 0) {
            parts.push(`${files.modified.length} file${files.modified.length > 1 ? 's' : ''} modified`);
        }

        if (files.removed.length > 0) {
            parts.push(`${files.removed.length} file${files.removed.length > 1 ? 's' : ''} removed`);
        }

        if (files.renamed.length > 0) {
            parts.push(`${files.renamed.length} file${files.renamed.length > 1 ? 's' : ''} renamed`);
        }

        if (totalChanges > 0) {
            parts.push(`${comparison.additions} additions, ${comparison.deletions} deletions`);
        }

        if (parts.length === 0) {
            return 'No changes between branches';
        }

        return parts.join('; ');
    }

    /**
     * Get significant changes (files with most changes)
     * @param {Object} comparison - Comparison analysis result
     * @param {number} limit - Maximum number of files to return
     * @returns {Array} Significant file changes
     */
    static getSignificantChanges(comparison, limit = 10) {
        const allFiles = [
            ...comparison.files.added.map(f => ({ ...f, status: 'added' })),
            ...comparison.files.modified.map(f => ({ ...f, status: 'modified' })),
            ...comparison.files.removed.map(f => ({ ...f, status: 'removed' }))
        ];

        // Sort by total changes (additions + deletions)
        allFiles.sort((a, b) => {
            const aTotal = (a.additions || 0) + (a.deletions || 0);
            const bTotal = (b.additions || 0) + (b.deletions || 0);
            return bTotal - aTotal;
        });

        return allFiles.slice(0, limit);
    }
}
