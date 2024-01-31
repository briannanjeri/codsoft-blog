import React from "react";
import { useState } from "react";
import "./style.css";
import { addDoc, collection } from "firebase/firestore";
import { Auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { post } from "../type";
import { UsersPost } from "../usersPost/usersPost";
import { useUserPostsContext } from "../userPostsContext";
import { useNavigate } from "react-router-dom";
export const BlogCreation = () => {
  const { usersPosts, setUsersPosts } = useUserPostsContext();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();
  const [user] = useAuthState(Auth);

  const navigate = useNavigate();

  if (!user?.uid) {
    navigate("/sign-in");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (description.trim() == "" || !image) {
        alert("ensure all fields are filled");
        return;
      }
      const cloudData = new FormData();
      cloudData.append("file", image);
      cloudData.append("upload_preset", "rqcxjkks");
      cloudData.append("cloud_name", "djl1ysnon");
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/djl1ysnon/image/upload",
        {
          method: "POST",
          body: cloudData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const cloudinaryData = await cloudinaryResponse.json();
        throw new Error(cloudinaryData.error);
      }

      const cloudinaryJsonData = await cloudinaryResponse.json();

      const postsRef = collection(db, "posts");
      const newPost: post = {
        description,
        thumbnail: cloudinaryJsonData.url,
        userId: user?.uid,
      };
      const newPostRef = await addDoc(postsRef, newPost);
      setDescription("");
      setUsersPosts([...usersPosts, { ...newPost, id: newPostRef.id }]);
    } catch (error) {
      if (error instanceof Error) {
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
            value={description}
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
          <button type="submit" className="form-submit">
            Create
          </button>
        </form>
      </div>
      <UsersPost />
    </div>
  );
};
