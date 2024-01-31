import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { Auth } from "../../firebaseConfig";
import "./style.css";
export const Navbar = () => {
  const [user, loading] = useAuthState(Auth);
  return (
    <div className="navbar">
      {user && (
        <ul className="navbar-list">
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/blog-creation-page" className="navbar-link">
              create-blog
            </Link>
          </li>
          <li>
            <Link
              to="/sign-in"
              onClick={() => Auth.signOut()}
              className="navbar-link"
            >
              log out
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};
