'use strict';

/**
 * pwaCore - Single Page Application
 * Handles all views from login to logout
 */

const App = {
    // Application state
    state: {
        currentView: 'loading',
        user: null,
        isAuthenticated: false
    },

    // DOM references
    viewport: null,

    // Initialize the application
    init() {
        this.viewport = document.getElementById('applicationView');
        this.checkAuthState();
        this.registerServiceWorker();
    },

    // Check if user is already authenticated
    checkAuthState() {
        const savedUser = localStorage.getItem('pwacore_user');
        if (savedUser) {
            try {
                this.state.user = JSON.parse(savedUser);
                this.state.isAuthenticated = true;
                this.showDashboard();
            } catch (e) {
                localStorage.removeItem('pwacore_user');
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    },

    // Register service worker for PWA functionality
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/ServiceWorker.js');
            } catch (error) {
                console.log('Service worker registration failed:', error);
            }
        }
    },

    // Clear the viewport
    clearView() {
        this.viewport.innerHTML = '';
    },

    // Show loading screen
    showLoading(message = 'Loading...') {
        this.clearView();
        this.state.currentView = 'loading';

        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;

        this.viewport.appendChild(loadingScreen);
    },

    // Show login view
    showLogin() {
        this.clearView();
        this.state.currentView = 'login';

        const loginView = document.createElement('div');
        loginView.className = 'login-view';
        loginView.innerHTML = `
            <div class="login-container">
                <h1>pwaCore</h1>
                <p class="subtitle">Progressive Web Application</p>
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required autocomplete="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required autocomplete="current-password">
                    </div>
                    <div id="loginError" class="error-message"></div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        `;

        this.viewport.appendChild(loginView);

        // Attach form handler
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    },

    // Handle login submission
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        errorDiv.textContent = '';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.state.user = data.user;
                this.state.isAuthenticated = true;
                localStorage.setItem('pwacore_user', JSON.stringify(data.user));
                this.showDashboard();
            } else {
                errorDiv.textContent = data.message || 'Login failed';
            }
        } catch (error) {
            errorDiv.textContent = 'Connection error. Please try again.';
        }
    },

    // Show dashboard/main application view
    showDashboard() {
        this.clearView();
        this.state.currentView = 'dashboard';

        const dashboardView = document.createElement('div');
        dashboardView.className = 'dashboard-view';
        dashboardView.innerHTML = `
            <header class="app-header">
                <h1>pwaCore</h1>
                <nav class="app-nav">
                    <span class="user-info">Welcome, ${this.state.user.username}</span>
                    <button id="logoutBtn" class="btn btn-secondary">Logout</button>
                </nav>
            </header>
            <main class="app-main">
                <section class="dashboard-content">
                    <h2>Dashboard</h2>
                    <div class="info-card">
                        <h3>Session Info</h3>
                        <p><strong>User:</strong> ${this.state.user.username}</p>
                        <p><strong>Login Time:</strong> ${new Date(this.state.user.loginTime).toLocaleString()}</p>
                    </div>
                    <div class="info-card">
                        <h3>PWA Status</h3>
                        <p id="pwaStatus">Checking...</p>
                    </div>
                </section>
            </main>
        `;

        this.viewport.appendChild(dashboardView);

        // Attach logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Check PWA status
        this.updatePWAStatus();
    },

    // Update PWA installation status
    updatePWAStatus() {
        const statusEl = document.getElementById('pwaStatus');
        if (!statusEl) return;

        const checks = [];

        if ('serviceWorker' in navigator) {
            checks.push('Service Worker: Supported');
        } else {
            checks.push('Service Worker: Not supported');
        }

        if (window.matchMedia('(display-mode: standalone)').matches) {
            checks.push('Running as: Installed PWA');
        } else {
            checks.push('Running as: Browser tab');
        }

        statusEl.innerHTML = checks.join('<br>');
    },

    // Handle logout
    async handleLogout() {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            // Continue with logout even if API call fails
        }

        // Clear local state
        this.state.user = null;
        this.state.isAuthenticated = false;
        localStorage.removeItem('pwacore_user');

        // Return to login
        this.showLogin();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
