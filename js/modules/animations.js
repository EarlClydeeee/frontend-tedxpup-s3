export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.speaker-card, .schedule-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// Cursor Halo Effect for Hero Section
let mouseX = 0;
let mouseY = 0;
let lastX = 0;
let lastY = 0;
let particles = [];

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate distance moved
    const distance = Math.sqrt(
        Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2)
    );
    
    // Only create particles if mouse is moving
    if (distance > 5) {
        createSmokeParticle(mouseX, mouseY);
        lastX = mouseX;
        lastY = mouseY;
    }
});

function createSmokeParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';
    
    // Random size
    const size = Math.random() * 40 + 30;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Position
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Random color variations (blue/purple smoke)
    const hue = Math.random() * 60 + 200; // 200-260 (blue to purple range)
    const saturation = Math.random() * 30 + 50; // 50-80%
    const lightness = Math.random() * 20 + 30; // 30-50%
    particle.style.background = `radial-gradient(circle, 
        hsla(${hue}, ${saturation}%, ${lightness}%, 0.8) 0%, 
        hsla(${hue}, ${saturation}%, ${lightness}%, 0.4) 40%,
        transparent 70%)`;
    
    // Random animation
    const animationType = Math.random() > 0.5 ? 'smokeRise' : 'smokeDrift';
    const duration = Math.random() * 1 + 1.5; // 1.5-2.5 seconds
    particle.style.animation = `${animationType} ${duration}s ease-out forwards`;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Create ambient particles on idle
let idleInterval;
document.addEventListener('mousemove', () => {
    clearTimeout(idleInterval);
    idleInterval = setTimeout(() => {
        // Create occasional ambient smoke when idle
        setInterval(() => {
            if (mouseX > 0 && mouseY > 0) {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                createSmokeParticle(mouseX + offsetX, mouseY + offsetY);
            }
        }, 300);
    }, 1000);
});