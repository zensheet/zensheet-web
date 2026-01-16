// ============================================
// Google Sheets CMS - Configuration
// ============================================

const CMS_CONFIG = {
    // Google Apps Script Web App URL
    // Ganti dengan URL dari Google Apps Script deployment Anda
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxqmAhnUTMk7nlSjWS4SqdeSHo5hKomrQ3HuNBK3ZxUSIyDygT5PTJg8s_iniKLYsn7/exec',

    // Sheet names (tab names in Google Sheet)
    SHEETS: {
        PRODUCTS: 'Products',
        HERO: 'Hero',
        FEATURES: 'Features'
    },

    // Cache settings (in milliseconds)
    CACHE: {
        DURATION: 5 * 60 * 1000, // 5 minutes
        KEY_PREFIX: 'zensheet_cms_'
    },

    // Loading settings
    LOADING: {
        SHOW_SKELETON: true,  // Show loading skeleton
        MIN_DISPLAY_TIME: 300 // Minimum time to show content (ms)
    }
};

// Helper: Convert Google Drive link to direct image URL
function convertGoogleDriveLink(url) {
    if (!url) return '';

    // Already converted
    if (url.includes('/uc?export=view')) {
        return url;
    }

    // Extract file ID from Google Drive link
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    // Return original URL if not Google Drive
    return url;
}

// Helper: Format price to Rupiah
function formatPrice(price) {
    if (!price || price === 'FREE') return 'FREE';
    return 'Rp ' + parseInt(price).toLocaleString('id-ID');
}

// Helper: Get cached data
function getCachedData(key) {
    try {
        const cached = localStorage.getItem(CMS_CONFIG.CACHE.KEY_PREFIX + key);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        // Check if cache expired
        if (now - data.timestamp > CMS_CONFIG.CACHE.DURATION) {
            localStorage.removeItem(CMS_CONFIG.CACHE.KEY_PREFIX + key);
            return null;
        }

        return data.content;
    } catch (e) {
        console.error('Cache read error:', e);
        return null;
    }
}

// Helper: Set cached data
function setCachedData(key, content) {
    try {
        const data = {
            timestamp: Date.now(),
            content: content
        };
        localStorage.setItem(CMS_CONFIG.CACHE.KEY_PREFIX + key, JSON.stringify(data));
    } catch (e) {
        console.error('Cache write error:', e);
    }
}

// Helper: Clear all CMS cache
function clearCMSCache() {
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CMS_CONFIG.CACHE.KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('CMS cache cleared');
    } catch (e) {
        console.error('Cache clear error:', e);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CMS_CONFIG, convertGoogleDriveLink, formatPrice, getCachedData, setCachedData, clearCMSCache };
}
