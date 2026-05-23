// Language Switcher Logic
const allLang = ['uk', 'ru'];
let currentLang = 'uk';

function changeLanguage(lang) {
    if (!allLang.includes(lang)) return;
    
    currentLang = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${lang}`).classList.add('active');

    // Update text
    for (let key in langArr) {
        let elements = document.querySelectorAll('.lng-' + key);
        if (elements.length > 0) {
            elements.forEach(el => {
                el.innerHTML = langArr[key][lang];
            });
        }
    }
}

document.getElementById('btn-uk').addEventListener('click', () => changeLanguage('uk'));
document.getElementById('btn-ru').addEventListener('click', () => changeLanguage('ru'));


// Slider Logic
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = Array.from(slider.querySelectorAll('.slide'));
        const nextBtn = slider.querySelector('.slider-next');
        const prevBtn = slider.querySelector('.slider-prev');
        const dotsContainer = slider.parentElement.querySelector('.slider-dots');
        
        if(!track || slides.length === 0) return;

        let currentIndex = 0;
        
        // Settings from data attributes or defaults
        const slidesDesktop = parseInt(slider.getAttribute('data-slides-desktop')) || 3;
        const slidesTablet = parseInt(slider.getAttribute('data-slides-tablet')) || 2;
        const slidesMobile = parseInt(slider.getAttribute('data-slides-mobile')) || 1;

        // Determine slides per view
        function getSlidesPerView() {
            if (window.innerWidth <= 768) return slidesMobile;
            if (window.innerWidth <= 992) return slidesTablet;
            return slidesDesktop;
        }

        let slidesPerView = getSlidesPerView();

        function updateSlider() {
            slidesPerView = getSlidesPerView();
            const slideWidth = 100 / slidesPerView;
            track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            updateDots();
        }

        // Create Dots
        function createDots() {
            if(!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const maxIndex = Math.max(0, slides.length - slidesPerView);
            
            // If less slides than per view, no dots needed
            if (maxIndex === 0) return;

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if(!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            const maxIndex = Math.max(0, slides.length - slidesPerView);
            if (maxIndex === 0) return;
            
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // loop
            }
            updateSlider();
        }

        function prevSlide() {
            const maxIndex = Math.max(0, slides.length - slidesPerView);
            if (maxIndex === 0) return;

            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex;
            }
            updateSlider();
        }

        if(nextBtn && prevBtn) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        }

        // Touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        const wrapper = slider.querySelector('.slider-wrapper');

        wrapper.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
        }, {passive: true});

        wrapper.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, {passive: true});

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }

        // Initialize
        window.addEventListener('resize', () => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                currentIndex = 0; // reset on resize breakpoint change
                createDots();
                updateSlider();
            }
        });

        createDots();
        updateSlider();

        // Auto Play
        setInterval(nextSlide, 5000);
    });
});

// Mobile Header Scroll Logic
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
const contactsBlock = document.querySelector('.contacts-block');
let currentTranslateY = 0;

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) {
        const currentScrollY = window.scrollY;
        const offset = contactsBlock ? contactsBlock.offsetTop : 0;
        const maxTranslate = Math.max(0, offset - 10);
        
        const deltaY = currentScrollY - lastScrollY;
        
        header.style.transition = 'none';

        if (currentScrollY <= 0) {
            currentTranslateY = 0;
        } else {
            currentTranslateY -= deltaY;
            currentTranslateY = Math.max(-maxTranslate, Math.min(0, currentTranslateY));
        }

        header.style.transform = `translateY(${currentTranslateY}px)`;
        lastScrollY = currentScrollY;
    } else {
        header.style.transition = '';
        header.style.transform = 'translateY(0)';
        currentTranslateY = 0;
        lastScrollY = window.scrollY;
    }
});
