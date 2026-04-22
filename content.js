// Content script - runs on all pages
// This file is loaded automatically by manifest.json

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeContacts') {
    const contacts = scrapeContactInfo();
    sendResponse(contacts);
  }
});

// Scraping function
function scrapeContactInfo() {
  const data = {
    emails: new Set(),
    linkedin: new Set(),
    whatsapp: new Set()
  };

  // Get all text content and links
  const bodyText = document.body.innerText;
  const links = document.querySelectorAll('a');

  // Email patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = bodyText.match(emailRegex);
  if (emailMatches) {
    emailMatches.forEach(email => data.emails.add(email.toLowerCase()));
  }

  // Scrape from links
  links.forEach(link => {
    const href = link.href.toLowerCase();
    
    // Mailto links
    if (href.startsWith('mailto:')) {
      const email = href.replace('mailto:', '').split('?')[0];
      data.emails.add(email);
    }
    
    // LinkedIn profiles
    if (href.includes('linkedin.com/in/') || href.includes('linkedin.com/company/')) {
      data.linkedin.add(link.href);
    }
    
    // WhatsApp links
    if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
      data.whatsapp.add(link.href);
    }
  });

  // Phone number patterns for WhatsApp
  const phoneRegex = /(\+91[\s-]?[6-9]\d{9}|\+1[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4})/g;
  const phoneMatches = bodyText.match(phoneRegex);
  if (phoneMatches) {
    phoneMatches.forEach(phone => {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      data.whatsapp.add(`https://wa.me/${cleanPhone}`);
    });
  }

  return {
    emails: Array.from(data.emails),
    linkedin: Array.from(data.linkedin),
    whatsapp: Array.from(data.whatsapp)
  };
}

console.log('Company Contact Scraper: Content script loaded');
