import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult("");
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

  return (
    <motion.div
      className="detect-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="detect-card">
        <h2>AI Deepfake Analyzer</h2>

        <input type="file" onChange={handleFileChange} />

        {preview && (
          <div className="preview">
            {file.type.startsWith("image") ? (
              <img src={preview} alt="preview" />
            ) : (
              <video src={preview} controls />
            )}
          </div>
        )}

        <button onClick={handleUpload}>
          {loading ? "Analyzing..." : "Analyze Media"}
        </button>

        {loading && <div className="spinner"></div>}

        {result && (
          <div className="result-box">
            <h3 className={result === "REAL" ? "real" : "fake"}>
              {result}
            </h3>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>

            <p>{confidence}% Confidence</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Detect;