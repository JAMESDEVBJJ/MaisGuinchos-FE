import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import HomePage from "./pages/HomePage";
import { TowTravelProvider } from "./contexts/TowTravelContext";

function App() {
  return (
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
  );
}

export default App;
