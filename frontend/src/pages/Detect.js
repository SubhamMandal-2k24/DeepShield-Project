import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import { useAuth, API_BASE } from "../context/AuthContext";
import heroScan from "../assets/images/hero-scan.jpg";
import neuralNetwork from "../assets/images/neural-network.jpg";
import "./Detect.css";

const MAX_FILE_MB = 50;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".avi", ".webm"];

// Turn an HTTP status (and the server's own message, if any) into text a
// visitor can act on, instead of one generic "error connecting" alert.
function errorMessage(status, detail) {
  if (status === 413) return `File too large. The limit is ${MAX_FILE_MB} MB.`;
  if (status === 400 || status === 422) {
    return detail || "This file couldn't be processed. Try a different image or video.";
  }
  if (status === 500) return "Analysis failed. Please try another file.";
  if (status === 502 || status === 503 || status === 504) {
    return "The server is waking up or restarting. Wait a minute and try again.";
  }
  return "Something went wrong. Please try again.";
}

function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const applyFile = (selected) => {
    if (!selected) return;

    // Drag-and-drop skips the file picker's "accept" filter, so check here too.
    const name = selected.name.toLowerCase();
    if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      setError("Unsupported file type. Use JPG, PNG, MP4, MOV, AVI or WEBM.");
      return;
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`File too large. The limit is ${MAX_FILE_MB} MB.`);
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult("");
  };

  const handleFileChange = (e) => {
    applyFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    applyFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult("");
      setError("");

      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // 401 means the login expired: clear it and let the route guard
        // send the user back to the login page.
        if (response.status === 401) {
          logout();
          return;
        }

        let detail = "";
        try {
          const body = await response.json();
          if (typeof body.detail === "string") detail = body.detail;
        } catch (_) {
          // response had no JSON body; fall back to the status message
        }
        setError(errorMessage(response.status, detail));
        return;
      }

      const data = await response.json();
      setResult(data.result);
      setConfidence(data.confidence);
    } catch (err) {
      // fetch itself failed: no connection, or the server is still asleep
      setError(
        "Couldn't reach the server. If it has been idle it may still be waking up. Wait a minute and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult("");
    setConfidence(0);
    setError("");
  };

  return (
    <div className="detect-page">
      {/* 1. INTRO */}
      <section className="detect-intro">
        <div className="detect-intro-grid">
          <div className="detect-intro-text-col">
            <AnimatedText as="span" className="eyebrow">
              AI ANALYSIS ENGINE
            </AnimatedText>
            <AnimatedText as="h1" delay={0.1}>
              Detect what's <span className="text-gradient">real</span>
            </AnimatedText>
            <AnimatedText delay={0.2}>
              <p className="detect-intro-text">
                Upload a video or image below. The model samples frames from it
                and returns a confidence-scored verdict. The first request
                after a pause can take a minute while the server wakes up.
              </p>
            </AnimatedText>
          </div>

          <motion.div
            className="detect-intro-image-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="detect-hero-image-wrap">
              <img src={heroScan} alt="AI facial analysis scan" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. UPLOAD TOOL */}
      <section className="detect-tool-section">
        <motion.div
          className="detect-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="detect-card glass-card">
            <div
              className={`drop-zone ${dragActive ? "drop-zone-active" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,video/mp4,video/quicktime,video/webm,video/x-msvideo,.avi"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {!preview && (
                <div className="drop-zone-placeholder">
                  <p className="drop-zone-title">Drag &amp; drop your file here</p>
                  <p className="drop-zone-sub">or click to browse</p>
                </div>
              )}

              {preview && (
                <div className="preview">
                  {loading && <div className="scan-overlay" />}
                  {file.type.startsWith("image") ? (
                    <img src={preview} alt="preview" />
                  ) : (
                    <video src={preview} controls />
                  )}
                </div>
              )}
            </div>

            <motion.button
              className="primary-btn analyze-btn"
              onClick={handleUpload}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Media"}
            </motion.button>

            {error && (
              <p className="detect-error" role="alert">
                {error}
              </p>
            )}

            {loading && <div className="spinner"></div>}

            <AnimatePresence>
              {result && (
                <motion.div
                  className="result-box"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <h3 className={result === "REAL" ? "real" : "fake"}>
                    {result}
                  </h3>

                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>

                  <p className="confidence-label">{confidence}% Confidence</p>

                  <motion.button
                    className="reset-btn"
                    onClick={handleReset}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Check Another File
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS (mini) */}
      <section className="detect-section">
        <AnimatedText as="h2" className="section-title">
          What happens after you upload
        </AnimatedText>

        <motion.div
          className="how-it-works-banner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={neuralNetwork} alt="Neural network analyzing data" />
        </motion.div>

        <div className="mini-steps">
          {[
            { step: "01", title: "Frame extraction", desc: "Key frames are pulled from your file using OpenCV." },
            { step: "02", title: "Model inference", desc: "Each frame is scored by a ResNet50-based network." },
            { step: "03", title: "Aggregation", desc: "Frame scores are averaged into one stable verdict." },
          ].map((item, i) => (
            <AnimatedText key={item.step} delay={i * 0.15}>
              <GlassCard className="mini-step-card">
                <span className="mini-step-number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </GlassCard>
            </AnimatedText>
          ))}
        </div>
      </section>

      {/* 4. TIPS */}
      <section className="detect-section tips-section">
        <AnimatedText as="h2" className="section-title">
          Tips for accurate results
        </AnimatedText>
        <div className="tips-grid">
          {[
            "Use clear, well-lit footage or images for best accuracy.",
            "Videos with visible faces yield the most reliable results.",
            "Very short clips may reduce frame-sampling accuracy.",
            "Heavily compressed files can affect confidence scores.",
          ].map((tip, i) => (
            <AnimatedText key={tip} delay={i * 0.1}>
              <div className="tip-item">
                <span className="tip-marker" />
                <p>{tip}</p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Detect;