'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// API endpoint for authentication (demo purposes)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Demo authentication - in production, use proper auth
    if (username && password) {
        res.json({
            success: true,
            user: {
                username: username,
                loginTime: new Date().toISOString()
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }
});

app.post('/api/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`pwaCore server running at http://localhost:${PORT}`);
});
