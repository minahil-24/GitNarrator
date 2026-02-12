/**
 * GitNarrator Side Panel
 * 
 * Main UI controller for the extension
 * Orchestrates all services and components
 * 
 * Design Pattern: MVC Controller
 * Responsibility: UI orchestration and user interaction
 */

// Services will be loaded via script tags in HTML
// Global references will be available after scripts load

// Global state
let currentAnalysis = null;
let currentOwner = null;
let currentRepo = null;
let currentBranch = null;

// Initialize when DOM and scripts are ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeApp, 200); // Wait for scripts to load
    });
} else {
    setTimeout(initializeApp, 200);
}

async function initializeApp() {
    if (typeof Logger !== 'undefined') {
        Logger.info('GitNarrator side panel loaded');
    }

    // Initialize AI service
    if (typeof aiService !== 'undefined') {
        await aiService.loadKey();
    }

    // Initialize components
    const progressIndicator = typeof ProgressIndicator !== 'undefined'
        ? new ProgressIndicator('progress-container')
        : null;
    const branchSelector = typeof BranchSelector !== 'undefined'
        ? new BranchSelector('branch-selector-container')
        : null;

    // Setup event listeners
    setupEventListeners(progressIndicator, branchSelector);

    // Load repository info from current tab
    await loadRepositoryInfo();

    // Setup tab navigation
    setupTabNavigation();
}

/**
 * Setup event listeners
 */
function setupEventListeners(progressIndicator, branchSelector) {
    // Analyze button
    const analyzeBtn = document.getElementById('btn-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            await analyzeRepository(progressIndicator);
        });
    }

    // Generate PPT button
    const pptBtn = document.getElementById('btn-generate-ppt');
    if (pptBtn) {
        pptBtn.addEventListener('click', async () => {
            await generatePPT(progressIndicator);
        });
    }

    // Save API key button
    const saveKeyBtn = document.getElementById('save-key-btn');
    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', async () => {
            const keyInput = document.getElementById('openai-key');
            const key = keyInput.value.trim();
            if (typeof aiService !== 'undefined') {
                await aiService.initialize(key);
                alert(key ? 'API key saved!' : 'API key removed.');
            }
        });
    }

    // Progress close button
    const progressClose = document.getElementById('progress-close');
    if (progressClose && progressIndicator) {
        progressClose.addEventListener('click', () => {
            progressIndicator.hide();
        });
    }
    // Mode selector
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
        modeSelect.addEventListener('change', async (e) => {
            const mode = e.target.value;
            if (typeof Logger !== 'undefined') {
                Logger.info(`Mode changed to: ${mode}`);
            }

            // If we have an analysis, refresh the diagram
            if (currentAnalysis) {
                await renderArchitectureDiagram();
            }
        });
    }

    // Branch selector callback
    if (branchSelector) {
        branchSelector.onChange(async (branchName) => {
            if (branchName && currentOwner && currentRepo) {
                currentBranch = branchName;
                await analyzeRepository(progressIndicator, branchName);
            }
        });
    }
}

/**
 * Load repository information from current tab
 */
