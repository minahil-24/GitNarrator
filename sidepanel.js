// sidepanel.js

document.addEventListener('DOMContentLoaded', async () => {
    console.log("RepoMind Side Panel Loaded");

    // State
    let currentOwner = '';
    let currentRepo = '';
    let currentBranch = 'main';
    let repoData = null;
    let treeData = null;

    // Initialize mermaid
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    }

    // 1. Get Context (URL)
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab && tab.url) {
        const parts = tab.url.split('/');
        if (parts.length >= 5 && parts[2] === 'github.com') {
            currentOwner = parts[3];
            currentRepo = parts[4];
            DOM.setText('repo-name', `${currentOwner}/${currentRepo}`);

            loadData();
        } else {
            DOM.setText('repo-name', 'Not a GitHub Repo');
            DOM.setHTML('readme-summary', "<p>Please navigate to a GitHub repository.</p>");
        }
    }

    async function loadData() {
        try {
            DOM.setText('readme-summary', "Loading repository details...");

            // Fetch Details
            repoData = await ghApi.getRepoDetails(currentOwner, currentRepo);
            DOM.setText('repo-branch', repoData.default_branch);
            currentBranch = repoData.default_branch;

            // Update Overview
            DOM.setText('stat-stars', repoData.stargazers_count);

            // TRACKING: Get contributors usually returns an array
            // We need to fetch it to show stats and use in PPT
            const contributors = await ghApi.getContributors(currentOwner, currentRepo).catch(() => []);
            DOM.setText('stat-contributors', contributors.length || 0);

            // TRACKING: Commits (rough estimate or recent) - usually paginated, so difficult to get total without header parsing
            // For now, let's leave 0 or try to fetch last commit
            DOM.setText('stat-commits', "N/A");

            // Fetch README (Summary)
            try {
                const readme = await ghApi.getReadme(currentOwner, currentRepo);
                const content = atob(readme.content);
                DOM.setHTML('readme-summary', content.substring(0, 300) + "...");
            } catch (e) {
                DOM.setText('readme-summary', "No README found.");
            }

            // Load Tree (Mind Map)
            treeData = await ghApi.getRepoTree(currentOwner, currentRepo, currentBranch);
            renderMindMap();
            populateFileExplorer();

            // Load Languages (Stats)
            const langs = await ghApi.getLanguages(currentOwner, currentRepo);
            renderCharts(langs);

        } catch (err) {
            console.error(err);
            DOM.setHTML('readme-summary', `<div style="color: #ff6b6b; border: 1px solid #ff6b6b; padding: 10px; border-radius: 4px;"><strong>Analysis Failed:</strong><br>${err.message}</div>`);
            // Reset state
            DOM.setText('repo-name', 'Error');
        }
    }

    async function renderMindMap() {
        if (!treeData || typeof mermaid === 'undefined') return;

        const mode = document.getElementById('mindmap-mode').value;
        const element = document.getElementById('mermaid-graph');

        let graphDefinition = '';

        element.innerHTML = 'Loading Graph...';
        element.removeAttribute('data-processed');

        if (mode === 'advanced') {
            // Check if we have an AI key
            const aiKey = document.getElementById('openai-key').value || await AIService.getKey();
            if (aiKey) {
                await AIService.setKey(aiKey);
                graphDefinition = await MindMap.generateAdvancedMermaid(treeData, AIService);
            } else {
                graphDefinition = "graph TD\nError[Advanced Mode requires OpenAI Key in Settings]";
            }
        } else {
            graphDefinition = MindMap.generateMermaid(treeData);
        }

        // Clear and Render
        element.innerHTML = graphDefinition;
        // Fix for mermaid re-rendering
        element.removeAttribute('data-processed');

        try {
            const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), graphDefinition);
            element.innerHTML = svg;
        } catch (e) {
            element.innerHTML = `Graph Error: ${e.message}. \nTry syntax:\n${graphDefinition}`;
            console.error("Mermaid Render Error", e);
        }
    }

    function renderCharts(langs) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('langChart').getContext('2d');

        const labels = Object.keys(langs);
        const data = Object.values(langs);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#f1e05a', '#2b7489', '#563d7c', '#e34c26', '#3178c6', '#860432']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#c9d1d9' } }
                }
            }
        });

        // Populate Tech stack list
        DOM.createList('tech-stack-list', labels.slice(0, 5));
    }

    function populateFileExplorer() {
        const select = document.getElementById('file-select');
        if (!treeData) return;

        // Filter for files
        const files = treeData.tree.filter(i => i.type === 'blob');

        files.forEach(file => {
            const opt = document.createElement('option');
            opt.value = file.path;
            opt.textContent = file.path;
            select.appendChild(opt);
        });

        select.addEventListener('change', async (e) => {
            const path = e.target.value;
            if (!path) return;

            DOM.setText('file-explanation', "Analyzing...");
            const content = await ghApi.getFileContent(currentOwner, currentRepo, path);

            const mode = document.getElementById('mode-toggle').value;
            const explanation = CodeAnalyzer.analyze(path, content, mode);

            DOM.setText('file-explanation', explanation);
        });
    }

    // Event Listeners

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // PPT
    document.getElementById('btn-generate-ppt').addEventListener('click', () => {
        if (!repoData) return;
        PPTGenerator.generate({
            repo: `${currentOwner}/${currentRepo}`,
            description: repoData.description,
            stats: {
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                issues: repoData.open_issues_count
            }
        });
    });

    // Mode Toggle
    document.getElementById('mode-toggle').addEventListener('change', () => {
        // Re-trigger analysis if a file is selected
        const select = document.getElementById('file-select');
        if (select.value) {
            select.dispatchEvent(new Event('change'));
        }
    });

    document.getElementById('refresh-map').addEventListener('click', () => {
        renderMindMap();
    });

    document.getElementById('mindmap-mode').addEventListener('change', () => {
        renderMindMap();
    });

    // Save/Load Key
    const savedKey = await AIService.getKey();
    if (savedKey) {
        document.getElementById('openai-key').value = savedKey;
    }
    document.getElementById('openai-key').addEventListener('change', async (e) => {
        await AIService.setKey(e.target.value);
    });

});
