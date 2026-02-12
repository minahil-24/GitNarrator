# GitNarrator - Installation Guide

This guide will walk you through installing GitNarrator in your Chrome/Edge browser.

## Prerequisites

- **Browser**: Google Chrome or Microsoft Edge (Chromium-based) version 88 or higher
- **Internet Connection**: Required for GitHub API access
- **GitHub Account**: Not required (works with public repositories)

## Installation Steps

### Method 1: Load Unpacked Extension (Development)

1. **Download the Extension**
   - Download or clone the GitNarrator extension folder
   - Ensure all files are present in the `extension` directory

2. **Open Chrome/Edge Extensions Page**
   - Open Chrome/Edge browser
   - Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Or go to Menu → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `extension` folder
   - The extension should now appear in your extensions list

5. **Verify Installation**
   - You should see "GitNarrator - Intelligent GitHub Repository Analyzer" in your extensions
   - The extension icon should appear in your browser toolbar

### Method 2: Package Extension (For Distribution)

1. **Package the Extension**
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Pack extension"
   - Select the `extension` folder
   - Click "Pack Extension"
   - A `.crx` file will be created

2. **Install the Packaged Extension**
   - Drag and drop the `.crx` file onto the extensions page
   - Confirm installation

## Post-Installation Setup

### 1. Pin the Extension (Optional)

- Click the puzzle icon (extensions menu) in your toolbar
- Find GitNarrator
- Click the pin icon to keep it visible

### 2. Configure Settings (Optional)

1. **Open GitNarrator**
   - Navigate to any GitHub repository
   - Click the GitNarrator icon in your toolbar
   - The side panel will open

2. **Add OpenAI API Key (Optional)**
   - Click the "⚙️ Settings" section
   - Enter your OpenAI API key (if you want AI-powered analysis)
   - Click "Save Key"
   - **Note**: This is optional. The extension works without it using heuristic analysis.

### 3. Test the Extension

1. **Navigate to a GitHub Repository**
   - Go to any public GitHub repository (e.g., `https://github.com/octocat/Hello-World`)

2. **Open GitNarrator**
   - Click the extension icon
   - You should see the repository name in the side panel

3. **Run Analysis**
   - Click "Analyze Repository"
   - Wait for the analysis to complete
   - Review the results

## Troubleshooting

### Extension Not Appearing

- **Check Developer Mode**: Ensure Developer Mode is enabled
- **Check Console**: Open DevTools (F12) and check for errors
- **Reload Extension**: Click the reload icon on the extensions page

### Side Panel Not Opening

- **Check Permissions**: Ensure the extension has necessary permissions
- **Check URL**: Make sure you're on a GitHub repository page
- **Reload Page**: Refresh the GitHub page

### API Rate Limit Errors

- **Wait**: GitHub allows 60 requests/hour for unauthenticated users
- **Wait Period**: The extension will automatically wait if rate limited
- **Try Later**: Wait a few minutes and try again

### PowerPoint Not Generating

- **Check Analysis**: Ensure repository analysis completed successfully
- **Check Console**: Open DevTools and check for errors
- **Check Library**: Ensure `pptxgen.bundle.js` is in `assets/libs/`

### Missing Libraries

If you see errors about missing libraries:

1. **Download Required Libraries**
   - PptxGenJS: Download from [PptxGenJS GitHub](https://github.com/gitbrent/PptxGenJS)
   - Chart.js: Download from [Chart.js CDN](https://cdn.jsdelivr.net/npm/chart.js)
   - Mermaid.js: Download from [Mermaid.js CDN](https://cdn.jsdelivr.net/npm/mermaid)

2. **Place in Correct Location**
   - Put files in `extension/assets/libs/`
   - Ensure file names match:
     - `pptxgen.bundle.js`
     - `chart.min.js`
     - `mermaid.min.js`

## Uninstallation

1. **Remove Extension**
   - Go to `chrome://extensions/`
   - Find GitNarrator
   - Click "Remove"
   - Confirm removal

2. **Clear Data (Optional)**
   - The extension stores minimal data locally
   - Data is automatically cleared when extension is removed

## Updating the Extension

1. **Download Latest Version**
   - Get the latest code/files

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Find GitNarrator
   - Click the reload icon (circular arrow)

## System Requirements

### Minimum Requirements
- Chrome/Edge 88+
- 100MB free disk space
- Internet connection

### Recommended
- Chrome/Edge 100+
- 500MB free disk space
- Stable internet connection
- OpenAI API key (for enhanced analysis)

## Security Notes

- **No Authentication Required**: Works with public repositories only
- **Local Storage**: API keys stored locally in browser
- **No External Servers**: All processing happens in your browser (except GitHub API and optional OpenAI)
- **Open Source**: Code is available for review

## Support

If you encounter issues:

1. Check the [User Guide](USER_GUIDE.md) for usage instructions
2. Review the [Technical Documentation](TECHNICAL_DOCS.md) for technical details
3. Check browser console for error messages
4. Ensure all files are in correct locations

---

**Installation complete!** You're ready to start using GitNarrator. See the [User Guide](USER_GUIDE.md) for how to use the extension.
