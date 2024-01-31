import React, { useEffect, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { post } from "./type";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  children?: ReactNode;
}
interface ContextData {
  usersPosts: post[];
  setUsersPosts: React.Dispatch<React.SetStateAction<post[]>>;
}

const UserPostsContext = createContext<ContextData>({} as ContextData);

export const UserPostsProvider = ({ children }: Props) => {
  const [usersPosts, setUsersPosts] = useState<post[]>([]);
  const [user, loading] = useAuthState(Auth);
  const fetchUserPosts = async () => {
    try {
      if (!user) {
        return;
      }
      const postsRef = collection(db, "posts");
      const postQuerySnapshot = await getDocs(
        query(postsRef, where("userId", "==", user.uid))
      );
      if (postQuerySnapshot.empty) {
        //user has no post
        return;
      }
      const data: post[] = postQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        thumbnail: doc.data().thumbnail,
        description: doc.data().description,
      }));
      setUsersPosts(data);
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  };
  useEffect(() => {
    fetchUserPosts();
  }, [user?.uid]);

  return (
    <div>
      <UserPostsContext.Provider value={{ usersPosts, setUsersPosts }}>
        {children}
      </UserPostsContext.Provider>
    </div>
  );
};
export const useUserPostsContext = () => {
  return useContext(UserPostsContext);
};
