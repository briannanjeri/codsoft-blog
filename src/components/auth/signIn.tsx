import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./style.css";
const SignIn = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const logIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userQuerySnapShot = await getDoc(userDocRef);
      if (userQuerySnapShot.exists()) {
        navigate("/");
        return;
      }
      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
      };
      const newUserDocRef = await setDoc(userDocRef, newUser);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  };

  return (
    <div className="signin-popup-container">
      <div className="popup-title">Access granted upon sign-in</div>
      <button className="signin-button" onClick={logIn}>
        SignIn With Google
      </button>
    </div>
  );
};

export default SignIn;
