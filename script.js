// DOM Elements
const stages = {
    welcome: document.getElementById('welcome-section'),
    message: document.getElementById('message-section'),
    photos: document.getElementById('photo-section'),
    surprise: document.getElementById('surprise-section')
};

const buttons = {
    start: document.getElementById('start-btn'),
    revealMessage: document.getElementById('reveal-message-btn'),
    nextToPhotos: document.getElementById('next-to-photos-btn'),
    revealPhotos: document.getElementById('reveal-photos-btn'),
    nextToSurprise: document.getElementById('next-to-surprise-btn'),
    surprise: document.getElementById('surprise-btn')
};

const content = {
    messageText: document.getElementById('message-content'),
    photoGrid: document.getElementById('photo-grid'),
    finalContent: document.getElementById('final-content')
};

// State Management
function switchSection(hideSection, showSection) {
    hideSection.style.opacity = '0';
    setTimeout(() => {
        hideSection.classList.add('hidden');
        hideSection.classList.remove('active');

        showSection.classList.remove('hidden');
        // Trigger reflow
        void showSection.offsetWidth;

        showSection.classList.add('active');
        showSection.style.opacity = '1';
    }, 500);
}

// Event Listeners

// 1. Start Button
buttons.start.addEventListener('click', () => {
    switchSection(stages.welcome, stages.message);
});

// 2. Reveal Message
buttons.revealMessage.addEventListener('click', () => {
    content.messageText.classList.remove('hidden');
    setTimeout(() => {
        content.messageText.style.opacity = '1';
        buttons.revealMessage.style.display = 'none'; // Hide the reveal button
        buttons.nextToPhotos.classList.remove('hidden');
    }, 100);
});

// 3. Go to Photos
buttons.nextToPhotos.addEventListener('click', () => {
    switchSection(stages.message, stages.photos);
});

// 4. Reveal Photos
buttons.revealPhotos.addEventListener('click', () => {
    content.photoGrid.classList.remove('hidden');
    setTimeout(() => {
        content.photoGrid.style.opacity = '1';

        // Staggered animation for photos
        const photos = document.querySelectorAll('.photo-item');
        photos.forEach((photo, index) => {
            photo.style.opacity = '0';
            photo.style.transform = 'translateY(20px)';
            photo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                photo.style.opacity = '1';
                photo.style.transform = 'translateY(0)';
            }, index * 200);
        });

        buttons.revealPhotos.style.display = 'none';
        buttons.nextToSurprise.classList.remove('hidden');
    }, 100);
});

// 5. Go to Surprise
buttons.nextToSurprise.addEventListener('click', () => {
    switchSection(stages.photos, stages.surprise);
});

// 6. Final Surprise
buttons.surprise.addEventListener('click', () => {
    content.finalContent.classList.remove('hidden');
    buttons.surprise.style.display = 'none';

    setTimeout(() => {
        content.finalContent.style.opacity = '1';
        content.finalContent.style.transform = 'scale(1)';
        startConfetti();
    }, 100);
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.classList.remove('hidden');
        lightbox.style.display = 'flex'; // Ensure flex layout
        lightboxImg.src = img.src;
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        lightbox.style.display = 'none';
    }
});

// Confetti Logic (Simple Canvas Implementation)
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function startConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push(createParticle());
    }
    animateConfetti();
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // Start above screen
        size: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
    };
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX; // Add slight drift
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
            // Reset to top to keep it raining gentle
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });

    requestAnimationFrame(animateConfetti);
}
