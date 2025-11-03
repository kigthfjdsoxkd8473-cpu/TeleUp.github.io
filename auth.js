// TeleUp Chat - Authentication Logic

class TeleUpAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('teleup_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('teleup_current_user')) || null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'chat.html';
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            
            // Password strength indicator
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
            }
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };

        // Validation
        if (!this.validateRegistration(userData)) {
            return;
        }

        // Check if user already exists
        if (this.users.find(user => user.email === userData.email)) {
            this.showError('Пользователь с таким email уже существует');
            return;
        }

        if (this.users.find(user => user.username === userData.username)) {
            this.showError('Имя пользователя уже занято');
            return;
        }

        // Save user (in real app, password should be hashed)
        this.users.push({
            ...userData,
            password: btoa(userData.password) // Simple encoding for demo
        });
        localStorage.setItem('teleup_users', JSON.stringify(this.users));

        // Auto-login and redirect
        this.currentUser = userData;
        localStorage.setItem('teleup_current_user', JSON.stringify(this.currentUser));
        
        this.showSuccess('Аккаунт успешно создан!');
        setTimeout(() => {
            window.location.href = 'chat.html';
        }, 1500);
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const login = formData.get('loginEmail');
        const password = formData.get('loginPassword');

        const user = this.users.find(u => 
            (u.email === login || u.username === login) && 
            u.password === btoa(password)
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('teleup_current_user', JSON.stringify(this.currentUser));
            
            this.showSuccess('Вход выполнен!');
            setTimeout(() => {
                window.location.href = 'chat.html';
            }, 1000);
        } else {
            this.showError('Неверный email/username или пароль');
        }
    }

    validateRegistration(userData) {
        // Username validation
        if (userData.username.length < 3) {
            this.showError('Имя пользователя должно содержать минимум 3 символа');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            this.showError('Введите корректный email адрес');
            return false;
        }

        // Password validation
        if (userData.password.length < 6) {
            this.showError('Пароль должен содержать минимум 6 символов');
            return false;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showError('Пароли не совпадают');
            return false;
        }

        return true;
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar) return;

        let strength = 0;
        let text = 'Надежность пароля';
        let className = '';

        if (password.length >= 6) strength += 1;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
        if (password.match(/\d/)) strength += 1;
        if (password.match(/[^a-zA-Z\d]/)) strength += 1;

        switch(strength) {
            case 0:
                className = '';
                text = 'Введите пароль';
                break;
            case 1:
                className = 'strength-weak';
                text = 'Слабый пароль';
                break;
            case 2:
                className = 'strength-medium';
                text = 'Средний пароль';
                break;
            case 3:
            case 4:
                className = 'strength-strong';
                text = 'Сильный пароль';
                break;
        }

        strengthBar.className = `strength-bar ${className}`;
        strengthText.textContent = text;
        strengthText.className = `strength-text ${className}`;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            ${type === 'error' ? 'background: #ff4757;' : 'background: #2ed573;'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('teleup_current_user');
        window.location.href = 'index.html';
    }
}

// Social login functions (mock for demo)
function loginWithGitHub() {
    const auth = new TeleUpAuth();
    auth.showSuccess('GitHub авторизация в демо-режиме');
    // In real app, this would redirect to GitHub OAuth
}

function loginWithGoogle() {
    const auth = new TeleUpAuth();
    auth.showSuccess('Google авторизация в демо-режиме');
    // In real app, this would redirect to Google OAuth
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TeleUpAuth();
});