import { useState } from "react";
import { api } from "../../services/api";
import guinchoIcon from "../../assets/icons/car-breakdown-tow-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const response = await api.post("/user/login", { email, password });

    const token = response.data?.token;

    localStorage.setItem("token", token);

    navigate("/homepage");
  }

  return (
    <div className="page">
      <div className="login-card">
        <div className="logo">
          <img src={guinchoIcon} alt="Guincho"></img>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label className="field">
            <span>Email:</span>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Senha:</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <a href="" className="forgot">
            Esqueceu a senha?
          </a>

          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>

        <Link to={"/signup"} className="signup">
          Cadastrar
        </Link>
      </div>
    </div>
  );
};

export default Login;
