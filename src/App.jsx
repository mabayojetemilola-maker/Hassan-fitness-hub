import React, { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";

const bodyAreas = [
  { id: "full-body", name: "Full Body", icon: "🏋️", desc: "Complete body workout" },
  { id: "abs", name: "Abs & Core", icon: "🔥", desc: "Build a stronger core" },
  { id: "chest", name: "Chest", icon: "🟥", desc: "Chest strength & muscle" },
  { id: "arms", name: "Arms", icon: "💪", desc: "Biceps & triceps" },
  { id: "legs", name: "Legs", icon: "🦵", desc: "Powerful lower body" },
  { id: "back", name: "Back", icon: "🔙", desc: "Build your back" },
  { id: "shoulders", name: "Shoulders", icon: "🏋️‍♂️", desc: "Strong shoulders" },
  { id: "glutes", name: "Glutes", icon: "🍑", desc: "Glutes & hips" },
];

const workouts = {
  "full-body": {
    title: "Full Body",
    subtitle: "Beginner • Home • No Equipment",
    exercises: [
      ["Jumping Jacks", "30 sec", "3 rounds"],
      ["Bodyweight Squats", "15 reps", "3 rounds"],
      ["Push-ups", "10 reps", "3 rounds"],
      ["Mountain Climbers", "30 sec", "3 rounds"],
      ["Reverse Lunges", "10 each leg", "3 rounds"],
      ["Plank", "30 sec", "3 rounds"],
      ["Burpees", "8 reps", "3 rounds"],
    ],
  },
  abs: {
    title: "Abs & Core",
    subtitle: "Core • Beginner • Home",
    exercises: [
      ["Crunches", "15 reps", "3 rounds"],
      ["Leg Raises", "10 reps", "3 rounds"],
      ["Bicycle Crunches", "20 reps", "3 rounds"],
      ["Mountain Climbers", "30 sec", "3 rounds"],
      ["Russian Twists", "20 reps", "3 rounds"],
      ["Plank", "30 sec", "3 rounds"],
    ],
  },
  chest: {
    title: "Chest",
    subtitle: "Chest • Beginner • No Equipment",
    exercises: [
      ["Push-ups", "10 reps", "3 rounds"],
      ["Wide Push-ups", "10 reps", "3 rounds"],
      ["Incline Push-ups", "12 reps", "3 rounds"],
      ["Diamond Push-ups", "8 reps", "3 rounds"],
      ["Slow Push-ups", "8 reps", "3 rounds"],
    ],
  },
  arms: {
    title: "Arms",
    subtitle: "Biceps & Triceps • Home",
    exercises: [
      ["Diamond Push-ups", "8 reps", "3 rounds"],
      ["Tricep Dips", "12 reps", "3 rounds"],
      ["Backpack Bicep Curls", "12 reps", "3 rounds"],
      ["Hammer Curls", "12 reps", "3 rounds"],
      ["Close-Grip Push-ups", "10 reps", "3 rounds"],
    ],
  },
  legs: {
    title: "Legs",
    subtitle: "Lower Body • Beginner",
    exercises: [
      ["Bodyweight Squats", "15 reps", "3 rounds"],
      ["Reverse Lunges", "10 each leg", "3 rounds"],
      ["Bulgarian Split Squats", "8 each leg", "3 rounds"],
      ["Calf Raises", "20 reps", "3 rounds"],
      ["Jump Squats", "10 reps", "3 rounds"],
      ["Wall Sit", "30 sec", "3 rounds"],
    ],
  },
  back: {
    title: "Back",
    subtitle: "Back • Home • Beginner",
    exercises: [
      ["Superman", "12 reps", "3 rounds"],
      ["Reverse Snow Angels", "12 reps", "3 rounds"],
      ["Backpack Rows", "12 reps", "3 rounds"],
      ["Bird Dog", "10 each side", "3 rounds"],
      ["Prone Y Raises", "10 reps", "3 rounds"],
    ],
  },
  shoulders: {
    title: "Shoulders",
    subtitle: "Shoulders • Home",
    exercises: [
      ["Pike Push-ups", "8 reps", "3 rounds"],
      ["Shoulder Taps", "20 reps", "3 rounds"],
      ["Lateral Raises", "12 reps", "3 rounds"],
      ["Front Raises", "12 reps", "3 rounds"],
      ["Overhead Press", "12 reps", "3 rounds"],
    ],
  },
  glutes: {
    title: "Glutes",
    subtitle: "Glutes & Hips • Home",
    exercises: [
      ["Glute Bridges", "15 reps", "3 rounds"],
      ["Hip Thrusts", "12 reps", "3 rounds"],
      ["Donkey Kicks", "12 each leg", "3 rounds"],
      ["Fire Hydrants", "12 each side", "3 rounds"],
      ["Bulgarian Split Squats", "8 each leg", "3 rounds"],
    ],
  },
};

const plan = [
  // WEEK 1
  ["Day 1", "Full Body", "full-body"],
  ["Day 2", "Abs & Core", "abs"],
  ["Day 3", "Chest", "chest"],
  ["Day 4", "Rest", null],
  ["Day 5", "Legs", "legs"],
  ["Day 6", "Arms", "arms"],
  ["Day 7", "Rest", null],

  // WEEK 2
  ["Day 8", "Back", "back"],
  ["Day 9", "Glutes", "glutes"],
  ["Day 10", "Full Body", "full-body"],
  ["Day 11", "Rest", null],
  ["Day 12", "Abs & Core", "abs"],
  ["Day 13", "Chest", "chest"],
  ["Day 14", "Rest", null],

  // WEEK 3
  ["Day 15", "Legs", "legs"],
  ["Day 16", "Arms", "arms"],
  ["Day 17", "Back", "back"],
  ["Day 18", "Rest", null],
  ["Day 19", "Glutes", "glutes"],
  ["Day 20", "Full Body", "full-body"],
  ["Day 21", "Rest", null],

  // WEEK 4
  ["Day 22", "Abs & Core", "abs"],
  ["Day 23", "Chest", "chest"],
  ["Day 24", "Legs", "legs"],
  ["Day 25", "Rest", null],
  ["Day 26", "Arms", "arms"],
  ["Day 27", "Full Body", "full-body"],
  ["Day 28", "Final Full Body Challenge", "full-body"],
];

const QUICK_AI_PROMPTS = [
  "Give me a 20-minute home workout with no equipment.",
  "What should I eat before and after a workout?",
  "How can I build muscle at home?",
  "How can I lose belly fat safely?",
];

function getTimerSeconds(target) {
  const match = String(target || "").match(/(\d+)\s*(?:sec|seconds)/i);
  return match ? Number(match[1]) : 30;
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [page, setPage] = useState("home");
  const [selectedArea, setSelectedArea] = useState(null);
  const [session, setSession] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [customTimer, setCustomTimer] = useState(30);

  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Hassan Fitness AI Coach. Ask me about workouts, exercises, nutrition, recovery, fat loss, muscle building, stretching, or fitness planning.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const totalExercises = useMemo(
    () =>
      Object.values(workouts).reduce(
        (number, workout) => number + workout.exercises.length,
        0
      ),
    []
  );

  function resetTimer(seconds = 30) {
    const safe = Math.max(5, Math.round(seconds));
    setCustomTimer(safe);
    setTimerSeconds(safe);
    setTimerTotalSeconds(safe);
    setTimerRunning(false);
    setTimerFinished(false);
  }

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setTimerRunning(false);
          setTimerFinished(true);

          try {
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([250, 120, 250]);
            }
          } catch {}

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    if (!session) return;

    const exercise = workouts[session.id]?.exercises[session.index];
    if (!exercise) return;

    const seconds = getTimerSeconds(exercise[1]);
    resetTimer(seconds);
    setTimerRunning(true);
  }, [session]);

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError("");

    try {
      if (authMode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      }
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setPage("home");
  }

  function openWorkout(id) {
    setSelectedArea(id);
    setPage("workout");
  }

  function startWorkout(id) {
    setSession({ id, index: 0 });
    setCompleted([]);
    setSelectedArea(id);
    setPage("session");
  }

  function completeExercise() {
    if (!session) return;

    const workout = workouts[session.id];
    const next = [...completed, session.index];

    if (session.index >= workout.exercises.length - 1) {
      setCompletedWorkouts((old) => [
        ...old,
        { id: session.id, date: new Date().toISOString() },
      ]);
      setCompleted(next);
      setSession(null);
      setPage("progress");
      resetTimer(30);
      return;
    }

    setCompleted(next);
    setSession({ ...session, index: session.index + 1 });
  }

  function applyPreset(seconds) {
    setCustomTimer(seconds);
    setTimerSeconds(seconds);
    setTimerFinished(false);
  }

  function toggleTimer() {
    if (timerSeconds <= 0) {
      setTimerSeconds(customTimer);
      setTimerFinished(false);
    }
    setTimerRunning((running) => !running);
  }

  function resetCurrentTimer() {
    resetTimer(customTimer);
  }

  async function sendAiMessage(text = aiInput) {
    const message = String(text || "").trim();
    if (!message || aiLoading) return;

    const nextMessages = [...aiMessages, { role: "user", content: message }];
    setAiMessages(nextMessages);
    setAiInput("");
    setAiError("");
    setAiLoading(true);

    try {
      const response = await fetch("/api/fitness-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
          userEmail: user?.email || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "The AI coach could not respond right now.");
      }

      setAiMessages((old) => [
        ...old,
        {
          role: "assistant",
          content: data.answer || "I couldn't generate an answer.",
        },
      ]);
    } catch (error) {
      setAiError(error.message || "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="app-shell auth-shell">
        <div className="bg-overlay" />
        <div className="auth-card">
          <div className="logo-mark">HF</div>
          <p className="eyebrow">HASSAN FITNESS HUB</p>
          <h1>
            Build your body.
            <br />
            Build your discipline.
          </h1>
          <p className="muted">Free workouts, plans and progress tracking.</p>

          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Gmail / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {authError && <div className="error-box">{authError}</div>}
            <button className="primary-btn" type="submit">
              {authMode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </button>
          </form>

          <button
            className="text-btn"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            {authMode === "login"
              ? "New here? Create an account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  const selectedWorkout = selectedArea ? workouts[selectedArea] : null;
  const currentExercise = session
    ? workouts[session.id]?.exercises[session.index]
    : null;

  return (
    <div className="app-shell">
      <div className="bg-overlay" />

      <header className="topbar">
        <div>
          <div className="brand">
            HASSAN <span>FITNESS</span>
          </div>
          <div className="tiny">YOUR BODY. YOUR DISCIPLINE.</div>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="content">
        {page === "home" && (
          <>
            <section className="hero-card">
              <div>
                <p className="eyebrow">WELCOME BACK</p>
                <h1>
                  Train smarter.
                  <br />
                  <span>Get stronger.</span>
                </h1>
                <p>Choose a focus area, start a timed workout, or ask the AI coach.</p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => setPage("workouts")}>
                    EXPLORE WORKOUTS →
                  </button>
                  <button className="secondary-btn" onClick={() => setPage("ai")}>
                    🤖 ASK AI COACH
                  </button>
                </div>
              </div>
              <div className="hero-badge">
                🔥
                <br />
                <strong>FREE</strong>
              </div>
            </section>

            <section className="stats-row">
              <div>
                <strong>{completedWorkouts.length}</strong>
                <span>Workouts</span>
              </div>
              <div>
                <strong>{completed.length}</strong>
                <span>Exercises</span>
              </div>
              <div>
                <strong>{completedWorkouts.length ? "1" : "0"}</strong>
                <span>Streak</span>
              </div>
            </section>

            <section className="section-heading">
              <div>
                <p className="eyebrow">START HERE</p>
                <h2>Choose your focus area</h2>
              </div>
            </section>

            <BodyGrid onOpen={openWorkout} />

            <section className="ai-preview">
              <div>
                <p className="eyebrow">AI FITNESS COACH</p>
                <h2>Have a fitness question?</h2>
                <p className="muted">Ask your AI coach about training, food, recovery and more.</p>
              </div>
              <button className="secondary-btn" onClick={() => setPage("ai")}>
                OPEN AI COACH →
              </button>
            </section>
          </>
        )}

        {page === "workouts" && (
          <>
            <section className="page-title">
              <p className="eyebrow">WORKOUT LIBRARY</p>
              <h1>Hit your focus areas</h1>
              <p>Choose a muscle group and get a ready-made workout.</p>
            </section>

            <BodyGrid onOpen={openWorkout} />
            <PlanPreview onStart={startWorkout} />
          </>
        )}

        {page === "workout" && selectedWorkout && (
          <>
            <button className="back-btn" onClick={() => setPage("workouts")}>
              ← Back
            </button>

            <section className="workout-head">
              <p className="eyebrow">WORKOUT PLAN</p>
              <h1>{selectedWorkout.title}</h1>
              <p>{selectedWorkout.subtitle}</p>
              <button
                className="primary-btn"
                onClick={() => startWorkout(selectedArea)}
              >
                ▶ START WORKOUT TIMER
              </button>
            </section>

            <div className="exercise-list">
              {selectedWorkout.exercises.map((exercise, index) => (
                <div className="exercise-item" key={exercise[0]}>
                  <div className="exercise-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="exercise-info">
                    <strong>{exercise[0]}</strong>
                    <span>
                      {exercise[1]} • {exercise[2]}
                    </span>
                  </div>
                  <span className="exercise-check">○</span>
                </div>
              ))}
            </div>

            <section className="pdf-box">
              <div className="pdf-icon">📄</div>
              <div>
                <p className="eyebrow">WORKOUT GUIDE</p>
                <h3>PDF guide coming here</h3>
                <p>
                  When you upload the PDF, we will connect it to this workout.
                </p>
              </div>
            </section>
          </>
        )}

        {page === "session" && session && currentExercise && (
          <section className="session-card">
            <button
              className="back-btn"
              onClick={() => {
                setTimerRunning(false);
                setSession(null);
                setPage("workout");
              }}
            >
              ← Exit workout
            </button>

            <p className="eyebrow">
              EXERCISE {session.index + 1} OF{" "}
              {workouts[session.id].exercises.length}
            </p>

            <div
              className={`timer-ring ${timerRunning ? "running" : ""} ${timerFinished ? "finished" : ""}`}
              style={{ "--progress": `${Math.max(0, Math.min(1, timerSeconds / Math.max(1, timerTotalSeconds)))}` }}
            >
              <div className="timer-inner">
                <strong>{formatTime(timerSeconds)}</strong>
                <span>{timerFinished ? "TIME'S UP" : timerRunning ? "WORK" : "PAUSED"}</span>
              </div>
            </div>

            <h1>{currentExercise[0]}</h1>

            <div className="session-target">
              Target: {currentExercise[1]}
            </div>

            <p className="muted">
              The workout uses a real countdown timer. For rep-based exercises,
              the default work timer is 30 seconds.
            </p>

            <div className="timer-controls">
              <button className="secondary-btn" onClick={toggleTimer}>
                {timerRunning ? "⏸ PAUSE" : timerSeconds <= 0 ? "▶ START" : "▶ RESUME"}
              </button>
              <button className="ghost-btn" onClick={resetCurrentTimer}>
                ↻ RESET
              </button>
            </div>

            <div className="preset-row">
              <span>Quick timer:</span>
              {[30, 45, 60, 90].map((seconds) => (
                <button
                  key={seconds}
                  className={`preset-btn ${customTimer === seconds ? "selected" : ""}`}
                  onClick={() => applyPreset(seconds)}
                >
                  {seconds}s
                </button>
              ))}
            </div>

            <button className="primary-btn large-btn" onClick={completeExercise}>
              {session.index === workouts[session.id].exercises.length - 1
                ? "✓ COMPLETE WORKOUT"
                : "✓ COMPLETE & NEXT"}
            </button>
          </section>
        )}

        {page === "ai" && (
          <section className="ai-page">
            <div className="page-title">
              <p className="eyebrow">HASSAN FITNESS AI</p>
              <h1>AI Fitness Coach</h1>
              <p>Ask questions about workouts, exercises, nutrition, recovery and fitness planning.</p>
            </div>

            <div className="quick-prompts">
              {QUICK_AI_PRO
