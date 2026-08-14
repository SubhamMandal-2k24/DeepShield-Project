import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroScene from "../components/HeroScene";
import GlassCard from "../components/GlassCard";
import AnimatedText from "../components/AnimatedText";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import homeHero from "../assets/images/home-hero.jpg";
import homeComparison from "../assets/images/home-comparison.jpg";
import "./Home.css";

function HomeImageBanner({ src, alt, withScanLine }) {
  return (
    <motion.div
      className="home-banner"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="home-banner-wrap">
        <img src={src} alt={alt} />
        {withScanLine && <div className="scan-line" />}
      </div>
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* 1. HERO */}
      <section className="hero">
        <div className="hero-grid" />
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

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <motion.button
              className="primary-btn"
              onClick={() => navigate("/detect")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Try Now
            </motion.button>
            <motion.button
              className="ghost-btn"
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-badges"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="hero-badge">
              <span className="badge-dot" /> ResNet50 Powered
            </span>
            <span className="hero-badge">
              <span className="badge-dot pink" /> Frame-Level Analysis
            </span>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span />
        </motion.div>
      </section>

      <HomeImageBanner
        src={homeHero}
        alt="Real versus deepfake facial analysis"
        withScanLine
      />

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

     {/* 3. WHY IT'S RELIABLE */}
      <section className="section stats-section">
        <AnimatedText as="h2" className="section-title">
          Why It's Reliable
        </AnimatedText>

        <div className="stats-grid">
          <Counter to={95} suffix="%" label="Detection Accuracy" />
          <Counter to={1200} suffix="+" label="Scans Completed" />
          <Counter to={1} suffix="" label="AI Model (ResNet50)" />
          <Counter to={7} suffix="s" label="Avg. Analysis Time" />
        </div>

        <div className="stats-grid stats-grid-secondary">
          {[
            { label: "Architecture", value: "ResNet50" },
            { label: "Training Data", value: "FaceForensics++" },
            { label: "Analysis Method", value: "Frame-Level" },
            { label: "Framework", value: "PyTorch" },
          ].map((item, i) => (
            <AnimatedText key={item.label} delay={i * 0.1}>
              <div className="stat-item">
                <h2 className="stat-number stat-text">{item.value}</h2>
                <p className="stat-label">{item.label}</p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </section>

      <HomeImageBanner
        src={homeComparison}
        alt="Authentic versus manipulated media comparison"
      />

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