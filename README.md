# SigmaGPT - AI Chat Assistant 🤖

A modern, feature-rich ChatGPT clone built with React, Node.js, and OpenAI API. Experience the power of AI conversations with a beautiful, responsive interface.

![SigmaGPT](https://img.shields.io/badge/SigmaGPT-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 💬 **Advanced Chat Interface**
- 🎨 Modern ChatGPT-style UI with smooth animations
- ⚡ Real-time typing animation for AI responses
- 📝 Markdown rendering with syntax highlighting
- 💾 Persistent chat history with MongoDB
- 📅 Smart date-based chat grouping (Today, Last 7 days, Last 30 days)

### 🎤 **Voice & Input**
- 🎙️ Voice input with continuous speech recognition
- 🔄 Auto-expanding textarea
- ⌨️ Keyboard shortcuts (Enter to send)
- 📎 File attachment support (coming soon)

### 🔐 **Authentication & Security**
- 🔒 Firebase Authentication (Email & Google OAuth)
- 👤 User profiles with avatars
- 🛡️ Secure environment variable management
- 🔑 Protected API endpoints

### 🎯 **Productivity Features**
- 🔍 Search through chat history
- 📚 Library for saved conversations
- 🧭 Explore pre-built prompts & templates
- ✏️ Edit and regenerate responses
- 📋 One-click code copy
- 👍👎 Message feedback system
- 🔄 Share conversations

## 🖼️ Screenshots

### Chat Interface
Clean, modern design with smooth animations and intuitive controls.

### Voice Input
Speak naturally and watch your words appear in real-time.

### Chat History
Organized by date with smart grouping for easy navigation.

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Firebase** - Authentication & user management
- **ReactMarkdown** - Rich text rendering
- **highlight.js** - Code syntax highlighting
- **Web Speech API** - Voice input

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - Database & ODM
- **OpenAI API** - AI conversation engine
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB database (local or Atlas)
- OpenAI API key
- Firebase project

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SigmaGPT.git
cd SigmaGPT
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create environment file
cp .env.example .env

# Edit .env and add:
# - MONGODB_URI=your_mongodb_connection_string
# - OPENAI_API_KEY=your_openai_api_key
# - PORT=8080
# - NODE_ENV=development

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd fronted
npm install

# Create environment file
cp .env.example .env

# Edit .env and add:
# - VITE_API_URL=http://localhost:8080
# - All Firebase configuration values

# Start development server
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173`

## 🌐 Deployment

### Quick Deploy

**Frontend (Vercel):**
```bash
cd fronted
npm run build
vercel --prod
```

**Backend (Render):**
1. Connect GitHub repository
2. Set root directory to `Backend`
3. Add environment variables
4. Deploy!

📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
SigmaGPT/
├── Backend/
│   ├── models/
│   │   └── Thread.js          # MongoDB schema
│   ├── routes/
│   │   └── chat.js            # API routes
│   ├── utils/
│   │   └── openai.js          # OpenAI integration
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env.example
│
├── fronted/
│   ├── src/
│   │   ├── Chat.jsx           # Message renderer
│   │   ├── ChatWindow.jsx     # Main chat interface
│   │   ├── Sidebar.jsx        # Navigation & history
│   │   ├── MyContext.jsx      # Global state
│   │   ├── AuthContext.jsx    # Auth state
│   │   ├── firebase.js        # Firebase config
│   │   ├── config.js          # API configuration
│   │   └── app.jsx            # Root component
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── README.md
├── DEPLOYMENT.md
├── LICENSE
└── .gitignore
```

## 🎮 Usage

### Starting a Conversation
1. **Sign in** with Email or Google
2. **Type** your message or use voice input 🎤
3. **Press Enter** or click send button
4. Watch the AI respond in real-time ✨

### Voice Input
1. Click the **microphone icon** 🎙️
2. Allow microphone permissions
3. Speak naturally
4. Your speech converts to text automatically

### Managing Chats
- **New Chat**: Click "+" button in sidebar
- **Search**: Use search bar to find past conversations
- **Delete**: Click trash icon on any chat
- **Rename**: (Coming soon)

### Explore Features
Click **Explore** to discover:
- 💡 Creative Writing prompts
- 💻 Coding assistance templates
- 🎓 Learning & educational queries
- 📊 Data analysis examples
- ✍️ Content creation ideas
- 🧠 Brainstorming starters

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## 🛠️ Development

### Run Backend
```bash
cd Backend
npm run dev  # Uses nodemon for auto-restart
```

### Run Frontend
```bash
cd fronted
npm run dev  # Vite dev server with HMR
```

### Build for Production
```bash
cd fronted
npm run build  # Creates optimized dist/ folder
```

## 🌟 Features in Detail

### Chat Features
- ✅ Real-time typing animation
- ✅ Markdown & code syntax highlighting
- ✅ Copy code blocks with one click
- ✅ Edit messages and regenerate
- ✅ Message actions (copy, share, feedback)
- ✅ Smooth scroll behavior

### Sidebar Features
- ✅ Create unlimited new chats
- ✅ Date-based organization
- ✅ Search functionality
- ✅ Library for saved items
- ✅ Explore prompt templates
- ✅ Delete conversations

### Input Features
- ✅ Voice input with Web Speech API
- ✅ Auto-expanding textarea
- ✅ Attach files (coming soon)
- ✅ Enter to send
- ✅ Multi-line support

## 🌐 Browser Support

| Browser | Voice Input | Chat |
|---------|------------|------|
| Chrome | ✅ Full | ✅ |
| Edge | ✅ Full | ✅ |
| Firefox | ⚠️ Limited | ✅ |
| Safari | ⚠️ Limited | ✅ |

**Note:** Voice input works best on Chrome/Edge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for the powerful GPT API
- Firebase for authentication services
- MongoDB for reliable data storage
- React community for amazing tools

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/SigmaGPT/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SigmaGPT/discussions)
- **Email**: your.email@example.com

## 🗺️ Roadmap

- [ ] Image generation support
- [ ] File upload and analysis
- [ ] Custom AI model selection
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Conversation export
- [ ] Advanced search filters
- [ ] Conversation folders

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by SigmaGPT Team

[Demo](https://your-demo-link.com) • [Documentation](https://docs.your-site.com) • [Report Bug](https://github.com/yourusername/SigmaGPT/issues)

</div>
