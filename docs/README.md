# AI Personal Health Coach 🏋️‍♂️

A comprehensive personal health tracking and coaching application powered by Google's Gemini AI. Track your daily habits, manage diet and workout plans, and get personalized health advice through an intelligent AI chatbot.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Dashboard
- **Real-time Step Tracking**: Uses device accelerometer to count steps
- **Health Metrics**: Track steps, calories burned, water intake, and sleep
- **Daily Check-in**: Quick health status updates
- **Visual Statistics**: Beautiful cards displaying your health data

### 📅 Daily Habits Tracker
- Track daily habits like:
  - 💧 Drink 8 glasses of water
  - 🌅 Wake up on time
  - 🌙 Sleep on time
  - 📚 Read for 20 minutes
  - 🧘 Meditate
  - 🏃 Exercise
- **Gamification**: Earn points for completing habits
- **Progress Visualization**: See your daily completion percentage
- **Persistence**: All progress saved to localStorage

### 🍽️ Diet Plan
- **Weekly Meal Planning**: Complete 7-day meal plans
- **Multiple Views**: Daily, Weekly, and Monthly views
- **Meal Tracking**: Track completion of Breakfast, Lunch, Dinner, and Snacks
- **Points System**: 
  - +10 points for completing meals
  - -5 points for skipping meals
- **Progress Tracking**: Visual progress bars and statistics
- **AI-Generated Plans**: Get personalized meal plans from Gemini AI

### 💪 Workout Plan
- **Weekly Workout Schedule**: 7-day workout plans with different focus areas
- **Exercise Tracking**: Track individual exercise completion
- **Detailed Exercise Info**: Sets, reps, and descriptions for each exercise
- **Points System**: Earn points for completing workouts
- **AI-Generated Plans**: Get personalized workout plans based on your stats
- **Progress Visualization**: Track your weekly workout completion

### 🤖 AI Chat Coach
- **Personalized Advice**: Get health advice tailored to your stats
- **Context-Aware**: AI knows your current health metrics
- **Natural Conversations**: Chat naturally about health, diet, and fitness
- **Real-time Responses**: Powered by Google's Gemini 2.5 Flash model

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: Modern UI library with latest features
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **TailwindCSS 3.4.18**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icon set

### AI & Services
- **Google Gemini AI**: Advanced AI model for personalized coaching
- **Device Motion API**: Real-time step counting using accelerometer

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-health-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
ai-health-coach/
├── docs/                      # Documentation files
│   ├── README.md             # This file
│   ├── SETUP.md              # Detailed setup guide
│   ├── API.md                # API documentation
│   ├── COMPONENTS.md         # Component documentation
│   ├── ARCHITECTURE.md       # Architecture overview
│   └── USER_GUIDE.md         # User guide
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable components
│   │   └── Sidebar.jsx       # Navigation sidebar
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── DailyHabits.jsx   # Daily habits tracker
│   │   ├── DietPlan.jsx      # Diet planning and tracking
│   │   ├── WorkoutPlan.jsx   # Workout planning and tracking
│   │   └── AIChat.jsx        # AI chatbot interface
│   ├── services/             # Business logic and APIs
│   │   ├── gemini.js         # Gemini AI integration
│   │   └── stepCounter.js    # Step counting service
│   ├── App.jsx               # Main app component
│   ├── App.css               # App-specific styles
│   ├── index.css             # Global styles
│   └── main.jsx              # App entry point
├── .env                       # Environment variables (create this)
├── .gitignore                # Git ignore rules
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js            # Vite configuration
```

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **[Setup Guide](./SETUP.md)**: Detailed installation and configuration
- **[API Documentation](./API.md)**: Service and API reference
- **[Component Documentation](./COMPONENTS.md)**: Component usage and props
- **[Architecture](./ARCHITECTURE.md)**: System design and architecture
- **[User Guide](./USER_GUIDE.md)**: How to use the application

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent coaching features
- Lucide React for the beautiful icon set
- The React and Vite communities for excellent tools

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for a healthier lifestyle**
