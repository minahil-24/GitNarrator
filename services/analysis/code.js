// /**
//  * Repository Analyzer Service
//  * 
//  * Main service that orchestrates repository analysis
//  * Coordinates all analysis services
//  * 
//  * Design Pattern: Service Layer / Facade
//  * Responsibility: Orchestrating repository analysis
//  * Only supports public repositories
//  */
// /*hello this is new repository for gitnarrator*/

// class RepositoryAnalyzer {
//     /**
//      * Analyze a complete repository
//      * @param {string} owner - Repository owner
//      * @param {string} repo - Repository name
//      * @param {string} branch - Branch name (optional)
//      * @param {Function} progressCallback - Progress callback function
//      * @returns {Promise<Object>} Complete analysis result
//      */
//     static async analyze(owner, repo, branch = null, progressCallback = null) {
//         const reportProgress = (step, message) => {
//             if (progressCallback) {
//                 progressCallback({ step, message, progress: step * 10 });
//             }
//         };

//         try {
//             reportProgress(1, 'Fetching repository details...');

//             if (typeof githubAPI === 'undefined') {
//                 throw new Error('GitHub API service is not available. Please refresh the extension.');
//             }

//             console.log(`Fetching repository details for: ${owner}/${repo}`);
//             const repoDetails = await githubAPI.getRepoDetails(owner, repo);

//             if (!repoDetails || !repoDetails.name) {
//                 throw new Error(`Repository "${owner}/${repo}" not found or is not public.`);
//             }

//             if (repoDetails.private) {
//                 throw new Error(`Repository "${owner}/${repo}" is private. Only public repositories are supported.`);
//             }

//             console.log('Repository details fetched:', repoDetails.name);

//             const defaultBranch = branch || repoDetails.default_branch || 'main';
//             reportProgress(2, `Analyzing branch: ${defaultBranch}`);

//             // Fetch all branches
//             reportProgress(3, 'Fetching branches...');
//             const branches = await githubAPI.getBranches(owner, repo);

//             // Fetch repository tree
//             reportProgress(4, 'Analyzing file structure...');
//             const treeData = await githubAPI.getRepoTree(owner, repo, defaultBranch, true);

//             const files = treeData.tree.filter(item => item.type === 'blob');
//             if (!files || files.length === 0) {
//                 console.warn('No files found in repository tree.');
//             }

//             // Get languages
//             reportProgress(5, 'Detecting technologies...');
//             const languages = await githubAPI.getLanguages(owner, repo);

//             // Get README
//             reportProgress(6, 'Fetching documentation...');
//             let readme = null;
//             try {
//                 readme = await githubAPI.getReadme(owner, repo);
//                 if (readme && readme.encoding === 'base64') {
//                     readme.content = atob(readme.content);
//                 }
//             } catch (err) {
//                 console.warn('README not found.');
//             }

//             // Analyze files/modules
//             reportProgress(7, 'Analyzing code files...');
//             const modules = typeof ModuleClassifier !== 'undefined' ? ModuleClassifier.groupByModule(files) : {};
//             const moduleStats = typeof ModuleClassifier !== 'undefined' ? ModuleClassifier.getModuleStats(modules) : [];

//             // Get commits
//             reportProgress(8, 'Analyzing commit history...');
//             let commits = [];
//             try {
//                 commits = await githubAPI.getCommits(owner, repo, defaultBranch, 100);
//             } catch (err) {
//                 console.warn('Unable to fetch commits.');
//             }
//             const commitAnalysis = typeof CommitAnalyzer !== 'undefined' ? CommitAnalyzer.analyze(commits) : { totalCommits: commits.length };

//             // Get contributors
//             reportProgress(9, 'Fetching contributor information...');
//             let contributors = [];
//             try {
//                 contributors = await githubAPI.getContributors(owner, repo);
//             } catch (err) {
//                 console.warn('Unable to fetch contributors.');
//             }

//             reportProgress(10, 'Analysis complete!');

//             return {
//                 repository: {
//                     owner,
//                     name: repo,
//                     fullName: `${owner}/${repo}`,
//                     description: repoDetails.description,
//                     defaultBranch,
//                     stars: repoDetails.stargazers_count,
//                     forks: repoDetails.forks_count,
//                     watchers: repoDetails.watchers_count,
//                     openIssues: repoDetails.open_issues_count,
//                     createdAt: repoDetails.created_at,
//                     updatedAt: repoDetails.updated_at,
//                     language: repoDetails.language,
//                     url: repoDetails.html_url
//                 },
//                 branches: branches.map(b => ({
//                     name: b.name,
//                     sha: b.commit.sha,
//                     protected: b.protected
//                 })),
//                 structure: {
//                     totalFiles: files.length,
//                     totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0),
//                     modules: moduleStats,
//                     tree: treeData.tree
//                 },
//                 technologies: {
//                     languages: Object.keys(languages),
//                     languageStats: languages
//                 },
//                 documentation: readme ? {
//                     name: readme.name,
//                     content: readme.content
//                 } : null,
//                 commits: commitAnalysis,
//                 contributors: contributors.map(c => ({
//                     login: c.login,
//                     contributions: c.contributions,
//                     avatar: c.avatar_url,
//                     url: c.html_url
//                 })),
//                 analysisDate: new Date().toISOString()
//             };

//         } catch (error) {
//             console.error('Repository analysis failed:', error.message || error);
//             if (typeof Logger !== 'undefined') {
//                 Logger.error('Repository analysis failed', error);
//             }
//             throw error;
//         }
//     }

//     /**
//      * Analyze specific branch
//      * @param {string} owner - Repository owner
//      * @param {string} repo - Repository name
//      * @param {string} branch - Branch name
//      * @param {Function} progressCallback - Progress callback
//      * @returns {Promise<Object>} Branch analysis
//      */
//     static async analyzeBranch(owner, repo, branch, progressCallback = null) {
//         return this.analyze(owner, repo, branch, progressCallback);
//     }
// }
