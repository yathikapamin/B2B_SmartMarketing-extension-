// DOM Elements
const loadingDiv = document.getElementById('loading');
const contactsSection = document.getElementById('contacts-section');
const noContactsDiv = document.getElementById('no-contacts');
const emailForm = document.getElementById('email-form');
const whatsappForm = document.getElementById('whatsapp-form');
const linkedinForm = document.getElementById('linkedin-form');

const emailsList = document.getElementById('emails-list');
const linkedinList = document.getElementById('linkedin-list');
const whatsappList = document.getElementById('whatsapp-list');

const sendEmailBtn = document.getElementById('send-email-btn');
const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
const sendLinkedInBtn = document.getElementById('send-linkedin-btn');

const sendBtn = document.getElementById('send-btn');
const cancelBtn = document.getElementById('cancel-btn');

const sendWhatsApp = document.getElementById('send-whatsapp');
const cancelWhatsApp = document.getElementById('cancel-whatsapp');
const whatsappContact = document.getElementById('whatsapp-contact');
const whatsappMessage = document.getElementById('whatsapp-message');
const whatsappStatus = document.getElementById('whatsapp-status');

const sendLinkedIn = document.getElementById('send-linkedin');
const cancelLinkedIn = document.getElementById('cancel-linkedin');
const linkedinProfile = document.getElementById('linkedin-profile');
const linkedinMessage = document.getElementById('linkedin-message');
const linkedinStatus = document.getElementById('linkedin-status');

const senderNameInput = document.getElementById('sender-name');
const senderEmailInput = document.getElementById('sender-email');
const recipientEmailSelect = document.getElementById('recipient-email');
const messageTextArea = document.getElementById('message-text');
const emailStatus = document.getElementById('email-status');
const pdfUpload = document.getElementById('pdf-upload');
const fileNameSpan = document.getElementById('file-name');
const clearFileBtn = document.getElementById('clear-file');
const fileLabel = document.querySelector('.file-label');

let scrapedData = null;
let selectedPdfFile = null;

// Backend API URL
const API_URL = 'http://localhost:3000';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved user info and messages
  const savedData = await chrome.storage.local.get([
    'senderName', 
    'senderEmail', 
    'whatsappMessage',
    'linkedinMessage'
  ]);
  if (savedData.senderName) senderNameInput.value = savedData.senderName;
  if (savedData.senderEmail) senderEmailInput.value = savedData.senderEmail;
  if (savedData.whatsappMessage) whatsappMessage.value = savedData.whatsappMessage;
  if (savedData.linkedinMessage) linkedinMessage.value = savedData.linkedinMessage;

  // Get current tab and scrape data
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Inject content script and scrape
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapeContactInfo
    });

    scrapedData = results[0].result;
    displayContacts(scrapedData);
  } catch (error) {
    console.error('Error scraping:', error);
    showNoContacts();
  }
});

// Scraping function (injected into page)
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

