const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.json': 'application/json',
};

// Mock API: page data
const mockPageData = {
    err: null,
    data: {
        business_name: "גרו ביזנס",
        sum: "250.00",
        type_id: 2,
        description: "תשלום עבור שירות - Payment for service",
        payment_link_background_color: "#f0f2f5",
        payment_link_btn_color: "#1a1a5e",
        payment_link_btn_text: "לתשלום",
        payment_link_direct_debit_message: "",
        environment: "sandbox"
    }
};

// Mock API: transaction → returns authCode so SDK shows payment form
const mockTransactionData = {
    err: null,
    data: {
        authCode: "DEMO_AUTH_CODE_12345"
    }
};

function readBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
    });
}

const server = http.createServer(async (req, res) => {
    const pathname = req.url.split('?')[0];

    // ── CORS headers for all responses ──
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ── Mock API endpoints ──
    if (req.method === 'POST' && pathname === '/api/light/web/1.0/drawPaymentLinkPageData') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockPageData));
        return;
    }

    if (req.method === 'POST' && pathname === '/api/light/web/1.0/doPaymentLinkTransaction') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockTransactionData));
        return;
    }

    // ── Static file serving ──
    let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(err.code === 'ENOENT' ? 404 : 500);
            res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
            return;
        }

        // For HTML: disable the CDN SDK loader (precise string replace)
        if (ext === '.html') {
            let html = data.toString();

            // Replace only the CDN src line inside the SDK loader script
            html = html.replace(
                "s.src = 'https://cdn.meshulam.co.il/sdk/gs.min.js';",
                "// CDN disabled - using local mock gs.min.js"
            );

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(Buffer.from(html));
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ السيرفر يعمل على: http://localhost:${PORT}`);
    console.log(`   افتح: http://localhost:${PORT}/?l=demo123\n`);
});
