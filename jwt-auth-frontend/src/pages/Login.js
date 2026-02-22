import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/* ─────────────────────────────────────────────
   Post-login full-screen transition overlay
───────────────────────────────────────────── */
const LoginSuccessOverlay = ({ username }) => (
  <div style={overlayStyles.backdrop}>
    <style>{`
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes popIn {
        0%   { opacity: 0; transform: scale(0.6) translateY(20px); }
        65%  { transform: scale(1.08) translateY(-4px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      @keyframes spinRing {
        to { transform: rotate(360deg); }
      }
      @keyframes dotPulse {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40%            { transform: scale(1);   opacity: 1;   }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes progressFill {
        from { width: 0%; }
        to   { width: 100%; }
      }
    `}</style>

    {/* Card */}
    <div style={overlayStyles.card}>
      {/* Spinning ring */}
      <div style={overlayStyles.ringWrap}>
        <div style={overlayStyles.ringOuter} />
        <div style={overlayStyles.ringInner} />
        <div style={overlayStyles.checkCircle}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polyline
              points="8,18 15,25 28,11"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "popIn 0.5s 0.2s both" }}
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h2 style={overlayStyles.heading}>Login Successful!</h2>
      <p style={overlayStyles.sub}>
        Welcome back, <strong style={{ color: "#ec4899" }}>{username}</strong>
      </p>
      <p style={overlayStyles.redirect}>Redirecting you now…</p>

      {/* Progress bar */}
      <div style={overlayStyles.progressTrack}>
        <div style={overlayStyles.progressBar} />
      </div>

      {/* Dot loader */}
      <div style={overlayStyles.dots}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              ...overlayStyles.dot,
              animation: `dotPulse 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const overlayStyles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(253,242,248,0.96) 0%, rgba(252,231,243,0.98) 50%, rgba(251,207,232,0.96) 100%)",
    backdropFilter: "blur(6px)",
    animation: "overlayFadeIn 0.35s ease",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    boxShadow:
      "0 32px 80px rgba(249,168,212,0.45), 0 0 0 1px rgba(249,168,212,0.15)",
    padding: "52px 44px 44px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
    minWidth: "340px",
    animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
  },
  ringWrap: {
    position: "relative",
    width: "96px",
    height: "96px",
    marginBottom: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "3px solid transparent",
    borderTopColor: "#f472b6",
    borderRightColor: "#f9a8d4",
    animation: "spinRing 1s linear infinite",
  },
  ringInner: {
    position: "absolute",
    inset: "10px",
    borderRadius: "50%",
    border: "2px solid transparent",
    borderBottomColor: "#fbcfe8",
    borderLeftColor: "#ec4899",
    animation: "spinRing 0.7s linear infinite reverse",
  },
  checkCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(236,72,153,0.35)",
  },
  heading: {
    margin: "0 0 8px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1f2937",
    animation: "slideUp 0.4s 0.15s both",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sub: {
    margin: "0 0 6px",
    fontSize: "15px",
    color: "#6b7280",
    animation: "slideUp 0.4s 0.25s both",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  redirect: {
    margin: "0 0 24px",
    fontSize: "13px",
    color: "#9ca3af",
    letterSpacing: "0.02em",
    animation: "slideUp 0.4s 0.35s both",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  progressTrack: {
    width: "220px",
    height: "5px",
    background: "#fce7f3",
    borderRadius: "99px",
    overflow: "hidden",
    marginBottom: "20px",
    animation: "slideUp 0.4s 0.4s both",
  },
  progressBar: {
    height: "100%",
    borderRadius: "99px",
    background: "linear-gradient(90deg, #f9a8d4, #ec4899, #f472b6)",
    backgroundSize: "400px 100%",
    animation: "progressFill 1.8s cubic-bezier(0.4,0,0.2,1) forwards, shimmer 1.5s linear infinite",
  },
  dots: {
    display: "flex",
    gap: "8px",
    animation: "slideUp 0.4s 0.5s both",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
    display: "inline-block",
  },
};

/* ─────────────────────────────────────────────
   Main Login Component
───────────────────────────────────────────── */
const Login = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);   // ← new
  const [loggedInUser, setLoggedInUser] = useState("");       // ← new
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const token = res.data.token;
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded));

      // ── Show success overlay, then navigate after 2 s ──
      setLoggedInUser(decoded.username || username);
      setLoginSuccess(true);

      setTimeout(() => {
        if (decoded.role === "admin") {
          navigate("/seller");
        } else {
          navigate("/user");
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
      setIsLoading(false);
    }
    // Note: we intentionally don't call setIsLoading(false) on success
    // so the button stays in "Signing in…" state while the overlay is shown.
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
    boxShadow:
      isButtonHovered && !isLoading
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
      background:
        "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
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
    logo: { textAlign: "center", marginBottom: "10px" },
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
    formGroup: { marginBottom: "24px" },
    label: {
      display: "block",
      color: "#555",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    inputWrapper: { position: "relative" },
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
    errorIcon: { color: "#ec4899", fontSize: "18px" },
    errorText: { color: "#be185d", fontSize: "14px", margin: 0 },
    registerLink: {
      textAlign: "center",
      marginTop: "25px",
      color: "#666",
      fontSize: "14px",
    },
    registerLinkA: {
      color: "#ec4899",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

  return (
    <>
      {/* ── Success overlay (rendered on top of everything) ── */}
      {loginSuccess && <LoginSuccessOverlay username={loggedInUser} />}

      <div style={styles.container}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          input::placeholder { color: #aaa; }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px #fdf2f8 inset !important;
          }
          * { scrollbar-width: none; -ms-overflow-style: none; }
          *::-webkit-scrollbar { display: none; }
          body { overflow: hidden; }
        `}</style>

        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🔐</div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Log in to continue to your dashboard</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>👤 Username</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  style={isUsernameFocused ? getInputStyle(true) : getInputStyle(false)}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🔒 Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={isPasswordFocused ? getInputStyle(true) : getInputStyle(false)}
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={getButtonStyle()}
              onMouseOver={() => setIsButtonHovered(true)}
              onMouseOut={() => setIsButtonHovered(false)}
            >
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div style={styles.registerLink}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.registerLinkA}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;