import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import { API_BASE } from "../context/AuthContext";
import "./History.css";

function History() {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load history");
        }

        const data = await response.json();
        setScans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const formatDate = (isoString) => {
  // Ensure the string is treated as UTC if no timezone info is present
  const utcString = isoString.endsWith("Z") ? isoString : isoString + "Z";
  const date = new Date(utcString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

  return (
    <div className="history-page">
      <section className="history-intro">
        <AnimatedText as="span" className="eyebrow">
          YOUR ACTIVITY
        </AnimatedText>
        <AnimatedText as="h1" delay={0.1}>
          Scan <span className="text-gradient">history</span>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p className="history-lead">
            Every file you've analyzed, with its result and confidence score.
          </p>
        </AnimatedText>
      </section>

      <section className="history-body">
        {loading && <p className="history-status">Loading your history...</p>}

        {error && <p className="history-status history-error">{error}</p>}

        {!loading && !error && scans.length === 0 && (
          <AnimatedText>
            <GlassCard className="history-empty-card">
              <p>You haven't analyzed any files yet.</p>
            </GlassCard>
          </AnimatedText>
        )}

        {!loading && !error && scans.length > 0 && (
          <div className="history-grid">
            {scans.map((scan, i) => (
              <AnimatedText key={scan.id} delay={i * 0.05}>
                <motion.div className="history-card glass-card">
                  <div className="history-card-top">
                    <span
                      className={`history-badge ${
                        scan.result === "REAL" ? "real" : "fake"
                      }`}
                    >
                      {scan.result}
                    </span>
                    <span className="history-confidence">
                      {scan.confidence}%
                    </span>
                  </div>
                  <p className="history-filename">{scan.filename}</p>
                  <p className="history-date">{formatDate(scan.created_at)}</p>
                </motion.div>
              </AnimatedText>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default History;