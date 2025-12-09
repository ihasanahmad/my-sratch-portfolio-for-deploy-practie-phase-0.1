// Form Handler - Robust form submission with proper error handling
// FormSubmit handles the actual email sending via form action
// Includes fallback for local file testing

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit');
    const formNext = document.getElementById('form-next');
    
    if (!form || !submitBtn) {
        console.error('Form or submit button not found');
        return;
    }
    
    // Check if running from file:// protocol (local file)
    const isLocalFile = window.location.protocol === 'file:';
    
    // Set redirect URL to current page (only if not local file)
    if (formNext && !isLocalFile) {
        formNext.value = window.location.href;
    }
    
    // Handle local file - change form action to prevent FormSubmit error page
    if (isLocalFile) {
        form.action = 'javascript:void(0);';
        form.method = 'POST';
    }
    
    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message ${type} show`;
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 300);
            }, 8000);
        }
    }
    
    // Function to reset button state - ALWAYS call this
    function resetButton() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = 'Submit Message';
        }
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        // Always prevent default to handle submission ourselves
        e.preventDefault();
        
        const firstName = document.getElementById('fname').value.trim();
        const lastName = document.getElementById('lname').value.trim();
        const email = document.getElementById('email').value.trim();
        const deadline = document.getElementById('date').value;
        const terms = document.getElementById('terms').checked;
        
        // Validation
        if (!firstName || !lastName || !email) {
            showMessage('Please fill in all required fields', 'error');
            return false;
        }
        
        if (!terms) {
            showMessage('Please agree to the terms', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        // Disable button immediately
        submitBtn.disabled = true;
        submitBtn.value = 'Preparing...';
        
        // If running from local file, copy email content to clipboard
        if (isLocalFile) {
            showMessage('Preparing your message...', 'sending');
            
            // Prepare email content
            const subject = `Portfolio Contact: ${firstName} ${lastName}`;
            const emailBody = `Hello Hassan,

You have received a new message from your portfolio contact form:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Project Deadline: ${deadline || 'Not specified'}
Terms Agreed: Yes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This message was sent from your portfolio website.
Please reply directly to: ${email}

Best regards,
Portfolio Contact Form`;

            // Create full email text
            const fullEmailText = `To: ihaxanahmad@gmail.com
Subject: ${subject}

${emailBody}`;
            
            // Copy to clipboard with timeout safety
            copyToClipboard(fullEmailText, subject, emailBody);
            
            // Safety timeout - always reset button after 3 seconds
            setTimeout(() => {
                resetButton();
            }, 3000);
            
            return false;
        }
        
        // If running from web server, use standard form submission (more reliable)
        // FormSubmit will handle the submission and redirect
        // Just show a message and let the form submit naturally
        showMessage('Sending your message...', 'sending');
        submitBtn.value = 'Sending...';
        
        // Allow the form to submit naturally to FormSubmit
        // Remove preventDefault to let browser handle it
        // But first, ensure form action is set correctly
        if (form.action !== 'https://formsubmit.co/ihaxanahmad@gmail.com') {
            form.action = 'https://formsubmit.co/ihaxanahmad@gmail.com';
        }
        
        // Set redirect back to current page
        if (formNext) {
            formNext.value = window.location.href + '?success=true';
        }
        
        // Submit the form naturally (browser will handle it)
        // This is more reliable than AJAX
        form.submit();
    });
    
    // Function to copy email content to clipboard
    function copyToClipboard(emailText, subject, emailBody) {
        let copySuccess = false;
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(emailText)
                .then(() => {
                    copySuccess = true;
                    showMessage('✓ Message copied to clipboard! Please paste it in an email to ihaxanahmad@gmail.com', 'success');
                    form.reset();
                    resetButton();
                })
                .catch((err) => {
                    console.error('Clipboard API error:', err);
                    // Fallback to old method
                    fallbackCopy(emailText, subject, emailBody);
                });
        } else {
            // Fallback to old method immediately
            fallbackCopy(emailText, subject, emailBody);
        }
    }
    
    // Fallback copy method
    function fallbackCopy(emailText, subject, emailBody) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = emailText;
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                showMessage('✓ Message copied to clipboard! Please paste it in an email to ihaxanahmad@gmail.com', 'success');
            } else {
                showMessage(`✓ Please email this to ihaxanahmad@gmail.com:\n\nSubject: ${subject}\n\n${emailBody.substring(0, 200)}...`, 'success');
            }
        } catch (err) {
            console.error('Copy error:', err);
            showMessage(`✓ Please email this to ihaxanahmad@gmail.com:\n\nSubject: ${subject}\n\n${emailBody.substring(0, 200)}...`, 'success');
        }
        
        // Always reset form and button
        form.reset();
        resetButton();
    }
    
    // Reset button handler
    const resetBtn = document.getElementById('reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (formMessage) {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }
                resetButton();
            }, 100);
        });
    }
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = 'rgba(244, 67, 54, 0.5)';
            } else {
                this.style.borderColor = 'rgba(100, 200, 255, 0.2)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = 'rgba(100, 200, 255, 0.5)';
            }
        });
    });
});
