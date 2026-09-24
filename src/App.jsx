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
          <h1>Hassan Fitness Hub</h1>
          <p>Your free fitness journey starts here 💪</p>

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

  return (
    <div className="app">
      <header>
        <h1>Hassan Fitness Hub 💪</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <section className="welcome">
          <h2>Welcome back!</h2>
          <p>{user.email}</p>
        </section>

        <section className="cards">
          <div className="card">
            <h3>🏋️ Workouts</h3>
            <p>Follow free workout routines for strength, fitness and weight management.</p>
            <button>View Workouts</button>
          </div>

          <div className="card">
            <h3>🥗 Nutrition</h3>
            <p>Learn simple healthy eating habits to support your fitness goals.</p>
            <button>Nutrition Guide</button>
          </div>

          <div className="card">
            <h3>📊 Progress</h3>
            <p>Track your workouts and monitor your fitness progress.</p>
            <button>My Progress</button>
          </div>

          <div className="card">
            <h3>🔥 Daily Goal</h3>
            <p>Stay consistent and complete your fitness goal every day.</p>
            <button>Start Today's Goal</button>
          </div>

          <div className="card">
            <h3>👤 Profile</h3>
            <p>Manage your fitness profile and personal information.</p>
            <button>My Profile</button>
          </div>

          <div className="card">
            <h3>❤️ Health Tips</h3>
            <p>Discover useful fitness and healthy-lifestyle tips.</p>
            <button>View Tips</button>
          </div>
        </section>
      </main>
    </div>
  );
    }
      
