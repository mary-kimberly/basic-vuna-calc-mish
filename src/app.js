// src/app.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// 📁 Tell the server to host your HTML, CSS, and JS files from the root directory
app.use(express.static(path.join(__dirname, '../')));

// 🟢 The mandatory health endpoint used by the pipeline to verify deployment success
app.get('/vunaCalc', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0' 
  });
});

module.exports = app;