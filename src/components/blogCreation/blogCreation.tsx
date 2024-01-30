import React from "react";
import { useState } from "react";
import "./style.css";
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { Auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { post } from "../type";
import { UsersPost } from "../usersPost/usersPost";
import { usePostsContex } from "../postsContext";
import { useUserPostsContext } from "../userPostsContext";
export const BlogCreation = () => {
  const { usersPosts, setUsersPosts } = useUserPostsContext();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>();
  const [user, loading] = useAuthState(Auth);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file.name);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (description.trim() == "" || !image) {
        alert("ensure all fields are filled");
        return;
      }
      const postsRef = collection(db, "posts");
      const newPost: post = {
        description,
        thumbnail: image,
        userId: user?.uid,
      };
      console.log("newpost", newPost);
      const newPostRef = await addDoc(postsRef, newPost);
      console.log("newPostRef", newPostRef);
      setUsersPosts([...usersPosts, { ...newPost, id: newPostRef.id }]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div>
      <div className="form-container">
        <form className="custom-form" onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <input
            type="text"
            id="description"
            className="form-input"
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="image" className="form-label">
            Upload Image:
          </label>
          <input
            type="file"
            id="image"
            className="form-input"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
          <input type="submit" className="form-submit" />
        </form>
      </div>
      <UsersPost />
    </div>
  );
};
