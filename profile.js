// TeleUp Chat - Profile Logic

class TeleUpProfile {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('teleup_current_user'));
        
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        this.loadProfileInfo();
    }

    loadProfileInfo() {
        const profileAvatar = document.getElementById('profileAvatar');
        const profileUsername = document.getElementById('profileUsername');
        const profileEmail = document.getElementById('profileEmail');
        const profileDate = document.getElementById('profileDate');

        if (profileAvatar && this.currentUser) {
            profileAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }

        if (profileUsername && this.currentUser) {
            profileUsername.textContent = this.currentUser.username;
        }

        if (profileEmail && this.currentUser) {
            profileEmail.textContent = this.currentUser.email;
        }

        if (profileDate && this.currentUser.createdAt) {
            profileDate.textContent = new Date(this.currentUser.createdAt).toLocaleDateString('ru-RU');
        }
    }
}

// Profile functions
function editProfile() {
    alert('Функция редактирования профиля в разработке');
}

function changePassword() {
    alert('Функция смены пароля в разработке');
}

function showSettings() {
    alert('Настройки будут доступны в следующем обновлении');
}

function logout() {
    localStorage.removeItem('teleup_current_user');
    window.location.href = 'index.html';
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TeleUpProfile();
});