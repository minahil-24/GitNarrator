/**
 * GitHub API Client Service
 * 
 * Handles all GitHub REST API interactions
 * Works with public repositories only (no authentication required)
 * 
 * Design Pattern: Service Layer
 * Responsibility: Single responsibility for GitHub API communication
 */

// Ensure rateLimiter is available (loaded before this script)
class GitHubAPIClient {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.rateLimiter = typeof rateLimiter !== 'undefined' ? rateLimiter : null;
    }

    /**
     * Make a request to GitHub API with rate limiting and error handling
     * @param {string} endpoint - API endpoint (e.g., '/repos/owner/repo')
     * @param {Object} options - Fetch options
     * @returns {Promise<any>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            ...options.headers
        };

        const requestFn = async () => {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers
                });

                // Handle rate limiting
                if (response.status === 403) {
                    const remaining = response.headers.get('X-RateLimit-Remaining');
                    const resetTime = response.headers.get('X-RateLimit-Reset');
                    
                    if (remaining === '0' && resetTime) {
                        const waitTime = (parseInt(resetTime) * 1000) - Date.now();
                        if (waitTime > 0) {
                            console.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime + 1000));
                            // Retry once
                            return this.request(endpoint, options);
                        }
                    }
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                }

                // Handle other errors
                if (!response.ok) {
                    if (response.status === 404) {
                        // Try to get more details from response
                        let errorDetail = 'Repository not found or is private.';
                        try {
                            const errorData = await response.json();
                            if (errorData.message) {
                                errorDetail = errorData.message;
                            }
                        } catch (e) {
                            // Ignore JSON parse errors
                        }
                        throw new Error(errorDetail);
                    }
                    if (response.status === 401) {
                        throw new Error('Unauthorized. Repository may be private.');
                    }
                    if (response.status === 403) {
                        throw new Error('Forbidden. Rate limit may be exceeded or repository is private.');
                    }
                    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                if (error.message.includes('rate limit')) {
                    throw error;
                }
                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Network error. Please check your internet connection.');
                }
                throw error;
            }
        };

        // Use rate limiter if available, otherwise execute directly
        if (this.rateLimiter) {
            return await this.rateLimiter.execute(requestFn);
        } else {
            return await requestFn();
        }
    }

    /**
     * Get repository details
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Object>}
     */
    async getRepoDetails(owner, repo) {
        return this.request(`/repos/${owner}/${repo}`);
    }

    /**
     * Get repository README
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Object>}
     */
    async getReadme(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}/readme`);
        } catch (error) {
            if (error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Get repository languages
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Object>}
     */
    async getLanguages(owner, repo) {
        return this.request(`/repos/${owner}/${repo}/languages`);
    }

    /**
     * Get repository tree (file structure)
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} branch - Branch name (default: 'main')
     * @param {boolean} recursive - Get recursive tree (default: true)
     * @returns {Promise<Object>}
     */
    async getRepoTree(owner, repo, branch = 'main', recursive = true) {
        const endpoint = `/repos/${owner}/${repo}/git/trees/${branch}${recursive ? '?recursive=1' : ''}`;
        return this.request(endpoint);
    }

    /**
     * Get file content
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} path - File path
     * @param {string} branch - Branch name (optional)
     * @returns {Promise<string>}
     */
    async getFileContent(owner, repo, path, branch = null) {
        const endpoint = `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}${branch ? `?ref=${branch}` : ''}`;
        const data = await this.request(endpoint);
        
        if (data.encoding === 'base64') {
            return atob(data.content);
        }
        return data.content || '';
    }

    /**
     * Get all branches
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Array>}
     */
    async getBranches(owner, repo) {
        const branches = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const data = await this.request(`/repos/${owner}/${repo}/branches?page=${page}&per_page=100`);
            if (data.length === 0) {
                hasMore = false;
            } else {
                branches.push(...data);
                page++;
                // Limit to prevent infinite loops
                if (page > 10) break;
            }
        }

        return branches;
    }

    /**
     * Get commits for a branch
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} branch - Branch name
     * @param {number} perPage - Commits per page (default: 100)
     * @returns {Promise<Array>}
     */
    async getCommits(owner, repo, branch = null, perPage = 100) {
        const endpoint = `/repos/${owner}/${repo}/commits${branch ? `?sha=${branch}` : ''}?per_page=${perPage}`;
        return this.request(endpoint);
    }

    /**
     * Get contributors
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @returns {Promise<Array>}
     */
    async getContributors(owner, repo) {
        try {
            return await this.request(`/repos/${owner}/${repo}/contributors?per_page=10`);
        } catch (error) {
            console.warn('Failed to fetch contributors:', error);
            return [];
        }
    }

    /**
     * Compare two branches
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {string} base - Base branch
     * @param {string} head - Head branch
     * @returns {Promise<Object>}
     */
    async compareBranches(owner, repo, base, head) {
        return this.request(`/repos/${owner}/${repo}/compare/${base}...${head}`);
    }
}

// Export singleton instance
const githubAPI = new GitHubAPIClient();
