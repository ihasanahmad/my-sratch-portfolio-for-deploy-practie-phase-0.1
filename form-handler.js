// Form Handler - Simple validation and user feedback
// FormSubmit handles the actual email sending via form action
// Includes fallback for local file testing

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit');
    const formNext = document.getElementById('form-next');
    
    if (!form) return;
    
    // Check if running from file:// protocol (local file)
    const isLocalFile = window.location.protocol === 'file:';
    
    // Set redirect URL to current page (only if not local file)
    if (formNext && !isLocalFile) {
        formNext.value = window.location.href;
    }
    
    // Handle local file - change form action to prevent FormSubmit error page
    if (isLocalFile) {
        // Change form action to prevent FormSubmit error page
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
            }, 5000);
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
        
        // If running from local file, use mailto fallback
        if (isLocalFile) {
            // Show sending message
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.value = 'Opening Email...';
            }
            showMessage('Opening your email client...', 'sending');
            
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
            
            // Create mailto link
            const mailtoLink = `mailto:ihaxanahmad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Show success message
                setTimeout(() => {
                    showMessage('✓ Email client opened! Please send the email to complete your message.', 'success');
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.value = 'Submit Message';
                    }
                }, 500);
            }, 300);
            
            return false;
        }
        
        // If running from web server, submit to FormSubmit
        // Show sending message
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Sending...';
        }
        showMessage('Sending your message...', 'sending');
        
        // Create form data and submit to FormSubmit
        const formData = new FormData(form);
        
        // Submit to FormSubmit
        fetch('https://formsubmit.co/ajax/ihaxanahmad@gmail.com', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('✓ Message sent successfully! I will get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            console.error('FormSubmit error:', error);
            showMessage('Error sending message. Please try again or email directly.', 'error');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.value = 'Submit Message';
            }
        });
    });
    
    // Reset button handler
    const resetBtn = document.getElementById('reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (formMessage) {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }
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
