// Enhanced Portfolio JavaScript with Slow Animations

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Very Slow Counter Animation (6 seconds) =====
    function animateCounter(element, target, duration = 6000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // ===== Expandable Stats =====
    const statExpandables = document.querySelectorAll('.stat-expandable');
    
    statExpandables.forEach((stat, index) => {
        const header = stat.querySelector('.stat-header');
        
        // Staggered reveal on page load
        setTimeout(() => {
            stat.classList.add('visible');
        }, index * 200);
        
        // Click to expand
        if (header) {
            header.addEventListener('click', function() {
                stat.classList.toggle('expanded');
                
                // Trigger counter animation when expanded
                if (stat.classList.contains('expanded')) {
                    const number = stat.querySelector('.stat-number');
                    if (number && number.dataset.target) {
                        const target = parseInt(number.dataset.target);
                        number.textContent = '0';
                        setTimeout(() => animateCounter(number, target, 6000), 300);
                    }
                }
            });
        }
    });
    
    // ===== Auto-count stats on page load =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach((number, index) => {
        const target = parseInt(number.dataset.target);
        setTimeout(() => {
            animateCounter(number, target, 6000);
        }, 1000 + (index * 500));
    });
    
    // ===== Typing Effect (4 seconds) =====
    function typeText(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    const typeElement = document.querySelector('.type-effect');
    if (typeElement) {
        const text = typeElement.textContent;
        setTimeout(() => typeText(typeElement, text, 60), 800);
    }
    
    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== Intersection Observer for Animations =====
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.cert-item, .writeup-preview').forEach(el => {
        observer.observe(el);
    });
    
    // ===== Active Nav Link =====
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        
        if (currentPath === href || 
            (href.includes('thm') && currentPath.includes('thm')) ||
            (href.includes('htb') && currentPath.includes('htb')) ||
            (currentPath === '/' + window.location.pathname.split('/')[1] + '/' && href === '/')) {
            link.classList.add('active');
        }
    });
    
    // ===== Glow Effect on Buttons =====
    const buttons = document.querySelectorAll('.cta-button, .contact-link');
    buttons.forEach(button => {
        button.classList.add('glow-effect');
    });
    
});

// ===== Helper: Format Date Properly =====
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}
