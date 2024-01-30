import React from "react";
import { useUserPostsContext } from "../userPostsContext";
import { UserPost } from "../userPost/userPost";

export const UsersPost = () => {
  const { usersPosts, setUsersPosts } = useUserPostsContext();

  console.log("usersPost", usersPosts);
  return (
    <div className="post-container">
      {usersPosts.map((post) => (
        <div key={post.id}>
          <UserPost post={post} />
        </div>
      ))}
    </div>
  );
};
