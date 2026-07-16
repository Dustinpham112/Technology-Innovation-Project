import { useState } from "react";
import { Link } from "react-router-dom";
import "./Spam.css";
import "./App";

function Spam() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!text.trim()) {
    alert("Please enter text");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/predict/spam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });

    const data = await res.json();

    alert(`Result: ${data.prediction}`);
    console.log(data);

  } catch (err) {
    console.error(err);
    alert("Server error");
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
            <Link to="/spam">
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
      <div className={`main ${isOpen ? "shift" : ""}`}>
        {/* Text + Upload */}
        <div className="text-section">
          <h2>Analyze Text Content</h2>
          <p>Enter text or upload file to detect spam:</p>

          <form onSubmit={handleSubmit}>
            <div className="upload-box">

              <textarea
                placeholder="Type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>

              <div className="file-upload">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && <p>📄 {file.name}</p>}
              </div>

            </div>

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Classify Text"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Spam;
