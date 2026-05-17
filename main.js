// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
});

// Magnetic Button Effect
const magneticButtons = document.querySelectorAll('.btn');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

// Dynamic Logo Blur on Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(2, 6, 23, 0.8)';
        nav.style.padding = '15px 10%';
    } else {
        nav.style.background = 'rgba(2, 6, 23, 0.5)';
        nav.style.padding = '20px 10%';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Honeypot check
        const honey = contactForm.querySelector('input[name="_honey"]').value;
        if (honey) {
            console.warn("Spam detected via honeypot.");
            return;
        }

        // Simulate form submission
        const formData = new FormData(contactForm);
        console.log("Form submitted:", Object.fromEntries(formData));

        // UI Feedback
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Here you would typically integrate with a service like Formspree or Netlify
        // fetch("https://formspree.io/f/your-id", { method: "POST", body: formData });
    });
}

// Topographic Lines Generator
const topoContainer = document.querySelector('.topo-lines');
if (topoContainer) {
    const canvas = document.createElement('canvas');
    topoContainer.innerHTML = '';
    topoContainer.appendChild(canvas);
    topoContainer.style.background = 'transparent';
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resize() {
        width = topoContainer.clientWidth || window.innerWidth;
        height = topoContainer.clientHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        drawTopo();
    }
    
    window.addEventListener('resize', resize);
    
    function drawTopo() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'; // matches var(--accent)
        ctx.lineWidth = 1;
        
        // Define center point for the topographic circles
        const cx = width * 0.7;
        const cy = height * 0.3;
        
        // Draw concentric loops with procedural distortion
        for (let r = 20; r < Math.max(width, height) * 1.5; r += 25) {
            ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.05) {
                // Procedural noise approximation using sine waves
                // Added complexity for a more organic terrain look
                const noise = Math.sin(angle * 6 + r * 0.01) * 20 + 
                              Math.cos(angle * 4 + r * 0.02) * 15 + 
                              Math.sin(angle * 12 + r * 0.03) * 5 +
                              Math.cos(angle * 3) * 10;
                              
                // Scale noise slightly by radius so outer lines are more jagged
                const r_noisy = r + noise * (1 + r / 500);
                
                const x = cx + Math.cos(angle) * r_noisy;
                const y = cy + Math.sin(angle) * r_noisy;
                
                if (angle === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    // Initial draw
    resize();
}
