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
import "./login.css";
import "./App.js"
 
const drawerWidth = 260;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 900);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.logoutMessage) {
      setSuccessMsg(location.state.logoutMessage);
      setOpenSuccess(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
 
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
 
    setLoading(true);
 
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });
 
      if (res.ok) {
        const data = await res.json();
        setSuccessMsg("Login successful! Welcome back.");
        setOpenSuccess(true);
        
        const displayName = data.fullName
          ? data.fullName
          : (data.username || "").split("@")[0].replace(/[._]/g, " ");

        localStorage.setItem("username", data.username);
        localStorage.setItem("displayName", displayName);
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    }
 
    setLoading(false);
  };
 
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
            <Typography variant="h5" fontWeight="bold" color="#2b3674">Login</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
          </Box>
        </Box>

        <div className={`main login-main`}>
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
 
export default Login;