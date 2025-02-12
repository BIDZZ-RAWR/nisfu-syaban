// Particle.js Configuration with Enhanced Settings
particlesJS('particles-js', {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#ffffff', '#81C784', '#4CAF50']
        },
        shape: {
            type: ['circle', 'star'],
            stroke: {
                width: 0,
                color: '#000000'
            },
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: ['grab', 'bubble']
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 200,
                size: 6,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Enhanced Audio Context Setup
class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {
            hover: 'hover-sound.mp3',
            click: 'click-sound.mp3',
            background: 'bidzz.mp3'
        };
        this.soundBuffers = new Map();
        this.loadAllSounds();
    }

    async loadAllSounds() {
        for (const [key, url] of Object.entries(this.sounds)) {
            try {
                const buffer = await this.loadSound(url);
                this.soundBuffers.set(key, buffer);
            } catch (error) {
                console.warn(`Failed to load sound: ${url}`, error);
            }
        }
    }

    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    playSound(name, options = {}) {
        const buffer = this.soundBuffers.get(name);
        if (!buffer) return;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.value = options.volume || 1;
        
        if (options.loop) {
            source.loop = true;
        }
        
        source.start(0);
        return source;
    }
}

// Enhanced Star Creation with Dynamic Effects
class StarryBackground {
    constructor() {
        this.container = document.getElementById('stars');
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init() {
        this.createStars(100);
        this.setupMouseTracking();
        this.animate();
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.dataset.speed = Math.random() * 0.5 + 0.5;
            this.stars.push(star);
            this.container.appendChild(star);
        }
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }

    animate() {
        this.stars.forEach(star => {
            const speed = parseFloat(star.dataset.speed);
            const rect = star.getBoundingClientRect();
            const x = rect.left + this.mouseX * 30 * speed;
            const y = rect.top + this.mouseY * 30 * speed;
            
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Countdown Timer with Animations
class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.callbacks = [];
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            clearInterval(this.interval);
            this.callbacks.forEach(callback => callback());
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.animateUpdate('days', days);
        this.animateUpdate('hours', hours);
        this.animateUpdate('minutes', minutes);
        this.animateUpdate('seconds', seconds);
    }

    animateUpdate(unit, value) {
        const element = this.elements[unit];
        const currentValue = parseInt(element.textContent);
        if (currentValue === value) return;

        element.classList.add('updating');
        setTimeout(() => {
            element.textContent = String(value).padStart(2, '0');
            element.classList.remove('updating');
        }, 300);
    }

    onComplete(callback) {
        this.callbacks.push(callback);
    }
}

// Enhanced Parallax Effect Manager
class ParallaxManager {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init() {
        this.setupMouseTracking();
        this.setupScrollTracking();
        this.animate();
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }

    setupScrollTracking() {
        window.addEventListener('scroll', () => {
            this.elements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        });
    }

    animate() {
        this.elements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const x = this.mouseX * 50 * speed;
            const y = this.mouseY * 50 * speed;
            
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.progress = 0;
        this.isLoading = true;
    }

    init() {
        this.showLoader();
        this.startLoading();
    }

    showLoader() {
        this.loader.style.display = 'flex';
    }

    startLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 10;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.hideLoader();
            }
            this.updateProgress();
        }, 200);
    }

    updateProgress() {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.opacity = 1 - (this.progress / 100);
        }
    }

    hideLoader() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            this.loader.style.display = 'none';
            document.body.classList.add('loaded');
        }, 1000);
    }
}

// Enhanced Interactive Elements Manager
class InteractionManager {
    constructor() {
        this.elements = document.querySelectorAll('.interactive-element');
        this.audioManager = new AudioManager();
    }

    init() {
        this.setupInteractions();
        this.setupHoverEffects();
    }

    setupInteractions() {
        this.elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.audioManager.playSound('hover', { volume: 0.5 });
                element.classList.add('hovered');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('hovered');
            });

            element.addEventListener('click', () => {
                this.audioManager.playSound('click', { volume: 0.7 });
                element.classList.add('clicked');
                setTimeout(() => element.classList.remove('clicked'), 200);
            });
        });
    }

    setupHoverEffects() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                element.style.setProperty('--mouse-x', `${x}px`);
                element.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    const loadingManager = new LoadingManager();
    const starryBackground = new StarryBackground();
    const parallaxManager = new ParallaxManager();
    const interactionManager = new InteractionManager();
    const countdownTimer = new CountdownTimer('2025-02-14T18:00:00');
    
    loadingManager.init();
    starryBackground.init();
    parallaxManager.init();
    interactionManager.init();
    countdownTimer.start();

    // Setup Audio Controls
    const audioControl = document.getElementById('audioControl');
    const sholawat = document.getElementById('sholawat');
    let isPlaying = false;

    audioControl.addEventListener('click', () => {
        if (isPlaying) {
            sholawat.pause();
            audioControl.classList.remove('active');
        } else {
            sholawat.play();
            audioControl.classList.add('active');
        }
        isPlaying = !isPlaying;
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            sholawat.pause();
        } else if (!document.hidden && isPlaying) {
            sholawat.play();
        }
    });

    // Add smooth scrolling
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

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            starryBackground.init();
            parallaxManager.init();
        }, 250);
    });
});

// Performance optimization
window.requestAnimationFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame || 
                             window.mozRequestAnimationFrame || 
                             function(callback) { window.setTimeout(callback, 1000 / 60); };