# GitNarrator - Complete System Design Document

## 1. Executive Summary

**GitNarrator** is an intelligent browser extension that analyzes GitHub repositories and automatically generates comprehensive PowerPoint presentations. It serves as a powerful tool for developers, project managers, and students to quickly understand codebase structure, architecture, and development history.
#hello

### Key Capabilities
- **Repository Analysis**: Deep analysis of public and authenticated private repositories
- **Multi-Branch Traversal**: Analyzes all branches and commits
- **Intelligent Code Classification**: Categorizes files by language, module, and purpose
- **Architecture Understanding**: Detects project structure and architectural patterns
- **Commit History Analysis**: Timeline, author patterns, and development insights
- **Branch Comparison**: Highlights differences between branches
- **Automated PPT Generation**: Creates professional presentations with multiple slide types

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Extension                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Side Panel  │  │   Content    │  │  Background  │     │
│  │     UI       │  │    Scripts   │  │   Service    │     │
│  │              │  │              │  │    Worker    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │  Service Layer  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │ GitHub   │  │                        │
│                  │  │   API    │  │                        │
│                  │  └──────────┘  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │   Code   │  │                        │
│                  │  │ Analyzer │  │                        │
│                  │  └──────────┘  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │  Commit  │  │                        │
│                  │  │ Analyzer │  │                        │
│                  │  └──────────┘  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │  Branch  │  │                        │
│                  │  │ Compare  │  │                        │
│                  │  └──────────┘  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │    AI    │  │                        │
│                  │  │ Service  │  │                        │
│                  │  └──────────┘  │                        │
│                  │  ┌──────────┐  │                        │
│                  │  │   PPT    │  │                        │
│                  │  │ Generator│  │                        │
│                  │  └──────────┘  │                        │
│                  └─────────────────┘                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  GitHub REST &  │
                  │  GraphQL APIs   │
                  └─────────────────┘
```

### 2.2 Component Breakdown

#### **A. Presentation Layer (UI)**
- **Side Panel**: Main user interface
  - Repository selector
  - Branch selector
  - Analysis mode selector (Basic/Advanced)
  - Progress indicators
  - Results display
  - Settings panel

#### **B. Background Service Worker**
- Manages extension lifecycle
- Handles cross-tab communication
- Manages storage (tokens, cache)
- Coordinates between UI and services

#### **C. Service Layer (Core Business Logic)**

1. **GitHub API Service**
   - REST API wrapper
   - GraphQL queries for efficient data fetching
   - Rate limit handling
   - Authentication management
   - Error handling & retry logic

2. **Repository Analyzer Service**
   - Repository metadata extraction
   - Tree traversal (all branches)
   - File classification
   - Language detection
   - Module identification

3. **Code Analyzer Service**
   - File content analysis
   - Pattern detection
   - Architecture inference
   - Dependency mapping
   - Code summarization

4. **Commit History Service**
   - Commit traversal (all branches)
   - Timeline generation
   - Author analysis
   - Commit frequency patterns
   - Development insights

5. **Branch Comparison Service**
   - Branch diff analysis
   - Change summarization
   - Conflict detection
   - Merge analysis

6. **AI Service**
   - OpenAI integration
   - Code explanation generation
   - Architecture inference
   - Documentation generation
   - Fallback heuristics

7. **PPT Generator Service**
   - Slide template management
   - Content organization
   - Visual diagram generation
   - Export functionality

---

## 3. Data Flow Architecture

### 3.1 Repository Analysis Flow

```
User Input (Repo URL)
    │
    ▼
[Background Worker] → Extract Owner/Repo
    │
    ▼
[GitHub API Service] → Fetch Repository Metadata
    │
    ├─→ [Repository Analyzer] → Get Tree Structure
    │       │
    │       ├─→ [Code Analyzer] → Classify Files
    │       │
    │       └─→ [Module Identifier] → Group by Module
    │
    ├─→ [Commit History Service] → Fetch All Commits
    │       │
    │       └─→ Analyze Timeline & Authors
    │
    └─→ [Branch Service] → List All Branches
            │
            └─→ [Branch Comparison] → Compare Selected Branches
                    │
                    ▼
[Data Aggregator] → Combine All Analysis
    │
    ▼
[PPT Generator] → Create Presentation
    │
    ▼
User Downloads PPTX
```

### 3.2 Network Flow Diagram

```
┌─────────────┐
│   Browser   │
│  Extension  │
└──────┬──────┘
       │ HTTPS
       │
       ▼
┌─────────────────────────────────────┐
│      GitHub REST API                │
│  • /repos/{owner}/{repo}            │
│  • /repos/{owner}/{repo}/commits    │
│  • /repos/{owner}/{repo}/branches   │
│  • /repos/{owner}/{repo}/git/trees  │
└─────────────────────────────────────┘
       │
       │ GraphQL (if available)
       ▼
