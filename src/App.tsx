import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";
import { TowTravelProvider } from "./contexts/TowTravelContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="dark"
        toastStyle={{
          backgroundColor: "#202A34",
          color: "#fff",
          borderRadius: "8px",
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <TowTravelProvider>
                <HomePage />
              </TowTravelProvider>
            }
          />
          <Route
            path="/homepage"
            element={
              <TowTravelProvider>
                <HomePage />
              </TowTravelProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
