import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./pages/dashboard";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/login";
import Welcomepage from "./pages/WelcomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Welcomepage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
