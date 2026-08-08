import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import "./Detect.css";

function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const applyFile = (selected) => {
    if (!selected) return;
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
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult("");

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      console.log(data);
      setResult(data.result);
      setConfidence(data.confidence);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend.");
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
  };

  return (
    <div className="detect-page">
      {/* 1. INTRO */}
      <section className="detect-intro">
        <AnimatedText as="span" className="eyebrow">
          AI ANALYSIS ENGINE
        </AnimatedText>
        <AnimatedText as="h1" delay={0.1}>
          Detect what's <span className="text-gradient">real</span>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p className="detect-intro-text">
            Upload a video or image below. Our model analyzes it frame by
            frame and returns a confidence-scored verdict in seconds.
          </p>
        </AnimatedText>
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