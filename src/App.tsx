import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";
import { TowTravelProvider } from "./contexts/TowTravelContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TowRequestProvider } from "./contexts/providers/TowRequestsProvider";

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
        style={{ zIndex: 11999 }}     
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={HomePageWithProviders()} />
          <Route path="/homepage" element={HomePageWithProviders()} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function HomePageWithProviders() {
  return (
    <TowTravelProvider>
      <TowRequestProvider>
        <HomePage />
      </TowRequestProvider>
    </TowTravelProvider>
  );
}

export default App;