┌─────────────────────────────────────┐
│      GitHub GraphQL API             │
│  • Efficient batch queries          │
│  • Reduced API calls                │
└─────────────────────────────────────┘
       │
       │ (Optional)
       ▼
┌─────────────────────────────────────┐
│      OpenAI API                     │
│  • Code explanation                 │
│  • Architecture inference           │
└─────────────────────────────────────┘
```

---

## 4. Module Structure (Proposed)

```
extension/
├── manifest.json
├── background/
│   ├── service-worker.js
│   └── message-handler.js
├── ui/
│   ├── sidepanel.html
│   ├── sidepanel.js
│   ├── sidepanel.css
│   └── components/
│       ├── progress-indicator.js
│       ├── branch-selector.js
│       └── repo-selector.js
├── services/
│   ├── github/
│   │   ├── api-client.js
│   │   ├── graphql-client.js
│   │   ├── rate-limiter.js
│   │   └── auth-manager.js
│   ├── analysis/
│   │   ├── repository-analyzer.js
│   │   ├── code-analyzer.js
│   │   ├── commit-analyzer.js
│   │   ├── branch-comparator.js
│   │   └── module-classifier.js
│   ├── ai/
│   │   └── ai-service.js
│   └── ppt/
│       ├── ppt-generator.js
│       ├── slide-templates.js
│       └── diagram-generator.js
├── utils/
│   ├── dom-utils.js
│   ├── storage-utils.js
│   ├── error-handler.js
│   └── logger.js
├── assets/
│   ├── icons/
│   └── libs/
│       ├── pptxgen.bundle.js
│       ├── chart.min.js
│       └── mermaid.min.js
└── docs/
    ├── README.md
    ├── INSTALLATION.md
    ├── USER_GUIDE.md
    └── TECHNICAL_DOCS.md
