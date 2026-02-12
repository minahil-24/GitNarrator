# GitNarrator - Intelligent GitHub Repository to PowerPoint Generator

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**GitNarrator** is a powerful browser extension that automatically analyzes GitHub repositories and generates comprehensive PowerPoint presentations. It's designed for developers, project managers, and students who need to quickly understand codebase structure, architecture, and development history.

## 🌟 Features

### Core Capabilities
- **🔍 Repository Analysis**: Deep analysis of public GitHub repositories
- **🌿 Multi-Branch Support**: Traverse and analyze all branches
- **📊 Code Classification**: Automatic file classification by language and module
- **🏗️ Architecture Detection**: Understand project structure and patterns
- **📝 Commit History**: Analyze commit timeline, authors, and development patterns
- **🔄 Branch Comparison**: Compare branches and highlight differences
- **📥 PowerPoint Generation**: Create professional presentations automatically

### Advanced Features
- **🎯 Intelligent Analysis**: AI-powered code explanation (optional)
- **📈 Progress Tracking**: Real-time analysis progress indicators
- **🎨 Modern UI**: Clean, professional interface
- **⚡ Performance Optimized**: Efficient API usage with rate limiting
- **🔒 Privacy First**: All processing happens locally, no data sent to external servers (except GitHub API and optional OpenAI)

## 📋 Requirements

- **Browser**: Chrome/Edge (Chromium-based) version 88 or higher
- **Internet Connection**: Required for GitHub API access
- **GitHub Repository**: Public repository access (no authentication required)

### Optional
- **OpenAI API Key**: For AI-powered analysis (optional, falls back to heuristics)

## 🚀 Quick Start

1. **Install the Extension**
   - See [Installation Guide](INSTALLATION.md) for detailed steps

2. **Navigate to a GitHub Repository**
   - Open any public GitHub repository in your browser

3. **Open GitNarrator**
   - Click the extension icon in your toolbar
   - The side panel will open automatically

4. **Analyze Repository**
   - Click "Analyze Repository" button
   - Wait for analysis to complete (typically 10-30 seconds)

5. **Generate PowerPoint**
   - Click "Generate PowerPoint" button
   - Your presentation will be downloaded automatically

## 📖 Documentation

- **[Installation Guide](INSTALLATION.md)** - Step-by-step installation instructions
- **[User Guide](USER_GUIDE.md)** - How to use GitNarrator
- **[Technical Documentation](TECHNICAL_DOCS.md)** - Technical details and architecture
- **[System Design](SYSTEM_DESIGN.md)** - Complete system design document

## 🎯 Use Cases

### For Students
- Quickly understand project structure for assignments
- Generate presentations for project demonstrations
- Analyze codebases for learning purposes

### For Developers
- Onboard new team members with repository overviews
- Document project architecture
- Analyze codebase before contributing

### For Project Managers
- Generate project status presentations
- Understand development timeline
- Track project metrics and statistics

## 🏗️ Architecture

GitNarrator follows a clean, modular architecture:

```
┌─────────────────┐
│   Side Panel    │  ← User Interface
│      (UI)       │
└────────┬────────┘
         │
┌────────▼────────┐
│  Service Layer  │  ← Business Logic
│  - GitHub API   │
│  - Analysis     │
│  - PPT Gen      │
└────────┬────────┘
         │
┌────────▼────────┐
│  GitHub REST    │  ← External API
│      API        │
└─────────────────┘
```

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Libraries**: 
  - PptxGenJS (PowerPoint generation)
  - Chart.js (Data visualization)
  - Mermaid.js (Diagrams)
- **APIs**: GitHub REST API, OpenAI API (optional)

## 📊 What's Included in Generated Presentations

1. **Title Slide** - Repository information
2. **Project Overview** - Description and key metrics
3. **Technology Stack** - Detected languages and frameworks
4. **Architecture** - Module structure and organization
5. **Module Analysis** - Detailed module breakdown (Advanced mode)
6. **Commit History** - Development timeline and contributors
7. **Branch Comparison** - Branch differences (Advanced mode)
8. **Network Flow** - Data flow diagram
9. **Functional Requirements** - System requirements
10. **Non-Functional Requirements** - Performance, security, etc.
11. **Work Breakdown Structure (WBS)** - Project structure
12. **Future Scope** - Recommendations and roadmap

## 🛠️ Development

### Project Structure

```
extension/
├── manifest.json
├── background/
│   └── service-worker.js
├── ui/
│   ├── sidepanel.html
│   ├── sidepanel.js
│   ├── sidepanel.css
│   └── components/
├── services/
│   ├── github/
│   ├── analysis/
│   ├── ai/
│   └── ppt/
├── utils/
└── docs/
```

### Design Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, etc.
- **Separation of Concerns**: Clear module boundaries
- **Service Layer Pattern**: Business logic separation
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Respectful API usage

## 🤝 Contributing

This is a university project, but suggestions and feedback are welcome!

## 📝 License

This project is created for educational purposes as part of a Software Project Management course.

## 🙏 Acknowledgments

- GitHub for providing the REST API
- PptxGenJS for PowerPoint generation
- All open-source libraries used in this project

## 📧 Support

For issues, questions, or feedback, please refer to the documentation or create an issue in the project repository.

---

**Made with ❤️ for developers and students**
