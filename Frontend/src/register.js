
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";    
import {
  Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  Typography, Button, Snackbar, Alert
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';
import "./register.css";  
 
const drawerWidth = 260;

function Register() {
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
  const [successMsg, setSuccessMsg] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 900);
  const location = useLocation();

  // Handle responsive sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar menu configuration
  const menuItems = [
    { text: "Home", path: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { text: "About", path: "/about", icon: <InfoIcon sx={{ color: "white" }} /> },
    { text: "Spam", path: "/spam", icon: <SecurityIcon sx={{ color: "white" }} /> },
    { text: "Malware", path: "/malware", icon: <BugReportIcon sx={{ color: "white" }} /> },
  ];
  // Uses the input's name attribute to update the correct field in state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  // Password strength calculator
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
    e.preventDefault(); 
    setError("");    
 
    // Client validation
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
 
    setLoading(true);
 
    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          password: form.password,
        }),
      });
 
      if (res.ok) {
        setSuccessMsg("Account created successfully! Please log in.");
        setOpenSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    }
 
    setLoading(false); // Re-enable the submit button
  };
 
  // Render
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      {/* ==================== SIDEBAR SECTION ==================== */}
      <Box 
        sx={{ 
          width: isOpen ? drawerWidth : 0, 
          flexShrink: 0,
          bgcolor: "#0B115A", 
          transition: "width 0.3s ease", 
          overflow: "hidden", 
          position: { xs: "fixed", md: "sticky" }, 
          top: 0, 
          left: 0,
          height: "100vh", 
          zIndex: 20,
          alignSelf: "flex-start",
          pointerEvents: isOpen ? "auto" : "none" 
        }}
      >
        <Box sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Logo Area */}
          <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box component="img" src="/logo.jpg" alt="Logo" sx={{ width: "80%", maxWidth: 150, borderRadius: 2, objectFit: "contain" }} />
          </Box>
          
          {/* Navigation Menu */}
          <List sx={{ mt: 2, flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 900) setIsOpen(false);
                    }} 
                    sx={{ mx: 2, borderRadius: 2, bgcolor: isActive ? "rgba(255,255,255,0.15)" : "transparent" }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "normal", color: "white" }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          
          {/* Auth Buttons (Login / Register) */}
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 'auto', p: 3 }}>
            <Button onClick={() => navigate("/Login")} fullWidth variant="outlined" sx={{ color: "white", borderColor: "white", mb: 1.5 }}>Login</Button>
            <Button onClick={() => navigate("/Register")} fullWidth variant="contained" sx={{ bgcolor: "#4359D7", color: "white" }}>Register</Button>
          </Box>

        </Box>
      </Box>

      {/* ==================== MOBILE OVERLAY BACKGROUND ==================== */}
      <Box 
        onClick={() => setIsOpen(false)} 
        sx={{ 
          //show on mobile and automatically hide on desktop 
          display: isOpen ? { xs: "block", md: "none" } : "none", 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          bgcolor: 'rgba(0,0,0,0.5)', zIndex: 15 
        }} 
      />

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
        {/* --- TOP HEADER (Toggle Menu & Title) --- */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Button onClick={() => setIsOpen(!isOpen)} sx={{ color: "#0B115A", fontSize: "1.8rem", mr: 2 }}>☰</Button>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#2b3674">Register</Typography>
            <Typography variant="body2" color="text.secondary">Create your account</Typography>
          </Box>
        </Box>

        {/* Main area */}
        <div className={`main register-main`}>
          <div className="auth-card">

            {/* Card header */}
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to stay protected</p>

            {/*validation or server errors */}
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">

              {/* Full name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              {/* Email */}
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

              {/* Password with strength bar */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

                {/* Strength bar only visible once the user starts typing */}
                {form.password && (
                  <div className="strength-bar-wrapper">
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
                    <span className={`strength-label level-text-${strength.level}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password*/}
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
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Shown only when both fields have a value and they don't match */}
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="field-error">Passwords do not match</p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="button auth-button" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Link back to login */}
            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>

          </div>
        </div>
        <Snackbar 
        open={openSuccess} 
        autoHideDuration={1500} 
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }} 
      >
        <Alert 
          onClose={() => setOpenSuccess(false)} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%', fontSize: '1.2rem', padding: '15px 30px', boxShadow: 5, borderRadius: 2 }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
}
 
export default Register;