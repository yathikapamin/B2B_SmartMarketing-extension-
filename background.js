// Background service worker for Manifest V3

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Company Contact Scraper extension installed');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendEmail') {
    // Future: Handle email sending via API
    console.log('Email sending requested:', request.data);
    sendResponse({ success: true });
  }
  return true;
});

// Optional: Add context menu for quick scraping
chrome.contextMenus.create({
  id: 'scrapeContacts',
  title: 'Scrape Contact Info',
  contexts: ['page']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scrapeContacts') {
    chrome.action.openPopup();
  }
});
