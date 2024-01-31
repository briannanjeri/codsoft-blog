import React from "react";
import { Auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePostsContex } from "../postsContext";
import { PublishedPost } from "../publishedPosts/publishedPosts";
export const Dashboard = () => {
  const { posts, setPosts } = usePostsContex();

  const [user] = useAuthState(Auth);
  const navigate = useNavigate();

  if (!user?.uid) {
    navigate("/sign-in");
  }

  return (
    <div className="blog-container">
      <div className="side-nav"></div>
      <div className="blog-post-container">
        {posts.map((publishedPost) => (
          <div key={publishedPost.id}>
            <PublishedPost publishedPost={publishedPost} />
          </div>
        ))}
      </div>
      <div className="side-nav"></div>
    </div>
  );
};
