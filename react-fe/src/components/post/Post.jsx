import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import React, { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();
  const [collectionsUserId, setCollectionsUserId] = useState([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [ownedByOthers, setOwnedByOthers] = useState(false);

  // Pengambilan data collections
  const { isLoading: isLoadingCollectionsQuery } = useQuery(
    ["collections", post.id],
    () =>
      makeRequest
        .get(`/collections/?postId=${post.id}`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        setCollectionsUserId(data);
        setIsLoadingCollections(false);

        // Periksa apakah postingan sudah dimiliki oleh orang lain
        const ownedByOthers = data.some(
          (userId) => userId !== currentUser.id && userId !== post.userId
        );
        setOwnedByOthers(ownedByOthers);
      },
    }
  );

  // Pengambilan data komentar
  const { isLoading: isLoadingComments, data: comments } = useQuery(
    ["comments", post.id],
    () =>
      makeRequest.get(`/comments/?postId=${post.id}`).then((res) => res.data)
  );

  // Pengambilan data like
  const { isLoading: isLoadingLikes, data: likes } = useQuery(
    ["likes", post.id],
    () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data)
  );

  // use mutation untuk like
  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes", post.id]);
      },
    }
  );

  // use mutation untuk delete post
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  // fungsi handle like
  const handleLike = () => {
    likeMutation.mutate(likes?.includes(currentUser.id));
  };

  // fungsi handle delete
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(post.id);
      console.log(`Post with ID ${post.id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting post:", error);
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error deleting the post. Please try again later.",
      });
    }
  };

  // fungsi handle buy
  const handleCollections = async () => {
    // Cek apakah post sudah dimiliki oleh currentUser
    if (collectionsUserId?.includes(currentUser.id)) {
      // Jika sudah dimiliki, tampilkan pesan bahwa post sudah dimiliki
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "This post is already owned by you!",
      });
    } else {
      // Jika belum dimiliki, tambahkan ke collections
      await makeRequest.post("/collections", {
        postId: post.id,
      });
      MySwal.fire({
        title: "Buy Success!",
        text: "Success buy this image.",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        confirmButtonText: "Ok",
        position: "center",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries(["collections", post.id]); // Invalidate and refetch only when necessary
          window.location.reload();
        }
      });
    }
  };

  if (isLoadingCollectionsQuery || isLoadingLikes) return <div>Loading...</div>;
  if (!collectionsUserId) return <div>Error loading collections</div>;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePic
                  ? `/upload/${post.profilePic}`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt=""
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.username}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`/upload/${post.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoadingLikes ? (
              "loading"
            ) : likes.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon className="commentIcon" />
            <span>
              {isLoadingComments ? "Loading..." : comments && comments.length}{" "}
              comments
            </span>
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
          <div className="item">
            {currentUser.id === post.userId ? (
              <span></span> // Jika pengguna saat ini adalah pemilik postingan
            ) : (
              <>
                {collectionsUserId?.includes(currentUser.id) ? (
                  <span>Owned</span> // Jika pengguna sudah memiliki koleksi ini
                ) : (
                  <>
                    {ownedByOthers ? (
                      <span>Owned by others</span> // Jika postingan sudah dimiliki oleh orang lain
                    ) : (
                      <ShoppingCartIcon onClick={handleCollections} /> // Jika pengguna belum memiliki koleksi ini
                    )}
                  </>
                )}
                {!isLoadingCollections && collectionsUserId.length === 0 && (
                  <span>Buy</span>
                )}{" "}
                {/* Kondisi ketika tidak ada koleksi */}
              </>
            )}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