```

---

## 5. Functional Requirements

### FR1: Repository Analysis
- **FR1.1**: Extract repository metadata (name, description, stars, forks)
- **FR1.2**: Traverse all branches in the repository
- **FR1.3**: Analyze file structure recursively
- **FR1.4**: Classify files by programming language
- **FR1.5**: Identify project modules and components

### FR2: Code Analysis
- **FR2.1**: Read and parse source code files
- **FR2.2**: Detect programming patterns and frameworks
- **FR2.3**: Identify dependencies and imports
- **FR2.4**: Generate code summaries (AI-powered or heuristic)
- **FR2.5**: Classify code by purpose (UI, API, Utils, etc.)

### FR3: Commit History Analysis
- **FR3.1**: Fetch commits from all branches
- **FR3.2**: Generate development timeline
- **FR3.3**: Analyze commit frequency patterns
- **FR3.4**: Identify top contributors
- **FR3.5**: Detect major milestones

### FR4: Branch Comparison
- **FR4.1**: List all available branches
- **FR4.2**: Compare two selected branches
- **FR4.3**: Highlight differences (files added/modified/deleted)
- **FR4.4**: Summarize changes between branches

### FR5: PPT Generation
- **FR5.1**: Generate title slide with repository info
- **FR5.2**: Create project overview slide
- **FR5.3**: Generate tech stack slide
- **FR5.4**: Create architecture diagram slide
- **FR5.5**: Generate module-wise code explanation slides
- **FR5.6**: Create commit history timeline slide
- **FR5.7**: Generate branch comparison slide
- **FR5.8**: Create network flow diagram slide
- **FR5.9**: Generate functional requirements slide
- **FR5.10**: Create non-functional requirements slide
- **FR5.11**: Generate WBS (Work Breakdown Structure) slide
- **FR5.12**: Create future scope slide

### FR6: User Interface
- **FR6.1**: Display repository information
- **FR6.2**: Provide branch selector dropdown
- **FR6.3**: Show analysis progress indicator
- **FR6.4**: Display analysis results
- **FR6.5**: Provide settings panel for API keys
- **FR6.6**: Support Basic and Advanced analysis modes

### FR7: Authentication
- **FR7.1**: Support GitHub Personal Access Token
- **FR7.2**: Store token securely (browser storage)
- **FR7.3**: Use token for authenticated API requests
- **FR7.4**: Access private repositories (if token has permissions)

---

## 6. Non-Functional Requirements

### NFR1: Performance
- **NFR1.1**: Analysis should complete within 30 seconds for repositories < 1000 files
- **NFR1.2**: UI should remain responsive during analysis
- **NFR1.3**: PPT generation should complete within 10 seconds

### NFR2: Reliability
- **NFR2.1**: Handle API rate limits gracefully
- **NFR2.2**: Retry failed API requests (exponential backoff)
- **NFR2.3**: Provide meaningful error messages
- **NFR2.4**: Handle missing or invalid repository data

### NFR3: Usability
- **NFR3.1**: Intuitive user interface
- **NFR3.2**: Clear progress indicators
- **NFR3.3**: Helpful error messages
- **NFR3.4**: Professional visual design

### NFR4: Security
- **NFR4.1**: Store API keys securely (localStorage)
- **NFR4.2**: Never expose tokens in logs or errors
- **NFR4.3**: Validate user inputs
- **NFR4.4**: Follow GitHub API security best practices

### NFR5: Maintainability
- **NFR5.1**: Modular code structure
- **NFR5.2**: Comprehensive comments
- **NFR5.3**: Follow SOLID principles
- **NFR5.4**: Separation of concerns

### NFR6: Scalability
- **NFR6.1**: Handle repositories of various sizes
- **NFR6.2**: Efficient API usage (batch requests where possible)
- **NFR6.3**: Cache frequently accessed data

---

## 7. Work Breakdown Structure (WBS)

### Level 1: Project Phases

#### 1.1 Architecture & Design
- 1.1.1 System architecture design
- 1.1.2 Database/storage design
- 1.1.3 API integration design
- 1.1.4 UI/UX design

#### 1.2 Core Development
- 1.2.1 GitHub API integration
- 1.2.2 Repository analysis engine
- 1.2.3 Code analysis engine
- 1.2.4 Commit history analyzer
- 1.2.5 Branch comparison engine

#### 1.3 PPT Generation
- 1.3.1 PPT template design
- 1.3.2 Slide generation logic
- 1.3.3 Diagram generation
- 1.3.4 Content formatting

#### 1.4 User Interface
- 1.4.1 Side panel UI development
- 1.4.2 Progress indicators
- 1.4.3 Branch/repo selectors
- 1.4.4 Results display

#### 1.5 Testing & Quality Assurance
- 1.5.1 Unit testing
- 1.5.2 Integration testing
- 1.5.3 User acceptance testing
- 1.5.4 Performance testing

#### 1.6 Documentation
- 1.6.1 Technical documentation
- 1.6.2 User guide
- 1.6.3 Installation guide
- 1.6.4 API documentation

---

## 8. Technology Stack

### Frontend
- **HTML5/CSS3**: UI structure and styling
- **Vanilla JavaScript**: Core logic (no framework dependencies)
- **Chrome Extension APIs**: Extension functionality

### Libraries
- **PptxGenJS**: PowerPoint generation
- **Chart.js**: Data visualization
- **Mermaid.js**: Diagram generation

### APIs
- **GitHub REST API**: Repository data
- **GitHub GraphQL API**: Efficient queries
- **OpenAI API**: AI-powered analysis (optional)

### Storage
- **Chrome Storage API**: Local data persistence
- **localStorage**: API keys and settings

---

## 9. Design Patterns & Principles

### SOLID Principles
- **Single Responsibility**: Each service handles one concern
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Service interfaces are interchangeable
- **Interface Segregation**: Focused service interfaces
- **Dependency Inversion**: Depend on abstractions

### Design Patterns
- **Service Layer Pattern**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Service creation
- **Observer Pattern**: Event handling
- **Strategy Pattern**: Different analysis modes

---

## 10. Error Handling Strategy

### Error Categories
1. **API Errors**: Rate limits, network failures, invalid responses
2. **Data Errors**: Missing files, invalid formats, parsing errors
3. **User Errors**: Invalid inputs, missing permissions
4. **System Errors**: Storage failures, extension errors

### Handling Approach
- **Graceful Degradation**: Fallback to heuristics if AI fails
- **User Feedback**: Clear error messages
- **Retry Logic**: Exponential backoff for transient errors
- **Logging**: Comprehensive error logging for debugging

---

## 11. Security Considerations

1. **API Key Storage**: Secure local storage, never exposed
2. **Input Validation**: Sanitize all user inputs
3. **XSS Prevention**: Careful HTML rendering
4. **CORS Handling**: Proper API request headers
5. **Token Security**: Never log or expose tokens

---

## 12. Future Enhancements

1. **Multi-Repository Comparison**: Compare multiple repos
2. **Export Formats**: PDF, Markdown, HTML
3. **Custom Templates**: User-defined PPT templates
4. **Collaboration Features**: Share analysis results
5. **Advanced Visualizations**: Interactive charts and graphs
6. **CI/CD Integration**: Analyze CI/CD pipelines
7. **Dependency Analysis**: Deep dependency graph visualization

---

## 13. Success Metrics

1. **Accuracy**: Correctly identifies project structure and architecture
2. **Completeness**: Analyzes all branches and commits
3. **Performance**: Completes analysis within acceptable time
4. **User Satisfaction**: Intuitive and useful interface
5. **PPT Quality**: Professional, informative presentations

---

This system design provides a comprehensive blueprint for building GitNarrator as a production-quality, scalable browser extension suitable for academic evaluation and real-world use.
