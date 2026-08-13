import { useState } from "react";
import { api } from "../../services/api";
import guinchoIcon from "../../assets/icons/car-breakdown-tow-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    try {

      e.preventDefault();

      const response = await api.post("/user/login", { email, password });

      const token = response.data?.token;

      if (token) {
        login(token)
      }

      navigate("/homepage");
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors) {
        Object.values(data.errors).forEach((messages: any) => {
          messages.forEach((message: string) => {
            toast.error(message);
          });
        });
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.error("Erro ao tentar logar.");
      }

      console.error("Erro ao tentar efetuar login", error);

    }
  }

  return (
    <div className="page">
      <div className="login-card">
        <div className="logo">
          <img src={guinchoIcon} alt="Guincho"></img>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label className="field">
            <span>E-mail:</span>
            <input
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Senha:</span>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <a href="" className="forgot">
            Esqueceu a senha?
          </a>

          <button type="submit" className="loginBtn">
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
