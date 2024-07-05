import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi field kosong
    if (!inputs.username || !inputs.password) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Username and password are required!",
      });
      return;
    }

    try {
      await login(inputs);
      MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
        timer: 1500, // Durasi SweetAlert ditampilkan (dalam milidetik)
        showConfirmButton: false, // Tidak menampilkan tombol OK
      }).then(() => {
        navigate("/");
        window.location.reload();
      });
    } catch (err) {
      setErr(err.response.data);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data || "An error occurred during login!",
      });
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Rungkad</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consectetur culpa, iusto doloremque, excepturi autem nemo expedita
            voluptatem distinctio!
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
