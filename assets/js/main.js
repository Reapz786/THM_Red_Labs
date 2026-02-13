// Enhanced Portfolio JavaScript - Fixed Counter Reset Issue

document.addEventListener('DOMContentLoaded', function() {
    
    // Track if counters have already animated (PREVENT RESET)
    const animatedCounters = new Set();
    
    // ===== Faster Counter Animation (3.5 seconds) =====
    function animateCounter(element, target, duration = 3500) {
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
                    animateCounter(number, target, 3500);
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
    
    // ===== Randomized Glitch Effect on Hero Name =====
    const heroName = document.querySelector('.hero-name');
    
    function randomGlitch() {
        if (heroName) {
            heroName.classList.add('glitch');
            setTimeout(() => {
                heroName.classList.remove('glitch');
            }, 200); // Glitch lasts 200ms
            
            // Random interval between 1-4 seconds
            const randomDelay = Math.random() * 3000 + 1000; // 1000-4000ms
            setTimeout(randomGlitch, randomDelay);
        }
    }
    
    // Start glitch effect after page loads
    setTimeout(randomGlitch, 2000); // First glitch after 2s
    
    // ===== Enhanced Typing Effect (FASTER: 40ms per char) =====
    function typeText(element, text, speed = 40, callback) {
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');
        element.style.opacity = '1';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
    
    // Check if mobile (for scroll trigger)
    const isMobile = window.innerWidth <= 1024;
    
    // ===== Hero text typing (BOTH LINES - FASTER) =====
    const typeLine1 = document.querySelector('.type-line-1');
    const typeLine2 = document.querySelector('.type-line-2');
    
    if (typeLine1 && typeLine2) {
        const text1 = typeLine1.dataset.text || typeLine1.textContent.trim();
        const text2 = typeLine2.dataset.text || typeLine2.textContent.trim();
        
        // Type first line, then second line after it completes (40ms per char = faster)
        setTimeout(() => {
            typeText(typeLine1, text1, 40, () => {
                // After first line completes, type second line
                setTimeout(() => {
                    typeText(typeLine2, text2, 40);
                }, 250); // Shorter pause
            });
        }, 800);
    }
    
    // ===== Section titles with typing =====
    const typeOnScrollElements = document.querySelectorAll('.type-on-scroll');
    
    if (isMobile) {
        // MOBILE: Type on scroll into view
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.typed) {
                    const text = entry.target.textContent;
                    const speed = parseInt(entry.target.dataset.typeSpeed) || 35; // Faster
                    entry.target.dataset.typed = 'true';
                    typeText(entry.target, text, speed);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px'
        });
        
        typeOnScrollElements.forEach(el => {
            el.style.opacity = '0';
            scrollObserver.observe(el);
        });
    } else {
        // DESKTOP: Type all on page load (staggered)
        typeOnScrollElements.forEach((el, index) => {
            const text = el.textContent;
            const speed = parseInt(el.dataset.typeSpeed) || 35; // Faster
            el.style.opacity = '0';
            
            // Stagger the typing animations
            setTimeout(() => {
                typeText(el, text, speed);
            }, 2800 + (index * 900)); // Start sooner, faster intervals
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
