import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import "./style.css";

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
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
      setError(err.message);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="logo-circle">💪</div>

          <h1>Hassan Fitness Hub</h1>

          <p>
            Your free fitness journey starts here.
            <br />
            Train. Eat. Progress. Repeat.
          </p>

          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email address"
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

            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Free Account"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <button
            className="switch-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  const pageContent = {
    home: (
      <>
        <section className="hero">
          <div>
            <span className="hero-tag">🔥 KEEP MOVING</span>
            <h2>Build a stronger you.</h2>
            <p>
              Stay consistent, follow your goals and become
              the best version of yourself.
            </p>

            <button
              className="hero-button"
              onClick={() => setActivePage("workouts")}
            >
              Start Workout →
            </button>
          </div>

          <div className="hero-emoji">🏋️</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>🔥</span>
            <strong>7</strong>
            <small>Day Streak</small>
          </div>

          <div className="stat-card">
            <span>🏋️</span>
            <strong>12</strong>
            <small>Workouts</small>
          </div>

          <div className="stat-card">
            <span>💧</span>
            <strong>6</strong>
            <small>Glasses Today</small>
          </div>

          <div className="stat-card">
            <span>🎯</span>
            <strong>80%</strong>
            <small>Daily Goal</small>
          </div>
        </section>

        <h2 className="section-title">Your Fitness Hub</h2>

        <section className="cards">
          <div className="card">
            <div className="card-icon">🏋️</div>
            <h3>Workouts</h3>
            <p>
              Find simple workouts for strength, fitness and
              weight management.
            </p>
            <button onClick={() => setActivePage("workouts")}>
              View Workouts
            </button>
          </div>

          <div className="card">
            <div className="card-icon">🥗</div>
            <h3>Nutrition</h3>
            <p>
              Learn healthy eating habits and make better
              food choices.
            </p>
            <button onClick={() => setActivePage("nutrition")}>
              Nutrition Guide
            </button>
          </div>

          <div className="card">
            <div className="card-icon">📊</div>
            <h3>My Progress</h3>
            <p>
              Keep track of your workouts and see how far
              you've come.
            </p>
            <button onClick={() => setActivePage("progress")}>
              View Progress
            </button>
          </div>

          <div className="card">
            <div className="card-icon">🔥</div>
            <h3>Daily Goal</h3>
            <p>
              Complete today's activities and stay consistent
              with your fitness journey.
            </p>
            <button onClick={() => setActivePage("goals")}>
              Today's Goal
            </button>
          </div>

          <div className="card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>
              View your account information and fitness
              profile.
            </p>
            <button onClick={() => setActivePage("profile")}>
              My Profile
            </button>
          </div>

          <div className="card">
            <div className="card-icon">❤️</div>
            <h3>Health Tips</h3>
            <p>
              Discover simple tips for a healthier lifestyle.
            </p>
            <button onClick={() => setActivePage("tips")}>
              View Tips
            </button>
          </div>
        </section>
      </>
    ),

    workouts: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <h2>🏋️ Workouts</h2>
        <p className="page-intro">
          Choose a workout and get moving.
        </p>

        <div className="workout-grid">
          <div className="workout-card">
            <span>💪</span>
            <h3>Full Body Workout</h3>
            <p>20 minutes • Beginner</p>
            <button>Start Workout</button>
          </div>

          <div className="workout-card">
            <span>🔥</span>
            <h3>Fat Burn Workout</h3>
            <p>25 minutes • Intermediate</p>
            <button>Start Workout</button>
          </div>

          <div className="workout-card">
            <span>🦵</span>
            <h3>Leg Workout</h3>
            <p>20 minutes • Beginner</p>
            <button>Start Workout</button>
          </div>

          <div className="workout-card">
            <span>🏃</span>
            <h3>Cardio Workout</h3>
            <p>30 minutes • Intermediate</p>
            <button>Start Workout</button>
          </div>
        </div>
      </section>
    ),

    nutrition: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <h2>🥗 Nutrition Guide</h2>
        <p className="page-intro">
          Simple nutrition habits to support your fitness.
        </p>

        <div className="tip-grid">
          <div className="info-card">
            <span>🥚</span>
            <h3>Eat Protein</h3>
            <p>
              Include protein-rich foods such as eggs, beans,
              fish, chicken and other healthy sources.
            </p>
          </div>

          <div className="info-card">
            <span>🥦</span>
            <h3>Eat Vegetables</h3>
            <p>
              Add different vegetables to your meals for
              important nutrients and fibre.
            </p>
          </div>

          <div className="info-card">
            <span>💧</span>
            <h3>Drink Water</h3>
            <p>
              Keep yourself hydrated throughout the day,
              especially when exercising.
            </p>
          </div>

          <div className="info-card">
            <span>🍎</span>
            <h3>Choose Whole Foods</h3>
            <p>
              Build meals around nutritious foods and limit
              highly processed choices.
            </p>
          </div>
        </div>
      </section>
    ),

    progress: (
      <section className="page-section">
        <button className="back-button" onClick={() => setActivePage("home")}>
          ← Back to Dashboard
        </button>

        <h2>📊 My Progress</h2>
        <p className="page-intro">
          Keep showing up and track your consistency.
        </p>

        <div className="progress-box">
          <h3>This Week</h3>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <strong>80%</strong>
          <p>Daily goal completion</p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>🏋️</span>
            <strong>12</strong>
            <small>Total Workouts</small>
          </div>

          <div className="stat-card">
            <span>🔥</span>
            <strong>7</strong>
            <small>Current Streak</small>
          </div>

          <div className="stat-card">
            <span>⏱️</span>
            <strong>240</strong>
            <small>Minutes Trained</small>
          </div>
        </div>
      </section>
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
