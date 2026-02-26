import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
