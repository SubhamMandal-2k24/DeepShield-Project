import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroScene from "../components/HeroScene";
import GlassCard from "../components/GlassCard";
import AnimatedText from "../components/AnimatedText";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 1. HERO */}
      <section className="hero">
        <HeroScene />
        <div className="hero-content">
          <AnimatedText as="span" className="eyebrow">
            NEXT-GEN MEDIA FORENSICS
          </AnimatedText>
          <AnimatedText as="h1" delay={0.1}>
            See Through Every <span className="text-gradient">DeepFake</span>
          </AnimatedText>
          <AnimatedText as="p" delay={0.2}>
            Upload a video or image and let AI analyze authenticity in seconds.
          </AnimatedText>
          <motion.button
            className="primary-btn"
            onClick={() => navigate("/detect")}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Try Now
          </motion.button>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="section cards-section">
        <AnimatedText as="h2" className="section-title">
          How It Works
        </AnimatedText>
        <div className="cards">
          {[
            { title: "Upload Video/Image", desc: "Select your file securely." },
            { title: "AI Analysis", desc: "Model checks manipulation patterns." },
            { title: "Instant Result", desc: "Real or Deepfake detection." },
          ].map((item, i) => (
            <AnimatedText key={item.title} delay={i * 0.15}>
              <GlassCard className="card">
                <div className="card-index">{`0${i + 1}`}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </GlassCard>
            </AnimatedText>
          ))}
        </div>
      </section>

      {/* 3. STATS */}
      <section className="section stats-section">
        <div className="stats-grid">
          <Counter to={99} suffix="%" label="Detection Accuracy" />
          <Counter to={12000} suffix="+" label="Scans Completed" />
          <Counter to={3} suffix="" label="AI Models Combined" />
          <Counter to={2} suffix="s" label="Avg. Analysis Time" />
        </div>
      </section>

      {/* 4. LIVE DEMO PREVIEW */}
      <section className="section demo-section">
        <AnimatedText as="h2" className="section-title">
          See It In Action
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <GlassCard className="demo-card">
            <div className="demo-preview">
              <div className="scan-line" />
              <p>Drop a file. Get an answer. That simple.</p>
            </div>
            <motion.button
              className="primary-btn"
              onClick={() => navigate("/detect")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Launch Detector
            </motion.button>
          </GlassCard>
        </AnimatedText>
      </section>

      {/* 5. WHY DEEPSHIELD */}
      <section className="section why-section">
        <AnimatedText as="h2" className="section-title">
          Why DeepShield
        </AnimatedText>
        <div className="why-layout">
          <AnimatedText className="why-image-wrap">
            <img src="/images/scan-1.jpg" alt="Biometric scan technology" className="why-image" />
          </AnimatedText>
          <div className="why-list">
            {[
              { title: "Trained on Real-World Data", desc: "Built using the FaceForensics++ benchmark dataset." },
              { title: "Frame-Level Precision", desc: "Analyzes manipulation patterns frame by frame, not just metadata." },
              { title: "Fast & Private", desc: "Your uploads are processed securely and never stored longer than needed." },
            ].map((item, i) => (
              <AnimatedText key={item.title} delay={i * 0.15}>
                <div className="why-item">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </AnimatedText>
            ))}
          </div>
        </div>
      </section>
      

      <Footer />
    </div>
  );
}

export default Home;