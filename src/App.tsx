import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";
import { TowTravelProvider } from "./contexts/TowTravelContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TowRequestProvider } from "./contexts/providers/TowRequestsProvider";
import SettingsPage from "./pages/SettingsPage";
import { Outlet } from "react-router-dom";


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

          <Route element={<AppProviders />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

function AppProviders() {
  return (
    <TowTravelProvider>
      <TowRequestProvider>
        <Outlet />
      </TowRequestProvider>
    </TowTravelProvider>
  );
}

export default App;
