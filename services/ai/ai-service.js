/**
 * AI Service
 * 
 * Handles AI-powered analysis using OpenAI API (optional)
 * Falls back to heuristics if API key is not provided
 * 
 * Design Pattern: Service Layer / Strategy
 * Responsibility: AI-powered code analysis and explanation
 */

class AIService {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1';
    }

    /**
     * Initialize AI service with API key
     * @param {string} apiKey - OpenAI API key
     */
    async initialize(apiKey) {
        if (apiKey && apiKey.trim().length > 0) {
            this.apiKey = apiKey.trim();
            await StorageUtils.set('openai_key', this.apiKey);
            return true;
        } else {
            this.apiKey = null;
            await StorageUtils.remove('openai_key');
            return false;
        }
    }

    /**
     * Load API key from storage
     */
    async loadKey() {
        this.apiKey = await StorageUtils.get('openai_key');
        return this.apiKey !== null;
    }

    /**
     * Check if AI service is available
     * @returns {boolean}
     */
    isAvailable() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }

    /**
     * Generate text using OpenAI API
     * @param {string} prompt - Prompt text
     * @param {Object} context - Additional context
     * @param {string} model - Model to use (default: gpt-3.5-turbo)
     * @returns {Promise<string|null>} Generated text or null if unavailable
     */
    async generate(prompt, context = {}, model = 'gpt-3.5-turbo') {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            const systemPrompt = context.systemPrompt || 
                'You are an expert software architect acting as a backend for a repository analysis tool. Be concise, technical, and professional.';

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: context.maxTokens || 500
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                Logger.warn('AI API error', error);
                return null;
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || null;
        } catch (error) {
            Logger.error('AI generation failed', error);
            return null;
        }
    }

    /**
     * Generate code explanation
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} mode - 'beginner' or 'advanced'
     * @returns {Promise<string>} Explanation
     */
    async explainCode(filePath, content, mode = 'beginner') {
        const ext = filePath.split('.').pop().toLowerCase();
        const contentPreview = content.substring(0, 2000); // Limit content size

        const prompt = mode === 'beginner'
            ? `Explain this ${ext} file for a beginner student in 2-3 sentences. Focus on what it does, not how it works.\n\nFile: ${filePath}\n\nCode:\n${contentPreview}`
            : `Provide an advanced technical summary of this ${ext} file. Highlight patterns, architecture, and key logic. Be concise.\n\nFile: ${filePath}\n\nCode:\n${contentPreview}`;

        return await this.generate(prompt, {
            systemPrompt: mode === 'beginner' 
                ? 'You are a helpful coding instructor explaining code to beginners.'
                : 'You are a senior software architect analyzing code.'
        });
    }

    /**
     * Generate architecture summary
     * @param {Object} analysis - Repository analysis result
     * @returns {Promise<string>} Architecture summary
     */
    async generateArchitectureSummary(analysis) {
        const prompt = `Based on this repository analysis, provide a 2-3 sentence architecture summary:\n\n` +
            `Languages: ${analysis.technologies.languages.join(', ')}\n` +
            `Modules: ${analysis.structure.modules.map(m => m.name).join(', ')}\n` +
            `Total Files: ${analysis.structure.totalFiles}\n` +
            `Description: ${analysis.repository.description || 'N/A'}`;

        return await this.generate(prompt, {
            systemPrompt: 'You are an expert software architect. Provide concise architecture insights.'
        });
    }

    /**
     * Generate project overview
     * @param {Object} analysis - Repository analysis result
     * @returns {Promise<string>} Project overview
     */
    async generateProjectOverview(analysis) {
        const prompt = `Generate a professional project overview (2-3 sentences) for:\n\n` +
            `Repository: ${analysis.repository.fullName}\n` +
            `Description: ${analysis.repository.description || 'N/A'}\n` +
            `Technologies: ${analysis.technologies.languages.join(', ')}\n` +
            `Stars: ${analysis.repository.stars}`;

        return await this.generate(prompt, {
            systemPrompt: 'You are a technical writer creating project documentation.'
        });
    }
}

// Export singleton instance
const aiService = new AIService();
