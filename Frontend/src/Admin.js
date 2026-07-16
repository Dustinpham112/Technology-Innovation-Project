import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import "./Admin.css";

const drawerWidth = 260;

function Admin() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 900);
  
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "";
  const displayName = localStorage.getItem("displayName") || username.split("@")[0].replace(/[._]/g, " ");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access Denied! Admins only.");
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:8000/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:8000/admin/history")
      .then(res => res.json())
      .then(data => setHistory(data.history || []))
      .catch(err => console.error(err));
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { state: { logoutMessage: "Logout successful! Please log in again." } });
  };

  const menuItems = [
    { text: "Home", path: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { text: "About", path: "/about", icon: <InfoIcon sx={{ color: "white" }} /> },
    { text: "Spam", path: "/spam", icon: <SecurityIcon sx={{ color: "white" }} /> },
    { text: "Malware", path: "/malware", icon: <BugReportIcon sx={{ color: "white" }} /> },
    { text: "Admin Panel", path: "/admin", icon: <AdminPanelSettingsIcon sx={{ color: "white" }} /> },
  ];

  return (
    <Box className="admin-container">
      
      {/* ==================== SIDEBAR SECTION ==================== */}
      <Box 
        className="admin-sidebar"
        sx={{ 
          width: isOpen ? drawerWidth : 0, 
          position: { xs: "fixed", md: "sticky" }, 
          top: 0, 
          left: 0,
          zIndex: 20,
          alignSelf: "flex-start",
          pointerEvents: isOpen ? "auto" : "none" 
        }}
      >
        <Box className="admin-sidebar-wrapper">
          
          {/* Logo Area */}
          <Box className="admin-logo-area">
            <Box component="img" src="/logo.jpg" alt="Logo" className="admin-logo" />
          </Box>
          
          {/* Navigation Menu */}
          <List className="admin-menu">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} className="admin-menu-item" disablePadding>
                  <ListItemButton 
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 900) setIsOpen(false);
                    }}
                    className={isActive ? "active" : ""}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "normal", color: "white" }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          
          {/* Auth Buttons */}
          <Box className="admin-logout-area">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4359D7', width: 48, height: 48, fontWeight: 'bold' }}>
                  {initials || 'U'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="white" noWrap>{displayName}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '180px' }}>{username}</Typography>
                </Box>
              </Box>
            </Box>
            <Button onClick={handleLogout} fullWidth variant="contained" color="error">Logout</Button>
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
      <Box component="main" className="admin-main" sx={{ bgcolor: "#f4f7fe" }}>
        <Box className="admin-header">
          <Button 
            onClick={() => setIsOpen(!isOpen)}
            sx={{ 
              color: "#0B115A", 
              fontSize: "1.8rem", 
              mr: 2 
            }}
          >
            ☰
          </Button>
          <Box className="admin-header-content">
            <Typography variant="h4">Admin Dashboard</Typography>
            <Typography variant="body2">Manage users and view system detections</Typography>
          </Box>
        </Box>

        <Card className="admin-card">
          <CardContent className="admin-card-content">
            <Typography className="admin-card-title">Registered Users</Typography>
            <div className="admin-table-container">
              <Table size="small" className="admin-table">
                <TableHead>
                  <TableRow>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Username</b></TableCell>
                    <TableCell><b>Password</b></TableCell>
                    <TableCell><b>Role</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.password}</TableCell>
                      <TableCell>{u.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardContent className="admin-card-content">
            <Typography className="admin-card-title">System Detection History</Typography>
            <div className="admin-table-container">
              <Table size="small" className="admin-table">
                <TableHead>
                  <TableRow>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Type</b></TableCell>
                    <TableCell><b>Content/File</b></TableCell>
                    <TableCell><b>Result</b></TableCell>
                    <TableCell><b>Timestamp</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.id}</TableCell>
                      <TableCell>{h.type}</TableCell>
                      <TableCell>{h.content}</TableCell>
                      <TableCell>
                         <span className={h.prediction === "Spam" || h.prediction === "Malware" ? "prediction-spam" : "prediction-safe"}>
                           {h.prediction}
                         </span>
                      </TableCell>
                      <TableCell>{h.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Admin;