const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../welcome.html'));
});

app.use(express.static(path.join(__dirname, '../')));

app.get('/vunaCalc', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0' 
  });
});

module.exports = app; // Export it so other files can require it!