// Create floating particles
const particlesContainer = document.getElementById('particles');
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
}

// Smoke trail cursor effect
let lastX = 0;
let lastY = 0;
let lastTime = 0;

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    
    // Throttle particle creation
    if (currentTime - lastTime < 50) return;
    
    lastTime = currentTime;
    
    const deltaX = Math.abs(e.clientX - lastX);
    const deltaY = Math.abs(e.clientY - lastY);
    const speed = deltaX + deltaY;
    
    lastX = e.clientX;
    lastY = e.clientY;
    
    // Only create particles when moving
    if (speed > 5) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.left = e.clientX + 'px';
        smoke.style.top = e.clientY + 'px';
        smoke.style.width = (Math.random() * 15 + 10) + 'px';
        smoke.style.height = smoke.style.width;
        smoke.style.background = `radial-gradient(circle, ${
            Math.random() > 0.5 ? 'rgba(235, 0, 40, 0.4)' : 'rgba(255, 255, 255, 0.3)'
        } 0%, transparent 70%)`;
        smoke.style.animation = `smokeRise ${Math.random() * 1 + 1}s ease-out forwards`;
        
        document.body.appendChild(smoke);
        
        setTimeout(() => smoke.remove(), 2000);
    }
});

// Magnetic button effect
const ctaButton = document.querySelector('.cta-button');

ctaButton.addEventListener('mousemove', (e) => {
    const rect = ctaButton.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    ctaButton.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-3px)`;
});

ctaButton.addEventListener('mouseleave', () => {
    ctaButton.style.transform = 'translate(0, 0)';
});