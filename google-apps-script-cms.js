// ============================================
// Google Apps Script - CMS Backend
// ============================================
// Deploy this as Web App with "Anyone" access

function doGet(e) {
    try {
        const sheetName = e.parameter.sheet || 'Products';
        const data = getSheetData(sheetName);

        return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function getSheetData(sheetName) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
    }

    const data = sheet.getDataRange().getValues();

    if (data.length === 0) {
        return [];
    }

    // First row is headers
    const headers = data[0];
    const rows = data.slice(1);

    // Convert to array of objects
    const result = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });

    return result;
}

// Test function (optional)
function testGetProducts() {
    const products = getSheetData('Products');
    Logger.log(products);
}

function testGetHero() {
    const hero = getSheetData('Hero');
    Logger.log(hero);
}

function testGetFeatures() {
    const features = getSheetData('Features');
    Logger.log(features);
}
