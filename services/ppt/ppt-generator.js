/**
 * PPT Generator Service
 * 
 * Generates comprehensive PowerPoint presentations from repository analysis
 * 
 * Design Pattern: Service Layer
 * Responsibility: PowerPoint generation and slide creation
 */

class PPTGenerator {
    /**
     * Generate PowerPoint presentation
     * @param {Object} analysis - Complete repository analysis result
     * @param {string} mode - 'basic' or 'advanced'
     * @param {Function} progressCallback - Progress callback
     * @returns {Promise<void>}
     */
    static async generate(analysis, mode = 'basic', progressCallback = null) {
        if (typeof PptxGenJS === 'undefined') {
            throw new Error('PptxGenJS library not found. Please add it to assets/libs.');
        }

        const reportProgress = (step, message) => {
            if (progressCallback) {
                progressCallback({ step, message, progress: step * 5 });
            }
        };

        reportProgress(1, 'Initializing presentation...');
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'GitNarrator';
        pptx.company = 'GitNarrator Extension';
        pptx.subject = `Analysis of ${analysis.repository.fullName}`;

        // Color scheme
        const colors = {
            bg: 'F6F8FA',        // Light background
            text: '24292F',       // Dark text
            accent: '0969DA',     // GitHub blue
            secondary: '656D76',  // Gray
            success: '1A7F37',    // Green
            warning: '9A6700',    // Orange
            codeBg: 'F6F8FA'      // Code background
        };

        // Create master slide
        this.createMasterSlide(pptx, colors);

        reportProgress(2, 'Creating title slide...');
        this.createTitleSlide(pptx, analysis, colors);

        reportProgress(3, 'Creating project overview...');
        await this.createProjectOverviewSlide(pptx, analysis, colors);

        reportProgress(4, 'Creating tech stack slide...');
        this.createTechStackSlide(pptx, analysis, colors);

        reportProgress(5, 'Creating architecture slide...');
        this.createArchitectureSlide(pptx, analysis, colors);

        if (mode === 'advanced') {
            reportProgress(6, 'Creating module analysis slides...');
            await this.createModuleSlides(pptx, analysis, colors);

            reportProgress(7, 'Creating commit history slide...');
            this.createCommitHistorySlide(pptx, analysis, colors);

            reportProgress(8, 'Creating branch comparison slide...');
            await this.createBranchComparisonSlide(pptx, analysis, colors);
        }

        reportProgress(9, 'Creating network flow diagram...');
        this.createNetworkFlowSlide(pptx, analysis, colors);

        reportProgress(10, 'Creating requirements slides...');
        this.createRequirementsSlides(pptx, analysis, colors);

        reportProgress(11, 'Creating WBS slide...');
        this.createWBSSlide(pptx, analysis, colors);

        reportProgress(12, 'Creating future scope slide...');
        await this.createFutureScopeSlide(pptx, analysis, colors);

        reportProgress(13, 'Finalizing presentation...');
        const fileName = `GitNarrator-${analysis.repository.fullName.replace('/', '-')}-${Date.now()}.pptx`;
        await pptx.writeFile({ fileName });
        
        reportProgress(14, 'Presentation generated!');
        return fileName;
    }

    /**
     * Create master slide template
     */
    static createMasterSlide(pptx, colors) {
        pptx.defineSlideMaster({
            title: 'MASTER_SLIDE',
            background: { color: colors.bg },
            objects: [
                {
                    line: {
                        x: 0.5,
                        y: 0.3,
                        w: '95%',
                        h: 0.02,
                        line: colors.accent,
                        lineSize: 2
                    }
                },
                {
                    text: {
                        text: 'GitNarrator',
                        options: {
                            x: 0.5,
                            y: 7.4,
                            w: 2,
                            fontSize: 10,
                            color: colors.secondary,
                            fontFace: 'Arial'
                        }
                    }
                }
            ]
        });
    }

    /**
     * Create title slide
     */
    static createTitleSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.background = { color: colors.bg };

