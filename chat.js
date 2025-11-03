// TeleUp Chat - Chat Logic

class TeleUpChat {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('teleup_current_user'));
        this.chats = JSON.parse(localStorage.getItem('teleup_chats')) || [];
        this.currentChat = null;
        
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        this.loadUserInfo();
        this.loadChats();
        this.setupEventListeners();
        
        // Create demo chats if none exist
        if (this.chats.length === 0) {
            this.createDemoChats();
        }
    }

    loadUserInfo() {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.username;
        }
        
        if (userAvatar && this.currentUser) {
            userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
    }

    loadChats() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        chatList.innerHTML = '';

        this.chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item ${this.currentChat?.id === chat.id ? 'active' : ''}`;
            chatItem.innerHTML = `
                <div style="font-weight: bold;">${chat.name}</div>
                <div style="font-size: 12px; color: #666;">${chat.lastMessage || 'Нет сообщений'}</div>
            `;
            
            chatItem.addEventListener('click', () => this.selectChat(chat));
            chatList.appendChild(chatItem);
        });
    }

    createDemoChats() {
        const demoChats = [
            {
                id: '1',
                name: 'Общий чат 🎉',
                type: 'group',
                participants: ['all'],
                lastMessage: 'Добро пожаловать в TeleUp!',
                messages: [
                    {
                        id: '1',
                        text: 'Добро пожаловать в TeleUp Chat! 🚀',
                        sender: 'system',
                        timestamp: new Date().toISOString(),
                        type: 'incoming'
                    }
                ]
            },
            {
                id: '2',
                name: 'Техподдержка 🔧',
                type: 'private',
                participants: ['support'],
                lastMessage: 'Чем можем помочь?',
                messages: [
                    {
                        id: '1',
                        text: 'Добро пожаловать в службу поддержки! Чем можем помочь?',
                        sender: 'support',
                        timestamp: new Date().toISOString(),
                        type: 'incoming'
                    }
                ]
            }
        ];

        this.chats = demoChats;
        this.saveChats();
    }

    selectChat(chat) {
        this.currentChat = chat;
        this.loadChats(); // Re-render to show active chat
        this.loadMessages();
    }

    loadMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer || !this.currentChat) return;

        messagesContainer.innerHTML = '';

        this.currentChat.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.type === 'outgoing' ? 'message-outgoing' : 'message-incoming'}`;
            messageElement.innerHTML = `
                <div>${message.text}</div>
                <div style="font-size: 11px; color: #999; text-align: right; margin-top: 5px;">
                    ${new Date(message.timestamp).toLocaleTimeString()}
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();

        if (!text || !this.currentChat) return;

        const message = {
            id: Date.now().toString(),
            text: text,
            sender: this.currentUser.username,
            timestamp: new Date().toISOString(),
            type: 'outgoing'
        };

        // Add to current chat
        this.currentChat.messages.push(message);
        this.currentChat.lastMessage = text;

        // Update in chats array
        const chatIndex = this.chats.findIndex(chat => chat.id === this.currentChat.id);
        if (chatIndex !== -1) {
            this.chats[chatIndex] = this.currentChat;
        }

        this.saveChats();
        this.loadMessages();
        this.loadChats();

        // Clear input
        messageInput.value = '';

        // Simulate reply in demo
        if (this.currentChat.id === '2') { // Support chat
            setTimeout(() => {
                this.simulateReply();
            }, 1000);
        }
    }

    simulateReply() {
        const replies = [
            'Спасибо за ваше сообщение!',
            'Мы уже работаем над вашим вопросом',
            'Нужна дополнительная информация?',
            'Попробуйте обновить страницу',
            'Скоро свяжемся с вами!'
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMessage = {
            id: Date.now().toString(),
            text: randomReply,
            sender: this.currentChat.name.split(' ')[0],
            timestamp: new Date().toISOString(),
            type: 'incoming'
        };

        this.currentChat.messages.push(replyMessage);
        this.currentChat.lastMessage = randomReply;

        const chatIndex = this.chats.findIndex(chat => chat.id === this.currentChat.id);
        if (chatIndex !== -1) {
            this.chats[chatIndex] = this.currentChat;
        }

        this.saveChats();
        this.loadMessages();
        this.loadChats();
    }

    saveChats() {
        localStorage.setItem('teleup_chats', JSON.stringify(this.chats));
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    logout() {
        localStorage.removeItem('teleup_current_user');
        window.location.href = 'index.html';
    }
}

// Global function for send button
function sendMessage() {
    if (window.teleUpChat) {
        window.teleUpChat.sendMessage();
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.teleUpChat = new TeleUpChat();
});