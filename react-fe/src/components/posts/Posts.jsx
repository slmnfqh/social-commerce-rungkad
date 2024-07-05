import React from "react";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId, key }) => {
  const { isLoading, error, data } = useQuery(["posts", userId], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => res.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;

  return (
    <div className="posts">
      {data.map((post, index) => (
        <Post key={post.id || index} post={post} />
      ))}
    </div>
  );
};

export default Posts;
