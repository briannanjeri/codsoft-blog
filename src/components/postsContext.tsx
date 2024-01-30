import React, { useEffect, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { post } from "./type";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Props {
  children?: ReactNode;
}
interface ContextData {
  posts: post[];
  setPosts: React.Dispatch<React.SetStateAction<post[]>>;
}

const PostsContext = createContext<ContextData>({} as ContextData);

export const PostsProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState<post[]>([]);

  // const fetchPosts = async () => {
  //   const postsRef = collection(db, "posts");
  //   const postQuerySnapshot = await getDocs(postsRef);
  //   const usersPost: post[] = [];
  //   if (postQuerySnapshot) {
  //     postQuerySnapshot.docs.map((doc) =>
  //       usersPost.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       } as post)
  //     );
  //   }
  //   setPosts(usersPost);
  // };
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  return (
    <div>
      <PostsContext.Provider value={{ posts, setPosts }}>
        {children}
      </PostsContext.Provider>
    </div>
  );
};
export const usePostsContex = () => {
  return useContext(PostsContext);
};
