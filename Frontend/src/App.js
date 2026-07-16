import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Spam from "./Spam";
import Malware from "./Malware";
import Login from "./login.js";
import Register from "./register.js";
import Admin from "./Admin.js";

/* ===== ROUTER ===== */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Spam" element={<Spam />} />
        <Route path="/malware" element={<Malware />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
