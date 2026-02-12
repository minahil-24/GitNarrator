/**
 * Background Service Worker
 * 
 * Manages extension lifecycle, message handling, storage, and side panel behavior
 * Design Pattern: Service Worker
 * Responsibility: Extension background operations
 */

// ----------------------
// Logger Utility
// ----------------------
const Logger = {
    info: (...args) => console.log('[GitNarrator INFO]:', ...args),
    warn: (...args) => console.warn('[GitNarrator WARN]:', ...args),
    error: (...args) => console.error('[GitNarrator ERROR]:', ...args)
};

// Import utilities that depend on Logger
try {
    importScripts('../utils/storage-utils.js');
} catch (e) {
    console.error('Failed to import storage-utils.js:', e);
}

// ----------------------
// Extension Install Event
// ----------------------
chrome.runtime.onInstalled.addListener(() => {
    Logger.info('GitNarrator extension installed');
});

// ----------------------
// Tabs Update Event (Enable/Disable Side Panel)
// ----------------------
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;

    try {
        const url = new URL(tab.url);

        if (url.origin === 'https://github.com' && url.pathname.split('/').length >= 3) {
            // Enable side panel for GitHub repository pages
            await chrome.sidePanel.setOptions({
                tabId,
                path: 'ui/sidepanel.html',
                enabled: true
            });
            Logger.info(`Side panel enabled for ${tab.url}`);
        } else {
            // Disable side panel for other pages
            await chrome.sidePanel.setOptions({
                tabId,
                enabled: false
            });
            Logger.info(`Side panel disabled for ${tab.url}`);
        }
    } catch (error) {
        Logger.error('Error setting side panel', error);
    }
});

// ----------------------
// Message Handling from Content Scripts / UI
// ----------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        try {
            switch (message.action) {
                case 'getRepoInfo':
                    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                    const activeTab = tabs[0];

                    if (activeTab && activeTab.url) {
                        const url = new URL(activeTab.url);

                        if (url.origin === 'https://github.com') {
                            const parts = url.pathname.split('/').filter(p => p);

                            if (parts.length >= 2) {
                                sendResponse({
                                    owner: parts[0],
                                    repo: parts[1],
                                    branch: parts[2] || null
                                });
                                Logger.info('Repo info sent:', parts.join('/'));
                                return;
                            }
                        }
                    }

                    sendResponse({ error: 'Not a GitHub repository page' });
                    Logger.warn('getRepoInfo failed: Not a GitHub repo page');
                    break;

                case 'saveSettings':
                    if (message.settings) {
                        await StorageUtils.set('settings', message.settings);
                        sendResponse({ success: true });
                        Logger.info('Settings saved:', message.settings);
                    } else {
                        sendResponse({ error: 'No settings provided' });
                        Logger.warn('saveSettings called without settings');
                    }
                    break;

                case 'getSettings':
                    const settings = await StorageUtils.get('settings');
                    sendResponse({ settings: settings || {} });
                    Logger.info('Settings retrieved:', settings);
                    break;

                default:
                    sendResponse({ error: 'Unknown action' });
                    Logger.warn('Unknown message action:', message.action);
            }
        } catch (error) {
            Logger.error('Message handler error', error);
            sendResponse({ error: error.message });
        }
    })();

    return true; // Keep message channel open for async response
});

// ----------------------
// Side Panel Behavior
// ----------------------
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => Logger.info('Side panel behavior set'))
    .catch(error => Logger.error('Error setting side panel behavior', error));
