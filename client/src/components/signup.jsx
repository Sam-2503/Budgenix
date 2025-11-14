import { useState } from "react";
import {
  User,
  Lock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";


export default function MultiStepSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const{signup}= useAuth();

  // Form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    income: "",
    categories: [
      "Food",
      "Utilities",
      "Entertainment",
      "Transportation",
      "Healthcare",
    ],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.income) {
      newErrors.income = "Income is required";
    } else if (parseFloat(formData.income) <= 0) {
      newErrors.income = "Income must be greater than 0";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    if (strength <= 2)
      return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, label: "Medium", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Category management
  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.includes(newCategory.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  // Navigation
  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();

    if (isValid) {
      setStep(step + 1);
      setError("");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
    setError("");
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    setError("");

    try {
      const response = signup(formData)

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center transform animate-scale-in">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome Aboard!
          </h2>
          <p className="text-zinc-400 mb-8">
            Your account has been created successfully. You can now start
            managing your finances.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-100 transition duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">
              Step {step} of 3
            </span>
            <span className="text-sm text-zinc-400">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Personal Details
              </h2>
              <p className="text-zinc-400 text-center mb-6">
                Let's start with the basics
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.username ? "border-red-500" : "border-zinc-800"
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition`}
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black border ${
                      errors.email ? "border-red-500" : "border-zinc-800"
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Secure Your Account
              </h2>
              <p className="text-zinc-400 text-center mb-6">
                Create a strong password
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-black border ${
                        errors.password ? "border-red-500" : "border-zinc-800"
                      } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-400">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.label === "Strong"
                              ? "text-green-500"
                              : passwordStrength.label === "Medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-black border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-zinc-800"
                      } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Setup */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Financial Setup
              </h2>
              <p className="text-zinc-400 text-center mb-6">
                Help us personalize your experience
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 bg-black border ${
                        errors.income ? "border-red-500" : "border-zinc-800"
                      } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition`}
                      placeholder="5000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.income && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.income}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Expense Categories
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addCategory())
                      }
                      className="flex-1 px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
                      placeholder="Add custom category"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-100 transition font-medium"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat) => (
                      <div
                        key={cat}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-white rounded-full text-sm font-medium"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => removeCategory(cat)}
                          className="hover:bg-zinc-700 rounded-full p-0.5 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.categories && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.categories}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-zinc-700 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          )}
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline font-semibold">
            Log in
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
