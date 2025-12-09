# EmailJS Setup Guide

## Quick Setup for Form Email Functionality

The contact form is currently configured to use a **mailto fallback** that works immediately - it opens the user's email client with pre-filled information.

### Option 1: Use Current Mailto Method (Works Immediately)
✅ **No setup required!** The form already works using the mailto method. When users submit, their email client opens with all form details pre-filled.

### Option 2: Set Up EmailJS for Automatic Email Sending (Recommended)

To enable automatic email sending without opening the email client:

1. **Sign up at EmailJS**
   - Go to https://www.emailjs.com/
   - Create a free account (100 emails/month free)

2. **Add Email Service**
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose "Gmail" (or your preferred email provider)
   - Connect your Gmail account (ihaxanahmad@gmail.com)
   - Copy your **Service ID** (e.g., `service_xxxxx`)

3. **Create Email Template**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template:
   
   ```
   To: ihaxanahmad@gmail.com
   From: {{from_name}} <{{from_email}}>
   Reply-To: {{reply_to}}
   Subject: Portfolio Contact: {{first_name}} {{last_name}}
   
   Hello Hassan,
   
   You have received a new message from your portfolio contact form:
   
   First Name: {{first_name}}
   Last Name: {{last_name}}
   Email: {{email}}
   Project Deadline: {{project_deadline}}
   
   ---
   This message was sent automatically from your portfolio website.
   ```
   
   - Copy your **Template ID** (e.g., `template_xxxxx`)

4. **Get Public Key**
   - Go to "Account" → "General"
   - Copy your **Public Key** (e.g., `xxxxxxxxxxxxx`)

5. **Update form-handler.js**
   - Open `form-handler.js`
   - Find the section that says `window.EMAILJS_CONFIGURED`
   - Replace with your actual values:
   
   ```javascript
   // Add this before the form handler code:
   window.EMAILJS_CONFIGURED = true;
   window.EMAILJS_SERVICE_ID = 'your_service_id_here';
   window.EMAILJS_TEMPLATE_ID = 'your_template_id_here';
   
   // Initialize EmailJS
   emailjs.init('your_public_key_here');
   ```

6. **Test the Form**
   - Submit a test message
   - Check your email inbox (ihaxanahmad@gmail.com)

### Alternative: Use Formspree (Even Easier)

1. Go to https://formspree.io/
2. Sign up for free account
3. Create a new form
4. Set recipient email to: `ihaxanahmad@gmail.com`
5. Copy your form endpoint
6. Update `form-handler.js` to use Formspree endpoint

### Current Status

✅ **Form is functional** - Uses mailto method (opens email client)
🔄 **EmailJS setup** - Optional, for automatic sending
🔄 **Formspree setup** - Alternative option

The form will work immediately with the mailto method. EmailJS setup is optional for a smoother user experience.