// Display scraped contacts
function displayContacts(data) {
  loadingDiv.classList.add('hidden');

  const hasContacts = data.emails.length > 0 || data.linkedin.length > 0 || data.whatsapp.length > 0;

  if (!hasContacts) {
    showNoContacts();
    return;
  }

  contactsSection.classList.remove('hidden');

  // Display emails
  if (data.emails.length > 0) {
    emailsList.innerHTML = data.emails.map(email => `
      <div class="contact-item">
        <span>${email}</span>
        <button class="copy-btn" data-copy="${email}">Copy</button>
      </div>
    `).join('');
  } else {
    emailsList.innerHTML = '<div class="empty-state">No emails found</div>';
  }

  // Display LinkedIn
  if (data.linkedin.length > 0) {
    linkedinList.innerHTML = data.linkedin.map(url => `
      <div class="contact-item">
        <a href="${url}" target="_blank">${url}</a>
        <button class="copy-btn" data-copy="${url}">Copy</button>
      </div>
    `).join('');
  } else {
    linkedinList.innerHTML = '<div class="empty-state">No LinkedIn profiles found</div>';
  }

  // Display WhatsApp
  if (data.whatsapp.length > 0) {
    whatsappList.innerHTML = data.whatsapp.map(url => {
      // Extract and display phone number
      let displayNumber = url;
      if (url.includes('wa.me/')) {
        displayNumber = url.split('wa.me/')[1].split('?')[0];
      } else if (url.includes('api.whatsapp.com')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        displayNumber = urlParams.get('phone') || displayNumber;
      }
      
      return `
        <div class="contact-item">
          <span>${displayNumber}</span>
          <button class="copy-btn" data-copy="${displayNumber}">Copy</button>
        </div>
      `;
    }).join('');
  } else {
    whatsappList.innerHTML = '<div class="empty-state">No WhatsApp contacts found</div>';
  }

  // Add copy functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text);
      btn.textContent = '✓';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  });

  // Populate recipient dropdown
  if (data.emails.length > 0) {
    recipientEmailSelect.innerHTML = '<option value="">Select email...</option>' +
      data.emails.map(email => `<option value="${email}">${email}</option>`).join('');
  }

  // Populate WhatsApp dropdown
  if (data.whatsapp.length > 0) {
    whatsappContact.innerHTML = '<option value="">Select WhatsApp contact...</option>' +
      data.whatsapp.map(url => {
        // Extract phone number for display
        let displayNumber = url;
        if (url.includes('wa.me/')) {
          displayNumber = url.split('wa.me/')[1].split('?')[0];
        } else if (url.includes('api.whatsapp.com')) {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          displayNumber = urlParams.get('phone') || displayNumber;
        }
        return `<option value="${url}">${displayNumber}</option>`;
      }).join('');
  }

  // Populate LinkedIn dropdown
  if (data.linkedin.length > 0) {
    linkedinProfile.innerHTML = '<option value="">Select LinkedIn profile...</option>' +
      data.linkedin.map(url => `<option value="${url}">${url}</option>`).join('');
  }
}

function showNoContacts() {
  loadingDiv.classList.add('hidden');
  noContactsDiv.classList.remove('hidden');
}

// Show email form
sendEmailBtn.addEventListener('click', () => {
  contactsSection.classList.add('hidden');
  emailForm.classList.remove('hidden');
});

// Cancel email form
cancelBtn.addEventListener('click', () => {
  emailForm.classList.add('hidden');
  contactsSection.classList.remove('hidden');
  emailStatus.classList.add('hidden');
});

// File upload handlers
pdfUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showStatus('PDF file must be less than 10MB', 'error');
      pdfUpload.value = '';
      return;
    }
    
    selectedPdfFile = file;
    fileNameSpan.textContent = file.name;
    fileLabel.classList.add('has-file');
    clearFileBtn.classList.remove('hidden');
  }
});

clearFileBtn.addEventListener('click', (e) => {
  e.preventDefault();
  selectedPdfFile = null;
  pdfUpload.value = '';
  fileNameSpan.textContent = 'Choose PDF file...';
  fileLabel.classList.remove('has-file');
  clearFileBtn.classList.add('hidden');
});

// Send email via backend API
sendBtn.addEventListener('click', async () => {
  const senderName = senderNameInput.value.trim();
  const senderEmail = senderEmailInput.value.trim();
  const recipientEmail = recipientEmailSelect.value;
  const message = messageTextArea.value.trim();

  // Validation
  if (!senderName || !senderEmail || !recipientEmail || !message) {
    showStatus('Please fill in all fields', 'error');
    return;
  }

  // Save user info
  await chrome.storage.local.set({ senderName, senderEmail });

  // Disable send button and show loading
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  showStatus('Sending email...', 'success');

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('senderName', senderName);
    formData.append('senderEmail', senderEmail);
    formData.append('recipientEmail', recipientEmail);
    formData.append('message', message);
    formData.append('subject', `Collaboration Opportunity from ${senderName}`);
    
    // Attach PDF if selected
    if (selectedPdfFile) {
      formData.append('pdf', selectedPdfFile);
    }

    // Send to backend
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      showStatus('Email sent successfully!', 'success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        emailForm.classList.add('hidden');
        contactsSection.classList.remove('hidden');
        messageTextArea.value = '';
        selectedPdfFile = null;
        pdfUpload.value = '';
        fileNameSpan.textContent = 'Choose PDF file...';
        fileLabel.classList.remove('has-file');
        clearFileBtn.classList.add('hidden');
        emailStatus.classList.add('hidden');
      }, 2000);
    } else {
      showStatus(`Error: ${result.error}`, 'error');
    }

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Check if backend is running
    if (error.message.includes('Failed to fetch')) {
      showStatus('Backend server not running. Please start the server first.', 'error');
    } else {
      showStatus(`Error: ${error.message}`, 'error');
    }
  } finally {
    // Re-enable send button
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Email';
  }
});

