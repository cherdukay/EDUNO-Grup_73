// ABC Okulları Öğretmen Verileri
const teachers = {
    matematik: [
        {
            id: 1,
            name: 'Ayşe Yılmaz',
            title: 'ABC Okulları Matematik Öğretmeni',
            apiName: 'ayse_mat',
            avatar: 'https://ui-avatars.com/api/?name=Ayşe+Yılmaz&background=3b82f6',
            style: 'motive_edici',
            experience: '15 yıl',
            greetings: [
                'Matematik çalışmaya hazır mısın?',
                'Bugün hangi konuyu çözmek istersin?',
                'Birlikte matematik problemlerini çözelim!'
            ],
            specialties: ['Geometri', 'TYT Matematik', 'AYT Matematik']
        },
        {
            id: 2,
            name: 'Mehmet Demir',
            title: 'ABC Okulları Matematik Öğretmeni',
            apiName: 'mehmet_mat',
            avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir&background=4f46e5',
            style: 'sistematik',
            experience: '12 yıl',
            greetings: [
                'Adım adım ilerleyelim',
                'Temellerden başlayalım',
                'Konuyu detaylıca ele alalım'
            ],
            specialties: ['Fonksiyonlar', 'Türev', 'İntegral']
        }
    ],
    fizik: [
        {
            id: 3,
            name: 'Zeynep Kaya',
            title: 'ABC Okulları Fizik Öğretmeni',
            apiName: 'zeynep_fiz',
            avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=9333ea',
            style: 'uygulamali',
            experience: '10 yıl',
            greetings: [
                'Fizik yasalarını keşfetmeye hazır mısın?',
                'Günlük hayattan örneklerle başlayalım',
                'Deneyle öğrenelim!'
            ],
            specialties: ['Mekanik', 'Elektrik', 'Modern Fizik']
        }
    ],
    kimya: [
        {
            id: 4,
            name: 'Ali Yıldız',
            title: 'ABC Okulları Kimya Öğretmeni',
            apiName: 'ali_kim',
            avatar: 'https://ui-avatars.com/api/?name=Ali+Yıldız&background=059669',
            style: 'interaktif',
            experience: '8 yıl',
            greetings: [
                'Kimya dünyasına hoş geldin!',
                'Moleküllerin dünyasını keşfedelim',
                'Kimyayı sevdirmeye hazırım!'
            ],
            specialties: ['Organik Kimya', 'Asit-Baz', 'Kimyasal Tepkimeler']
        }
    ]
};

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    // Kullanıcı kontrolü
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Kullanıcı bilgilerini göster
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    userName.textContent = user.name;

    // Enter tuşu ile mesaj gönderme
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Çıkış fonksiyonu
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('activeTeacher');
    window.location.href = 'index.html';
}

// Öğretmenleri göster
function showTeachers(subject) {
    const modal = document.getElementById('teachersModal');
    const modalTitle = document.getElementById('modalTitle');
    const teachersList = document.getElementById('teachersList');

    modalTitle.textContent = `ABC Okulları ${subject.charAt(0).toUpperCase() + subject.slice(1)} Öğretmenleri`;
    teachersList.innerHTML = '';

    teachers[subject].forEach(teacher => {
        const teacherCard = document.createElement('div');
        teacherCard.className = 'bg-gray-50 p-4 rounded-lg hover:shadow-md transition duration-300';
        teacherCard.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <img src="${teacher.avatar}" alt="${teacher.name}" class="w-12 h-12 rounded-full mr-4">
                    <div>
                        <h4 class="font-semibold">${teacher.name}</h4>
                        <p class="text-sm text-gray-600">${teacher.experience} deneyim</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${teacher.specialties.map(specialty => 
                                `<span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">${specialty}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <button onclick="startChat('${subject}', ${teacher.id})" 
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    <i class="fas fa-comments mr-2"></i>Sohbet Başlat
                </button>
            </div>
        `;
        teachersList.appendChild(teacherCard);
    });

    modal.classList.remove('hidden');
}

// Modal kapat
function closeModal() {
    document.getElementById('teachersModal').classList.add('hidden');
}

// Chat başlat
function startChat(subject, teacherId) {
    const teacher = teachers[subject].find(t => t.id === teacherId);
    if (!teacher) return;

    const chatModal = document.getElementById('chatModal');
    const teacherAvatar = document.getElementById('teacherAvatar');
    const teacherName = document.getElementById('teacherName');
    const teacherSubject = document.getElementById('teacherSubject');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');

    teacherAvatar.src = teacher.avatar;
    teacherName.textContent = teacher.name;
    teacherSubject.textContent = teacher.title;
    chatMessages.innerHTML = '';
    
    if (messageInput) {
        messageInput.value = '';
        messageInput.focus();
    }

    // Hoşgeldin mesajı
    const greeting = teacher.greetings[Math.floor(Math.random() * teacher.greetings.length)];
    addMessage(true, greeting);

    closeModal();
    chatModal.classList.remove('hidden');

    // Aktif öğretmeni sakla
    localStorage.setItem('activeTeacher', JSON.stringify(teacher));
}

// Chat modal kapat
function closeChatModal() {
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.classList.add('hidden');
        localStorage.removeItem('activeTeacher');
    }
}

// Mesaj gönder
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const message = messageInput.value.trim();
    if (!message) return;

    const teacher = JSON.parse(localStorage.getItem('activeTeacher'));
    if (!teacher) return;

    addMessage(false, message);
    messageInput.value = '';
    messageInput.focus();

    // Loading mesajı göster
    const loadingId = showLoadingMessage();

    try {
        // API isteği
        const response = await fetch('http://127.0.0.1:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teacher: teacher.apiName,
                message: message,
                style: teacher.style
            })
        });

        if (!response.ok) {
            throw new Error('API Hatası');
        }

        const data = await response.json();
        removeLoadingMessage(loadingId);
        
        if (data.response) {
            addMessage(true, data.response);
        }
    } catch (error) {
        console.error('Chat hatası:', error);
        removeLoadingMessage(loadingId);
        addMessage(true, 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Loading mesajı
function showLoadingMessage() {
    const loadingId = 'loading-' + Date.now();
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatMessages) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex items-center space-x-2 text-gray-500';
        loadingDiv.innerHTML = `
            <div class="flex items-center bg-gray-100 rounded-lg p-3">
                <span class="animate-pulse">Yanıt yazılıyor</span>
                <div class="dots-animation ml-2">...</div>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    return loadingId;
}

// Loading mesajını kaldır
function removeLoadingMessage(loadingId) {
    if (loadingId) {
        const element = document.getElementById(loadingId);
        if (element) element.remove();
    }
}

// Mesaj ekle
function addMessage(isTeacher, message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isTeacher ? '' : 'justify-end'} mb-4`;
    
    const teacher = JSON.parse(localStorage.getItem('activeTeacher'));
    
    messageDiv.innerHTML = `
        <div class="max-w-[70%] ${isTeacher ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-3">
            ${isTeacher && teacher ? `
                <div class="flex items-center mb-2">
                    <img src="${teacher.avatar}" alt="${teacher.name}" class="w-6 h-6 rounded-full mr-2">
                    <span class="text-sm font-semibold text-gray-700">${teacher.name}</span>
                </div>
            ` : ''}
            <p class="text-gray-800 whitespace-pre-wrap">${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}