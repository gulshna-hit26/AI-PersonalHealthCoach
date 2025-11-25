# API Documentation

This document describes the services and APIs used in the AI Personal Health Coach application.

## Table of Contents

- [Gemini AI Service](#gemini-ai-service)
- [Step Counter Service](#step-counter-service)
- [LocalStorage API](#localstorage-api)

---

## Gemini AI Service

**File:** `src/services/gemini.js`

The Gemini AI service provides integration with Google's Gemini AI model for personalized health coaching and plan generation.

### Configuration

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

### Functions

#### `isConfigured()`

Checks if the Gemini API key is configured.

**Returns:** `boolean`

**Example:**
```javascript
import { isConfigured } from '../services/gemini';

if (!isConfigured()) {
  console.error("API key not configured");
}
```

---

#### `sendMessage(history, userMessage, userStats)`

Sends a message to the AI coach with conversation history and user stats.

**Parameters:**
- `history` (Array): Array of previous messages
  ```javascript
  [
    { sender: 'user', text: 'How can I improve my sleep?' },
    { sender: 'ai', text: 'Here are some tips...' }
  ]
  ```
- `userMessage` (string): The current user message
- `userStats` (Object): User's current health statistics
  ```javascript
  {
    steps: 8432,
    calories: 1850,
    water: 1.2,
    sleep: "7h 20m"
  }
  ```

**Returns:** `Promise<string>` - AI response text

**Throws:** `Error` if API key is missing

**Example:**
```javascript
import { sendMessage } from '../services/gemini';

const history = [
  { sender: 'user', text: 'Hello' },
  { sender: 'ai', text: 'Hi! How can I help?' }
];

const userStats = {
  steps: 8000,
  calories: 1800,
  water: 2.0,
  sleep: "7h"
};

try {
  const response = await sendMessage(
    history,
    "How can I improve my fitness?",
    userStats
  );
  console.log(response);
} catch (error) {
  console.error("AI error:", error);
}
```

---

#### `generatePlans(userStats)`

Generates personalized workout and diet plans based on user statistics.

**Parameters:**
- `userStats` (Object): User's health statistics
  ```javascript
  {
    steps: 8432,
    calories: 1850,
    water: 1.2,
    sleep: "7h 20m"
  }
  ```

**Returns:** `Promise<Object>` - Generated plans
```javascript
{
  workout: [
    {
      name: "Push-ups",
      meta: "3 sets • Moderate",
      desc: "Keep core tight, chest to floor"
    }
  ],
  diet: [
    {
      name: "Oatmeal & Berries",
      meta: "350 kcal • Breakfast",
      desc: "Rolled oats, blueberries, honey"
    }
  ]
}
```

**Throws:** 
- `Error` if API key is missing
- `Error` if AI response cannot be parsed

**Example:**
```javascript
import { generatePlans } from '../services/gemini';

const userStats = {
  steps: 10000,
  calories: 2000,
  water: 2.5,
  sleep: "8h"
};

try {
  const plans = await generatePlans(userStats);
  console.log("Workout plan:", plans.workout);
  console.log("Diet plan:", plans.diet);
} catch (error) {
  console.error("Failed to generate plans:", error);
}
```

---

## Step Counter Service

**File:** `src/services/stepCounter.js`

The Step Counter service uses the device's accelerometer to count steps in real-time.

### Class: `StepCounter`

#### Constructor

```javascript
const counter = new StepCounter();
```

**Properties:**
- `steps` (number): Current step count
- `isTracking` (boolean): Whether tracking is active
- `threshold` (number): Acceleration threshold (default: 1.3)
- `stepMinInterval` (number): Minimum ms between steps (default: 300)

---

#### `start(onStepCallback)`

Starts step tracking using the device accelerometer.

**Parameters:**
- `onStepCallback` (Function): Callback function called on each step
  ```javascript
  (stepCount) => {
    console.log("Steps:", stepCount);
  }
  ```

**Returns:** `Promise<boolean>` - `true` if started successfully, `false` otherwise

**Example:**
```javascript
import { stepCounter } from '../services/stepCounter';

const success = await stepCounter.start((steps) => {
  console.log(`Steps: ${steps}`);
  updateUI(steps);
});

if (!success) {
  console.error("Failed to start step counter");
}
```

**Notes:**
- Requires device with accelerometer (mobile devices)
- On iOS 13+, requires user permission
- Must be called from user interaction (button click)

---

#### `stop()`

Stops step tracking and removes event listeners.

**Returns:** `void`

**Example:**
```javascript
stepCounter.stop();
console.log("Tracking stopped");
```

---

#### `reset()`

Resets the step count to zero.

**Returns:** `void`

**Example:**
```javascript
stepCounter.reset();
console.log("Steps reset to 0");
```

---

#### `getSteps()`

Gets the current step count.

**Returns:** `number` - Current step count

**Example:**
```javascript
const currentSteps = stepCounter.getSteps();
console.log(`Current steps: ${currentSteps}`);
```

---

#### `setSteps(count)`

Sets the step count to a specific value.

**Parameters:**
- `count` (number): New step count

**Returns:** `void`

**Example:**
```javascript
// Restore from localStorage
const savedSteps = localStorage.getItem('steps');
if (savedSteps) {
  stepCounter.setSteps(parseInt(savedSteps));
}
```

---

### Singleton Instance

A singleton instance is exported for app-wide use:

```javascript
export const stepCounter = new StepCounter();
```

**Usage:**
```javascript
import { stepCounter } from '../services/stepCounter';

// Start tracking
await stepCounter.start((steps) => {
  console.log(steps);
});

// Get current steps
const steps = stepCounter.getSteps();

// Stop tracking
stepCounter.stop();
```

---

## LocalStorage API

The application uses browser localStorage for data persistence.

### Storage Keys

#### Dashboard
- `steps` (string): Saved step count
- `lastCheckIn` (string): ISO date of last check-in

#### Daily Habits
- `dailyHabits` (JSON string): Habit completion data
  ```javascript
  {
    "2024-11-25": {
      "water": true,
      "wakeup": false,
      "sleep": true,
      "reading": true,
      "meditation": false,
      "exercise": true
    }
  }
  ```
- `habitPoints` (string): Total points earned

#### Diet Plan
- `dietProgress` (JSON string): Meal completion data
  ```javascript
  {
    "2024-11-25": {
      "Breakfast": true,
      "Lunch": false,
      "Dinner": true,
      "Snack": false
    }
  }
  ```
- `dietPoints` (string): Total diet points

#### Workout Plan
- `workoutProgress` (JSON string): Exercise completion data
  ```javascript
  {
    "Monday": [true, false, true, true],
    "Tuesday": [false, false, false, false]
  }
  ```
- `workoutPoints` (string): Total workout points

### Helper Functions

#### Save Data
```javascript
// Save object as JSON
localStorage.setItem('key', JSON.stringify(data));

// Save primitive
localStorage.setItem('steps', '8432');
```

#### Load Data
```javascript
// Load JSON object
const data = JSON.parse(localStorage.getItem('key') || '{}');

// Load primitive with default
const steps = parseInt(localStorage.getItem('steps') || '0');
```

#### Clear Data
```javascript
// Clear specific key
localStorage.removeItem('steps');

// Clear all data
localStorage.clear();
```

---

## Error Handling

### Gemini AI Errors

```javascript
try {
  const response = await sendMessage(history, message, stats);
} catch (error) {
  if (error.message.includes("API Key")) {
    // Handle missing API key
    showError("Please configure your API key");
  } else {
    // Handle other errors
    showError("Failed to connect to AI");
  }
}
```

### Step Counter Errors

```javascript
const started = await stepCounter.start(callback);

if (!started) {
  // Handle failure
  if (typeof DeviceMotionEvent === 'undefined') {
    showError("Device motion not supported");
  } else {
    showError("Permission denied or device has no accelerometer");
  }
}
```

### LocalStorage Errors

```javascript
try {
  const data = JSON.parse(localStorage.getItem('key'));
} catch (error) {
  // Handle corrupted data
  console.error("Failed to parse localStorage data");
  localStorage.removeItem('key');
}
```

---

## Rate Limits & Quotas

### Gemini API
- **Free tier**: 60 requests per minute
- **Quota exceeded**: Returns 429 error
- **Recommendation**: Implement request throttling for production

### Device Motion API
- **No rate limits**
- **Battery impact**: Continuous tracking drains battery
- **Recommendation**: Allow users to pause tracking

---

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` file
   - Use environment variables
   - Rotate keys regularly

2. **Data Privacy**
   - All data stored locally
   - No server-side storage
   - Users control their data

3. **Input Validation**
   - Sanitize user inputs before sending to AI
   - Validate localStorage data before parsing

---

## Testing

### Test Gemini AI Service

```javascript
import { isConfigured, sendMessage } from '../services/gemini';

// Test configuration
console.assert(isConfigured(), "API key should be configured");

// Test message sending
const response = await sendMessage([], "Hello", {
  steps: 5000,
  calories: 1500,
  water: 1.0,
  sleep: "7h"
});
console.assert(response.length > 0, "Should receive response");
```

### Test Step Counter

```javascript
import { stepCounter } from '../services/stepCounter';

// Test initialization
console.assert(stepCounter.getSteps() === 0, "Should start at 0");

// Test set/get
stepCounter.setSteps(100);
console.assert(stepCounter.getSteps() === 100, "Should set steps");

// Test reset
stepCounter.reset();
console.assert(stepCounter.getSteps() === 0, "Should reset to 0");
```
