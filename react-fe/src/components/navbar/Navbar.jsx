import React, { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await makeRequest.get(
        `/user/search?query=${searchTerm}`
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setError("No users found.");
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setError(`${searchTerm} not found in database.`);
    } finally {
      setLoading(false);
    }
  };

  const clearSearchResults = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h3>Rungkad</h3>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon className="item" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          {searchTerm && (
            <button className="clear-button" onClick={clearSearchResults}>
              Clear
            </button>
          )}
          {loading && <p className="loading-message">Loading...</p>}
          <div
            className="search-results"
            style={{ display: searchResults.length > 0 ? "block" : "none" }}
          >
            <ul>
              {searchResults.length > 0
                ? searchResults.map((user) => (
                    <li key={user.id}>
                      <a href={`/profile/${user.id}`}>
                        <img
                          src={`../public/upload/${user.profilePic}`}
                          alt=""
                        />
                        <p>{user.username}</p>
                      </a>
                    </li>
                  ))
                : !loading &&
                  error && <li className="error-message">User not found.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <Link
            to={`/profile/${currentUser.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
