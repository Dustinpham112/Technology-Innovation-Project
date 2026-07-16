import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  Typography, Button, Avatar
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import InfoIcon from '@mui/icons-material/Info';
import "./Spam.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const BASE_URL = "http://127.0.0.1:8000";

const drawerWidth = 260;

function Spam() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
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

  // Sidebar menu configuration
  const menuItems = [
    { text: "Home", path: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { text: "About", path: "/about", icon: <InfoIcon sx={{ color: "white" }} /> },
    { text: "Spam", path: "/spam", icon: <SecurityIcon sx={{ color: "white" }} /> },
    { text: "Malware", path: "/malware", icon: <BugReportIcon sx={{ color: "white" }} /> },
  ];
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/predict/spam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();
      setResult(data);
      setHistory((prev) => [
        ...prev,
        { text: data.original_text, prediction: data.prediction, true_label: data.true_label },
      ]);
      setText("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const spamCount = history.filter((h) => h.prediction === "Spam").length;
  const notSpamCount = history.filter((h) => h.prediction === "Not Spam").length;
  const total = history.length;
  const spamPct = total > 0 ? Math.round((spamCount / total) * 100) : 0;
  const notSpamPct = total > 0 ? Math.round((notSpamCount / total) * 100) : 0;

  // Calculate confusion matrix values
  let TP = 0, FP = 0, TN = 0, FN = 0;
  history.forEach((h) => {
    if (h.true_label) {
      if (h.prediction === "Spam" && h.true_label === "Spam") TP++;
      else if (h.prediction === "Spam" && h.true_label === "Not Spam") FP++;
      else if (h.prediction === "Not Spam" && h.true_label === "Not Spam") TN++;
      else if (h.prediction === "Not Spam" && h.true_label === "Spam") FN++;
    }
  });

  const totalWithTrue = TP + FP + TN + FN;
  const accuracy = totalWithTrue > 0 ? (TP + TN) / totalWithTrue : 0;
  const precision = (TP + FP) > 0 ? TP / (TP + FP) : 0;
  const recall = (TP + FN) > 0 ? TP / (TP + FN) : 0;
  const f1 = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

  const barData = {
    labels: ["Spam", "Not Spam"],
    datasets: [{
      data: [spamCount, notSpamCount],
      backgroundColor: ["#E24B4A", "#1D9E75"],
      borderRadius: 6,
    }],
  };

  const pieData = {
    labels: [`Spam (${spamPct}%)`, `Not Spam (${notSpamPct}%)`],
    datasets: [{
      data: [spamCount, notSpamCount],
      backgroundColor: ["#E24B4A", "#1D9E75"],
      borderWidth: 0,
    }],
  };

  const isSpam = result?.prediction === "Spam";

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
          // Anti-freeze spell: When sidebar closes, lock all hidden clicks
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
          // Only show on mobile (xs) and automatically hide on desktop (md)
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
            <Typography variant="h5" fontWeight="bold" color="#2b3674">Spam Detection</Typography>
            <Typography variant="body2" color="text.secondary">Analyze Text Content</Typography>
          </Box>
        </Box>

        <div className="text-section">
          <p>Enter text to detect spam:</p>

          {/* upload left, charts right */}
          <div className="analyze-row">

            {/* file upload */}
            <div className="analyze-left">
              <form onSubmit={handleSubmit}>
                <div className="upload-box">
                  <textarea
                    placeholder="Type your text here..."
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setError(null);
                      setResult(null);
                    }}
                  />
                  <div style={{ textAlign: "right", color: "#6b7280", fontSize: "0.85rem", marginTop: "8px", fontWeight: "500" }}>
                    Word count: {wordCount}
                  </div>
                </div>

                <button className="button" type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Classify Text"}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div className="result-box error">
                  <p>{error}</p>
                </div>
              )}

              {/* result */}
              {result && (
                <div className={`result-box ${isSpam ? "spam" : "not-spam"}`}>
                  <p className="result-label">Result</p>
                  <p className="result-value">{result.prediction}</p>
                  <p className="result-text">"{result.original_text}"</p>
                </div>
              )}
            </div>

            {/*charts */}
            {history.length > 0 && (
              <div className="analyze-right">

                {/* Confusion Matrix */}
                <div className="confusion-matrix">
                  <h3>Confusion Matrix ({total} times)</h3>
                  <table className="confusion-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Actual Spam</th>
                        <th>Actual Not Spam</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Predicted Spam</td>
                        <td>{spamCount}</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>Predicted Not Spam</td>
                        <td>0</td>
                        <td>{notSpamCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bar chart */}
                <div className="chart-card">
                  <h3>Spam vs Not Spam</h3>
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } },
                      },
                    }}
                  />
                </div>

                {/* Pie chart */}
                <div className="chart-card">
                  <h3>Spam vs Not Spam (%)</h3>
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "bottom" },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
                          },
                        },
                      },
                    }}
                  />
                </div>

              </div>
            )}
          </div>

          {/* history */}
          {history.length > 0 && (
            <div className="chart-card" style={{ marginTop: "24px" }}>
              <h3>History ({total} times)</h3>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Text</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="history-text">{h.text}</td>
                      <td>
                        <span className={`badge ${h.prediction === "Spam" ? "badge-spam" : "badge-safe"}`}>
                          {h.prediction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="button-clear"
                onClick={() => { setHistory([]); setResult(null); }}
              >
                Reset
              </button>
            </div>
          )}

        </div>
      </Box>
    </Box>
  );
}

export default Spam;