async function loadRepositoryInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab || !tab.url) {
            showError('Please navigate to a GitHub repository page.');
            return;
        }

        const url = new URL(tab.url);
        if (url.origin !== 'https://github.com') {
            showError('Please navigate to a GitHub repository page.');
            return;
        }

        // Parse GitHub URL - handle various formats:
        // https://github.com/owner/repo
        // https://github.com/owner/repo/tree/branch
        // https://github.com/owner/repo/blob/branch/file
        // https://github.com/owner/repo/issues
        const parts = url.pathname.split('/').filter(p => p);

        // Skip special paths like 'tree', 'blob', 'issues', 'pulls', etc.
        const skipPaths = ['tree', 'blob', 'issues', 'pulls', 'actions', 'projects', 'wiki', 'security', 'settings'];

        // Find owner and repo (first two non-empty parts that aren't in skipPaths)
        let owner = null;
        let repo = null;
        let branch = null;

        for (let i = 0; i < parts.length; i++) {
            if (!owner && parts[i] && !skipPaths.includes(parts[i])) {
                owner = parts[i];
            } else if (owner && !repo && parts[i] && !skipPaths.includes(parts[i])) {
                repo = parts[i];
                // Check if next part is 'tree' or 'blob' followed by branch name
                if (i + 1 < parts.length && (parts[i + 1] === 'tree' || parts[i + 1] === 'blob')) {
                    if (i + 2 < parts.length) {
                        branch = parts[i + 2];
                    }
                }
                break;
            }
        }

        if (!owner || !repo) {
            showError('Could not detect repository. Please ensure you are on a GitHub repository page.');
            return;
        }

        currentOwner = owner;
        currentRepo = repo;
        currentBranch = branch || null;

        // Update UI
        const repoNameEl = document.getElementById('repo-name');
        if (repoNameEl) {
            repoNameEl.textContent = `${currentOwner}/${currentRepo}`;
        }

        const branchEl = document.getElementById('repo-branch');
        if (branchEl) {
            branchEl.textContent = currentBranch || 'main';
        }

        console.log(`Repository detected: ${currentOwner}/${currentRepo} (branch: ${currentBranch || 'main'})`);

        // Load basic repo info
        await loadBasicRepoInfo();
    } catch (error) {
        if (typeof Logger !== 'undefined') {
            Logger.error('Failed to load repository info', error);
        }
        const errorMsg = typeof ErrorHandler !== 'undefined'
            ? ErrorHandler.handle(error, 'loadRepositoryInfo')
            : error.message || 'Failed to load repository info';
        showError(errorMsg);
    }
}

/**
 * Load basic repository information
 */
async function loadBasicRepoInfo() {
    try {
        if (typeof githubAPI === 'undefined') {
            console.error('GitHub API service not loaded');
            showError('GitHub API service not loaded. Please refresh the extension.');
            return;
        }

        console.log(`Loading basic info for: ${currentOwner}/${currentRepo}`);
        const repoDetails = await githubAPI.getRepoDetails(currentOwner, currentRepo);

        if (!repoDetails) {
            throw new Error('Failed to fetch repository details');
        }

        console.log('Repository details loaded:', repoDetails);

        // Update UI
        document.getElementById('repo-branch').textContent = repoDetails.default_branch || 'main';
        document.getElementById('repo-stars').textContent = `⭐ ${repoDetails.stargazers_count}`;
        document.getElementById('stat-stars').textContent = repoDetails.stargazers_count;
        document.getElementById('stat-forks').textContent = repoDetails.forks_count;
        document.getElementById('stat-issues').textContent = repoDetails.open_issues_count;

        // Load description
        const descriptionEl = document.getElementById('repo-description');
        if (repoDetails.description) {
            descriptionEl.textContent = repoDetails.description;
        } else {
            descriptionEl.innerHTML = '<p class="loading-text">No description available.</p>';
        }

        // Load languages
        const languages = await githubAPI.getLanguages(currentOwner, currentRepo);
        const techStackEl = document.getElementById('tech-stack');
        const langKeys = Object.keys(languages).slice(0, 8);

        if (langKeys.length > 0) {
            techStackEl.innerHTML = langKeys.map(lang =>
                `<span class="tech-tag">${lang}</span>`
            ).join('');
        } else {
            techStackEl.innerHTML = '<p class="loading-text">No languages detected.</p>';
        }
    } catch (error) {
        console.error('Failed to load basic repo info:', error);
        if (typeof Logger !== 'undefined') {
            Logger.error('Failed to load basic repo info', error);
        }
        const errorMsg = typeof ErrorHandler !== 'undefined'
            ? ErrorHandler.handle(error, 'loadBasicRepoInfo')
            : error.message || 'Failed to load repository information';
        showError(errorMsg);
    }
}

/**
 * Analyze repository
 */
