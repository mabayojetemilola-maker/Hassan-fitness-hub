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
    ["Push-ups","4 sets × 12 reps"],["Pike Push-ups","3 sets × 8 reps"],["Diamond Push-ups","3 sets × 8 reps"],["Tricep Dips (chair)","3 sets × 12 reps"],["Superman","3 sets × 12 reps"],["Plank Shoulder Taps
