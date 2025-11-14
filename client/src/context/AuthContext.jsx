import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");

        if (token) {
          await fetchUserData(token);
        } else {
          setIsUserLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsUserLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setIsFetchingUserData(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3300/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsUserLoggedIn(true);

      setUser(response.data.user);
    } catch (err) {
      console.error("Fetch user data failed:", err);
    } finally {
      setIsFetchingUserData(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Logging in with credentials:", credentials);

      const response = await axios.post(
        "http://localhost:3300/api/users/login",
        credentials
      );

      const data = response.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setIsUserLoggedIn(true);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3300/api/users/register",
        userData
      );

      const data = response.data;
      return { success: true, data };
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsUserLoggedIn(false);
    setUser(null);
    setError(null);
  };

  // Refresh user data
  const refreshUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await fetchUserData(token);
    }
  };

  const value = {
    isUserLoggedIn,
    user,
    isLoading,
    isFetchingUserData,
    error,
    fetchUserData,
    login,
    signup,
    logout,
    refreshUserData,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
