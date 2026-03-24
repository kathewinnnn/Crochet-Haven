import API_BASE_URL from '../apiConfig';

/* ─────────────────────────────────────────────
   Post-registration full-screen transition overlay
───────────────────────────────────────────── */
const RegisterSuccessOverlay = ({ username }) => (
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
      @keyframes confettiFall {
        0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
      }
    `}</style>

    {/* Confetti dots */}
    {[
      { left: "15%", color: "#f9a8d4", delay: "0s",   size: "8px"  },
      { left: "30%", color: "#ec4899", delay: "0.1s",  size: "6px"  },
      { left: "50%", color: "#fbcfe8", delay: "0.15s", size: "10px" },
      { left: "65%", color: "#f472b6", delay: "0.05s", size: "7px"  },
      { left: "80%", color: "#f9a8d4", delay: "0.2s",  size: "9px"  },
      { left: "22%", color: "#fce7f3", delay: "0.25s", size: "5px"  },
      { left: "70%", color: "#ec4899", delay: "0.3s",  size: "6px"  },
    ].map((c, i) => (
      <div
        key={i}
        style={{
          position: "fixed",
          top: "18%",
          left: c.left,
          width: c.size,
          height: c.size,
          borderRadius: "50%",
          background: c.color,
          animation: `confettiFall 1.4s ${c.delay} ease-out forwards`,
          pointerEvents: "none",
        }}
      />
    ))}

    {/* Card */}
    <div style={overlayStyles.card}>
      {/* Spinning rings */}
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
      <h2 style={overlayStyles.heading}>Account Created! 🎉</h2>
      <p style={overlayStyles.sub}>
        Welcome aboard, <strong style={{ color: "#ec4899" }}>{username}</strong>!
      </p>
      <p style={overlayStyles.redirect}>Taking you to login…</p>

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
    animation:
      "progressFill 1.8s cubic-bezier(0.4,0,0.2,1) forwards, shimmer 1.5s linear infinite",
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
   Main Register Component
───────────────────────────────────────────── */
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
  const [registerSuccess, setRegisterSuccess] = useState(false); // ← new
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim()) { setError("Username is required"); return; }
    if (formData.username.length < 3) { setError("Username must be at least 3 characters"); return; }
    if (!formData.email.trim()) { setError("Email is required"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { setError("Please enter a valid email address"); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // ── Show success overlay, then navigate to login after 2 s ──
      setRegisterSuccess(true);
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      } else if (err.request) {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
      setIsLoading(false);
    }
    // intentionally no setIsLoading(false) on success — button stays "Creating Account…"
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
      margin: "0 0 8px 0",
    },
    subtitle: {
      textAlign: "center",
      color: "#666",
      fontSize: "14px",
      marginBottom: "35px",
    },
    formGroup: { marginBottom: "20px" },
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
    loginLink: {
      textAlign: "center",
      marginTop: "25px",
      color: "#666",
      fontSize: "14px",
    },
    loginLinkA: { color: "#ec4899", textDecoration: "none", fontWeight: "600" },
    passwordStrength: {
      fontSize: "12px",
      marginTop: "6px",
      color: formData.password.length >= 6 ? "#48bb78" : "#a0aec0",
    },
  };

  return (
    <>
      {/* ── Success overlay ── */}
      {registerSuccess && <RegisterSuccessOverlay username={formData.username} />}

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
                  style={getInputStyle(isUsernameFocused)}
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
                  style={getInputStyle(isEmailFocused)}
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
                  style={getInputStyle(isPasswordFocused)}
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
                  style={getInputStyle(isConfirmPasswordFocused)}
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
              style={getButtonStyle()}
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
    </>
  );
};

export default Register;