function showStatus(message, type) {
  emailStatus.textContent = message;
  emailStatus.className = `status-message ${type}`;
  emailStatus.classList.remove('hidden');
}

// Show WhatsApp form
sendWhatsAppBtn.addEventListener('click', () => {
  if (scrapedData && scrapedData.whatsapp.length === 0) {
    alert('No WhatsApp contacts found on this page.');
    return;
  }
  contactsSection.classList.add('hidden');
  whatsappForm.classList.remove('hidden');
});

// Cancel WhatsApp form
cancelWhatsApp.addEventListener('click', () => {
  whatsappForm.classList.add('hidden');
  contactsSection.classList.remove('hidden');
  whatsappStatus.classList.add('hidden');
});

// Send WhatsApp message
sendWhatsApp.addEventListener('click', async () => {
  const contact = whatsappContact.value;
  const message = whatsappMessage.value.trim();

  if (!contact) {
    showWhatsAppStatus('Please select a contact', 'error');
    return;
  }

  // Save message for next time (optional)
  if (message) {
    await chrome.storage.local.set({ whatsappMessage: message });
  }

  // Extract phone number from wa.me URL or use as-is
  let phoneNumber = contact;
  
  // If it's a wa.me link, extract the phone number
  if (contact.includes('wa.me/')) {
    phoneNumber = contact.split('wa.me/')[1].split('?')[0];
  } else if (contact.includes('api.whatsapp.com')) {
    const urlParams = new URLSearchParams(contact.split('?')[1]);
    phoneNumber = urlParams.get('phone') || phoneNumber;
  }
  
  // Remove any non-numeric characters except +
  phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  // Validate phone number format
  if (!phoneNumber.startsWith('+')) {
    showWhatsAppStatus('Phone number should start with + and country code (e.g., +919876543210)', 'error');
    return;
  }
  
  // Check minimum length (country code + number)
  if (phoneNumber.length < 10) {
    showWhatsAppStatus('Phone number seems too short. Include country code (e.g., +919876543210)', 'error');
    return;
  }
  
  // Open WhatsApp with pre-filled message
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  console.log('Opening WhatsApp with:', phoneNumber);
  
  chrome.tabs.create({ url: whatsappUrl });
  
  showWhatsAppStatus('Opening WhatsApp chat with your message...', 'success');
  
  // Close popup after opening WhatsApp
  setTimeout(() => {
    window.close();
  }, 1500);
});

function showWhatsAppStatus(message, type) {
  whatsappStatus.textContent = message;
  whatsappStatus.className = `status-message ${type}`;
  whatsappStatus.classList.remove('hidden');
}

// Show LinkedIn form
sendLinkedInBtn.addEventListener('click', () => {
  if (scrapedData && scrapedData.linkedin.length === 0) {
    alert('No LinkedIn profiles found on this page.');
    return;
  }
  contactsSection.classList.add('hidden');
  linkedinForm.classList.remove('hidden');
});

// Cancel LinkedIn form
cancelLinkedIn.addEventListener('click', () => {
  linkedinForm.classList.add('hidden');
  contactsSection.classList.remove('hidden');
  linkedinStatus.classList.add('hidden');
});

// Send LinkedIn message
sendLinkedIn.addEventListener('click', async () => {
  const profile = linkedinProfile.value;
  const message = linkedinMessage.value.trim();

  if (!profile) {
    showLinkedInStatus('Please select a profile', 'error');
    return;
  }

  // Save message for next time (optional)
  if (message) {
    await chrome.storage.local.set({ linkedinMessage: message });
  }

  // Copy message to clipboard for manual pasting in LinkedIn
  if (message) {
    try {
      await navigator.clipboard.writeText(message);
      showLinkedInStatus('Message copied to clipboard! Opening profile...', 'success');
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  } else {
    showLinkedInStatus('Opening LinkedIn profile...', 'success');
  }

  // Open LinkedIn profile directly
  chrome.tabs.create({ url: profile });
  
  setTimeout(() => {
    window.close();
  }, 1500);
});

function showLinkedInStatus(message, type) {
  linkedinStatus.textContent = message;
  linkedinStatus.className = `status-message ${type}`;
  linkedinStatus.classList.remove('hidden');
}