        // Title
        slide.addText(analysis.repository.fullName, {
            x: 1,
            y: 2.5,
            w: '80%',
            h: 1,
            fontSize: 44,
            color: colors.text,
            bold: true,
            align: 'center'
        });

        // Subtitle
        slide.addText('Intelligent Repository Analysis', {
            x: 1,
            y: 3.8,
            w: '80%',
            fontSize: 24,
            color: colors.accent,
            align: 'center'
        });

        // Metadata
        const metadata = [
            `Generated: ${new Date(analysis.analysisDate).toLocaleDateString()}`,
            `Branch: ${analysis.repository.defaultBranch}`,
            `Total Files: ${analysis.structure.totalFiles}`
        ].join(' • ');

        slide.addText(metadata, {
            x: 1,
            y: 5.5,
            w: '80%',
            fontSize: 14,
            color: colors.secondary,
            align: 'center'
        });
    }

    /**
     * Create project overview slide
     */
    static async createProjectOverviewSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Project Overview', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        // Description
        let overview = analysis.repository.description || 'No description available.';
        
        // Try AI-generated overview
        if (typeof aiService !== 'undefined' && aiService.isAvailable()) {
            const aiOverview = await aiService.generateProjectOverview(analysis);
            if (aiOverview) {
                overview = aiOverview;
            }
        }

        slide.addText(overview, {
            x: 0.5,
            y: 1.2,
            w: '90%',
            fontSize: 16,
            color: colors.text,
            lineSpacing: 28
        });

        // Key metrics
        slide.addText('Key Metrics', {
            x: 0.5,
            y: 3.5,
            fontSize: 20,
            color: colors.accent,
            bold: true
        });

        const metrics = [
            `⭐ Stars: ${analysis.repository.stars}`,
            `🍴 Forks: ${analysis.repository.forks}`,
            `👀 Watchers: ${analysis.repository.watchers}`,
            `📝 Open Issues: ${analysis.repository.openIssues}`,
            `📅 Created: ${new Date(analysis.repository.createdAt).toLocaleDateString()}`,
            `🔄 Last Updated: ${new Date(analysis.repository.updatedAt).toLocaleDateString()}`
        ];

        slide.addText(metrics.join('\n'), {
            x: 0.5,
            y: 4.2,
            w: '45%',
            fontSize: 14,
            color: colors.text,
            bullet: { type: 'number', code: '1.' }
        });
    }

    /**
     * Create tech stack slide
     */
    static createTechStackSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Technology Stack', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const languages = analysis.technologies.languages;
        const languageStats = analysis.technologies.languageStats;

        // Primary languages
        slide.addText('Primary Languages', {
            x: 0.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        const topLanguages = Object.entries(languageStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([lang, bytes]) => {
                const percentage = ((bytes / Object.values(languageStats).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return `${lang}: ${percentage}%`;
            });

        slide.addText(topLanguages.join('\n'), {
            x: 0.5,
            y: 1.8,
            w: '45%',
            fontSize: 14,
            color: colors.text
        });

        // Detected frameworks (from code analysis)
        slide.addText('Detected Technologies', {
            x: 5.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        const techList = languages.length > 0 
            ? languages.join(', ')
            : 'Analysis in progress...';

        slide.addText(techList, {
            x: 5.5,
            y: 1.8,
            w: '40%',
            fontSize: 14,
            color: colors.text
        });
    }

    /**
     * Create architecture slide
     */
    static createArchitectureSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Project Architecture', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        // Module structure
        slide.addText('Module Structure', {
            x: 0.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        const modules = analysis.structure.modules.slice(0, 8).map(m => 
            `${m.name}: ${m.fileCount} files`
        );

        slide.addText(modules.join('\n'), {
            x: 0.5,
            y: 1.8,
            w: '45%',
            fontSize: 14,
            color: colors.text
        });

        // Architecture description
        let archDescription = 'The project follows a modular architecture with clear separation of concerns.';
        
        if (analysis.structure.modules.length > 0) {
            const topModules = analysis.structure.modules.slice(0, 3).map(m => m.name).join(', ');
            archDescription = `The project is organized into ${analysis.structure.modules.length} main modules: ${topModules}.`;
        }

        slide.addText('Architecture Overview', {
            x: 5.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        slide.addText(archDescription, {
            x: 5.5,
            y: 1.8,
            w: '40%',
            fontSize: 14,
            color: colors.text,
            lineSpacing: 24
        });
    }

    /**
     * Create module analysis slides
     */
    static async createModuleSlides(pptx, analysis, colors) {
        const topModules = analysis.structure.modules.slice(0, 3);

        for (const module of topModules) {
            const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
            slide.addText(`Module: ${module.name}`, {
                x: 0.5,
                y: 0.4,
                fontSize: 32,
                color: colors.accent,
                bold: true
            });

            slide.addText(`Files: ${module.fileCount}`, {
                x: 0.5,
                y: 1.2,
                fontSize: 18,
                color: colors.text,
                bold: true
            });

            // Show sample files
            const sampleFiles = module.files.slice(0, 10).map(f => {
                const parts = f.split('/');
                return parts[parts.length - 1];
            });

            slide.addText('Key Files:', {
                x: 0.5,
                y: 1.8,
                fontSize: 16,
                color: colors.text,
                bold: true
            });

            slide.addText(sampleFiles.join('\n'), {
                x: 0.5,
                y: 2.3,
                w: '90%',
                fontSize: 12,
                color: colors.secondary
            });
        }
    }

    /**
     * Create commit history slide
     */
    static createCommitHistorySlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Commit History & Development Timeline', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const commits = analysis.commits;

        slide.addText(`Total Commits: ${commits.totalCommits}`, {
            x: 0.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        // Top contributors
        if (commits.authors && commits.authors.topContributors) {
            slide.addText('Top Contributors', {
                x: 0.5,
                y: 1.8,
                fontSize: 16,
                color: colors.text,
                bold: true
            });

            const contributors = commits.authors.topContributors
                .slice(0, 5)
                .map((author, idx) => `${idx + 1}. ${author.name}: ${author.count} commits`);

            slide.addText(contributors.join('\n'), {
                x: 0.5,
                y: 2.3,
                w: '45%',
                fontSize: 14,
                color: colors.text
            });
        }

        // Recent activity
        if (commits.recentActivity) {
            slide.addText('Recent Activity', {
                x: 5.5,
                y: 1.8,
                fontSize: 16,
                color: colors.text,
                bold: true
            });

            const activity = [
                `Last Week: ${commits.recentActivity.lastWeek} commits`,
                `Last Month: ${commits.recentActivity.lastMonth} commits`,
                `Status: ${commits.recentActivity.isActive ? 'Active' : 'Inactive'}`
            ];

            slide.addText(activity.join('\n'), {
                x: 5.5,
                y: 2.3,
                w: '40%',
                fontSize: 14,
                color: colors.text
            });
        }
    }

    /**
     * Create branch comparison slide
     */
    static async createBranchComparisonSlide(pptx, analysis, colors) {
        if (analysis.branches.length < 2) {
            return; // Skip if only one branch
        }

        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Branch Comparison', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        slide.addText(`Total Branches: ${analysis.branches.length}`, {
            x: 0.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        // List branches
        const branchList = analysis.branches
            .slice(0, 10)
            .map(b => `${b.name}${b.protected ? ' (protected)' : ''}`);

        slide.addText('Available Branches:', {
            x: 0.5,
            y: 1.8,
            fontSize: 16,
            color: colors.text,
            bold: true
        });

        slide.addText(branchList.join('\n'), {
            x: 0.5,
            y: 2.3,
            w: '90%',
            fontSize: 14,
            color: colors.text
        });
    }

    /**
     * Create network flow diagram slide
     */
    static createNetworkFlowSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Network Flow & Data Architecture', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const flowDescription = [
            '1. Browser Extension → GitHub REST API',
            '2. API requests for repository data',
            '3. Data processing and analysis',
            '4. PowerPoint generation',
            '5. File download to user'
        ];

        slide.addText('Data Flow:', {
            x: 0.5,
            y: 1.2,
            fontSize: 18,
            color: colors.text,
            bold: true
        });

        slide.addText(flowDescription.join('\n'), {
            x: 0.5,
            y: 1.8,
            w: '90%',
            fontSize: 14,
            color: colors.text
        });
    }

    /**
     * Create requirements slides
     */
    static createRequirementsSlides(pptx, analysis, colors) {
        // Functional Requirements
        const slide1 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide1.addText('Functional Requirements', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const functionalReqs = [
            'Repository analysis and structure detection',
            'Multi-branch traversal and comparison',
            'Code file classification and analysis',
            'Commit history analysis and timeline generation',
            'Automated PowerPoint presentation generation',
            'Technology stack detection',
            'Module identification and organization'
        ];

        slide1.addText(functionalReqs.join('\n'), {
            x: 0.5,
            y: 1.2,
            w: '90%',
            fontSize: 14,
            color: colors.text,
            bullet: { type: 'number', code: '1.' }
        });

        // Non-Functional Requirements
        const slide2 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide2.addText('Non-Functional Requirements', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const nonFunctionalReqs = [
            'Performance: Analysis completes within 30 seconds',
            'Reliability: Handles API rate limits gracefully',
            'Usability: Intuitive user interface',
            'Security: Secure API key storage',
            'Maintainability: Modular, SOLID-compliant code',
            'Scalability: Handles repositories of various sizes'
        ];

        slide2.addText(nonFunctionalReqs.join('\n'), {
            x: 0.5,
            y: 1.2,
            w: '90%',
            fontSize: 14,
            color: colors.text,
            bullet: { type: 'number', code: '1.' }
        });
    }

    /**
     * Create WBS slide
     */
    static createWBSSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Work Breakdown Structure (WBS)', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        const wbs = [
            '1. Architecture & Design',
            '   1.1 System architecture design',
            '   1.2 API integration design',
            '   1.3 UI/UX design',
            '2. Core Development',
            '   2.1 GitHub API integration',
            '   2.2 Repository analysis engine',
            '   2.3 Code analysis engine',
            '   2.4 PPT generation engine',
            '3. Testing & Documentation',
            '   3.1 Unit testing',
            '   3.2 User documentation',
            '   3.3 Technical documentation'
        ];

        slide.addText(wbs.join('\n'), {
            x: 0.5,
            y: 1.2,
            w: '90%',
            fontSize: 12,
            color: colors.text
        });
    }

    /**
     * Create future scope slide
     */
    static async createFutureScopeSlide(pptx, analysis, colors) {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
        slide.addText('Future Scope & Recommendations', {
            x: 0.5,
            y: 0.4,
            fontSize: 32,
            color: colors.accent,
            bold: true
        });

        let recommendations = [
            '• Implement multi-repository comparison',
            '• Add support for additional export formats (PDF, Markdown)',
            '• Enhance AI-powered analysis capabilities',
            '• Add custom template support',
            '• Implement collaboration features',
            '• Add dependency graph visualization'
        ];

        // Try AI-generated recommendations
        if (typeof aiService !== 'undefined' && aiService.isAvailable()) {
            const aiRecs = await aiService.generate(
                `Suggest 3-4 future improvements for a GitHub repository analysis tool. Be professional and specific.`
            );
            if (aiRecs) {
                recommendations = aiRecs.split('\n').filter(r => r.trim().length > 0).slice(0, 6);
            }
        }

        slide.addText(recommendations.join('\n'), {
            x: 0.5,
            y: 1.2,
            w: '90%',
            fontSize: 14,
            color: colors.text
        });
    }
}
