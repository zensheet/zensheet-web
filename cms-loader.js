// ============================================
// Google Sheets CMS - Data Loader
// ============================================

// Main CMS Loader
const CMSLoader = {
    // Fetch data from Google Sheets
    async fetchData(sheetName) {
        try {
            // Check cache first
            const cached = getCachedData(sheetName);
            if (cached) {
                console.log(`Using cached data for ${sheetName}`);
                return cached;
            }

            // Fetch from Google Sheets
            const url = `${CMS_CONFIG.SCRIPT_URL}?sheet=${sheetName}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Cache the data
            setCachedData(sheetName, data);

            return data;
        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            return null;
        }
    },

    // Load and render products
    async loadProducts() {
        const products = await this.fetchData(CMS_CONFIG.SHEETS.PRODUCTS);
        if (!products || !products.length) {
            console.warn('No products data found');
            return;
        }

        // Filter active products only
        const activeProducts = products.filter(p => p.Status === 'Active');

        // Render products
        this.renderProducts(activeProducts);
    },

    // Render product cards
    renderProducts(products) {
        const container = document.querySelector('.product-grid');
        if (!container) return;

        // Keep static products, add dynamic ones
        // Or replace all - your choice
        // For now, we'll prepend dynamic products

        const dynamicHTML = products.map(product => {
            const imageURL = convertGoogleDriveLink(product.ImageURL);
            const price = formatPrice(product.Price);
            const oldPrice = product.OldPrice ? formatPrice(product.OldPrice) : '';

            return `
                <article class="product-card cms-product" data-id="${product.ID}">
                    <div class="card-image">
                        <img src="${imageURL}" alt="${product.Title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <span class="category">${product.Category}</span>
                        <h3>${product.Title}</h3>
                        <p class="description">${product.Description}</p>
                        <div class="price-row">
                            <span class="price">${price}</span>
                            ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                        </div>
                        <div class="card-actions">
                            <a href="${product.BuyLink}" target="_blank" class="btn-primary">
                                Beli Sekarang
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Remove old CMS products
        container.querySelectorAll('.cms-product').forEach(el => el.remove());

        // Add new products at the beginning
        container.insertAdjacentHTML('afterbegin', dynamicHTML);

        // Re-initialize Feather icons if needed
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    },

    // Load and update hero section
    async loadHero() {
        const hero = await this.fetchData(CMS_CONFIG.SHEETS.HERO);
        if (!hero || !hero.length) {
            console.warn('No hero data found');
            return;
        }

        const heroData = hero[0]; // First row

        // Update hero text
        const heroHeading = document.querySelector('.hero h1');
        const heroSub = document.querySelector('.hero-sub');
        const btn1 = document.querySelector('.hero-buttons .btn-primary');
        const btn2 = document.querySelector('.hero-buttons .btn-secondary');

        if (heroHeading && heroData.MainHeading) {
            // Keep the accent-text span
            const parts = heroData.MainHeading.split('|'); // Use | as separator for accent
            if (parts.length === 2) {
                heroHeading.innerHTML = `${parts[0]}<span class="accent-text">${parts[1]}</span>`;
            } else {
                heroHeading.textContent = heroData.MainHeading;
            }
        }

        if (heroSub && heroData.SubHeading) {
            heroSub.textContent = heroData.SubHeading;
        }

        if (btn1 && heroData.Button1Text) {
            btn1.textContent = heroData.Button1Text;
        }

        if (btn2 && heroData.Button2Text) {
            btn2.textContent = heroData.Button2Text;
        }
    },

    // Load and update features
    async loadFeatures() {
        const features = await this.fetchData(CMS_CONFIG.SHEETS.FEATURES);
        if (!features || !features.length) {
            console.warn('No features data found');
            return;
        }

        const container = document.querySelector('.features-grid');
        if (!container) return;

        const featuresHTML = features.map(feature => `
            <div class="feature-item">
                <i data-feather="${feature.Icon}"></i>
                <h4>${feature.Title}</h4>
                <p>${feature.Description}</p>
            </div>
        `).join('');

        container.innerHTML = featuresHTML;

        // Re-initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    },

    // Initialize CMS
    async init() {
        console.log('Initializing CMS...');

        // Check if script URL is configured
        if (CMS_CONFIG.SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            console.warn('CMS not configured. Please update cms-config.js with your Google Apps Script URL.');
            return;
        }

        try {
            // Load all sections
            await Promise.all([
                this.loadProducts(),
                this.loadHero(),
                this.loadFeatures()
            ]);

            console.log('CMS loaded successfully!');
        } catch (error) {
            console.error('CMS initialization error:', error);
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CMSLoader.init());
} else {
    CMSLoader.init();
}

// Expose for manual refresh
window.CMSLoader = CMSLoader;
window.clearCMSCache = clearCMSCache;

// Add keyboard shortcut to clear cache (Ctrl+Shift+C)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        clearCMSCache();
        alert('CMS cache cleared! Refreshing page...');
        location.reload();
    }
});
