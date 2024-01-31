import React from "react";
import { post } from "../type";
import "./style.css";

type PublishedPost = { publishedPost: post };

export const PublishedPost = ({ publishedPost }: PublishedPost) => {
  return (
    <div className="blog-post">
      <div className="overlay"></div>

      <img
        src={publishedPost.thumbnail}
        alt={publishedPost.description}
        className="blogPost-image"
      />
      <div className="post-details">
        <div className="post-description">{publishedPost.description}</div>
      </div>
    </div>
  );
};
