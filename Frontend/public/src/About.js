import { useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";


function About() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="container">
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

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
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>

      <div className={`about-main ${isOpen ? "shift" : ""}`}>
        <section className="about-section intro">
          <h1>About Us</h1>
          <p>
            We are a team of passionate developers from Swinburne University, driven by a love for web design and development with a strong focus on building safe, secure, and innovative online experiences. Our mission is to create websites and applications that not only look great and function seamlessly but also actively protect users against spam, malware, and other digital threats. By combining creativity, technical expertise, and a commitment to security, we strive to deliver solutions that inspire trust, empower communities, and contribute to a safer digital world.

          </p>
        </section>

        <section className="about-section mission">
          <h2>OUR MISSION</h2>
          <p>
            Our mission is to design and build secure, innovative, and user‑friendly web solutions that protect communities from spam, malware, and other online threats. As developers from Swinburne University, we are committed to combining creativity with technical expertise to deliver platforms that inspire trust, empower users, and contribute to a safer digital environment. We strive to push boundaries, embrace new technologies, and continuously improve, ensuring that every project we create not only meets the highest standards of design and functionality but also strengthens the resilience of the web against evolving challenges.
          </p>
        </section>

        <section className="about-section vision">
          <h2>OUR VISION</h2>
          <p>
            Our vision is to shape a digital world where security and creativity coexist seamlessly. We aspire to build web platforms that are not only visually engaging and highly functional but also resilient against spam, malware, and evolving online threats. As developers from Swinburne University, we envision a future where users can explore, connect, and innovate with confidence, knowing that the technology supporting them is trustworthy and secure. By embracing innovation, collaboration, and continuous learning, we aim to contribute to a safer, smarter, and more inspiring internet for communities everywhere.
          </p>
        </section>

        <section className="about-section values">
          <h2>OUR VALUES</h2>
          <ul>
            <li>Security first</li>
            <li>User protection</li>
            <li>Innovation</li>
          </ul>
        </section>

        {/* Team section at the bottom */}
        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <img src="/Duong.jpeg" alt="Member 1" />
              <h3>Name 1</h3>
              <p>Role</p>
            </div>
            <div className="team-card">
              <img src="/Nhu.jpeg" alt="Member 2" />
              <h3>Name 2</h3>
              <p>Role</p>
            </div>
            <div className="team-card">
              <img src="/Dat.jpeg" alt="Member 3" />
              <h3>Name 3</h3>
              <p>Role</p>
            </div>
            <div className="team-card">
              <img src="/Nguyen.jpeg" alt="Member 4" />
              <h3>Name 4</h3>
              <p>Role</p>
            </div>
            <div className="team-card">
              <img src="/member5.jpg" alt="Member 5" />
              <h3>Name 5</h3>
              <p>Role</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