async function analyzeRepository(progressIndicator, branch = null) {
    if (!currentOwner || !currentRepo) {
        showError('Please navigate to a GitHub repository page.');
        return;
    }

    if (typeof RepositoryAnalyzer === 'undefined') {
        showError('Repository Analyzer service not loaded. Please refresh the extension.');
        return;
    }

    const mode = document.getElementById('mode-select').value;
    const branchToAnalyze = branch || currentBranch || 'main';

    try {
        if (progressIndicator) {
            progressIndicator.show();
            progressIndicator.update(0, 'Starting analysis...');
        }

        const progressCallback = (progress) => {
            if (progressIndicator) {
                progressIndicator.update(progress.progress, progress.message);
            }
        };

        // Perform analysis
        currentAnalysis = await RepositoryAnalyzer.analyze(
            currentOwner,
            currentRepo,
            branchToAnalyze,
            progressCallback
        );

        // Update UI with results
        updateUIWithAnalysis(currentAnalysis);

        // Render architecture diagram
        await renderArchitectureDiagram();

        if (progressIndicator) {
            progressIndicator.showSuccess('Analysis complete!');
        }
        const pptBtn = document.getElementById('btn-generate-ppt');
        if (pptBtn) {
            pptBtn.disabled = false;
        }

        // Load branches
        if (typeof BranchSelector !== 'undefined') {
            const branchSelector = new BranchSelector('branch-selector-container');
            branchSelector.setBranches(currentAnalysis.branches);
            branchSelector.setSelected(branchToAnalyze);
        }

    } catch (error) {
        console.error('Repository analysis failed:', error);
        if (typeof Logger !== 'undefined') {
            Logger.error('Repository analysis failed', error);
        }

        // More detailed error message
        let errorMsg = 'Analysis failed. ';
        if (error.message) {
            if (error.message.includes('404') || error.message.includes('not found')) {
                errorMsg += `Repository "${currentOwner}/${currentRepo}" not found. Please check:\n`;
                errorMsg += `1. The repository exists and is public\n`;
                errorMsg += `2. The URL is correct\n`;
                errorMsg += `3. You have internet connection`;
            } else if (error.message.includes('rate limit')) {
                errorMsg += 'GitHub API rate limit exceeded. Please wait a few minutes and try again.';
            } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
                errorMsg += 'Network error. Please check your internet connection.';
            } else {
                errorMsg += error.message;
            }
        } else {
            errorMsg += typeof ErrorHandler !== 'undefined'
                ? ErrorHandler.handle(error, 'analyzeRepository')
                : 'Unknown error occurred';
        }

        if (progressIndicator) {
            progressIndicator.showError(errorMsg);
        }
        showError(errorMsg);

        // Keep PPT button disabled on error
        const pptBtn = document.getElementById('btn-generate-ppt');
        if (pptBtn) {
            pptBtn.disabled = true;
        }
    }
}

/**
 * Update UI with analysis results
 */
