# Setup Guide

This guide will walk you through setting up the AI Personal Health Coach application from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Node.js** (v16.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git** (optional, for cloning)
   - Download from [git-scm.com](https://git-scm.com/)

### Required API Keys

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key (keep it secure!)

## Installation Steps

### 1. Get the Code

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd ai-health-coach
```

**Option B: Download ZIP**
- Download and extract the project ZIP file
- Navigate to the extracted folder

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React and React DOM
- Vite (build tool)
- TailwindCSS (styling)
- Google Generative AI SDK
- Lucide React (icons)
- Development dependencies (ESLint, PostCSS, etc.)

**Expected Output:**
```
added 200+ packages in 30s
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# On Windows
type nul > .env

# On macOS/Linux
touch .env
```

Add your Gemini API key to the `.env` file:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important Notes:**
- Replace `your_actual_api_key_here` with your actual API key
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`

### 4. Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port 5173 already in use

**Solution:**
```bash
# Kill the process using the port
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <process_id> /F

# On macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

Or specify a different port:
```bash
npm run dev -- --port 3000
```

#### 3. API Key not working

**Symptoms:**
- AI Chat shows "Please configure your VITE_GEMINI_API_KEY"
- Generate Plans button doesn't work

**Solution:**
1. Verify `.env` file exists in root directory
2. Check the API key format: `VITE_GEMINI_API_KEY=AIza...`
3. Restart the dev server after changing `.env`
4. Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 4. Step counter not working

**Symptoms:**
- Step count stays at 0
- "Start Tracking" button shows error

**Causes:**
- Device doesn't have accelerometer (desktop browsers)
- Permission denied for motion sensors
- Using HTTP instead of HTTPS (required for iOS)

**Solution:**
- Test on a mobile device
- Grant motion sensor permissions when prompted
- Use HTTPS in production

#### 5. Build errors with TailwindCSS

**Solution:**
```bash
# Regenerate Tailwind config
npx tailwindcss init -p
```

### Browser Compatibility

**Recommended Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features requiring specific support:**
- Step Counter: Requires Device Motion API (mobile devices)
- AI Chat: Requires modern JavaScript (ES6+)

### Performance Tips

1. **Enable React DevTools** for debugging
   - Install React DevTools browser extension

2. **Clear localStorage** if experiencing issues
   ```javascript
   // In browser console
   localStorage.clear()
   ```

3. **Check browser console** for errors
   - Press F12 to open DevTools
   - Look for red error messages

## Next Steps

Once the application is running:

1. **Explore the Dashboard** - View your health metrics
2. **Set up Daily Habits** - Configure your daily goals
3. **Try the AI Chat** - Ask health-related questions
4. **Create Diet Plan** - Generate or customize meal plans
5. **Create Workout Plan** - Get personalized exercise routines

For more information, see:
- [User Guide](./USER_GUIDE.md) - How to use the application
- [API Documentation](./API.md) - Service and API reference
- [Component Documentation](./COMPONENTS.md) - Component details

## Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](link-to-issues)
2. Review the [FAQ](link-to-faq)
3. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Browser and OS version
   - Screenshots if applicable
