import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import "./App.js"
 
function Login() {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
 
    setLoading(true);
 
    try {
      // Replace with your real API endpoint
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      if (res.ok) {
        alert("Login successful!");
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    }
 
    setLoading(false);
  };
 
  return (
    <div className="container">
      {/* ☰ */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
 
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div>
          <h2>Spam & Malware</h2>
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
        <div className="sidebar-footer">
          <p className="company">Swintech Company</p>
          <div className="auth-buttons">
            <Link to="/Login">Login</Link>
            <Link to="/Register">Register</Link>
          </div>
        </div>
      </div>
 
      {/* Main */}
      <div className={`main login-main ${isOpen ? "shift" : ""}`}>
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your secure account</p>
 
          {error && <div className="auth-error">{error}</div>}
 
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
 
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
 
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>
 
            <button type="submit" className="button auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
 
          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
 
export default Login;