import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Transactions } from "./pages/transactions";
import { Budget } from "./pages/budget";
import { Analytics } from "./pages/analytics";
import Settings from "./pages/settings";
import { Routes, Route, Router } from "react-router-dom";

import LoginPage from "./pages/loginPage";
import Welcomepage from "./pages/Welcomepage";
import FeaturesPage from "./pages/featurepage";
import SignupPage from "./pages/signupPage";
import Contact from "./pages/contact";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Welcomepage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