function updateUIWithAnalysis(analysis) {
    // Update stats
    document.getElementById('stat-files').textContent = analysis.structure.totalFiles;

    // Update module structure
    const moduleEl = document.getElementById('module-structure');
    if (analysis.structure.modules.length > 0) {
        moduleEl.innerHTML = analysis.structure.modules.map(module => `
            <div class="module-item">
                <div class="module-name">${module.name}</div>
                <div class="module-files">${module.fileCount} files</div>
            </div>
        `).join('');
    } else {
        moduleEl.innerHTML = '<p class="loading-text">No modules detected.</p>';
    }

    // Update commit history
    const commitEl = document.getElementById('commit-history');
    if (analysis.commits && analysis.commits.timeline) {
        const recentCommits = analysis.commits.timeline.slice(0, 10);
        commitEl.innerHTML = recentCommits.map(commit => `
            <div class="commit-item">
                <div class="commit-message">${commit.message}</div>
                <div class="commit-meta">${commit.author} • ${new Date(commit.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    } else {
        commitEl.innerHTML = '<p class="loading-text">No commits found.</p>';
    }

    // Update contributors
    const contributorsEl = document.getElementById('contributors');
    if (analysis.contributors && analysis.contributors.length > 0) {
        contributorsEl.innerHTML = analysis.contributors.slice(0, 10).map(contributor => `
            <div class="contributor-item">
                <img src="${contributor.avatar}" alt="${contributor.login}" class="contributor-avatar">
                <span class="contributor-name">${contributor.login}</span>
            </div>
        `).join('');
    } else {
        contributorsEl.innerHTML = '<p class="loading-text">No contributors found.</p>';
    }
}

/**
 * Render architecture diagram
 */
async function renderArchitectureDiagram() {
    const diagramEl = document.getElementById('architecture-diagram');
    if (!diagramEl || !currentAnalysis) return;

    if (typeof DiagramGenerator === 'undefined' || typeof mermaid === 'undefined') {
        diagramEl.innerHTML = '<p class="error-text">Diagram services not available.</p>';
        return;
    }

    try {
        diagramEl.innerHTML = '<p class="loading-text">Generating diagram...</p>';

        const mode = document.getElementById('mode-select').value;
        const graphDefinition = await DiagramGenerator.generate(
            currentAnalysis,
            mode,
            typeof aiService !== 'undefined' ? aiService : null
        );

        // Initialize mermaid
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose'
        });

        const id = 'mermaid-svg-' + Date.now();

        try {
            // Try v10+ async render first
            const result = await mermaid.render(id, graphDefinition);
            diagramEl.innerHTML = typeof result === 'string' ? result : result.svg;
        } catch (renderError) {
            Logger.warn('Async mermaid.render failed, trying fallback...', renderError);

            // Fallback: use the "mermaid" class and init/run
            diagramEl.innerHTML = `<div class="mermaid" id="${id}">${graphDefinition}</div>`;

            if (typeof mermaid.run === 'function') {
                await mermaid.run({
                    nodes: [document.getElementById(id)]
                });
            } else if (typeof mermaid.init === 'function') {
                mermaid.init(undefined, '#' + id);
            } else {
                throw renderError;
            }
        }

    } catch (error) {
        console.error('Diagram rendering failed:', error);
        diagramEl.innerHTML = `<p class="error-text">Failed to render diagram: ${error.message}</p>`;
    }
}

/**
 * Generate PowerPoint presentation
 */
async function generatePPT(progressIndicator) {
    if (!currentAnalysis) {
        showError('Please analyze the repository first.');
        return;
    }

    if (typeof PPTGenerator === 'undefined') {
        showError('PPT Generator service not loaded. Please refresh the extension.');
        return;
    }

    const mode = document.getElementById('mode-select').value;

    try {
        if (progressIndicator) {
            progressIndicator.show();
            progressIndicator.update(0, 'Generating PowerPoint...');
        }

        const progressCallback = (progress) => {
            if (progressIndicator) {
                progressIndicator.update(progress.progress, progress.message);
            }
        };

        const fileName = await PPTGenerator.generate(
            currentAnalysis,
            mode,
            progressCallback
        );

        if (progressIndicator) {
            progressIndicator.showSuccess(`Presentation saved as ${fileName}`);
            setTimeout(() => {
                progressIndicator.hide();
            }, 2000);
        }

    } catch (error) {
        if (typeof Logger !== 'undefined') {
            Logger.error('PPT generation failed', error);
        }
        const errorMsg = typeof ErrorHandler !== 'undefined'
            ? ErrorHandler.handle(error, 'generatePPT')
            : error.message || 'PPT generation failed';
        if (progressIndicator) {
            progressIndicator.showError(errorMsg);
        }
        showError(errorMsg);
    }
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: var(--error-color);
        color: white;
        padding: 12px;
        border-radius: 6px;
        margin: 16px;
        font-size: 14px;
    `;
    errorDiv.textContent = message;

    document.body.insertBefore(errorDiv, document.body.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
