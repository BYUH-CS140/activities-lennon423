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
                    // Ensure img.dataset.src exists before assigning
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazyload'); // Remove class once loaded
                        lazyLoadObserver.unobserve(img); // Stop observing
                    } else {
                        console.warn(`Image with class 'lazyload' is missing data-src:`, img);
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
    // Select all images that are part of the gallery grid for lightbox
    const galleryImages = document.querySelectorAll('.masonry-grid .grid-item img');

    let currentImageIndex;

    function openLightbox(index) {
        currentImageIndex = index;
        // *** FIX HERE: Use data-src for lightbox image if available, otherwise fallback to src ***
        const imageUrl = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;
        if (imageUrl) {
            lightboxImage.src = imageUrl;
            lightboxModal.style.display = 'flex';
            document.body.classList.add('no-scroll'); // Add class to prevent body scroll
        } else {
            console.error("Attempted to open lightbox with invalid image or missing data-src/src:", galleryImages[currentImageIndex]);
        }
    }

    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Remove class to enable body scroll
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        // *** FIX HERE: Use data-src for lightbox image if available, otherwise fallback to src ***
        lightboxImage.src = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        // *** FIX HERE: Use data-src for lightbox image if available, otherwise fallback to src ***
        lightboxImage.src = galleryImages[currentImageIndex].dataset.src || galleryImages[currentImageIndex].src;
    }

    // Event Listeners for Gallery Images
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => openLightbox(index));
    });

    // Event Listeners for Lightbox Controls
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking on the modal backdrop
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            // Only close if clicking on the modal itself, not its children (image, buttons)
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'flex') { // Check if lightbox is open
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