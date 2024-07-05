import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EventIcon from "@mui/icons-material/Event";
import CollectionsIcon from "@mui/icons-material/Collections";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import GroupIcon from "@mui/icons-material/Group";
import { AuthContext } from "../../context/authContext";
import LogoutIcon from "@mui/icons-material/Logout";
import "./leftBar.scss";
import ExploreIcon from "@mui/icons-material/Explore";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const LeftBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const MySwal = withReactContent(Swal);
  const [defaultProfilePic, setDefaultProfilePic] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  useEffect(() => {
    // Set default profile picture path if currentUser does not have one
    if (!currentUser?.profilePic) {
      setDefaultProfilePic(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      );
    }
  }, [currentUser]);

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <Link
            to={`/profile/${currentUser.id}`}
            className="user"
            style={{ textDecoration: "none" }}
          >
            <img
              src={
                currentUser.profilePic
                  ? `/upload/${currentUser.profilePic}`
                  : defaultProfilePic
              }
              alt=""
            />
            <span>{currentUser.name}</span>
          </Link>

          <Link
            to="/collections"
            className="item"
            style={{ textDecoration: "none", color: "black" }}
          >
            <CollectionsIcon />
            <span>Collections</span>
          </Link>
          <div className="item" style={{ color: "grey" }}>
            <GroupIcon />
            <span style={{ color: "grey" }}>Mutual Friends</span>
          </div>
          <div className="item" style={{ color: "grey" }}>
            <StorefrontIcon />
            <span style={{ color: "grey" }}>Marketplace</span>
          </div>
          <div className="item" style={{ color: "grey" }}>
            <ExploreIcon />
            <span style={{ color: "grey" }}>Explore</span>
          </div>
        </div>

        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item" style={{ color: "grey" }}>
            <EventIcon />
            <span style={{ color: "grey" }}>Events</span>
          </div>
          <div className="item" style={{ color: "grey" }}>
            <SportsEsportsIcon />
            <span style={{ color: "grey" }}>Gaming</span>
          </div>
        </div>

        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
