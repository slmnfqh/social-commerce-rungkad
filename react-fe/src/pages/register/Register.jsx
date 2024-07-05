import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validasi field kosong
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required!",
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", inputs);
      MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Account successfully created!",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data || "An error occurred during registration!",
      });
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Rungkad</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consectetur culpa, iusto doloremque, excepturi autem nemo expedita
            voluptatem distinctio!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Fullname"
              name="name"
              onChange={handleChange}
            />
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
