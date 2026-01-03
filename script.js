document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle 'active' class on nav
            navLinks.classList.toggle('active');

            // Optional: Toggle icon (menu vs close) - simplied using just CSS display logic for now
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scroll for Anchor Links (if CSS scroll-behavior: smooth isn't supported)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close modal when clicking outside (attached here to ensure element exists)
    const leadModal = document.getElementById('leadModal');
    if (leadModal) {
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                closeModal();
            }
        });
    }

    console.log("ZenSheet script initialized.");
});

// GLOBAL FUNCTIONS (Accessible by HTML onclick)

function openModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('leadModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('leadModal');
    if (modal) modal.classList.remove('active');
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKq1qDIKbSwCufLMpV7Tb55bb69qUqJ92vM7LLKpzMERSMzdL2KKgCpbKrTBBHE1cPDw/exec";

function handleLeadSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const formData = new FormData(form);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            // Trigger Download regardless of response status to ensure UX
            triggerDownload();

            // Reset Form & UI
            form.reset();
            closeModal();
            alert("Terima kasih! Data terkirim & Download dimulai.");
        })
        .catch(error => {
            console.error('Error!', error.message);
            // Still download even if script fails (fallback)
            triggerDownload();
            closeModal();
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

function triggerDownload() {
    const link = document.createElement('a');
    link.href = 'downloads/The%20Art%20of%20Uncomplicating%20(Remastered).pdf';
    link.download = 'The Art of Uncomplicating (ZenSheet).pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// GALLERY LIGHTBOX LOGIC
const productGalleries = {
    'sales': [
        'images/sales_dashboard_preview_1.jpg',
        'images/sales_dashboard_preview_2.jpg',
        'images/sales_dashboard_preview_3.jpg',
        'images/sales_dashboard_preview_4.jpg'
    ],
    'ups': [
        'images/ups_calc_preview_1.jpg',
        'images/ups_calc_preview_2.jpg'
    ],
    'tax': [
        'images/tax_calc_preview_1.jpg',
        'images/tax_calc_preview_2.jpg'
    ],
    'crm': [
        'images/sales_crm_preview_1.jpg',
        'images/sales_crm_preview_2.jpg',
        'images/sales_crm_preview_3.jpg',
        'images/sales_crm_preview_4.jpg',
        'images/sales_crm_preview_5.jpg',
        'images/sales_crm_preview_6.jpg',
        'images/sales_crm_preview_7.jpg'
    ]
};

let currentGallery = [];
let currentImageIndex = 0;

function openGallery(productKey, index = 0) {
    if (productGalleries[productKey]) {
        currentGallery = productGalleries[productKey];
        currentImageIndex = index;
        updateGalleryImage();
        const modal = document.getElementById('galleryModal');
        if (modal) {
            modal.classList.add('active');
            // Re-initialize feather icons inside modal if needed
            if (typeof feather !== 'undefined') feather.replace();
        }
    } else {
        console.error("Gallery not found for key:", productKey);
    }
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (modal) modal.classList.remove('active');
}

function updateGalleryImage() {
    const imgElement = document.getElementById('galleryImage');
    const counterElement = document.getElementById('galleryCounter');

    if (imgElement && currentGallery.length > 0) {
        imgElement.style.opacity = '0.5';
        setTimeout(() => {
            imgElement.src = currentGallery[currentImageIndex];
            imgElement.style.opacity = '1';
        }, 150);
    }

    if (counterElement && currentGallery.length > 0) {
        counterElement.innerText = `${currentImageIndex + 1} / ${currentGallery.length}`;
    }
}

function nextImage() {
    if (currentGallery.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
    updateGalleryImage();
}

function prevImage() {
    if (currentGallery.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
    updateGalleryImage();
}

// Close gallery on outside click
document.addEventListener('click', (e) => {
    const galleryModal = document.getElementById('galleryModal');
    if (e.target === galleryModal) {
        closeGallery();
    }
});
