import { useState } from "react";
import { Toaster } from "react-hot-toast";
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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
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
