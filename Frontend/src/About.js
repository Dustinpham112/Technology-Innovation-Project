import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  Typography, Button, Container, Grid, Card, CardContent, CardMedia, Avatar
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';

// Sidebar width constant
const drawerWidth = 260;

function About() {
  // Setup state for sidebar (open on PC, closed on Mobile)
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

  // Handle responsive sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Team members data array
  const teamMembers = [
    { name: "Pham Do Dat", role: "Leader", img: "/Dat.jpeg" },
    { name: "Le Ngoc Trieu Duong", role: "best member", img: "/Duong.jpeg" },
    { name: "Duong Thoai Nhu", role: "best member", img: "/Nhu.jpeg" },
    { name: "Nguyen Thi Mai Nguyen", role: "best member", img: "/Nguyen.jpeg" },
    { name: "Tran Ngo Anh Khoi", role: "best member", img: "/Khoi.jpg" },
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
          // # FIXED: Added alignSelf spell so Sidebar always sticks to the top corner when scrolling
          alignSelf: "flex-start",
          pointerEvents: isOpen ? "auto" : "none" 
        }}
      >
        <Box sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Logo Area */}
          <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <Box component="img" src="/logo.jpg" alt="Logo" sx={{ width: "80%", maxWidth: 150, borderRadius: 2 }} />
          </Box>
          
          {/* Navigation Menu */}
          <List sx={{ mt: 2, flexGrow: 1 }}>
            {[
              { text: "Home", path: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
              { text: "About", path: "/about", icon: <InfoIcon sx={{ color: "white" }} /> },
              { text: "Spam", path: "/spam", icon: <SecurityIcon sx={{ color: "white" }} /> },
              { text: "Malware", path: "/malware", icon: <BugReportIcon sx={{ color: "white" }} /> },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => { 
                    navigate(item.path); 
                    if (window.innerWidth < 900) setIsOpen(false); 
                  }} 
                  sx={{ mx: 2, borderRadius: 2, bgcolor: location.pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent" }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ color: "white" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          {/* Auth Buttons */}
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
      <Box component="main" sx={{ flexGrow: 1, position: "relative", backgroundImage: `url('/school.jpg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.75)", zIndex: 0 } }}>
        <Box sx={{ position: "relative", zIndex: 2, p: { xs: 2, md: 4 } }}>
          
          {/* --- TOP HEADER (Toggle Menu & Title) --- */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Button onClick={() => setIsOpen(!isOpen)} sx={{ color: "#0B115A", fontSize: "1.8rem", mr: 2 }}>☰</Button>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#2b3674">About Us</Typography>
              <Typography variant="body2" color="text.secondary">Swintech Development Team</Typography>
            </Box>
          </Box>

          <Container maxWidth="xl" disableGutters>
            
            {/* --- WHO WE ARE BOX --- */}
            <Card elevation={3} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, bgcolor: "rgba(255,255,255,0.95)", mb: 5, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Typography variant="h4" fontWeight="bold" color="#4359D7" gutterBottom>Who We Are</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                We are a team of passionate developers from Swinburne University, driven by a love for web design and development with a strong focus on building safe, secure, and innovative online experiences. Our mission is to create websites and applications that not only look great and function seamlessly but also actively protect users against spam, malware, and other digital threats. By combining creativity, technical expertise, and a commitment to security, we strive to deliver solutions that inspire trust, empower communities, and contribute to a safer digital world.
              </Typography>
            </Card>

            {/* --- OUR MISSION BOX --- */}
            <Card elevation={3} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, bgcolor: "rgba(255,255,255,0.95)", mb: 5, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Typography variant="h5" fontWeight="bold" color="#2b3674" gutterBottom>OUR MISSION</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Our mission is to design and build secure, innovative, and user‑friendly web solutions that protect communities from spam, malware, and other online threats. As developers from Swinburne University, we are committed to combining creativity with technical expertise to deliver platforms that inspire trust, empower users, and contribute to a safer digital environment. We strive to push boundaries, embrace new technologies, and continuously improve, ensuring that every project we create not only meets the highest standards of design and functionality but also strengthens the resilience of the web against evolving challenges.
              </Typography>
            </Card>

            {/* --- OUR VISION BOX --- */}
            <Card elevation={3} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, bgcolor: "rgba(255,255,255,0.95)", mb: 5, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
              <Typography variant="h5" fontWeight="bold" color="#2b3674" gutterBottom>OUR VISION</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Our vision is to shape a digital world where security and creativity coexist seamlessly. We aspire to build web platforms that are not only visually engaging and highly functional but also resilient against spam, malware, and evolving online threats. As developers from Swinburne University, we envision a future where users can explore, connect, and innovate with confidence, knowing that the technology supporting them is trustworthy and secure. By embracing innovation, collaboration, and continuous learning, we aim to contribute to a safer, smarter, and more inspiring internet for communities everywhere.
              </Typography>
            </Card>

            {/* --- MEET OUR TEAM SECTION --- */}
            <Box sx={{ mt: { xs: 4, md: 6 }, mb: 8, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="#2b3674" sx={{ mb: { xs: 4, md: 6 } }}>Meet Our Team</Typography>
              <Grid container spacing={{ xs: 4, sm: 3, md: 3 }} justifyContent="center">
                {teamMembers.map((member, idx) => (
                  <Grid item key={idx} xs={12} sm={6} md={2.4}>
                    <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-12px)', boxShadow: 8 } }}>
                      <CardMedia component="img" height="250" image={member.img} alt={member.name} sx={{ objectFit: 'cover' }} />
                      <CardContent sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <Typography variant="h6" fontWeight="bold" color="#2b3674">{member.name}</Typography>
                        <Typography variant="subtitle2" color="#4359D7">{member.role}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

          </Container>
        </Box>
      </Box>
    </Box>
  );
}
export default About;