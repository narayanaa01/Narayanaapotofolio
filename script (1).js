document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcons(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcons(newTheme);
    });

    function updateThemeToggleIcons(theme) {
        // Since we are changing attributes, we can let CSS handle layout,
        // but this helper helps with any auxiliary state.
        if (theme === 'dark') {
            document.getElementById('theme-toggle').setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            document.getElementById('theme-toggle').setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        const isActive = mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Indicators & Header State ---
    const header = document.querySelector('.header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Progress bar width
        scrollProgress.style.width = `${scrolled}%`;

        // Dynamic Header blur/background
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Dynamic active nav links on scroll
        updateActiveNavLinkOnScroll();
    });

    // Back to top behavior
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Helper to highlight navigation links depending on active viewport section
    const sections = document.querySelectorAll('section');
    function updateActiveNavLinkOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
                if (currentSectionId === 'achievements') {
                    currentSectionId = 'certifications';
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // --- Typewriter Effect ---
    const words = [
        "Electronics & Communication Engineering Student",
        "Full-Stack MERN Developer",
        "Digital System & VLSI Enthusiast",
        "Problem Solver & Tech Learner"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = 100;
        
        if (isDeleting) {
            typingSpeed /= 2; // speed up deleting
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    // Start the typewriter loop
    if (typewriterElement) {
        type();
    }

    // --- Intersection Observer for Reveal-on-Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Unobserve once revealed to keep layout responsive
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });



    // --- Simulated Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple validation check
            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            // Set sending status
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Message...</span><i class="spinner"></i>';
            
            // Simulating API network call
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show success state
                formStatus.className = 'form-status success';
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully. Narayanaa will get back to you shortly.`;
                
                // Reset form fields
                contactForm.reset();

                // Clear success message after 7 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.className = 'form-status';
                        formStatus.textContent = '';
                        formStatus.style.opacity = '1';
                    }, 300);
                }, 7000);
            }, 1800);
        });
    }

    // --- Resume Download Action Trigger ---
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Since we don't have a physical PDF, we invoke window.print()
            // which prints the page using the browser print dialogue.
            // We can also let the user know we've prepared a printer-friendly CSS print layout.
            alert("Preparing print dialogue. For the best result, select 'Save as PDF' in the destination dropdown.");
            window.print();
        });
    }
});
