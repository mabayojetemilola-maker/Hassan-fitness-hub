import React, { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

const WORKOUTS = [
  {id:"full-body-beginner",name:"Full Body Starter",level:"beginner",duration:25,calories:180,exercises:[
    ["Bodyweight Squats","3 sets × 12 reps"],["Push-ups (knee ok)","3 sets × 8–10 reps"],["Glute Bridges","3 sets × 15 reps"],["Plank","3 × 20–30 sec"],["Walking Lunges","2 sets × 10/leg"],["Superman Hold","3 × 15 sec"]]},
  {id:"upper-strength",name:"Upper Body Strength",level:"intermediate",duration:35,calories:260,exercises:[
    ["Push-ups","4 sets × 12 reps"],["Pike Push-ups","3 sets × 8 reps"],["Diamond Push-ups","3 sets × 8 reps"],["Tricep Dips (chair)","3 sets × 12 reps"],["Superman","3 sets × 12 reps"],["Plank Shoulder Taps","3 × 20 taps"]]},
  {id:"lower-power",name:"Lower Body Power",level:"intermediate",duration:30,calories:240,exercises:[
    ["Jump Squats","4 sets × 10 reps"],["Bulgarian Split Squats","3 sets × 10/leg"],["Single-leg Glute Bridge","3 × 12/leg"],["Calf Raises","4 sets × 20 reps"],["Wall Sit","3 × 40 sec"],["Lateral Lunges","3 × 10/side"]]},
  {id:"hiit-blast",name:"HIIT Fat Burner",level:"advanced",duration:20,calories:280,exercises:[
    ["Burpees","40 sec work / 20 sec rest × 4"],["Mountain Climbers","40 sec work / 20 sec rest × 4"],["High Knees","40 sec work / 20 sec rest × 4"],["Jumping Jacks","40 sec work / 20 sec rest × 4"],["Squat Jumps","40 sec work / 20 sec rest × 4"],["Plank Jacks","40 sec work / 20 sec rest × 4"]]},
  {id:"core-crusher",name:"Core Crusher",level:"intermediate",duration:18,calories:150,exercises:[
    ["Crunches","3 sets × 20 reps"],["Russian Twists","3 sets × 20/side"],["Leg Raises","3 sets × 12 reps"],["Bicycle Crunches","3 sets × 16 reps"],["Side Plank","3 × 25 sec/side"],["Dead Bug","3 sets × 10/side"]]},
  {id:"mobility",name:"Mobility & Stretch",level:"beginner",duration:15,calories:60,exercises:[
    ["Cat-Cow","10 slow reps"],["World’s Greatest Stretch","5/side"],["Hip Flexor Stretch","45 sec/side"],["Hamstring Stretch","45 sec/side"],["Shoulder Circles","20 each direction"],["Child’s Pose","60 sec"]]}
];

const QUOTES = [
  "The only bad workout is the one that didn't happen.","Discipline is choosing between what you want now and what you want most.",
  "Your body can stand almost anything. It’s your mind you have to convince.","Success starts with self-discipline.",
  "Don’t stop when you’re tired. Stop when you’re done.","Progress, not perfection.","Hassan Fitness — built one rep at a time."
];

const emptyState = {name:"Athlete", workoutsCompleted:0,totalMinutes:0,streak:0,lastWorkoutDate:null,weightLog:[],workoutLog:[]};

function AuthScreen() {
  const [mode,setMode]=useState("login"), [email,setEmail]=useState(""), [password,setPassword]=useState(""), [name,setName]=useState("");
  const [busy,setBusy]=useState(false), [error,setError]=useState("");
  const submit=async e=>{
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if(mode==="signup"){
        const cred=await createUserWithEmailAndPassword(auth,email,password);
        if(name.trim()) await updateProfile(cred.user,{displayName:name.trim()});
      } else await signInWithEmailAndPassword(auth,email,password);
    } catch(err){ setError(err.message.replace("Firebase: ","")); } finally {setBusy(false);}
  };
  const google=async()=>{setError("");setBusy(true);try{await signInWithPopup(auth,googleProvider)}catch(err){setError(err.message.replace("Firebase: ",""))}finally{setBusy(false)}};
  return <main className="auth-page"><div className="auth-card">
    <div className="logo auth-logo"><div className="logo-icon">💪</div><span>Hassan Fitness</span></div>
    <h1>{mode==="login"?"Welcome back":"Create your account"}</h1>
    <p className="muted">{mode==="login"?"Log in to keep your fitness progress synced.":"Create an account so your fitness data is saved to your account."}</p>
    {error&&<div className="error">{error}</div>}
    <form onSubmit={submit}>
      {mode==="signup"&&<><label>Your name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Hassan" required/></>}
      <label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/>
      <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength="6" required/>
      <button className="btn btn-primary" disabled={busy}>{busy?"Please wait…":mode==="login"?"Log in":"Create account"}</button>
    </form>
    <div className="or"><span>or</span></div>
    <button className="btn btn-secondary" onClick={google} disabled={busy}>🔵 Continue with Google</button>
    <button className="switch" onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}}>
      {mode==="login"?"New here? Create an account":"Already have an account? Log in"}
    </button>
  </div></main>
}

