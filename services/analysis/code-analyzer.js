/**
 * Code Analyzer Service
 * 
 * Analyzes source code files to extract patterns, frameworks, and structure
 * 
 * Design Pattern: Service Layer
 * Responsibility: Code analysis and pattern detection
 */

class CodeAnalyzer {
    /**
     * Analyze a code file
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} mode - Analysis mode: 'beginner' or 'advanced'
     * @returns {Object} Analysis result
     */
    static analyze(filePath, content, mode = 'advanced') {
        const ext = filePath.split('.').pop().toLowerCase();
        const analysis = {
            filePath,
            extension: ext,
            language: this.detectLanguage(ext),
            linesOfCode: content.split('\n').length,
            size: content.length,
            mode
        };

        if (mode === 'advanced') {
            analysis.frameworks = this.detectFrameworks(content, ext);
            analysis.patterns = this.detectPatterns(content, ext);
            analysis.complexity = this.estimateComplexity(content, ext);
            analysis.dependencies = this.extractDependencies(content, ext);
        }

        return analysis;
    }

    /**
     * Detect programming language from extension
     * @param {string} ext - File extension
     * @returns {string} Language name
     */
    static detectLanguage(ext) {
        const languageMap = {
            'js': 'JavaScript',
            'jsx': 'JavaScript (React)',
            'ts': 'TypeScript',
            'tsx': 'TypeScript (React)',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'cs': 'C#',
            'php': 'PHP',
            'rb': 'Ruby',
            'go': 'Go',
            'rs': 'Rust',
            'swift': 'Swift',
            'kt': 'Kotlin',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'json': 'JSON',
            'xml': 'XML',
            'md': 'Markdown'
        };

        return languageMap[ext] || ext.toUpperCase();
    }

    /**
     * Detect frameworks and libraries
     * @param {string} content - File content
     * @param {string} ext - File extension
     * @returns {Array} Detected frameworks
     */
    static detectFrameworks(content, ext) {
        const frameworks = [];

        // React
        if (content.includes('import React') || content.includes('from "react"') ||
            content.includes('useState') || content.includes('useEffect') ||
            content.includes('React.Component')) {
            frameworks.push('React');
        }

        // Vue
        if (content.includes('import Vue') || content.includes('from "vue"') ||
            content.includes('export default') && content.includes('data()')) {
            frameworks.push('Vue.js');
        }

        // Angular
        if (content.includes('@Component') || content.includes('@Injectable') ||
            content.includes('@angular/core')) {
            frameworks.push('Angular');
        }

        // Express.js
        if (content.includes('express') || content.includes('app.get') ||
            content.includes('app.post') || content.includes('require(\'express\')')) {
            frameworks.push('Express.js');
        }

        // Django
        if (content.includes('from django') || content.includes('django.db')) {
            frameworks.push('Django');
        }

        // Flask
        if (content.includes('from flask') || content.includes('@app.route')) {
            frameworks.push('Flask');
        }

        // Node.js
        if (ext === 'js' && (content.includes('require(') || content.includes('module.exports'))) {
            frameworks.push('Node.js');
        }

        return frameworks;
    }

    /**
     * Detect code patterns
     * @param {string} content - File content
     * @param {string} ext - File extension
     * @returns {Array} Detected patterns
     */
    static detectPatterns(content, ext) {
        const patterns = [];

        // Classes
        if (content.match(/class\s+\w+/g)) {
            patterns.push('Object-Oriented');
        }

        // Functions
        const functionCount = (content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>/g) || []).length;
        if (functionCount > 0) {
            patterns.push(`Functional (${functionCount} functions)`);
        }

        // Async/Await
        if (content.includes('async') || content.includes('await')) {
            patterns.push('Async/Await');
        }

        // Promises
        if (content.includes('.then(') || content.includes('Promise')) {
            patterns.push('Promises');
        }

        // Hooks (React)
        if (content.match(/use\w+\(/g)) {
            patterns.push('React Hooks');
        }

        return patterns;
    }

    /**
     * Estimate code complexity
     * @param {string} content - File content
     * @param {string} ext - File extension
     * @returns {string} Complexity level
     */
    static estimateComplexity(content, ext) {
        const lines = content.split('\n').length;
        const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>/g) || []).length;
        const classes = (content.match(/class\s+\w+/g) || []).length;
        const conditionals = (content.match(/if\s*\(|switch\s*\(|case\s+/g) || []).length;

        if (lines < 50 && functions < 5) return 'Low';
        if (lines < 200 && functions < 15 && conditionals < 20) return 'Medium';
        return 'High';
    }

    /**
     * Extract dependencies/imports
     * @param {string} content - File content
     * @param {string} ext - File extension
     * @returns {Array} Dependencies
     */
    static extractDependencies(content, ext) {
        const dependencies = [];

        // ES6 imports
        const es6Imports = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
        es6Imports.forEach(imp => {
            const match = imp.match(/from\s+['"]([^'"]+)['"]/);
            if (match && !match[1].startsWith('.')) {
                dependencies.push(match[1]);
            }
        });

        // CommonJS requires
        const requires = content.match(/require\(['"]([^'"]+)['"]\)/g) || [];
        requires.forEach(req => {
            const match = req.match(/require\(['"]([^'"]+)['"]\)/);
            if (match && !match[1].startsWith('.')) {
                dependencies.push(match[1]);
            }
        });

        // Python imports
        if (ext === 'py') {
            const pyImports = content.match(/^import\s+(\w+)|^from\s+(\w+)/gm) || [];
            pyImports.forEach(imp => {
                const match = imp.match(/(?:import|from)\s+(\w+)/);
                if (match) {
                    dependencies.push(match[1]);
                }
            });
        }

        return [...new Set(dependencies)].slice(0, 10); // Remove duplicates, limit to 10
    }

    /**
     * Generate beginner-friendly explanation
     * @param {Object} analysis - Analysis result
     * @returns {string} Explanation text
     */
    static generateBeginnerExplanation(analysis) {
        let explanation = `This is a ${analysis.language} file. `;
        
        if (analysis.frameworks && analysis.frameworks.length > 0) {
            explanation += `It uses ${analysis.frameworks.join(' and ')}. `;
        }

        explanation += `The file has ${analysis.linesOfCode} lines of code. `;

        if (analysis.patterns && analysis.patterns.length > 0) {
            explanation += `It follows ${analysis.patterns[0]} patterns.`;
        }

        return explanation;
    }

    /**
     * Generate advanced explanation
     * @param {Object} analysis - Analysis result
     * @returns {string} Explanation text
     */
    static generateAdvancedExplanation(analysis) {
        let explanation = `**File Analysis: ${analysis.filePath}**\n\n`;
        explanation += `- **Language**: ${analysis.language}\n`;
        explanation += `- **Lines of Code**: ${analysis.linesOfCode}\n`;
        explanation += `- **File Size**: ${(analysis.size / 1024).toFixed(2)} KB\n`;
        explanation += `- **Complexity**: ${analysis.complexity || 'N/A'}\n`;

        if (analysis.frameworks && analysis.frameworks.length > 0) {
            explanation += `- **Frameworks**: ${analysis.frameworks.join(', ')}\n`;
        }

        if (analysis.patterns && analysis.patterns.length > 0) {
            explanation += `- **Patterns**: ${analysis.patterns.join(', ')}\n`;
        }

        if (analysis.dependencies && analysis.dependencies.length > 0) {
            explanation += `- **Dependencies**: ${analysis.dependencies.slice(0, 5).join(', ')}\n`;
        }

        return explanation;
    }
}
