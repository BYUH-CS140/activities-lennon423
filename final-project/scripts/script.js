document.addEventListener("DOMContentLoaded", function () {
    // --- Mobile Navigation Toggle ---
    const toggleBtn = document.querySelector('.toggle_btn');
    const toggleBtnIcon = document.querySelector('.toggle_btn i');
    const dropDownMenu = document.querySelector('.dropdown_menu');

    if (toggleBtn && dropDownMenu && toggleBtnIcon) {
        toggleBtn.onclick = function () {
            dropDownMenu.classList.toggle('open');
            const isOpen = dropDownMenu.classList.contains('open');
            toggleBtnIcon.classList = isOpen
                ? 'fa-solid fa-xmark' // Changed to fa-xmark for a close icon
                : 'fa-solid fa-bars';
        };
    } else {
        console.warn("Mobile navigation elements not found. Check selectors: .toggle_btn, .dropdown_menu, .toggle_btn i");
    }

    // --- Lazy Loading for Images (using Intersection Observer) ---
    const lazyLoadImages = document.querySelectorAll('img.lazyload');

    if ('IntersectionObserver' in window) {
        let lazyLoadObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    if (img.dataset.src) { // Ensure data-src exists
                        img.src = img.dataset.src;
                        img.classList.remove('lazyload');
                        lazyLoadObserver.unobserve(img);
                    } else {
                        console.warn(`Lazyload image is missing data-src attribute:`, img);
                    }
                }
            });
        }, {
            rootMargin: "0px 0px 200px 0px" // Load images when they are 200px from viewport
        });

        lazyLoadImages.forEach(function (img) {
            lazyLoadObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        console.warn("Intersection Observer not supported. Images loaded directly without lazy-loading.");
        lazyLoadImages.forEach(function (img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazyload');
            }
        });
    }

    // --- Lightbox Functionality ---
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    // Select ALL images within the masonry grid
    const galleryImages = document.querySelectorAll('.masonry-grid .grid-item img');

    let currentImageIndex;

    function openLightbox(index) {
        currentImageIndex = index;
        // Use data-src first, then fall back to src if data-src isn't set (e.g., after lazy load)
        const imageUrl = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;

        if (imageUrl) {
            lightboxImage.src = imageUrl;
            lightboxModal.style.display = 'flex';
            document.body.classList.add('no-scroll'); // Prevent background scroll
        } else {
            console.error("Image URL not found for lightbox. Check data-src or src attribute.", galleryImages[currentImageIndex]);
        }
    }

    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Re-enable background scroll
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;
    }

    // Attach click listeners to each gallery image
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => openLightbox(index));
    });

    // Attach click listeners to lightbox controls
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    } else {
        console.warn("Lightbox close button (.close-btn) not found.");
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    } else {
        console.warn("Lightbox previous button (.prev-btn) not found.");
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    } else {
        console.warn("Lightbox next button (.next-btn) not found.");
    }

    // Close lightbox when clicking outside the image or on the backdrop itself
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            // Close only if click is directly on the modal background or the image itself
            // Not on the navigation buttons or close button
            if (e.target === lightboxModal || e.target === lightboxImage) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'flex') { // Check if lightbox is currently open
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
});