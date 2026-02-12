/**
 * Commit Analyzer Service
 * 
 * Analyzes commit history to extract timeline, patterns, and insights
 * 
 * Design Pattern: Service Layer
 * Responsibility: Commit history analysis
 */

class CommitAnalyzer {
    /**
     * Analyze commits from all branches
     * @param {Array} commits - Array of commit objects
     * @returns {Object} Analysis result
     */
    static analyze(commits) {
        if (!commits || commits.length === 0) {
            return {
                totalCommits: 0,
                timeline: [],
                authors: {},
                frequency: {},
                milestones: []
            };
        }

        return {
            totalCommits: commits.length,
            timeline: this.generateTimeline(commits),
            authors: this.analyzeAuthors(commits),
            frequency: this.analyzeFrequency(commits),
            milestones: this.detectMilestones(commits),
            recentActivity: this.getRecentActivity(commits)
        };
    }

    /**
     * Generate timeline from commits
     * @param {Array} commits - Array of commit objects
     * @returns {Array} Timeline entries
     */
    static generateTimeline(commits) {
        const timeline = commits.map(commit => ({
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message.split('\n')[0],
            author: commit.commit.author.name,
            date: new Date(commit.commit.author.date),
            url: commit.html_url
        }));

        // Sort by date (newest first)
        timeline.sort((a, b) => b.date - a.date);

        return timeline;
    }

    /**
     * Analyze commit authors
     * @param {Array} commits - Array of commit objects
     * @returns {Object} Author statistics
     */
    static analyzeAuthors(commits) {
        const authors = {};

        commits.forEach(commit => {
            const authorName = commit.commit.author.name;
            if (!authors[authorName]) {
                authors[authorName] = {
                    name: authorName,
                    count: 0,
                    commits: []
                };
            }
            authors[authorName].count++;
            authors[authorName].commits.push({
                message: commit.commit.message.split('\n')[0],
                date: new Date(commit.commit.author.date)
            });
        });

        // Convert to array and sort by count
        const authorArray = Object.values(authors).sort((a, b) => b.count - a.count);

        return {
            total: authorArray.length,
            topContributors: authorArray.slice(0, 5),
            distribution: authors
        };
    }

    /**
     * Analyze commit frequency
     * @param {Array} commits - Array of commit objects
     * @returns {Object} Frequency statistics
     */
    static analyzeFrequency(commits) {
        const frequency = {
            byDay: {},
            byMonth: {},
            byYear: {}
        };

        commits.forEach(commit => {
            const date = new Date(commit.commit.author.date);
            const day = date.toISOString().split('T')[0];
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const year = date.getFullYear().toString();

            frequency.byDay[day] = (frequency.byDay[day] || 0) + 1;
            frequency.byMonth[month] = (frequency.byMonth[month] || 0) + 1;
            frequency.byYear[year] = (frequency.byYear[year] || 0) + 1;
        });

        return frequency;
    }

    /**
     * Detect major milestones
     * @param {Array} commits - Array of commit objects
     * @returns {Array} Milestone commits
     */
    static detectMilestones(commits) {
        const milestones = [];

        // Look for significant commit messages
        const significantKeywords = [
            'release', 'version', 'v1.0', 'v2.0', 'initial', 'first', 'major',
            'milestone', 'launch', 'deploy', 'production', 'stable'
        ];

        commits.forEach(commit => {
            const message = commit.commit.message.toLowerCase();
            if (significantKeywords.some(keyword => message.includes(keyword))) {
                milestones.push({
                    sha: commit.sha.substring(0, 7),
                    message: commit.commit.message.split('\n')[0],
                    date: new Date(commit.commit.author.date),
                    url: commit.html_url
                });
            }
        });

        // Sort by date and return top 10
        milestones.sort((a, b) => b.date - a.date);
        return milestones.slice(0, 10);
    }

    /**
     * Get recent activity
     * @param {Array} commits - Array of commit objects
     * @returns {Object} Recent activity stats
     */
    static getRecentActivity(commits) {
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentCommits = commits.filter(commit => {
            const date = new Date(commit.commit.author.date);
            return date >= lastMonth;
        });

        const weekCommits = commits.filter(commit => {
            const date = new Date(commit.commit.author.date);
            return date >= lastWeek;
        });

        return {
            lastWeek: weekCommits.length,
            lastMonth: recentCommits.length,
            isActive: recentCommits.length > 0
        };
    }
}
