import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import "./collections.scss"; // Tambahkan file styling sesuai kebutuhan

const Collections = () => {
  const { currentUser } = useContext(AuthContext);

  const {
    isLoading,
    error,
    data: collections,
  } = useQuery(["collections", currentUser.id], () =>
    makeRequest
      .get(`/collections/user?userId=${currentUser.id}`)
      .then((res) => res.data)
  );
  console.log(collections);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading collections</div>;

  return (
    <div className="collections">
      <h1>My Collections</h1>
      <div className="collection-list">
        {collections.map((collection) => (
          <div key={collection?.id} className="collection-item">
            <img src={"/upload/" + collection?.img} alt={collection?.desc} />
            <p>{collection?.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
