import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    
    <BrowserRouter>
    
    <Toaster

        toastOptions={{
          duration: 4000,
          style: {
            background: "#1b2832",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px"
          },
          success: {
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "red",
              secondary: "white",
            },
          },
        }}
      />

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
