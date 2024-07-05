import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [defaultProfilePic, setDefaultProfilePic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [defaultCoverPic, setDefaultCoverPic] = useState(
    "https://www.example.com/default-cover-pic.jpg" // Ganti dengan path default cover picture Anda
  );
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/user/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationship?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationship?userId=" + userId);
      return makeRequest.post("/relationship", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  useEffect(() => {
    // Set default profile picture path if user does not have one
    if (data && !data.profilePic) {
      setDefaultProfilePic(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      );
    }

    if (data && !data.coverPic) {
      setDefaultCoverPic(
        "https://cdn.pixabay.com/photo/2015/05/11/23/10/picture-frame-763299_1280.png"
      );
    }
  }, [data]);

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser?.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img
              src={
                data?.coverPic ? "/upload/" + data?.coverPic : defaultCoverPic
              }
              alt=""
              className="cover"
            />
            <img
              src={
                data?.profilePic
                  ? "/upload/" + data?.profilePic
                  : defaultProfilePic
              }
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" className="icon" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" className="icon" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" className="icon" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" className="icon" />
                </a>
              </div>
              <div className="center">
                <h3>{data?.name}</h3>
                <div className="info">
                  <div className="item">
                    <PlaceIcon className="icon" />
                    <span>{data?.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon className="icon" />
                    <span>{data?.bio}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser?.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData?.includes(currentUser?.id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
