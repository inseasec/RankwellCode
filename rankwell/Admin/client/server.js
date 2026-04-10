const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 2014;

// Read API URL from environment variable (default if not set)
const apiUrl = process.env.API_URL || 'http://localhost:8017';

// Serve static assets (CSS, JS, images) normally
app.use('/admin', express.static(path.join(__dirname, 'dist')));

// For HTML requests, inject the API URL into index.html
app.get('/admin/*splat', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Inject the runtime variable into the <head> or before </body>
  const injectScript = `<script>window.__RUNTIME_API_URL__ = "${apiUrl}";</script>`;
  
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${injectScript}</head>`);
  } else {
    html = html.replace('</body>', `${injectScript}</body>`);
  }
  
  res.send(html);
});

app.listen(port, () => {
  console.log(`✅ Admin UI at http://localhost:${port}/admin/`);
  console.log(`🔗 Using API URL: ${apiUrl}`);
});