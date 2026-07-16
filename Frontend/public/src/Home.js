import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  Typography, Button, Container, Grid, Card, CardContent
} from "@mui/material";

// Import icon cho mấy cái thông số
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UpdateIcon from '@mui/icons-material/Update';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const drawerWidth = 260;

function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { text: "About Us", path: "/about", icon: <InfoIcon sx={{ color: "white" }} /> },
    { text: "Spam Filter", path: "/spam", icon: <SecurityIcon sx={{ color: "white" }} /> },
    { text: "Malware Scan", path: "/malware", icon: <BugReportIcon sx={{ color: "white" }} /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      {/* 1. SIDEBAR */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 10,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0B115A", 
            color: "white",
            borderRight: "none",
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* GÓC TRÊN CÙNG BÊN TRÁI: CHỈ CÓ LOGO, ĐÃ XÓA CHỮ SWINTECH */}
          <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box 
              component="img" 
              src="/logo.jpg" 
              alt="Logo" 
              sx={{ 
                width: "80%", // Chỉnh độ to nhỏ của logo ở đây nè
                maxWidth: 150, 
                borderRadius: 2,
                objectFit: "contain"
              }} 
            />
          </Box>
          
          {/* Menu Links */}
          <List sx={{ mt: 2, flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 2, borderRadius: 2,
                      bgcolor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "normal" }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Login & Register Buttons */}
          <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <Button 
              component={Link} 
              to="/Login" 
              fullWidth 
              variant="outlined" 
              startIcon={<LoginIcon />}
              sx={{ 
                color: "white", 
                borderColor: "rgba(255,255,255,0.5)", 
                mb: 1.5,
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } 
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/Register" 
              fullWidth 
              variant="contained" 
              startIcon={<AppRegistrationIcon />}
              sx={{ 
                bgcolor: "#4359D7", 
                color: "white", 
                "&:hover": { bgcolor: "#3246B5" } 
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* 2. NỘI DUNG CHÍNH (HÌNH NỀN BACKGROUND) */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        transition: "margin 0.3s", 
        ml: isOpen ? 0 : `-${drawerWidth}px`,
        position: "relative",
        backgroundImage: `url('/picture_home.jpeg')`, // Hình nền nằm ở đây nè
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh"
      }}>
        
        {/* Lớp phủ mờ giúp chữ không bị chìm vào hình nền */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(244, 247, 254, 0.85)", zIndex: 0 }} />

        {/* Nội dung thực tế */}
        <Box sx={{ position: "relative", zIndex: 1, p: 4 }}>
          
          {/* Nút bật/tắt menu & Lời chào */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Button variant="text" onClick={() => setIsOpen(!isOpen)} sx={{ color: "#0B115A", mr: 2, fontSize: "1.2rem", minWidth: "auto" }}>☰</Button>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#2b3674">Welcome to Swintech Company</Typography>
              <Typography variant="body2" color="text.secondary">Email Security You Can Trust</Typography>
            </Box>
          </Box>

          <Container maxWidth="xl" disableGutters>
            
            <Grid container spacing={4}>
              {/* CỘT TRÁI: 4 Thẻ Thống Kê */}
              <Grid item xs={12} lg={5}>
                <Grid container spacing={3}>
                  
                  {/* Thẻ 1: 21s */}
                  <Grid item xs={12} sm={6}>
                    <Card elevation={2} sx={{ borderRadius: 3, p: 1, bgcolor: "rgba(255,255,255,0.9)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Protection speed</Typography>
                          <SpeedIcon sx={{ color: "#2196f3" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="#2b3674">21s</Typography>
                        <Typography variant="caption" sx={{ color: "#4caf50", display: "flex", alignItems: "center", mt: 1 }}>
                          <span style={{ color: "gray" }}>Fastest response time</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Thẻ 2: 100% */}
                  <Grid item xs={12} sm={6}>
                    <Card elevation={2} sx={{ borderRadius: 3, p: 1, bgcolor: "rgba(255,255,255,0.9)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Security commitment</Typography>
                          <VerifiedUserIcon sx={{ color: "#4caf50" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="#2b3674">100%</Typography>
                        <Typography variant="caption" sx={{ color: "#4caf50", display: "flex", alignItems: "center", mt: 1 }}>
                          <span style={{ color: "gray" }}>Guaranteed safety</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Thẻ 3: 24/7 */}
                  <Grid item xs={12} sm={6}>
                    <Card elevation={2} sx={{ borderRadius: 3, p: 1, bgcolor: "rgba(255,255,255,0.9)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">System monitoring</Typography>
                          <UpdateIcon sx={{ color: "#ff9800" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="#2b3674">24/7</Typography>
                        <Typography variant="caption" sx={{ color: "#4caf50", display: "flex", alignItems: "center", mt: 1 }}>
                          <span style={{ color: "gray" }}>Real-time updates</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Thẻ 4: Total Scans */}
                  <Grid item xs={12} sm={6}>
                    <Card elevation={2} sx={{ borderRadius: 3, p: 1, bgcolor: "rgba(255,255,255,0.9)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Total AI Scans</Typography>
                          <AssessmentIcon sx={{ color: "#9c27b0" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="#2b3674">2,000</Typography>
                        <Typography variant="caption" sx={{ color: "#4caf50", display: "flex", alignItems: "center", mt: 1 }}>
                          <span style={{ color: "gray" }}>Accurate predictions</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </Grid>

              {/* CỘT PHẢI: Biểu đồ bự */}
              <Grid item xs={12} lg={7}>
                <Card elevation={2} sx={{ borderRadius: 3, height: "100%", p: 2, bgcolor: "rgba(255,255,255,0.9)" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="#2b3674" gutterBottom>
                      Daily Scanning Chart
                    </Typography>
                    <Box sx={{ 
                      mt: 3, height: 250, borderRadius: 2, 
                      background: "linear-gradient(180deg, rgba(136,132,216,0.3) 0%, rgba(136,132,216,0) 100%)",
                      borderBottom: "3px solid #8884d8",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                       <Typography color="#8884d8" fontWeight="bold">[ Line Chart Area ]</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>

            {/* BANNER XANH Ở DƯỚI */}
            <Box sx={{ mt: 6 }}>
              <Card elevation={3} sx={{ borderRadius: 4, bgcolor: "#4359D7", color: "white", overflow: "hidden", position: "relative" }}>
                <Box sx={{ p: { xs: 4, md: 8 }, zIndex: 2, position: "relative" }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Better Security;<br/>Less Risk.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    Protect your business with a single, AI-powered email security solution.
                  </Typography>
                  <Box>
                    <Button component={Link} to="/spam" variant="contained" sx={{ bgcolor: "white", color: "#4359D7", fontWeight: "bold", mr: 2, px: 4, py: 1.5, "&:hover": { bgcolor: "#f4f6f8" } }}>
                      Test Spam AI
                    </Button>
                    <Button component={Link} to="/malware" variant="outlined" sx={{ color: "white", borderColor: "white", px: 4, py: 1.5 }}>
                      Test Malware AI
                    </Button>
                  </Box>
                </Box>
                
                {/* Trang trí hiệu ứng cắt vát */}
                <Box sx={{ position: "absolute", top: 0, right: "-10%", width: "50%", height: "100%", bgcolor: "rgba(255,255,255,0.05)", transform: "skewX(-20deg)" }} />
                <Box sx={{ position: "absolute", top: 0, right: "-20%", width: "50%", height: "100%", bgcolor: "rgba(255,255,255,0.05)", transform: "skewX(-20deg)" }} />
              </Card>
            </Box>

          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;