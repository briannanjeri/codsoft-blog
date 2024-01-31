import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Auth, app, db } from "../../firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import "./style.css";
const SignIn = () => {
  const [SignedInUser, setSignedInUser] = useState<User>();

  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  //   if (loading) {
  //     return <div>loading...</div>;
  //   }

  const logIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userQuerySnapShot = await getDoc(userDocRef);
      if (userQuerySnapShot.exists()) {
        navigate("/");
        console.log("user exists");
        return;
      }
      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
      };
      const newUserDocRef = await setDoc(userDocRef, newUser);
      navigate("/");

      console.log("newuserdofref", newUserDocRef);
      console.log("user added to firestore with Id", newUserDocRef);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
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
