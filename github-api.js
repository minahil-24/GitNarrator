// github-api.js

const API_BASE = 'https://api.github.com';

class GitHubAPI {
    constructor() {
        this.token = null; // Can be set if we add Auth later
    }

    async _request(endpoint) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, { headers });

            if (response.status === 403) {
                throw new Error("API Rate Limit Exceeded. Please try again later or add an API Token.");
            }
            if (response.status === 404) {
                throw new Error("Repository not found (404). Is it private?");
            }

            if (!response.ok) {
                let errorMsg = response.statusText;
                try {
                    const errorBody = await response.json();
                    if (errorBody.message) errorMsg = errorBody.message;
                } catch (e) { /* ignore JSON parse error */ }
                throw new Error(`GitHub API Error (${response.status}): ${errorMsg}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API Request Failed:", error);
            throw error;
        }
    }

    async getRepoDetails(owner, repo) {
        return this._request(`/repos/${owner}/${repo}`);
    }

    async getReadme(owner, repo) {
        // Prefer the raw content or the HTML rendered by GitHub?
        // Let's get the standard object which has base64 content
        return this._request(`/repos/${owner}/${repo}/readme`);
    }

    async getContributors(owner, repo) {
        return this._request(`/repos/${owner}/${repo}/contributors?per_page=10`);
    }

    async getLanguages(owner, repo) {
        return this._request(`/repos/${owner}/${repo}/languages`);
    }

    /**
     * Fetches the entire git tree recursively.
     * Useful for the Mind Map.
     * Warning: Large repos can be huge.
     */
    async getRepoTree(owner, repo, branch = 'main') {
        // First get the latest commit SHA to ensure we get the tree
        // Actually, asking for /trees/{branch}?recursive=1 works usually
        return this._request(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    }

    async getFileContent(owner, repo, path) {
        const data = await this._request(`/repos/${owner}/${repo}/contents/${path}`);
        if (data.encoding === 'base64') {
            return atob(data.content); // Decode Base64
        }
        return data.content || "";
    }
}

// Export a singleton
const ghApi = new GitHubAPI();
