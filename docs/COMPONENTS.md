# Component Documentation

This document provides detailed information about all components and pages in the AI Personal Health Coach application.

## Table of Contents

- [Components](#components)
  - [Sidebar](#sidebar)
- [Pages](#pages)
  - [Dashboard](#dashboard)
  - [Daily Habits](#daily-habits)
  - [Diet Plan](#diet-plan)
  - [Workout Plan](#workout-plan)
  - [AI Chat](#ai-chat)

---

## Components

### Sidebar

**File:** `src/components/Sidebar.jsx`

Navigation sidebar component that provides app-wide navigation.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeTab` | string | Yes | Currently active tab identifier |
| `setActiveTab` | function | Yes | Function to change active tab |

#### Tab Values

- `'dashboard'` - Dashboard page
- `'habits'` - Daily Habits page
- `'chat'` - AI Chat page
- `'diet'` - Diet Plan page
- `'workout'` - Workout Plan page
- `'settings'` - Settings page (coming soon)

#### Usage

```jsx
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Main content */}
    </div>
  );
}
```

#### Features

- Fixed position sidebar
- Icon-based navigation with labels
- Active state highlighting
- Responsive design

---

## Pages

### Dashboard

**File:** `src/pages/Dashboard.jsx`

Main dashboard displaying health metrics and step tracking.

#### Features

1. **Step Tracking**
   - Real-time step counting using accelerometer
   - Start/Stop/Reset controls
   - Persistence to localStorage

2. **Health Metrics Display**
   - Steps count
   - Calories burned (calculated from steps)
   - Water intake
   - Sleep duration

3. **Daily Check-in**
   - Quick health status update
   - Visual feedback on completion

#### State Management

```javascript
const [steps, setSteps] = useState(0);
const [isTracking, setIsTracking] = useState(false);
const [hasCheckedIn, setHasCheckedIn] = useState(false);
const [trackingError, setTrackingError] = useState(null);
```

#### Key Functions

##### `handleStartTracking()`

Starts the step counter and updates UI.

```javascript
const handleStartTracking = async () => {
  const success = await stepCounter.start((newSteps) => {
    setSteps(newSteps);
    localStorage.setItem('steps', newSteps.toString());
  });
  
  if (success) {
    setIsTracking(true);
    setTrackingError(null);
  } else {
    setTrackingError("Failed to start tracking");
  }
};
```

##### `handleStopTracking()`

Stops the step counter.

```javascript
const handleStopTracking = () => {
  stepCounter.stop();
  setIsTracking(false);
};
```

##### `handleResetSteps()`

Resets step count to zero.

```javascript
const handleResetSteps = () => {
  stepCounter.reset();
  setSteps(0);
  localStorage.setItem('steps', '0');
};
```

##### `handleCheckIn()`

Records daily check-in.

```javascript
const handleCheckIn = () => {
  setHasCheckedIn(true);
  localStorage.setItem('lastCheckIn', new Date().toISOString());
};
```

#### Sub-Components

##### `StatCard`

Displays a single health metric.

**Props:**
- `title` (string): Metric name
- `value` (string|number): Metric value
- `unit` (string): Unit of measurement
- `icon` (ReactNode): Icon component
- `color` (string): Theme color

**Usage:**
```jsx
<StatCard
  title="Steps"
  value={steps}
  unit="steps"
  icon={<Footprints />}
  color="primary"
/>
```

---

### Daily Habits

**File:** `src/pages/DailyHabits.jsx`

Track and gamify daily health habits.

#### Default Habits

```javascript
const DEFAULT_HABITS = [
  { id: 'water', name: 'Drink 8 glasses of water', points: 15 },
  { id: 'wakeup', name: 'Wake up on time', points: 10 },
  { id: 'sleep', name: 'Sleep on time', points: 15 },
  { id: 'meditation', name: 'Meditate for 10 minutes', points: 10 },
  { id: 'exercise', name: 'Exercise for 30 minutes', points: 20 },
  { id: 'reading', name: 'Read for 20 minutes', points: 10 }
];
```

#### State Management

```javascript
const [completedHabits, setCompletedHabits] = useState({});
const [totalPoints, setTotalPoints] = useState(0);
const [showConfetti, setShowConfetti] = useState(false);
```

#### Key Functions

##### `getTodayKey()`

Gets today's date as a storage key.

```javascript
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0]; // "2024-11-25"
};
```

##### `toggleHabit(habitId, habitPoints)`

Toggles habit completion and updates points.

```javascript
const toggleHabit = (habitId, habitPoints) => {
  const todayKey = getTodayKey();
  const isCompleted = completedHabits[todayKey]?.[habitId];
  
  const updated = {
    ...completedHabits,
    [todayKey]: {
      ...completedHabits[todayKey],
      [habitId]: !isCompleted
    }
  };
  
  setCompletedHabits(updated);
  localStorage.setItem('dailyHabits', JSON.stringify(updated));
  
  // Update points
  const newPoints = isCompleted 
    ? totalPoints - habitPoints 
    : totalPoints + habitPoints;
  setTotalPoints(newPoints);
  localStorage.setItem('habitPoints', newPoints.toString());
};
```

##### `calculateProgress()`

Calculates daily completion percentage.

```javascript
const calculateProgress = () => {
  const todayKey = getTodayKey();
  const todayHabits = completedHabits[todayKey] || {};
  const completed = Object.values(todayHabits).filter(Boolean).length;
  return Math.round((completed / DEFAULT_HABITS.length) * 100);
};
```

#### Features

- Daily habit tracking with checkboxes
- Points-based gamification
- Progress visualization
- Confetti animation on 100% completion
- localStorage persistence
- Daily reset functionality

---

### Diet Plan

**File:** `src/pages/DietPlan.jsx`

Weekly diet planning and meal tracking with multiple view modes.

#### View Modes

1. **Daily View** - Today's meals
2. **Weekly View** - Full week overview
3. **Monthly View** - Calendar view with daily summaries

#### Meal Types

```javascript
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
```

#### State Management

```javascript
const [viewMode, setViewMode] = useState('daily');
const [mealProgress, setMealProgress] = useState({});
const [totalPoints, setTotalPoints] = useState(0);
const [expandedDays, setExpandedDays] = useState({});
```

#### Key Functions

##### `toggleMeal(dateKey, mealType)`

Toggles meal completion and updates points.

```javascript
const toggleMeal = (dateKey, mealType) => {
  const isCompleted = mealProgress[dateKey]?.[mealType];
  
  const updated = {
    ...mealProgress,
    [dateKey]: {
      ...mealProgress[dateKey],
      [mealType]: !isCompleted
    }
  };
  
  setMealProgress(updated);
  localStorage.setItem('dietProgress', JSON.stringify(updated));
  
  // +10 for completion, -5 for skipping
  const pointChange = isCompleted ? -10 : 10;
  const newPoints = totalPoints + pointChange;
  setTotalPoints(newPoints);
  localStorage.setItem('dietPoints', newPoints.toString());
};
```

##### `calculateProgress()`

Calculates completion statistics.

```javascript
const calculateProgress = () => {
  const totalMeals = Object.values(mealProgress).reduce((sum, day) => {
    return sum + Object.keys(day).length;
  }, 0);
  
  const completedMeals = Object.values(mealProgress).reduce((sum, day) => {
    return sum + Object.values(day).filter(Boolean).length;
  }, 0);
  
  return {
    total: totalMeals,
    completed: completedMeals,
    percentage: totalMeals > 0 
      ? Math.round((completedMeals / totalMeals) * 100) 
      : 0
  };
};
```

#### Default Meal Plan

Includes complete 7-day meal plan with:
- Meal name
- Calorie count
- Ingredient description

Example:
```javascript
Monday: {
  Breakfast: { 
    name: 'Oatmeal & Berries', 
    calories: '350 kcal', 
    desc: 'Rolled oats, blueberries, honey' 
  },
  // ... other meals
}
```

---

### Workout Plan

**File:** `src/pages/WorkoutPlan.jsx`

Weekly workout planning and exercise tracking.

#### State Management

```javascript
const [workoutPlan, setWorkoutPlan] = useState(DEFAULT_WORKOUTS);
const [completedExercises, setCompletedExercises] = useState({});
const [totalPoints, setTotalPoints] = useState(0);
const [isGenerating, setIsGenerating] = useState(false);
const [expandedDays, setExpandedDays] = useState({});
```

#### Key Functions

##### `handleGeneratePlan()`

Generates AI-powered workout plan.

```javascript
const handleGeneratePlan = async () => {
  setIsGenerating(true);
  try {
    const userStats = {
      steps: 8000,
      calories: 1800,
      water: 2.0,
      sleep: "7h"
    };
    
    const plans = await generatePlans(userStats);
    
    if (plans.workout) {
      // Transform AI response to workout format
      const aiWorkout = {
        Monday: {
          focus: 'AI Generated',
          exercises: plans.workout
        }
      };
      setWorkoutPlan(aiWorkout);
    }
  } catch (error) {
    console.error("Failed to generate plan:", error);
  } finally {
    setIsGenerating(false);
  }
};
```

##### `toggleExercise(day, exerciseIndex)`

Toggles exercise completion.

```javascript
const toggleExercise = (day, exerciseIndex) => {
  const dayExercises = completedExercises[day] || [];
  const updated = [...dayExercises];
  updated[exerciseIndex] = !updated[exerciseIndex];
  
  const newCompleted = {
    ...completedExercises,
    [day]: updated
  };
  
  setCompletedExercises(newCompleted);
  localStorage.setItem('workoutProgress', JSON.stringify(newCompleted));
  
  // Update points
  const pointChange = updated[exerciseIndex] ? 5 : -5;
  const newPoints = totalPoints + pointChange;
  setTotalPoints(newPoints);
  localStorage.setItem('workoutPoints', newPoints.toString());
};
```

#### Default Workout Plan

7-day workout plan with different focus areas:
- Monday: Chest & Triceps
- Tuesday: Back & Biceps
- Wednesday: Cardio & Core
- Thursday: Legs & Shoulders
- Friday: Full Body
- Saturday: Core & Flexibility
- Sunday: Rest Day

Each exercise includes:
- Name
- Sets
- Reps
- Description/form tips

---

### AI Chat

**File:** `src/pages/AIChat.jsx`

Conversational AI health coach interface.

#### State Management

```javascript
const [messages, setMessages] = useState([
  { 
    id: 1, 
    sender: 'ai', 
    text: 'Hello! I am your personal health coach.' 
  }
]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

#### Key Functions

##### `handleSend()`

Sends message to AI and handles response.

```javascript
const handleSend = async () => {
  if (!input.trim()) return;
  
  if (!isConfigured()) {
    // Show configuration error
    return;
  }
  
  // Add user message
  const userMsg = { id: Date.now(), sender: 'user', text: input };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setIsLoading(true);
  
  try {
    const userStats = {
      steps: 8432,
      calories: 1850,
      water: 1.2,
      sleep: "7h 20m"
    };
    
    const history = messages.filter(m => m.id !== 1);
    const responseText = await sendMessage(history, input, userStats);
    
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: responseText
    };
    setMessages(prev => [...prev, aiMsg]);
  } catch (error) {
    // Show error message
  } finally {
    setIsLoading(false);
  }
};
```

#### Features

- Real-time chat interface
- Message history
- Loading indicators
- Auto-scroll to latest message
- Context-aware responses (includes user stats)
- Error handling for missing API key

---

## Common Patterns

### LocalStorage Persistence

All pages use similar localStorage patterns:

```javascript
// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('key');
  if (saved) {
    setState(JSON.parse(saved));
  }
}, []);

// Save on change
useEffect(() => {
  localStorage.setItem('key', JSON.stringify(state));
}, [state]);
```

### Points System

Consistent points calculation:

```javascript
// Award points
const newPoints = totalPoints + pointValue;

// Deduct points
const newPoints = totalPoints - pointValue;

// Save
setTotalPoints(newPoints);
localStorage.setItem('points', newPoints.toString());
```

### Toggle Patterns

All completion toggles follow similar pattern:

```javascript
const toggle = (id) => {
  const isCompleted = state[id];
  const updated = { ...state, [id]: !isCompleted };
  setState(updated);
  localStorage.setItem('key', JSON.stringify(updated));
  updatePoints(isCompleted ? -points : +points);
};
```

---

## Styling

All components use TailwindCSS utility classes:

### Common Classes

- `glass-card`: Glassmorphism effect
- `btn-primary`: Primary button style
- `text-primary`: Primary color text
- `bg-darker`: Dark background
- `bg-dark`: Slightly lighter dark background

### Custom CSS

Defined in `src/index.css` and `src/App.css`:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ... */
}
```
