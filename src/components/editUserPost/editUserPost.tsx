import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserPostsContext } from "../userPostsContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const EditUserPost = () => {
  const { usersPosts, setUsersPosts } = useUserPostsContext();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>();
  const { postId } = useParams();
  const navigate = useNavigate();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file.name);
    }
  };

  useEffect(() => {
    const post = usersPosts.find((post) => post.id == postId);
    if (post) {
      setDescription(post.description);
      setImage(post.thumbnail);
    }
  }, []);

  const handleSaveClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (description && image) {
        const updatedPost = {
          description,
          thumbnail: image,
        };
        if (postId) {
          const postRef = doc(db, "posts", postId);
          const querySnapShot = await getDoc(postRef);
          if (querySnapShot.exists()) {
            const data = querySnapShot.data();
            const updatedPosts = { ...data, ...updatedPost };
            await updateDoc(postRef, updatedPosts);
            //fetch the updatedDoc
            const updatedQuerySnapshot = await getDoc(postRef);
            const id = updatedQuerySnapshot.id;
            const updatedData = updatedQuerySnapshot.data();
            if (updatedData && id) {
              const updatedUserPosts = usersPosts.map((userPost) =>
                userPost.id === postId
                  ? { ...userPost, ...updatedData }
                  : userPost
              );
              console.log("updatedUserPosts", updatedUserPosts);
              setUsersPosts(updatedUserPosts);
              navigate("/blog-creation-page");
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <form className="custom-form">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
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

          <button
            type="submit"
            className="form-submit"
            onClick={(e) => handleSaveClick(e)}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
