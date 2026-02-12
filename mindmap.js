// mindmap.js

const MindMap = {
    /**
     * Converts a GitHub Tree API response to Mermaid Syntax
     * @param {Object} treeData Response from git/trees?recursive=1
     * @param {number} maxNodes Limit nodes to prevent freezing
     */
    generateMermaid: (treeData, maxNodes = 100) => {
        if (!treeData || !treeData.tree) return "graph LR\nRoot[Start Analysis]";

        let syntax = ["graph LR"];
        const files = treeData.tree;

        // 1. Process paths into a Set of edges
        // Limit depth to 2 or 3 to avoid visual clutter
        // Filter out node_modules, .git, .vscode, assets, etc.
        const ignorePatterns = ['node_modules', '.git', 'dist', 'build', 'coverage', '.vscode', 'assets', 'images', 'test'];

        let nodes = new Set();
        let edges = new Set();
        let count = 0;

        // Root node
        syntax.push(`root[Repository]`);
        syntax.push(`style root fill:#f9f,stroke:#333,stroke-width:2px`);

        for (const item of files) {
            if (count > maxNodes) break;
            if (item.type !== 'tree' && item.type !== 'blob') continue;

            const parts = item.path.split('/');

            // Filter ignored
            if (parts.some(p => ignorePatterns.includes(p))) continue;
            // Limit depth for clarity
            if (parts.length > 3) continue;

            // Build edges: root -> dir1 -> dir2 -> file
            let parent = 'root';

            parts.forEach((part, index) => {
                const id = parts.slice(0, index + 1).join('_').replace(/[\-\.\s]/g, '_'); // Sanitized ID
                const label = part;

                if (!nodes.has(id)) {
                    // Verify if it's a folder (tree) or file (blob)
                    // We infer from path position. Last item might be file.
                    // Or we check the original item if it matches the full path.

                    let shape = '[ ]'; // Rect (default)
                    if (index === parts.length - 1 && item.type === 'blob') {
                        shape = '([ ])'; // Rounded (File)
                    } else {
                        shape = '{{ }}'; // Hex (Folderish)
                    }

                    syntax.push(`${id}${shape.replace(' ', label)}`);
                    nodes.add(id);
                    count++;
                }

                const edge = `${parent} --> ${id}`;
                if (!edges.has(edge)) {
                    syntax.push(edge);
                    edges.add(edge);
                }

                parent = id;
            });
        }

        return syntax.join('\n');
    },
    /**
     * Uses AI to generate a high-level component diagram
     */
    generateAdvancedMermaid: async (treeData, aiService) => {
        if (!treeData || !treeData.tree) return "graph TD\nError[No Data]";

        // 1. Summarize the file structure for the AI (to save tokens)
        // We only send directories and key files (js, py, etc) depth 2
        const files = treeData.tree
            .filter(f => f.type === 'blob' || f.type === 'tree')
            .filter(f => !f.path.includes('node_modules') && !f.path.includes('.git'))
            .map(f => f.path)
            .filter(p => p.split('/').length <= 3) // Limited depth
            .join('\n');

        const prompt = `
        You are a software architect. Below is a file list of a repository.
        Generate a Mermaid.js flowchart (graph TD) that represents the likely High-Level Architecture.
        
        Rules:
        1. Identify the main modules/components based on folder names (e.g. "auth", "services", "ui").
        2. Create a graph where these modules connect logically.
        3. Do NOT just list files. Abstract them into components.
        4. Return ONLY the Mermaid code string. Start with "graph TD".
        5. Use standard styling.

        File List:
        ${files.substring(0, 3000)}
        `;

        const result = await aiService.generate(prompt);
        if (!result) return "graph TD\nError[AI Generation Failed]";

        // Clean up code block ticks if present
        let clean = result.replace(/```mermaid/g, '').replace(/```/g, '').trim();
        return clean;
    }
};
