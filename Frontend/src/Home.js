import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  Typography, Button, Container, Grid, Card, CardContent, Avatar
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UpdateIcon from '@mui/icons-material/Update';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 260;

function Home() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 900);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("token") !== null;
  const username = localStorage.getItem("username") || "";
  const displayName = localStorage.getItem("displayName") || username.split("@")[0].replace(/[._]/g, " ");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  // processing log out
  const handleLogout = () => {
    localStorage.clear(); // delete all
    navigate("/login", { state: { logoutMessage: "Logout successful! Please log in again." } });
  };

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
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#4359D7', width: 48, height: 48, fontWeight: 'bold' }}>
                    {initials || 'U'}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="white" noWrap>{displayName}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '180px' }}>{username}</Typography>
                  </Box>
                </Box>
                <Button 
                  onClick={handleLogout} 
                  fullWidth 
                  variant="contained" 
                  color="error"
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} fullWidth variant="outlined" sx={{ color: "white", borderColor: "white", mb: 1.5 }}>Login</Button>
                <Button onClick={() => navigate("/register")} fullWidth variant="contained" sx={{ bgcolor: "#4359D7", color: "white" }}>Register</Button>
              </>
            )}
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
      <Box component="main" sx={{ flexGrow: 1, width: "100%", position: "relative", backgroundImage: `url('/picture_home.jpeg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.7)", zIndex: 0 } }}>
        <Box sx={{ position: "relative", zIndex: 2, p: { xs: 2, md: 4 } }}>
          
          {/* --- TOP HEADER (Toggle Menu & Title) --- */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Button onClick={() => setIsOpen(!isOpen)} sx={{ color: "#0B115A", fontSize: "1.8rem", mr: 2 }}>☰</Button>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#2b3674">Welcome to Swintech Company</Typography>
              <Typography variant="body2" color="text.secondary">Email Security You Can Trust</Typography>
            </Box>
          </Box>

          <Container maxWidth="xl" disableGutters>
            
            {/* --- STATISTICS CARDS (4 Info Boxes) --- */}
            <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 8 }}>
              {[
                { title: "Protection speed", val: "21s", icon: <SpeedIcon color="primary" /> },
                { title: "Security commitment", val: "100%", icon: <VerifiedUserIcon color="success" /> },
                { title: "System monitoring", val: "24/7", icon: <UpdateIcon sx={{ color: '#ff9800' }} /> },
                { title: "Total AI Scans", val: "2,000", icon: <AssessmentIcon sx={{ color: '#9c27b0' }} /> }
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Card elevation={2} sx={{ borderRadius: 4, p: 2, bgcolor: "rgba(255,255,255,0.9)", transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">{item.title}</Typography>
                        {item.icon}
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="#2b3674">{item.val}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* --- CALL TO ACTION BOX (Test AI Buttons) --- */}
            <Box sx={{ mb: 8 }}>
              <Card elevation={3} sx={{ borderRadius: 4, bgcolor: "#4359D7", color: "white", p: { xs: 4, md: 6 } }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>Better Security;<br/>Less Risk.</Typography>
                <Typography sx={{ mb: 4, opacity: 0.9 }}>Protect your business with a single, AI-powered email security solution.</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button onClick={() => navigate("/spam")} variant="contained" sx={{ bgcolor: "white", color: "#4359D7", fontWeight: "bold", width: { xs: '100%', sm: 'auto' } }}>Test Spam AI</Button>
                  <Button onClick={() => navigate("/malware")} variant="outlined" sx={{ color: "white", borderColor: "white", width: { xs: '100%', sm: 'auto' } }}>Test Malware AI</Button>
                </Box>
              </Card>
            </Box>

            {/* --- BOTTOM INFORMATION BOX --- */}
            <Box sx={{ pb: 8 }}>
              <Card elevation={2} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, bgcolor: "rgba(255,255,255,0.95)" }}>
                <Typography variant="h4" fontWeight="bold" color="#2b3674" gutterBottom sx={{ borderLeft: "5px solid #4359D7", pl: 2 }}>
                  Protect your business with a single, AI-powered email security solution
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 3, fontSize: "1.1rem", lineHeight: 1.8 }}>
                  Unlike attacks on devices and systems, email attacks always target your people. Swintech Email Protection provides everything you need to protect your people and organization against all email threat types, eliminating the need for separate email and data protection solutions.
                </Typography>
              </Card>
            </Box>

          </Container>
        </Box>
      </Box>
    </Box>
  );
}
export default Home;