// Enhanced Portfolio JavaScript - Fixed Counter Reset Issue

document.addEventListener('DOMContentLoaded', function() {
    
    // Track if counters have already animated (PREVENT RESET)
    const animatedCounters = new Set();
    
    // ===== Very Slow Counter Animation (5 seconds) =====
    function animateCounter(element, target, duration = 5000) {
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
    
    // ===== Expandable Stats (NO COUNTER RESET) =====
    const statExpandables = document.querySelectorAll('.stat-expandable');
    
    statExpandables.forEach((stat, index) => {
        const header = stat.querySelector('.stat-header');
        const number = stat.querySelector('.stat-number');
        
        // Staggered reveal on page load
        setTimeout(() => {
            stat.classList.add('visible');
        }, index * 200);
        
        // Animate counter ONCE on page load (NOT on expand)
        if (number && number.dataset.target) {
            const target = parseInt(number.dataset.target);
            const counterId = number.closest('.stat-expandable').getAttribute('data-stat-id') || `stat-${index}`;
            
            if (!animatedCounters.has(counterId)) {
                setTimeout(() => {
                    animateCounter(number, target, 5000);
                    animatedCounters.add(counterId);
                }, 1000 + (index * 500));
            }
        }
        
        // Click to expand (DON'T re-animate counter)
        if (header) {
            header.addEventListener('click', function() {
                stat.classList.toggle('expanded');
                // Counter stays at its value, no re-animation
            });
        }
    });
    
    // ===== Enhanced Typing Effect with Scroll Trigger =====
    function typeText(element, text, speed = 60) {
        let i = 0;
        element.textContent = '';
        element.style.opacity = '1';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Check if mobile (for scroll trigger)
    const isMobile = window.innerWidth <= 1024;
    
    // Hero text (always types on load)
    const typeElement = document.querySelector('.type-effect');
    if (typeElement) {
        const text = typeElement.textContent;
        setTimeout(() => typeText(typeElement, text, 60), 800);
    }
    
    // Section titles with typing
    const typeOnScrollElements = document.querySelectorAll('.type-on-scroll');
    
    if (isMobile) {
        // MOBILE: Type on scroll into view
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.typed) {
                    const text = entry.target.textContent;
                    const speed = parseInt(entry.target.dataset.typeSpeed) || 60;
                    entry.target.dataset.typed = 'true';
                    typeText(entry.target, text, speed);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px'
        });
        
        typeOnScrollElements.forEach(el => {
            el.style.opacity = '0'; // Hide until typed
            scrollObserver.observe(el);
        });
    } else {
        // DESKTOP: Type all on page load (staggered)
        typeOnScrollElements.forEach((el, index) => {
            const text = el.textContent;
            const speed = parseInt(el.dataset.typeSpeed) || 60;
            el.style.opacity = '0'; // Hide initially
            
            // Stagger the typing animations
            setTimeout(() => {
                typeText(el, text, speed);
            }, 1500 + (index * 800)); // Start after hero, 800ms between each
        });
    }
    
    // ===== Smooth Scroll with Offset =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
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
            (currentPath === window.location.pathname.split('/')[1] + '/' && href.includes('index'))) {
            link.classList.add('active');
        }
    });
    
    // ===== Glow Effect on Buttons =====
    const buttons = document.querySelectorAll('.cta-button, .contact-link');
    buttons.forEach(button => {
        button.classList.add('glow-effect');
    });
    
    // ===== Process Callouts (Add data attributes for ALL types) =====
    document.querySelectorAll('.writeup-content blockquote').forEach(blockquote => {
        const firstP = blockquote.querySelector('p:first-child');
        if (firstP) {
            const text = firstP.textContent;
            // Match [!type] with any capitalization
            const match = text.match(/\[!(\w+)\]/i);
            if (match) {
                const type = match[1].toLowerCase();
                blockquote.setAttribute('data-callout', type);
                // Remove the [!type] marker from visible text
                firstP.innerHTML = firstP.innerHTML.replace(/\[!\w+\]\s*/i, '');
                // Add a styled label
                const label = document.createElement('strong');
                label.style.display = 'block';
                label.style.marginBottom = '0.5rem';
                label.style.textTransform = 'uppercase';
                label.style.fontSize = '0.85rem';
                label.style.opacity = '0.9';
                label.textContent = type;
                firstP.insertBefore(label, firstP.firstChild);
            }
        }
    });
    
});
