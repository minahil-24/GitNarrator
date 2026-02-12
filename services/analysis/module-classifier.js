/**
 * Module Classifier Service
 * 
 * Classifies files into modules based on path patterns and content
 * 
 * Design Pattern: Service Layer
 * Responsibility: Module identification and classification
 */

class ModuleClassifier {
    /**
     * Classify a file into a module category
     * @param {string} filePath - File path
     * @param {string} content - File content (optional)
     * @returns {string} Module category
     */
    static classify(filePath, content = '') {
        const path = filePath.toLowerCase();
        
        // UI/Frontend modules
        if (path.includes('component') || path.includes('ui/') || path.includes('view/') || 
            path.includes('page/') || path.includes('screen/') || path.endsWith('.jsx') || 
            path.endsWith('.tsx') || path.includes('template')) {
            return 'UI/Components';
        }

        // API/Backend modules
        if (path.includes('api/') || path.includes('route/') || path.includes('endpoint/') ||
            path.includes('controller/') || path.includes('handler/') || path.includes('service/')) {
            return 'API/Backend';
        }

        // Utils/Helpers
        if (path.includes('util/') || path.includes('helper/') || path.includes('lib/') ||
            path.includes('common/') || path.includes('shared/')) {
            return 'Utils/Helpers';
        }

        // Configuration
        if (path.includes('config/') || path.includes('setting/') || path.endsWith('.config.js') ||
            path.endsWith('.env') || path.includes('package.json') || path.includes('tsconfig.json')) {
            return 'Configuration';
        }

        // Tests
        if (path.includes('test/') || path.includes('spec/') || path.includes('__test__/') ||
            path.includes('__tests__/') || path.endsWith('.test.js') || path.endsWith('.spec.js')) {
            return 'Tests';
        }

        // Database
        if (path.includes('model/') || path.includes('schema/') || path.includes('db/') ||
            path.includes('database/') || path.includes('migration/')) {
            return 'Database';
        }

        // Styles
        if (path.endsWith('.css') || path.endsWith('.scss') || path.endsWith('.sass') ||
            path.endsWith('.less') || path.includes('style/') || path.includes('theme/')) {
            return 'Styles';
        }

        // Documentation
        if (path.endsWith('.md') || path.includes('doc/') || path.includes('docs/') ||
            path.includes('readme')) {
            return 'Documentation';
        }

        // Assets
        if (path.includes('asset/') || path.includes('image/') || path.includes('img/') ||
            path.includes('static/') || path.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
            return 'Assets';
        }

        // Default: Source code
        return 'Source Code';
    }

    /**
     * Group files by module
     * @param {Array} files - Array of file objects with path property
     * @returns {Object} Object with module names as keys and file arrays as values
     */
    static groupByModule(files) {
        const modules = {};

        files.forEach(file => {
            const module = this.classify(file.path, file.content || '');
            if (!modules[module]) {
                modules[module] = [];
            }
            modules[module].push(file);
        });

        return modules;
    }

    /**
     * Get module statistics
     * @param {Object} modules - Module groups from groupByModule
     * @returns {Array} Array of module stats
     */
    static getModuleStats(modules) {
        return Object.entries(modules).map(([name, files]) => ({
            name,
            fileCount: files.length,
            files: files.map(f => f.path)
        })).sort((a, b) => b.fileCount - a.fileCount);
    }
}
