# 🎵 Kooka Sing - Discover Your Voice with Kooka the Kookaburra

> *"Join Kooka the Kookaburra on a magical journey to discover your singing voice!"*

**Kooka Sing** is a delightful, mobile-first singing education app designed to make learning to sing fun, engaging, and accessible for everyone. Through the guidance of our charming mascot Kooka the Kookaburra, users embark on a progressive musical journey that builds confidence, develops vocal skills, and nurtures a love for music.

## 🌟 What Makes Kooka Sing Special?

### 🎯 **Progressive Learning Journey**
- **Skill Tree System**: Navigate through carefully crafted units that unlock progressively
- **Four Lesson Types**: Echo, Practice, Sound, and Song lessons for comprehensive vocal development
- **Age-Appropriate Content**: Tailored experiences for Young Explorers (under 12), Rising Stars (13-17), and Singing Enthusiasts (18+)

### 🎤 **Interactive Learning Experience**
- **Echo Lessons**: Listen and repeat with real-time audio feedback
- **Practice Sessions**: Step-by-step guided exercises with visual aids
- **Sound Exploration**: Discover your vocal range through fun animal sounds and pitch exercises
- **Song Learning**: Build confidence by singing along to familiar tunes

### 🎨 **Charming & Engaging Design**
- **Kooka the Kookaburra**: Your friendly, encouraging guide throughout the journey
- **Beautiful Animations**: Smooth transitions and delightful visual feedback
- **Mobile-First Design**: Optimized for touch devices with responsive layouts
- **Accessibility Focus**: Clear visual hierarchy and intuitive navigation

### 🏆 **Motivation & Progress**
- **Daily Streaks**: Build momentum with streak tracking and gentle reminders
- **Progress Visualization**: See your growth through unit completion bars
- **Achievement System**: Celebrate milestones and unlock new content
- **Local Progress**: Your journey is saved locally for offline access

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Safari, Firefox, Edge)
- Microphone access for interactive lessons
- Mobile device recommended for best experience

### Installation & Development

```bash
# Clone the repository
git clone [your-repo-url]
cd kooka-sing

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture & Technology

### **Frontend Stack**
- **React 19** with TypeScript for robust, type-safe development
- **Vite** for lightning-fast development and optimized builds
- **React Router** for seamless navigation between lessons and skill tree
- **CSS-in-JS** styling with a comprehensive design system

### **Core Features**
- **Audio Processing**: Real-time microphone input with volume detection
- **Local Storage**: Offline-first approach with progress persistence
- **Responsive Design**: Mobile-optimized with touch-friendly interactions
- **Internationalization**: Built-in i18n support for future language expansion

### **Project Structure**
```
src/
├── components/     # Reusable UI components (Button, Card, Progress, etc.)
├── context/        # React context for app state management
├── data/           # Lesson content and unit definitions
├── models/         # TypeScript interfaces and type definitions
├── pages/          # Main application pages
├── services/       # Audio processing and analytics
├── storage/        # LocalStorage utilities and persistence
├── theme/          # Design system, colors, and styling
└── i18n/           # Internationalization support
```

## 🎓 Educational Philosophy

Kooka Sing is built on the belief that everyone has a unique voice waiting to be discovered. Our approach emphasizes:

- **Progressive Skill Building**: Each lesson builds upon previous knowledge
- **Positive Reinforcement**: Encouraging feedback and celebration of progress
- **Accessibility**: Lessons designed for various skill levels and learning styles
- **Fun-First Learning**: Engaging content that makes practice enjoyable
- **Confidence Building**: Safe space to explore and develop vocal abilities

## 📱 Mobile Experience

The app is specifically optimized for mobile devices with:
- Touch-friendly interface elements
- Responsive layouts that adapt to any screen size
- iOS/Android viewport optimization
- App-like experience with install prompts
- Smooth animations and transitions

## 🔧 Development Notes

### **Key Implementation Details**
- **Streak Logic**: Handled in `AppContext.tsx` with daily completion tracking
- **Unit Progress**: Visual progress bars on `SkillTreePage` using the `Progress` component
- **Audio Recording**: Real-time microphone input with configurable volume thresholds
- **Lesson Unlocking**: Prerequisite-based progression system

### **Testing**
```bash
# Run tests
npm test

# Watch mode for development
npm run test:watch
```

### **Code Quality**
- ESLint configuration for consistent code style
- TypeScript for type safety and better developer experience
- Component-based architecture for maintainability

## 🌍 Internationalization

The app is built with internationalization in mind:
- String localization in `src/i18n/`
- Default locale configured in `src/App.tsx`
- Easy to add new languages and cultural adaptations

## 📄 License & Attribution

- **Nursery Rhyme Audio**: Sourced from BabyMozart (nursery_rhymes) for educational, non-commercial purposes
- **Educational Content**: Designed for learning and personal development
- **Open Source**: Built with modern web technologies and best practices

## 🤝 Contributing

We welcome contributions to make Kooka Sing even better! Whether it's:
- Improving lesson content
- Enhancing the user experience
- Adding new features
- Bug fixes and performance improvements

Please feel free to open issues or submit pull requests.

## 🎯 Roadmap

- [ ] Additional lesson types and content
- [ ] Social features and progress sharing
- [ ] Advanced audio analysis and feedback
- [ ] Multi-language support
- [ ] Teacher/parent dashboard
- [ ] Performance analytics and insights

---

**Made with ❤️ for music lovers everywhere**

*Kooka the Kookaburra is here to guide you on your musical journey. Start singing today and discover the joy of your own voice!*
