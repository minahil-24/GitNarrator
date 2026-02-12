/**
 * Diagram Generator Service
 * 
 * Generates Mermaid.js diagrams from repository analysis data.
 * Supports basic file tree and advanced architecture diagrams.
 * 
 * Design Pattern: Service Layer / Strategy
 * Responsibility: Converting analysis data into visual representations
 */

class DiagramGenerator {
    /**
     * Generate Mermaid syntax from repository structure
     * @param {Object} analysis - Repository analysis result
     * @param {string} mode - 'basic' or 'advanced'
     * @param {Object} aiService - Singleton instance of AIService
     * @returns {Promise<string>} Mermaid syntax
     */
    static async generate(analysis, mode = 'basic', aiService = null) {
        if (!analysis || !analysis.structure || !analysis.structure.tree) {
            return 'graph TD\nEmpty[No Data Available]';
        }

        if (mode === 'advanced' && aiService && aiService.isAvailable()) {
            return await this.generateAdvanced(analysis, aiService);
        }

        return this.generateBasic(analysis);
    }

    /**
     * Generate a basic file tree diagram
     * @param {Object} analysis - Repository analysis result
     * @returns {string} Mermaid syntax
     */
    static generateBasic(analysis) {
        const tree = analysis.structure.tree;
        const maxNodes = 50; // Limit nodes for clarity
        const ignorePatterns = ['node_modules', '.git', 'dist', 'build', 'coverage', '.vscode', 'assets', 'images'];

        let syntax = ['graph LR'];
        let nodes = new Set();
        let edges = new Set();
        let count = 0;

        // Root node
        syntax.push(`root["📦 ${analysis.repository.name}"]`);
        syntax.push(`style root fill:#58a6ff,stroke:#333,stroke-width:2px,color:#fff`);

        for (const item of tree) {
            if (count > maxNodes) break;

            const parts = item.path.split('/');
            if (parts.some(p => ignorePatterns.includes(p))) continue;
            if (parts.length > 3) continue; // Limit depth

            let parent = 'root';

            parts.forEach((part, index) => {
                const id = 'node_' + parts.slice(0, index + 1).join('_').replace(/[\-\.\s]/g, '_');
                const label = part;

                if (!nodes.has(id)) {
                    let shape = index === parts.length - 1 && item.type === 'blob'
                        ? `("${label}")` // Rounded for files
                        : `[["${label}"]]`; // Subroutine for folders

                    syntax.push(`${id}${shape}`);
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
    }

    /**
     * Generate an advanced architecture diagram using AI
     * @param {Object} analysis - Repository analysis result
     * @param {Object} aiService - AIService instance
     * @returns {Promise<string>} Mermaid syntax
     */
    static async generateAdvanced(analysis, aiService) {
        const structureSummary = analysis.structure.tree
            .filter(node => node.type === 'tree' || (node.type === 'blob' && node.path.split('/').length <= 2))
            .map(node => node.path)
            .join('\n')
            .substring(0, 2000);

        const prompt = `
        You are a software architect. Generate a Mermaid.js flowchart (graph TD) representing the High-Level Architecture of this project.
        
        Project: ${analysis.repository.fullName}
        Description: ${analysis.repository.description || 'N/A'}
        Tech Stack: ${analysis.technologies.languages.join(', ')}
        
        File Structure:
        ${structureSummary}
        
        Rules:
        1. Group logic into components (e.g., UI, API, Services, Database, Core).
        2. Focus on how modules interact.
        3. Do NOT just list files; abstract them into architectural blocks.
        4. Return ONLY the Mermaid code starting with "graph TD".
        5. Keep it concise enough for a single slide.
        `;

        const result = await aiService.generate(prompt, {
            systemPrompt: 'You are an expert software architect generating Mermaid diagrams.'
        });

        if (!result) {
            return this.generateBasic(analysis) + '\n%% AI Generation failed, falling back to basic';
        }

        // Clean up result
        let clean = result.replace(/```mermaid/g, '').replace(/```/g, '').trim();
        if (!clean.startsWith('graph')) {
            clean = 'graph TD\n' + clean;
        }

        return clean;
    }
}
