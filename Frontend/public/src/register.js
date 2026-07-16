
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";    
import "./register.css";   // Register-specific styles: strength bar, terms row, etc.
 
function Register() {
  // State
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/closed
 
  // All form fields grouped into a single state object for easy handling
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
 
  const [showPassword, setShowPassword] = useState(false); // Toggle main password visibility
  const [showConfirm, setShowConfirm] = useState(false);   // Toggle confirm password visibility
  const [loading, setLoading] = useState(false);           // Disable button while submitting
  const [error, setError] = useState("");                  // Top-level error message
 
  // useNavigate lets us redirect to the login page after successful registration
  const navigate = useNavigate();
 
  // Generic input change handler
  // Uses the input's name attribute to update the correct field in state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  // Password strength calculator
  // Returns a level (1–4) and a label used to drive the strength bar UI
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", level: 0 };
 
    let score = 0;
    if (pwd.length >= 8) score++;          // At least 8 characters
    if (/[A-Z]/.test(pwd)) score++;        // At least one uppercase letter
    if (/[0-9]/.test(pwd)) score++;        // At least one number
    if (/[^A-Za-z0-9]/.test(pwd)) score++; // At least one special character
 
    const levels = ["", "Weak", "Fair", "Good", "Strong"];
    return { label: levels[score], level: score };
  };
 
  // Compute strength on every render so the bar updates in real time
  const strength = getPasswordStrength(form.password);
 
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError("");        // Clear any previous error
 
    // Client-side validation — check all fields are filled
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
 
    // Passwords must match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
 
    // Enforce minimum password length
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
 
    setLoading(true); // Show loading state on the button
 
    try {
      // TODO: Replace this URL with your real backend registration endpoint
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send fields the server needs — never send confirmPassword
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });
 
      if (res.ok) {
        // On success, redirect to the login page
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        // Server returned an error (e.g. 409 email already exists)
        setError("Registration failed. Please try again.");
      }
    } catch {
      // Network failure or server unreachable
      setError("Server error. Please try again later.");
    }
 
    setLoading(false); // Re-enable the submit button
  };
 
  // Render
  return (
    <div className="container">
 
      {/* Menu toggle button (☰) — fixed top-left, toggles sidebar */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
 
      {/* Sidebar — same structure used across Home, About, Malware, Login */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div>
          <h2>Spam & Malware</h2>
 
          {/* Navigation links */}
          <div className="menu">
            <Link to="/">
              <p>Home</p>
            </Link>
            <Link to="/about">
              <p>About</p>
            </Link>
            <Link to="/Spam">
              <p>Spam</p>
            </Link>
            <Link to="/malware">
              <p>Malware</p>
            </Link>
          </div>
        </div>

        {/* Sidebar footer: project credit + auth links */}
        <div className="sidebar-footer">
          <p className="company">Swintech Company</p>
          <div className="auth-buttons">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          {/* Card heading */}
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to stay protected</p>
 
          {/* Top-level error message — shown only when error state is set */}
          {error && <div className="auth-error">{error}</div>}
 
          {/* Registration form */}
          <form onSubmit={handleSubmit} className="auth-form">
 
            {/* Full name field */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"           // Must match the key in form state
                type="text"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}   // Uses generic handler above
                autoComplete="name"
              />
            </div>
 
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
 
            {/* Password field with Show/Hide toggle and strength bar */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                {/* type switches between "password" and "text" based on showPassword */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {/* Toggle visibility button */}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
 
              {/* Password strength bar — only visible when the user starts typing */}
              {form.password && (
                <div className="strength-bar-wrapper">
                  {/* 4 segments; segments up to strength.level get a colour class */}
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`strength-segment ${
                          strength.level >= n ? `level-${strength.level}` : ""
                        }`}
                      />
                    ))}
                  </div>
                  {/* Text label: Weak / Fair / Good / Strong */}
                  <span className={`strength-label level-text-${strength.level}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>
 
            {/* Confirm password field with Show/Hide toggle and mismatch warning */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {/* Toggle visibility button */}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
 
              {/* Inline mismatch error — shown once the user has typed in both fields */}
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="field-error">Passwords do not match</p>
              )}
            </div>
 
            {/* Terms of Service checkbox — required before submitting */}
            <div className="terms-row">
              <label className="remember-me">
                <input type="checkbox" required /> I agree to the{" "}
                {/* TODO: Link to actual Terms of Service page */}
                <a href="#terms" className="auth-link">Terms of Service</a>
              </label>
            </div>
 
            {/* Submit button — disabled while request is in flight */}
            <button
              type="submit"
              className="button auth-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
 
          {/* Link back to the login page */}
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
 
        </div>
      </div>
 
    </div>
  );
}
 
export default Register;