import React, { useState, useEffect } from 'react';
import { generatePlans } from '../services/gemini';
import { Dumbbell, Loader, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_WORKOUTS = {
    Monday: {
        focus: 'Chest & Triceps',
        exercises: [
            { name: 'Push-ups', sets: '3', reps: '12-15', desc: 'Keep core tight, chest to floor' },
            { name: 'Dumbbell Bench Press', sets: '3', reps: '10-12', desc: 'Control the weight down' },
            { name: 'Tricep Dips', sets: '3', reps: '12-15', desc: 'Use a chair or bench' },
            { name: 'Plank', sets: '3', reps: '45s', desc: 'Hold position, don\'t sag hips' }
        ]
    },
    Tuesday: {
        focus: 'Back & Biceps',
        exercises: [
            { name: 'Pull-ups (or Rows)', sets: '3', reps: '8-10', desc: 'Full range of motion' },
            { name: 'Dumbbell Rows', sets: '3', reps: '10-12', desc: 'Keep back flat' },
            { name: 'Bicep Curls', sets: '3', reps: '12-15', desc: 'Squeeze at the top' },
            { name: 'Superman', sets: '3', reps: '15', desc: 'Lift arms and legs simultaneously' }
        ]
    },
    Wednesday: {
        focus: 'Active Recovery',
        exercises: [
            { name: 'Light Jog/Walk', sets: '1', reps: '30m', desc: 'Keep heart rate moderate' },
            { name: 'Stretching Routine', sets: '1', reps: '15m', desc: 'Focus on tight areas' },
            { name: 'Yoga Flow', sets: '1', reps: '20m', desc: 'Basic sun salutations' }
        ]
    },
    Thursday: {
        focus: 'Legs & Shoulders',
        exercises: [
            { name: 'Squats', sets: '4', reps: '12-15', desc: 'Knees behind toes' },
            { name: 'Lunges', sets: '3', reps: '10/leg', desc: 'Keep torso upright' },
            { name: 'Shoulder Press', sets: '3', reps: '10-12', desc: 'Press straight up' },
            { name: 'Calf Raises', sets: '3', reps: '20', desc: 'Full extension' }
        ]
    },
    Friday: {
        focus: 'Full Body HIIT',
        exercises: [
            { name: 'Burpees', sets: '3', reps: '15', desc: 'Explosive movement' },
            { name: 'Mountain Climbers', sets: '3', reps: '40s', desc: 'Keep hips low' },
            { name: 'Jump Squats', sets: '3', reps: '15', desc: 'Soft landing' },
            { name: 'Russian Twists', sets: '3', reps: '20/side', desc: 'Feet off ground if possible' }
        ]
    },
    Saturday: {
        focus: 'Cardio & Core',
        exercises: [
            { name: 'Running/Cycling', sets: '1', reps: '45m', desc: 'Steady state cardio' },
            { name: 'Crunches', sets: '3', reps: '20', desc: 'Engage core' },
            { name: 'Leg Raises', sets: '3', reps: '15', desc: 'Control the descent' },
            { name: 'Bicycle Crunches', sets: '3', reps: '20/side', desc: 'Elbow to opposite knee' }
        ]
    },
    Sunday: {
        focus: 'Rest Day',
        exercises: [
            { name: 'Rest', sets: '1', reps: '0', desc: 'Take a break, you earned it!' },
            { name: 'Light Walk', sets: '1', reps: '20m', desc: 'Optional active recovery' }
        ]
    }
};

const WorkoutPlan = () => {
    const [workouts, setWorkouts] = useState(DEFAULT_WORKOUTS);
    const [isLoading, setIsLoading] = useState(false);
    const [completedExercises, setCompletedExercises] = useState({});
    const [points, setPoints] = useState(0);
    const [expandedDays, setExpandedDays] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('weeklyWorkoutCompletion');
        if (saved) {
            const data = JSON.parse(saved);
            setCompletedExercises(data.completed || {});
            setPoints(data.points || 0);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem('weeklyWorkoutCompletion', JSON.stringify({
            completed: completedExercises,
            points: points
        }));
    }, [completedExercises, points, isLoaded]);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        try {
            // In a real app, we would pass user stats/goals here
            const userStats = {
                steps: 8432,
                calories: 1850,
                water: 1.2,
                sleep: "7h 20m"
            };
            const plans = await generatePlans(userStats);
            if (plans && plans.workout) {
                // For now, just show success - could parse AI response to update workouts
                alert("AI workout plan generated! (Using default plan for now)");
            }
        } catch (error) {
            console.error("Failed to generate plan:", error);
            alert("Failed to generate new plan. Please check your API key or try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExercise = (day, exerciseIndex) => {
        const key = `${day}-${exerciseIndex}`;
        const wasCompleted = completedExercises[key];

        setCompletedExercises(prev => ({
            ...prev,
            [key]: !wasCompleted
        }));

        setPoints(prev => prev + (wasCompleted ? -10 : 10));
    };

    const toggleDay = (day) => {
        setExpandedDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
    };

    const resetProgress = () => {
        if (confirm('Reset all workout progress? This will clear all checkmarks and reset points to 0.')) {
            setCompletedExercises({});
            setPoints(0);
        }
    };

    const calculateProgress = () => {
        let total = 0;
        let completed = 0;

        DAYS.forEach(day => {
            const dayExercises = workouts[day]?.exercises || [];
            total += dayExercises.length;
            dayExercises.forEach((_, idx) => {
                if (completedExercises[`${day}-${idx}`]) completed++;
            });
        });

        return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    const progress = calculateProgress();

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        Workout Plan <Dumbbell className="w-8 h-8 text-primary" />
                    </h2>
                    <p className="text-gray-400">Track your workouts and build strength!</p>
                </div>
                <button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" /> Generate AI Plan
                        </>
                    )}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Total Points</h3>
                    <div className="text-4xl font-bold text-primary">{points}</div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Exercises Completed</h3>
                    <div className="text-4xl font-bold text-white">{progress.completed}/{progress.total}</div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Weekly Progress</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-secondary h-full transition-all duration-500"
                                style={{ width: `${progress.percent}%` }}
                            ></div
                            >
                        </div>
                        <span className="text-2xl font-bold text-white">{progress.percent}%</span>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={resetProgress}
                    className="text-sm text-gray-400 hover:text-white underline"
                >
                    Reset Progress
                </button>
            </div>

            <div className="space-y-4">
                {DAYS.map((day) => {
                    const dayPlan = workouts[day];
                    const isExpanded = expandedDays[day];
                    const dayExercises = dayPlan.exercises || [];
                    const completedCount = dayExercises.filter((_, idx) => completedExercises[`${day}-${idx}`]).length;

                    return (
                        <div key={day} className="glass-card overflow-hidden">
                            <button
                                onClick={() => toggleDay(day)}
                                className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-white">{day}</h3>
                                        <span className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {dayPlan.focus}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 text-left">
                                        {completedCount}/{dayExercises.length} exercises completed
                                    </p>
                                </div>
                                <span className="text-white">
                                    {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="p-6 pt-0 border-t border-white/10">
                                    <div className="space-y-3 mt-4">
                                        {dayExercises.map((exercise, idx) => {
                                            const key = `${day}-${idx}`;
                                            const isCompleted = completedExercises[key];

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleExercise(day, idx)}
                                                    className={`p-4 rounded-xl flex items-start gap-4 transition-all cursor-pointer ${isCompleted
                                                        ? 'bg-secondary/20 border border-secondary/30'
                                                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted || false}
                                                        onChange={() => toggleExercise(day, idx)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="mt-1 w-5 h-5 cursor-pointer accent-secondary"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className={`font-bold ${isCompleted ? 'line-through text-gray-500' : 'text-white'
                                                                }`}>
                                                                {exercise.name}
                                                            </h4>
                                                            <div className="text-xs text-right text-gray-400">
                                                                <div>{exercise.sets} sets</div>
                                                                <div>{exercise.reps} reps</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-400">{exercise.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkoutPlan;
