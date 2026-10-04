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
            DEEPFAKE DETECTION 
          </AnimatedText>
          <AnimatedText as="h1" delay={0.1}>
            See Through Every <span className="text-gradient">DeepFake</span>
          </AnimatedText>
          <AnimatedText as="p" delay={0.2}>
            Upload a video or image and let a deep learning model check it for
            signs of manipulation.
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
            { title: "Clear Result", desc: "A real or fake verdict with a confidence score." },
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

      {/* 3. BY THE NUMBERS */}
      <section className="section stats-section">
        <AnimatedText as="h2" className="section-title">
          By the Numbers
        </AnimatedText>

        <div className="stats-grid">
          <Counter to={75} suffix="%" label="Validation Accuracy (frame-level)" />
          <Counter to={10} suffix="" label="Frames Sampled per Video" />
          <Counter to={15} suffix="s" label="Typical Analysis Time (live demo)" />
          <Counter to={30} suffix="MB" label="Max Upload Size" />
        </div>

        <AnimatedText delay={0.1}>
          <p className="stats-note">
            Accuracy is measured on a held-out split of FaceForensics++ frames.
            Results on other kinds of media may be lower.
          </p>
        </AnimatedText>

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
              { title: "Built on a Benchmark Dataset", desc: "Trained on the FaceForensics++ DeepFakeDetection subset." },
              { title: "Frame-Level Analysis", desc: "Samples 10 frames per video and averages the model's predictions." },
              { title: "Private by Design", desc: "Uploads are analyzed and deleted right away. Only your result is saved to your history." },
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