import React from "react";
import SignIn from "./components/auth/signIn";
import { Routes, Route } from "react-router-dom";
import { BlogCreation } from "./components/blogCreation/blogCreation";
import { Dashboard } from "./components/dashboard/dashboard";
import { Navbar } from "./components/navbar/navbar";
import { EditUserPost } from "./components/editUserPost/editUserPost";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="post/:postId/edit" element={<EditUserPost />}></Route>

        <Route path="/blog-creation-page" element={<BlogCreation />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
      </Routes>
    </div>
  );
}

export default App;
