# GitNarrator - User Guide

Complete guide on how to use GitNarrator to analyze GitHub repositories and generate PowerPoint presentations.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Understanding Results](#understanding-results)
5. [PowerPoint Generation](#powerpoint-generation)
6. [Tips & Best Practices](#tips--best-practices)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Setup

1. **Install the Extension**
   - Follow the [Installation Guide](INSTALLATION.md)

2. **Navigate to a GitHub Repository**
   - Open any public GitHub repository in your browser
   - Example: `https://github.com/octocat/Hello-World`

3. **Open GitNarrator**
   - Click the GitNarrator icon in your browser toolbar
   - The side panel will open automatically

### Interface Overview

The GitNarrator interface consists of:

- **Header**: Repository info, mode selector, settings
- **Tabs**: Overview, Structure, Commits, Branches
- **Main Content**: Analysis results and controls
- **Progress Indicator**: Shows analysis progress

## Basic Usage

### Step 1: Analyze Repository

1. **Navigate to Repository**
   - Go to any public GitHub repository page

2. **Open GitNarrator**
   - Click the extension icon
   - Repository name should appear in the header

3. **Start Analysis**
   - Click the "🔍 Analyze Repository" button
   - Progress indicator will show analysis progress
   - Wait for completion (typically 10-30 seconds)

4. **View Results**
   - Results appear in different tabs:
     - **Overview**: Repository description, tech stack, statistics
     - **Structure**: Module organization, architecture
     - **Commits**: Commit history, contributors
     - **Branches**: Available branches, comparisons

### Step 2: Generate PowerPoint

1. **Complete Analysis**
   - Ensure analysis completed successfully
   - "Generate PowerPoint" button should be enabled

2. **Select Mode**
   - **Basic Mode**: Essential slides only
   - **Advanced Mode**: Comprehensive analysis with all slides

3. **Generate**
   - Click "📥 Generate PowerPoint" button
   - Wait for generation (typically 5-15 seconds)
   - File will download automatically

## Advanced Features

### Mode Selection

**Basic Mode** (Default):
- Essential slides only
- Faster generation
- Good for quick overviews

**Advanced Mode**:
- All slides included
- Module-wise analysis
- Branch comparisons
- Detailed commit history
- Best for comprehensive presentations

### Branch Selection

1. **View Branches**
   - Go to "Branches" tab
   - See all available branches

2. **Select Branch**
   - Use the branch dropdown
   - Select a different branch to analyze

3. **Compare Branches**
   - Select two branches
   - View differences in the branch comparison section

### Settings Configuration

1. **Open Settings**
   - Click "⚙️ Settings" in the header

2. **Add OpenAI API Key (Optional)**
   - Enter your OpenAI API key
   - Click "Save Key"
   - Enables AI-powered code explanations
   - **Note**: Works without key using heuristics

## Understanding Results

### Overview Tab

**Repository Description**
- Project description from GitHub
- Key information about the project

**Technology Stack**
- Detected programming languages
- Technology tags

**Repository Statistics**
- Stars, Forks, Issues
- Total files count

### Structure Tab

**Module Structure**
- Files organized by module
- Module categories:
  - UI/Components
  - API/Backend
  - Utils/Helpers
  - Configuration
  - Tests
  - Database
  - Styles
  - Documentation
  - Assets

**Architecture Diagram**
- Visual representation of project structure
- Module relationships

### Commits Tab

**Commit History**
- Recent commits with messages
- Author information
- Commit dates

**Contributors**
- Top contributors
- Contribution statistics
- Contributor avatars

### Branches Tab

**Available Branches**
- List of all branches
- Branch protection status

**Branch Comparison**
- Differences between branches
- File changes summary

## PowerPoint Generation

### What's Included

The generated PowerPoint includes:

1. **Title Slide**
   - Repository name and metadata

2. **Project Overview**
   - Description and key metrics

3. **Technology Stack**
   - Languages and frameworks

4. **Architecture**
   - Module structure and organization

5. **Module Analysis** (Advanced mode)
   - Detailed module breakdown

6. **Commit History**
   - Timeline and contributors

7. **Branch Comparison** (Advanced mode)
   - Branch differences

8. **Network Flow**
   - Data flow diagram

9. **Functional Requirements**
   - System requirements

10. **Non-Functional Requirements**
    - Performance, security, etc.

11. **Work Breakdown Structure**
    - Project structure

12. **Future Scope**
    - Recommendations and roadmap

### Customization

Currently, the presentation uses a standard template. Future versions may include:
- Custom templates
- Theme selection
- Slide customization

## Tips & Best Practices

### For Best Results

1. **Choose Appropriate Repositories**
   - Works best with well-structured repositories
   - Larger repos may take longer to analyze

2. **Use Advanced Mode for Presentations**
   - Provides comprehensive analysis
   - Better for academic/professional use

3. **Wait for Complete Analysis**
   - Don't interrupt the analysis process
   - Ensure all data is loaded before generating PPT

4. **Check Rate Limits**
   - GitHub allows 60 requests/hour (unauthenticated)
   - Extension handles rate limits automatically

5. **Use AI Key for Better Explanations**
   - Optional but recommended
   - Provides more detailed code explanations

### Performance Tips

1. **Large Repositories**
   - May take 30-60 seconds to analyze
   - Be patient during analysis

2. **Multiple Analyses**
   - Wait between analyses to avoid rate limits
   - Extension shows progress clearly

3. **PPT Generation**
   - Advanced mode takes longer
   - Basic mode is faster

## Troubleshooting

### Common Issues

**Analysis Not Starting**
- Check internet connection
- Verify you're on a GitHub repository page
- Check browser console for errors

**Rate Limit Errors**
- Wait a few minutes
- Extension will automatically retry
- Consider using authenticated requests (future feature)

**PPT Not Generating**
- Ensure analysis completed successfully
- Check browser console for errors
- Verify PptxGenJS library is loaded

**Missing Data**
- Some repositories may have limited data
- Private repositories are not supported
- Check repository permissions

### Getting Help

1. **Check Console**
   - Open DevTools (F12)
   - Look for error messages

2. **Review Documentation**
   - [Installation Guide](INSTALLATION.md)
   - [Technical Documentation](TECHNICAL_DOCS.md)

3. **Verify Setup**
   - All files in correct locations
   - Libraries properly loaded
   - Extension permissions granted

## Keyboard Shortcuts

Currently, GitNarrator uses mouse/touch interactions. Keyboard shortcuts may be added in future versions.

## Limitations

### Current Limitations

1. **Public Repositories Only**
   - Private repos require authentication (not implemented)

2. **Rate Limits**
   - 60 requests/hour for unauthenticated users
   - Extension handles this automatically

3. **File Size Limits**
   - Very large files may not be fully analyzed
   - Extension focuses on structure and key files

4. **Language Support**
   - Best results with common languages
   - Some languages may have limited analysis

### Future Enhancements

- Private repository support
- Custom templates
- Export to other formats (PDF, Markdown)
- Multi-repository comparison
- Advanced visualizations

## Best Practices for Presentations

1. **Review Generated Content**
   - Check all slides for accuracy
   - Customize as needed

2. **Add Context**
   - Supplement with your own insights
   - Add project-specific details

3. **Use for Overview**
   - Great starting point
   - Add detailed explanations as needed

4. **Academic Use**
   - Perfect for project presentations
   - Includes WBS and requirements

## Support

For additional help:
- Review [Technical Documentation](TECHNICAL_DOCS.md)
- Check [System Design](SYSTEM_DESIGN.md)
- Review code comments for technical details

---

**Happy Analyzing!** 🚀

Use GitNarrator to quickly understand any GitHub repository and create professional presentations.
