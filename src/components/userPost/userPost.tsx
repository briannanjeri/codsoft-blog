import React, { useEffect } from "react";
import { post } from "../type";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Auth, db } from "../../firebaseConfig";
import "./style.css";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useUserPostsContext } from "../userPostsContext";
import { usePostsContex } from "../postsContext";

type Post = {
  post: post;
};

export const UserPost = ({ post }: Post) => {
  const { usersPosts, setUsersPosts } = useUserPostsContext();
  const { posts, setPosts } = usePostsContex();
  const [user, loading] = useAuthState(Auth);
  const navigate = useNavigate();
  const handleEditClick = (postId: string) => {
    navigate(`/post/${postId}/edit`);
  };
  const handleDeleteIcon = async () => {
    if (post.id != undefined) {
      const postRef = doc(db, "posts", post.id);
      const querySnapShot = await getDoc(postRef);
      if (querySnapShot.exists()) {
        //post exist
        try {
          await deleteDoc(postRef);
          const publishedPostRef = doc(db, "publishedPosts", post.id);
          const publishedPostSnapshot = await getDoc(publishedPostRef);
          if (publishedPostSnapshot.exists()) {
            await deleteDoc(publishedPostRef);
          }
          const updatedPosts = usersPosts.filter(
            (userPost) => userPost.id !== post.id
          );
          setUsersPosts(updatedPosts);
          const updatedPublishedPosts = posts.filter(
            (publishedPost) => publishedPost.id !== post.id
          );
          setPosts(updatedPublishedPosts);
        } catch (error) {
          if (error instanceof Error) {
          }
        }
      }
    }
  };
  const handlePublishButton = async (userPost: post) => {
    if (userPost.id != undefined) {
      const publishedPostRef = doc(db, "publishedPosts", userPost.id);
      try {
        const publishedPostSnapshot = await getDoc(publishedPostRef);
        if (publishedPostSnapshot.exists()) {
          return;
        } else {
          const newPublishedPostRef = await setDoc(publishedPostRef, userPost);
          const newDocumentSnapshot = await getDoc(publishedPostRef);
          const id = newDocumentSnapshot.id;
          const newdocumentData = newDocumentSnapshot.data();
          setPosts((prevPosts: any) => {
            if (prevPosts == null) {
              return [newdocumentData];
            } else {
              return [...prevPosts, newdocumentData];
            }
          });
        }
      } catch (error) {
        if (error instanceof Error) {
        }
      }
    }
  };
  useEffect(() => {}, [posts]);

  return (
    <div className="userPost-container">
      <div className="icon-container">
        <FontAwesomeIcon
          icon={faEdit}
          onClick={() => {
            post.id && handleEditClick(post.id);
          }}
        />
        Edit
        <FontAwesomeIcon icon={faTrashAlt} onClick={handleDeleteIcon} />
        Delete
      </div>
      <div className="image-container">
        <img
          src={post.thumbnail}
          alt={post.description}
          className="post-image"
        />
        <div className="overlay"></div>
        <div className="description-overlay">{post?.description}</div>
      </div>
      {!posts.some((allPost) => allPost.id == post.id) && (
        <button
          className="publish-button"
          onClick={() => handlePublishButton(post)}
        >
          Publish
        </button>
      )}
      {posts.some((Post) => Post.id === post.id) && (
        <button className="publish-button" style={{ opacity: 0.5 }}>
          Published
        </button>
      )}
    </div>
  );
};
