// Particles.js Konfigürasyonu
particlesJS('particles-js',
{
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
});

// Form elementlerini seç
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.login-button');

// Input animasyonları
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('input-focused');
    });
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('input-focused');
        }
    });
});

// Enter tuşu ile giriş
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && (document.activeElement === emailInput || document.activeElement === passwordInput)) {
        login();
    }
});

// Kullanıcı giriş fonksiyonu
function login() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Basit validasyon
    if (!email || !password) {
        showError('Lütfen tüm alanları doldurunuz.');
        return;
    }

    // Email formatı kontrolü
    if (!isValidEmail(email)) {
        showError('Lütfen geçerli bir e-posta adresi giriniz.');
        return;
    }

    // Demo giriş kontrolü
    if (email === 'demo@eduno.com' && password === 'demo123') {
        // Login başarılı animasyonu
        loginButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Giriş Yapılıyor...';
        loginButton.disabled = true;

        // Local storage'a kullanıcı bilgilerini kaydet
        localStorage.setItem('user', JSON.stringify({
            email: email,
            isLoggedIn: true,
            name: 'Demo Kullanıcı'
        }));

        // Dashboard'a yönlendir
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showError('Geçersiz kullanıcı bilgileri. Demo giriş için:\nE-posta: demo@eduno.com\nŞifre: demo123');
    }
}

// Hata mesajı göster
function showError(message) {
    // Mevcut hata mesajını temizle
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Yeni hata mesajı oluştur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-2';
    errorDiv.textContent = message;

    // Form'un altına ekle
    const form = document.querySelector('form');
    form.appendChild(errorDiv);

    // 3 saniye sonra hata mesajını kaldır
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Email formatı kontrolü
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    // Kullanıcı oturum kontrolü
    try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const user = JSON.parse(userDataString);
            if (user && typeof user === 'object' && user.isLoggedIn === true) {
                window.location.href = 'dashboard.html';
                return;
            }
        }
    } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        localStorage.removeItem('user'); // Hatalı veriyi temizle
    }

    // Sosyal medya butonlarını devre dışı bırak (demo için)
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            showError('Sosyal medya girişi şu anda demo versiyonunda aktif değildir.');
        });
    });

    // Partikül efektini başlat
    if (typeof particlesJS !== 'undefined') {
        console.log('Particles.js başlatıldı');
    } else {
        console.error('Particles.js yüklenemedi');
    }
});