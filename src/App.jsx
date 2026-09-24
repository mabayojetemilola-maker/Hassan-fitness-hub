import React, { useMemo, useState } from "react";
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
  ["Day 1", "Full Body", "full-body"],
  ["Day 2", "Abs & Core", "abs"],
  ["Day 3", "Chest", "chest"],
  ["Day 4", "Rest", null],
  ["Day 5", "Legs", "legs"],
  ["Day 6", "Arms", "arms"],
  ["Day 7", "Rest", null],
];

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

  const totalExercises = useMemo(
    () =>
      Object.values(workouts).reduce(
        (number, workout) => number + workout.exercises.length,
        0
      ),
    []
  );

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError("");

    try {
      if (authMode === "login") {
        const result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

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
    setSession({
      id,
      index: 0,
    });

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
        {
          id: session.id,
          date: new Date().toISOString(),
        },
      ]);

      setCompleted(next);
      setSession(null);
      setPage("progress");

      return;
    }

    setCompleted(next);

    setSession({
      ...session,
      index: session.index + 1,
    });
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

          <p className="muted">
            Free workouts, plans and progress tracking.
          </p>

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

            {authError && (
              <div className="error-box">
                {authError}
              </div>
            )}

            <button className="primary-btn" type="submit">
              {authMode === "login"
                ? "LOGIN"
                : "CREATE ACCOUNT"}
            </button>
          </form>

          <button
            className="text-btn"
            onClick={() =>
              setAuthMode(
                authMode === "login"
                  ? "signup"
                  : "login"
              )
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

  const selectedWorkout = selectedArea
    ? workouts[selectedArea]
    : null;

  return (
    <div className="app-shell">
      <div className="bg-overlay" />

      <header className="topbar">
        <div>
          <div className="brand">
            HASSAN <span>FITNESS</span>
          </div>

          <div className="tiny">
            YOUR BODY. YOUR DISCIPLINE.
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="content">

        {page === "home" && (
          <>
            <section className="hero-card">
              <div>
                <p className="eyebrow">
                  WELCOME BACK
                </p>

                <h1>
                  Train smarter.
                  <br />
                  <span>Get stronger.</span>
                </h1>

                <p>
                  Choose a focus area and start your
                  workout today.
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    setPage("workouts")
                  }
                >
                  EXPLORE WORKOUTS →
                </button>
              </div>

              <div className="hero-badge">
                🔥
                <br />
                <strong>FREE</strong>
              </div>
            </section>

            <section className="stats-row">
              <div>
                <strong>
                  {completedWorkouts.length}
                </strong>

                <span>Workouts</span>
              </div>

              <div>
                <strong>
                  {completed.length}
                </strong>

                <span>Exercises</span>
              </div>

              <div>
                <strong>
                  {completedWorkouts.length
                    ? "1"
                    : "0"}
                </strong>

                <span>Streak</span>
              </div>
            </section>

            <section className="section-heading">
              <div>
                <p className="eyebrow">
                  START HERE
                </p>

                <h2>
                  Choose your focus area
                </h2>
              </div>
            </section>

            <BodyGrid
              onOpen={openWorkout}
            />
          </>
        )}

        {page === "workouts" && (
          <>
            <section className="page-title">
              <p className="eyebrow">
                WORKOUT LIBRARY
              </p>

              <h1>
                Hit your focus areas
              </h1>

              <p>
                Choose a muscle group and get a
                ready-made workout.
              </p>
            </section>

            <BodyGrid
              onOpen={openWorkout}
            />

            <PlanPreview
              onStart={startWorkout}
            />
          </>
        )}

        {page === "workout" &&
          selectedWorkout && (
            <>
              <button
                className="back-btn"
                onClick={() =>
                  setPage("workouts")
                }
              >
                ← Back
              </button>

              <section className="workout-head">
                <p className="eyebrow">
                  WORKOUT PLAN
                </p>

                <h1>
                  {selectedWorkout.title}
                </h1>

                <p>
                  {selectedWorkout.subtitle}
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    startWorkout(
                      selectedArea
                    )
                  }
                >
                  ▶ START WORKOUT
                </button>
              </section>

              <div className="exercise-list">
                {selectedWorkout.exercises.map(
                  (exercise, index) => (
                    <div
                      className="exercise-item"
                      key={exercise[0]}
                    >
                      <div className="exercise-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="exercise-info">
                        <strong>
                          {exercise[0]}
                        </strong>

                        <span>
                          {exercise[1]} •{" "}
                          {exercise[2]}
                        </span>
                      </div>

                      <span className="exercise-check">
                        ○
                      </span>
                    </div>
                  )
                )}
              </div>

              <section className="pdf-box">
                <div className="pdf-icon">
                  📄
                </div>

                <div>
                  <p className="eyebrow">
                    WORKOUT GUIDE
                  </p>

                  <h3>
                    PDF guide coming here
                  </h3>

                  <p>
                    When you upload the PDF, we
                    will connect it to this workout.
                  </p>
                </div>
              </section>
            </>
          )}

        {page === "session" &&
          session && (
            <section className="session-card">
              <button
                className="back-btn"
                onClick={() => {
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

              <div className="session-count">
                {session.index + 1}
              </div>

              <h1>
                {
                  workouts[session.id]
                    .exercises[session.index][0]
                }
              </h1>

              <div className="session-target">
                {
                  workouts[session.id]
                    .exercises[session.index][1]
                }
              </div>

              <p className="muted">
                Complete this exercise, then tap
                the button below.
              </p>

              <button
                className="primary-btn large-btn"
                onClick={completeExercise}
              >
                {session.index ===
                workouts[session.id].exercises
                  .length -
                  1
                  ? "✓ COMPLETE WORKOUT"
                  : "✓ COMPLETE & NEXT"}
              </button>
            </section>
          )}

        {page === "progress" && (
          <>
            <section className="page-title">
              <p className="eyebrow">
                YOUR REAL ACTIVITY
              </p>

              <h1>
                Progress
              </h1>

              <p>
                For now this demo counts only
                workouts you actually complete inside
                the app. Firebase saving will be added
                next.
              </p>
            </section>

            <div className="progress-grid">
              <div className="progress-card">
                <strong>
                  {completedWorkouts.length}
                </strong>

                <span>
                  Completed workouts
                </span>
              </div>

              <div className="progress-card">
                <strong>
                  {completed.length}
                </strong>

                <span>
                  Exercises this session
                </span>
              </div>

              <div className="progress-card">
                <strong>
                  {Math.round(
                    (completedWorkouts.length /
                      28) *
                      100
                  )}
                  %
                </strong>

                <span>
                  28-day plan
                </span>
              </div>

              <div className="progress-card">
                <strong>
                  {totalExercises}
                </strong>

                <span>
                  Exercises available
                </span>
              </div>
            </div>

            <div className="plan-box">
              <h2>
                28-Day Fitness Plan
              </h2>

              <p>
                Week 1 • Start building consistency
              </p>

              {plan.map(
                ([day, name, id]) => (
                  <div
                    className="plan-row"
                    key={day}
                  >
                    <strong>
                      {day}
                    </strong>

                    <span>
                      {name}
                    </span>

                    {id ? (
                      <button
                        className="mini-btn"
                        onClick={() =>
                          startWorkout(id)
                        }
                      >
                        Start
                      </button>
                    ) : (
                      <span className="rest">
                        REST
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {page === "profile" && (
          <section className="page-title">
            <p className="eyebrow">
              ACCOUNT
            </p>

            <h1>
              Your Profile
            </h1>

            <div className="profile-card">
              <div className="avatar">
                {(user.email || "U")[0].toUpperCase()}
              </div>

              <h2>
                {user.email}
              </h2>

              <p>
                Registration will be upgraded
                with full name, age, username and
                phone number next.
              </p>
            </div>
          </section>
        )}

      </main>

      <nav className="bottom-nav">
        <NavButton
          active={page === "home"}
          icon="⌂"
          label="Home"
          onClick={() => setPage("home")}
        />

        <NavButton
          active={[
            "workouts",
            "workout",
            "session",
          ].includes(page)}
          icon="🏋"
          label="Workouts"
          onClick={() =>
            setPage("workouts")
          }
        />

        <NavButton
          active={page === "progress"}
          icon="📈"
          label="Progress"
          onClick={() =>
            setPage("progress")
          }
        />

        <NavButton
          active={page === "profile"}
          icon="👤"
          label="Profile"
          onClick={() =>
            setPage("profile")
          }
        />
      </nav>
    </div>
  );
}

function BodyGrid({ onOpen }) {
  return (
    <div className="body-grid">
      {bodyAreas.map(
        (area, index) => (
          <button
            className={`body-card ${
              index === 0
                ? "featured"
                : ""
            }`}
            key={area.id}
            onClick={() =>
              onOpen(area.id)
            }
          >
            <div className="body-art">
              {area.icon}
            </div>

            <div className="body-card-text">
              <strong>
                {area.name}
              </strong>

              <span>
                {area.desc}
          ),

    goals: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <h2>🔥 Today's Goals</h2>
        <p className="page-intro">
          Complete your goals and keep your streak alive.
        </p>

        <div className="goal-list">
          <div className="goal">
            <span>🏋️</span>
            <div>
              <h3>Complete a workout</h3>
              <p>20 minutes of exercise</p>
            </div>
            <button>✓</button>
          </div>

          <div className="goal">
            <span>💧</span>
            <div>
              <h3>Drink water</h3>
              <p>Drink 6–8 glasses today</p>
            </div>
            <button>✓</button>
          </div>

          <div className="goal">
            <span>🚶</span>
            <div>
              <h3>Stay active</h3>
              <p>Take a walk or move regularly</p>
            </div>
            <button>✓</button>
          </div>
        </div>
      </section>
    ),

    profile: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <h2>My Profile</h2>
          <p>{user.email}</p>

          <div className="profile-row">
            <span>Account</span>
            <strong>Free Member</strong>
          </div>

          <div className="profile-row">
            <span>Workouts</span>
            <strong>12</strong>
          </div>

          <div className="profile-row">
            <span>Streak</span>
            <strong>7 Days 🔥</strong>
          </div>
        </div>
      </section>
    ),

    tips: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <h2>❤️ Health Tips</h2>
        <p className="page-intro">
          Small healthy habits can make a difference.
        </p>

        <div className="tip-grid">
          <div className="info-card">
            <span>😴</span>
            <h3>Get Enough Sleep</h3>
            <p>
              Give your body enough time to rest and recover.
            </p>
          </div>

          <div className="info-card">
            <span>🚶</span>
            <h3>Keep Moving</h3>
            <p>
              Avoid sitting for very long periods and stay
              active throughout your day.
            </p>
          </div>

          <div className="info-card">
            <span>💧</span>
            <h3>Stay Hydrated</h3>
            <p>
              Drink water regularly throughout the day.
            </p>
          </div>

          <div className="info-card">
            <span>🧘</span>
            <h3>Take Care of Yourself</h3>
            <p>
              Balance exercise, nutrition, recovery and
              healthy daily habits.
            </p>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="brand-icon">💪</div>
          <div>
            <h1>Hassan Fitness Hub</h1>
            <small>FREE FITNESS FOR EVERYONE</small>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <nav className="nav-bar">
        <button
          className={activePage === "home" ? "active" : ""}
          onClick={() => setActivePage("home")}
        >
          🏠 Home
        </button>

        <button
          className={activePage === "workouts" ? "active" : ""}
          onClick={() => setActivePage("workouts")}
        >
          🏋️ Workouts
        </button>

        <button
          className={activePage === "nutrition" ? "active" : ""}
          onClick={() => setActivePage("nutrition")}
        >
          🥗 Nutrition
        </button>

        <button
          className={activePage === "progress" ? "active" : ""}
          onClick={() => setActivePage("progress")}
        >
          📊 Progress
        </button>

        <button
          className={activePage === "profile" ? "active" : ""}
          onClick={() => setActivePage("profile")}
        >
          👤 Profile
        </button>
      </nav>

      <main>
        <section className="welcome">
          <p>WELCOME BACK 👋</p>
          <h2>{user.email}</h2>
        </section>

        {pageContent[activePage]}
      </main>

      <footer>
        <p>© 2026 Hassan Fitness Hub • Free Fitness For Everyone 💚</p>
      </footer>
    </div>
  );
        }
