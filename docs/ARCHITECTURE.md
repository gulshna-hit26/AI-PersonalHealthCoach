# Architecture Documentation

This document describes the architecture and design decisions of the AI Personal Health Coach application.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Storage Strategy](#storage-strategy)
- [AI Integration](#ai-integration)
- [Design Decisions](#design-decisions)

---

## System Overview

### Technology Stack

```
┌─────────────────────────────────────────┐
│           User Interface                │
│         (React 19.2.0)                  │
│    TailwindCSS + Lucide Icons           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Application Layer                │
│     - Pages (Dashboard, etc.)           │
│     - Components (Sidebar)              │
│     - State Management (useState)       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Service Layer                   │
│   - Gemini AI Service                   │
│   - Step Counter Service                │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ Google       │    │ Browser      │
│ Gemini AI    │    │ APIs         │
│              │    │ - localStorage│
│              │    │ - DeviceMotion│
└──────────────┘    └──────────────┘
```

### Core Components

1. **UI Layer** - React components and pages
2. **Service Layer** - Business logic and external integrations
3. **Storage Layer** - Browser localStorage for persistence
4. **External APIs** - Gemini AI and Device Motion API

---

## Architecture Patterns

### Component-Based Architecture

The application follows a component-based architecture:

```
App (Root)
├── Sidebar (Navigation)
└── Pages (Routed Content)
    ├── Dashboard
    ├── DailyHabits
    ├── DietPlan
    ├── WorkoutPlan
    └── AIChat
```

**Benefits:**
- Modular and maintainable
- Reusable components
- Clear separation of concerns
- Easy to test individual components

### Service-Oriented Design

Services encapsulate external integrations:

```javascript
// Gemini AI Service
export const sendMessage = async (history, message, stats) => { ... }
export const generatePlans = async (stats) => { ... }

// Step Counter Service
export const stepCounter = new StepCounter();
```

**Benefits:**
- Centralized API logic
- Easy to mock for testing
- Single source of truth for external integrations
- Simplified component code

### Single Page Application (SPA)

Client-side routing using state management:

```javascript
const [activeTab, setActiveTab] = useState('dashboard');

const renderContent = () => {
  switch (activeTab) {
    case 'dashboard': return <Dashboard />;
    case 'habits': return <DailyHabits />;
    // ...
  }
};
```

**Benefits:**
- Fast navigation (no page reloads)
- Smooth user experience
- Reduced server load
- Works offline (except AI features)

---

## Data Flow

### Unidirectional Data Flow

```
User Action → Event Handler → State Update → Re-render → UI Update
```

Example: Completing a habit

```javascript
// 1. User clicks habit card
onClick={() => toggleHabit(habit.id, habit.points)}

// 2. Event handler updates state
const toggleHabit = (id, points) => {
  setCompletedHabits(updated);
  setTotalPoints(newPoints);
}

// 3. State change triggers re-render
// 4. UI updates to show completion
```

### Data Flow Diagram

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Event Handler │
└──────┬───────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Update State │  │ Update       │
│ (React)      │  │ localStorage │
└──────┬───────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│  Re-render   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  UI Update   │
└──────────────┘
```

---

## State Management

### Local State (useState)

Each page manages its own state:

```javascript
// Dashboard
const [steps, setSteps] = useState(0);
const [isTracking, setIsTracking] = useState(false);

// DailyHabits
const [completedHabits, setCompletedHabits] = useState({});
const [totalPoints, setTotalPoints] = useState(0);
```

**Why not global state?**
- Pages are independent
- No shared state between pages
- Simpler architecture
- Easier to understand and maintain

### State Persistence

State is persisted to localStorage:

```javascript
// Save on change
useEffect(() => {
  localStorage.setItem('key', JSON.stringify(state));
}, [state]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('key');
  if (saved) setState(JSON.parse(saved));
}, []);
```

**Benefits:**
- Survives page refreshes
- Works offline
- No backend required
- Fast access

---

## Storage Strategy

### LocalStorage Schema

```javascript
// Dashboard
localStorage.steps = "8432"
localStorage.lastCheckIn = "2024-11-25T10:30:00.000Z"

// Daily Habits
localStorage.dailyHabits = {
  "2024-11-25": {
    "water": true,
    "wakeup": false,
    "sleep": true
  }
}
localStorage.habitPoints = "45"

// Diet Plan
localStorage.dietProgress = {
  "2024-11-25": {
    "Breakfast": true,
    "Lunch": false
  }
}
localStorage.dietPoints = "120"

// Workout Plan
localStorage.workoutProgress = {
  "Monday": [true, false, true],
  "Tuesday": [false, false, false]
}
localStorage.workoutPoints = "85"
```

### Data Structure Design

**Date Keys:** ISO format strings
```javascript
const dateKey = new Date().toISOString().split('T')[0]; // "2024-11-25"
```

**Nested Objects:** For complex data
```javascript
{
  "2024-11-25": {
    "Breakfast": true,
    "Lunch": false
  }
}
```

**Arrays:** For ordered data
```javascript
{
  "Monday": [true, false, true, true] // Exercise completion
}
```

---

## AI Integration

### Gemini AI Architecture

```
┌─────────────────┐
│  React Component│
│  (AIChat,       │
│   WorkoutPlan)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini Service  │
│ (gemini.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Google          │
│ Generative AI   │
│ SDK             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini API      │
│ (Cloud)         │
└─────────────────┘
```

### Context Management

AI receives user context:

```javascript
const systemContext = `
  You are an expert Personal Health Coach AI.
  
  User's Current Stats:
  - Steps: ${userStats.steps}
  - Calories: ${userStats.calories}
  - Water: ${userStats.water}L
  - Sleep: ${userStats.sleep}
`;
```

**Benefits:**
- Personalized responses
- Context-aware advice
- Better recommendations

### Conversation History

Chat maintains conversation history:

```javascript
const chat = model.startChat({
  history: [
    { role: "user", parts: [{ text: systemContext }] },
    { role: "model", parts: [{ text: "Understood..." }] },
    ...previousMessages
  ]
});
```

**Benefits:**
- Coherent conversations
- AI remembers context
- Natural dialogue flow

---

## Design Decisions

### Why React?

**Chosen:** React 19.2.0

**Reasons:**
- Component-based architecture
- Large ecosystem
- Excellent performance
- Hooks for state management
- Wide community support

**Alternatives considered:**
- Vue.js - Less ecosystem
- Svelte - Smaller community
- Vanilla JS - Too complex for this scale

### Why Vite?

**Chosen:** Vite 7.2.4

**Reasons:**
- Lightning-fast HMR
- Modern build tool
- Excellent DX
- ES modules support
- Optimized production builds

**Alternatives considered:**
- Create React App - Slower, deprecated
- Webpack - More complex configuration
- Parcel - Less control

### Why TailwindCSS?

**Chosen:** TailwindCSS 3.4.18

**Reasons:**
- Utility-first approach
- Rapid development
- Consistent design system
- Small production bundle
- Easy customization

**Alternatives considered:**
- CSS Modules - More boilerplate
- Styled Components - Runtime overhead
- Plain CSS - Harder to maintain

### Why LocalStorage?

**Chosen:** Browser localStorage

**Reasons:**
- No backend required
- Fast access
- Works offline
- Simple API
- Sufficient for use case

**Alternatives considered:**
- IndexedDB - Overkill for simple data
- Backend database - Adds complexity
- Cookies - Size limitations

### Why Gemini AI?

**Chosen:** Google Gemini 2.5 Flash

**Reasons:**
- Fast responses
- High quality output
- Multimodal capabilities
- Good free tier
- Easy integration

**Alternatives considered:**
- OpenAI GPT - More expensive
- Claude - Limited free tier
- Local LLM - Performance issues

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Each page is a separate component
   - Lazy loading possible in future

2. **Memoization**
   - Can add React.memo for expensive components
   - useMemo for expensive calculations

3. **LocalStorage Efficiency**
   - Only save when data changes
   - Use useEffect dependencies correctly

4. **AI Request Optimization**
   - Debounce user input
   - Show loading states
   - Handle errors gracefully

### Bundle Size

Current production build:
- React + React DOM: ~140KB
- TailwindCSS (purged): ~10KB
- Gemini AI SDK: ~50KB
- Application code: ~30KB
- **Total: ~230KB** (gzipped)

---

## Security Considerations

### API Key Protection

```javascript
// ✅ Correct - Environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ❌ Wrong - Hardcoded
const API_KEY = "AIza...";
```

### Data Privacy

- All user data stored locally
- No server-side storage
- No analytics or tracking
- User controls their data

### Input Sanitization

```javascript
// Validate user input before AI
if (!input.trim()) return;

// Handle AI errors gracefully
try {
  const response = await sendMessage(...);
} catch (error) {
  // Show user-friendly error
}
```

---

## Scalability

### Current Limitations

1. **LocalStorage Size** - ~5-10MB limit
2. **No Multi-Device Sync** - Data is device-specific
3. **No Collaboration** - Single user only

### Future Enhancements

1. **Backend Integration**
   - User authentication
   - Cloud data storage
   - Multi-device sync

2. **Database Migration**
   - Move from localStorage to backend
   - Maintain backward compatibility

3. **Real-time Features**
   - WebSocket for live updates
   - Collaborative features

---

## Testing Strategy

### Unit Testing (Future)

```javascript
// Test services
test('stepCounter increments correctly', () => {
  stepCounter.setSteps(100);
  expect(stepCounter.getSteps()).toBe(100);
});

// Test components
test('Dashboard renders correctly', () => {
  render(<Dashboard />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### Integration Testing (Future)

```javascript
// Test AI integration
test('AI chat sends and receives messages', async () => {
  const response = await sendMessage([], "Hello", stats);
  expect(response).toBeTruthy();
});
```

---

## Deployment

### Build Process

```bash
npm run build
```

Output: `dist/` folder with optimized assets

### Hosting Options

1. **Static Hosting**
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages

2. **Requirements**
   - HTTPS (for Device Motion API)
   - Environment variable support (for API key)

---

## Conclusion

The AI Personal Health Coach uses a modern, scalable architecture with:
- Component-based React UI
- Service-oriented business logic
- LocalStorage for persistence
- AI integration for personalization

This architecture provides a solid foundation for future enhancements while maintaining simplicity and performance.
