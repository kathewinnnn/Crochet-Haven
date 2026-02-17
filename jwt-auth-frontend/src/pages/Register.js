//node server.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate username
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    // Validate email
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        // Server responded with an error
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      } else if (err.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (isFocused) => ({
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: isFocused ? "2px solid #f9a8d4" : "2px solid #fbcfe8",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: isFocused ? "#fff" : "#fdf2f8",
    boxShadow: isFocused ? "0 0 0 4px rgba(249, 168, 212, 0.2)" : "none",
  });

  const getButtonStyle = () => ({
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #f9a8d4 0%, #f472b6 50%, #ec4899 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    boxShadow: isButtonHovered && !isLoading 
      ? "0 6px 20px rgba(249, 168, 212, 0.6)" 
      : "0 4px 15px rgba(249, 168, 212, 0.5)",
    opacity: isLoading ? 0.7 : 1,
    transform: isButtonHovered && !isLoading ? "translateY(-2px)" : "none",
    marginTop: "10px",
  });

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      background: "#ffffff",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(249, 168, 212, 0.4)",
      padding: "50px 40px",
      width: "100%",
      maxWidth: "420px",
      animation: "fadeIn 0.5s ease-out",
    },
    logo: {
      textAlign: "center",
      marginBottom: "10px",
    },
    logoIcon: {
      fontSize: "48px",
      marginBottom: "10px",
      filter: "drop-shadow(0 4px 8px rgba(249, 168, 212, 0.4))",
    },
    title: {
      textAlign: "center",
      color: "#333",
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },
    subtitle: {
      textAlign: "center",
      color: "#666",
      fontSize: "14px",
      marginBottom: "35px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      color: "#555",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    inputWrapper: {
      position: "relative",
    },
    input: getInputStyle(false),
    inputFocus: getInputStyle(true),
    passwordToggle: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#888",
      fontSize: "18px",
      padding: "5px",
    },
    errorBox: {
      backgroundColor: "#fdf2f8",
      border: "1px solid #f9a8d4",
      borderRadius: "10px",
      padding: "14px 16px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    errorIcon: {
      color: "#ec4899",
      fontSize: "18px",
    },
    errorText: {
      color: "#be185d",
      fontSize: "14px",
      margin: 0,
    },
    submitButton: getButtonStyle(),
    loginLink: {
      textAlign: "center",
      marginTop: "25px",
      color: "#666",
      fontSize: "14px",
    },
    loginLinkA: {
      color: "#ec4899",
      textDecoration: "none",
      fontWeight: "600",
    },
    inputIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#888",
      fontSize: "16px",
      zIndex: 1,
    },
    passwordStrength: {
      fontSize: "12px",
      marginTop: "6px",
      color: formData.password.length >= 6 ? "#48bb78" : "#a0aec0",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          input::placeholder {
            color: #aaa;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px #fdf2f8 inset !important;
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          *::-webkit-scrollbar {
            display: none;
          }
          body {
            overflow: hidden;
          }
        `}
      </style>
      
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📝</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Sign up to get started</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <label style={styles.label}>👤 Username</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                name="username"
                value={formData.username}
                required
                onChange={handleChange}
                placeholder="Choose a username"
                style={isUsernameFocused ? styles.inputFocus : styles.input}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>✉️ Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                placeholder="Enter your email"
                style={isEmailFocused ? styles.inputFocus : styles.input}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🔒 Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                required
                onChange={handleChange}
                placeholder="Create a password"
                style={isPasswordFocused ? styles.inputFocus : styles.input}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div style={styles.passwordStrength}>
              {formData.password.length === 0 
                ? "Enter a password" 
                : formData.password.length < 6 
                  ? "Password must be at least 6 characters" 
                  : "✓ Password strength: Good"}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🔐 Confirm Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                required
                onChange={handleChange}
                placeholder="Confirm your password"
                style={isConfirmPasswordFocused ? styles.inputFocus : styles.input}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={styles.submitButton}
            onMouseOver={() => setIsButtonHovered(true)}
            onMouseOut={() => setIsButtonHovered(false)}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/" style={styles.loginLinkA}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
