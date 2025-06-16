// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');
    
    mobileNav.classList.toggle('active');
    
    // Change icon
    if (mobileNav.classList.contains('active')) {
        menuIcon.className = 'fas fa-times';
    } else {
        menuIcon.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');
    
    mobileNav.classList.remove('active');
    menuIcon.className = 'fas fa-bars';
}

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.servicio-card, .noticia-card, .value-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.servicio-card, .noticia-card, .value-card');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on load
    animateOnScroll();
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobile-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileNav.classList.contains('active') && 
        !mobileNav.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

// Handle "Leer más" buttons
document.addEventListener('DOMContentLoaded', function() {
    const leerMasButtons = document.querySelectorAll('.leer-mas');
    
    leerMasButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Here you could add functionality to show full article
            // For now, just show an alert
            alert('Funcionalidad de leer más - aquí se mostraría el artículo completo');
        });
    });
});