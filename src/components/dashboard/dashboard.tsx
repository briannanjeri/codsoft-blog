import React from "react";
import { Auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = Auth.currentUser;

  useEffect(() => {
    console.log("currentUSer", currentUser);

    if (!currentUser) {
      navigate("/sign-in");
    }
  }, []);

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};