export default function App(){
  const [user,setUser]=useState(undefined), [state,setState]=useState(emptyState), [page,setPage]=useState("home");
  const [loading,setLoading]=useState(true), [current,setCurrent]=useState(null), [toast,setToast]=useState(""), [timer,setTimer]=useState(0), [running,setRunning]=useState(false);
  const [weight,setWeight]=useState(""), [height,setHeight]=useState(""), [bmiWeight,setBmiWeight]=useState(""), [bmi,setBmi]=useState(null);
  const [name,setName]=useState("");

  useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u); if(u){const snap=await getDoc(doc(db,"users",u.uid)); const data=snap.exists()?snap.data():{}; const merged={...emptyState,...data,name:data.name||u.displayName||"Athlete"}; setState(merged);setName(merged.name)} setLoading(false)}),[]);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>setTimer(t=>t+1),1000);return()=>clearInterval(id)},[running]);
  const save=async next=>{setState(next); if(user) await setDoc(doc(db,"users",user.uid),next,{merge:true})};
  const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2500)};
  const complete=async w=>{const today=new Date().toISOString().slice(0,10);let streak=state.streak;
    if(!state.lastWorkoutDate) streak=1; else {const diff=Math.floor((new Date(today)-new Date(state.lastWorkoutDate))/86400000); if(diff===1)streak++;else if(diff>1)streak=1;}
    const next={...state,streak,lastWorkoutDate:today,workoutsCompleted:state.workoutsCompleted+1,totalMinutes:state.totalMinutes+w.duration,workoutLog:[{name:w.name,date:today,duration:w.duration},...state.workoutLog].slice(0,50)};
    await save(next);setCurrent(null);notify(`Great job! ${w.name} completed 💪`);
  };
  const logWeight=async()=>{const v=parseFloat(weight);if(!v||v<20||v>300)return notify("Enter a valid weight (20–300 kg)");await save({...state,weightLog:[{weight:v,date:new Date().toISOString().slice(0,10)},...state.weightLog].slice(0,60)});setWeight("");notify(`Weight logged: ${v} kg`)};
  const calcBMI=()=>{const h=parseFloat(height),w=parseFloat(bmiWeight);if(!h||!w||h<100||h>250||w<20)return notify("Enter valid height & weight");setBmi(w/((h/100)**2))};
  const bmiCat=useMemo(()=>bmi==null?"":bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese",[bmi]);
  if(loading)return <div className="loading">Loading Hassan Fitness…</div>;
  if(!user)return <AuthScreen/>;

  const saveName=async()=>{const n=name.trim()||"Athlete";await updateProfile(user,{displayName:n});await save({...state,name:n});notify("Profile saved")};
  const logout=()=>signOut(auth);
  const nav=[["home","🏠","Home"],["workouts","🏋️","Workouts"],["timer","⏱️","Timer"],["progress","📈","Progress"],["profile","👤","Profile"]];
  return <div className="app">
    <header className="app-header"><div className="logo"><div className="logo-icon">💪</div><span>Hassan Fitness</span></div><div className="user-chip">{state.name}</div></header>
    <main>
      {page==="home"&&<section className="page"><h2>Dashboard</h2><div className="stats-grid">
        {[["Workouts",state.workoutsCompleted],["Day Streak",state.streak],["Minutes",state.totalMinutes],["Last Weight (kg)",state.weightLog[0]?.weight??"—"]].map(([l,v])=><div className="stat-card" key={l}><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>)}</div>
        <div className="card"><div className="card-title">Today's Motivation</div><p className="quote">"{QUOTES[Math.floor(Math.random()*QUOTES.length)]}"</p></div>
        <button className="btn btn-primary" onClick={()=>setPage("workouts")}>Start a Workout →</button>
      </section>}
      {page==="workouts"&&<section className="page"><h2>Workout Plans</h2>{WORKOUTS.map(w=><button className="workout-card" key={w.id} onClick={()=>setCurrent(w)}>
        <div className="workout-top"><h3>{w.name}</h3><span className={`badge badge-${w.level}`}>{w.level}</span></div>
        <div className="workout-meta">⏱ {w.duration} min　🔥 ~{w.calories} kcal　{w.exercises.length} exercises</div>
      </button>)}</section>}
      {page==="timer"&&<section className="page"><h2>Workout Timer</h2><div className="card"><div className="timer-display">{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</div>
        <div className="timer-controls"><button className="btn btn-primary" onClick={()=>setRunning(!running)}>{running?"Pause":"Start"}</button><button className="btn btn-secondary" onClick={()=>{setRunning(false);setTimer(0)}}>Reset</button></div>
        <div className="preset-row">{[300,600,900,1200,1800].map(s=><button className="btn btn-secondary btn-sm" key={s} onClick={()=>setTimer(s)}>{s/60} min</button>)}</div>
      </div></section>}
      {page==="progress"&&<section className="page"><h2>Progress</h2><div className="card"><div className="card-title">Log Weight</div><label>Weight (kg)</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 75.5"/><button className="btn btn-primary" onClick={logWeight}>Save Weight</button></div>
        <div className="card"><div className="card-title">BMI Calculator</div><label>Height (cm)</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 175"/><label>Weight (kg)</label><input type="number" value={bmiWeight} onChange={e=>setBmiWeight(e.target.value)} placeholder="e.g. 70"/><button className="btn btn-secondary" onClick={calcBMI}>Calculate BMI</button>{bmi!=null&&<div className="bmi-result show"><div className="bmi-value">{bmi.toFixed(1)}</div><div>{bmiCat}</div></div>}</div>
        <div className="card"><div className="card-title">Weight History</div>{state.weightLog.length?state.weightLog.slice(0,15).map((e,i)=><div className="log-entry" key={i}><span>{new Date(e.date).toLocaleDateString()}</span><b>{e.weight} kg</b></div>):<div className="empty">No entries yet.</div>}</div>
        <div className="card"><div className="card-title">Completed Workouts</div>{state.workoutLog.length?state.workoutLog.slice(0,15).map((e,i)=><div className="log-entry" key={i}><span><b>{e.name}</b><br/><small>{new Date(e.date).toLocaleDateString()} · {e.duration} min</small></span><b>✓</b></div>):<div className="empty">No workouts completed yet.</div>}</div>
      </section>}
      {page==="profile"&&<section className="page"><h2>Profile</h2><div className="card"><label>Your Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Hassan"/><button className="btn btn-primary" onClick={saveName}>Save Profile</button></div>
        <div className="card"><div className="card-title">Account</div><p className="muted">{user.email}</p><p className="muted">Your profile and fitness progress are now saved to Firebase and linked to your account.</p></div>
        <button className="btn btn-danger" onClick={logout}>Log out</button>
      </section>}
    </main>
    <nav className="bottom-nav">{nav.map(([id,icon,label])=><button className={`nav-item ${page===id?"active":""}`} key={id} onClick={()=>setPage(id)}><span className="nav-icon">{icon}</span>{label}</button>)}</nav>
    {current&&<div className="overlay show" onClick={e=>e.target===e.currentTarget&&setCurrent(null)}><div className="sheet"><div className="sheet-header"><h2>{current.name}</h2><button className="close-btn" onClick={()=>setCurrent(null)}>×</button></div>{current.exercises.map(([n,d],i)=><div className="exercise-item" key={n}><div className="ex-num">{i+1}</div><div className="ex-info"><div className="ex-name">{n}</div><div className="ex-detail">{d}</div></div></div>)}<button className="btn btn-primary" onClick={()=>complete(current)}>Mark Complete</button></div></div>}
    {toast&&<div className="toast show">{toast}</div>}
  </div>
}