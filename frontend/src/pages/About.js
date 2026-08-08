import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import "./About.css";

const methodology = [
  "Video or image upload and temporary storage",
  "Frame extraction using OpenCV",
  "Frame sampling and preprocessing",
  "Deep neural network inference",
  "Probability aggregation and confidence scoring",
  "Final classification (REAL / FAKE)",
];

const techStack = [
  "PyTorch",
  "ResNet50",
  "FastAPI",
  "React.js",
  "OpenCV",
  "REST API",
];

const architecture = [
  "React Frontend",
  "FastAPI Backend",
  "PyTorch Model",
  "Prediction Response",
  "UI Display",
];

function About() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <AnimatedText as="span" className="eyebrow">
          ABOUT THE PROJECT
        </AnimatedText>
        <AnimatedText as="h1" delay={0.1}>
          About <span className="text-gradient">DeepShield</span>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p className="about-lead">
            An end-to-end AI-driven deepfake detection system designed to identify
            manipulated or synthetic media using advanced deep learning and computer
            vision techniques. As generative AI advances, detecting forged digital
            content has become critical for maintaining digital trust and media
            authenticity.
          </p>
        </AnimatedText>
      </section>

      {/* OBJECTIVE */}
      <section className="about-section">
        <AnimatedText>
          <GlassCard className="about-card">
            <h2>Project objective</h2>
            <p>
              The primary objective of this project is to demonstrate the practical
              implementation of deep learning in solving real-world challenges through
              full-stack AI integration — showcasing expertise in data science, machine
              learning, backend development, and frontend engineering.
            </p>
          </GlassCard>
        </AnimatedText>
      </section>

      {/* MODEL ARCHITECTURE */}
      <section className="about-section">
        <AnimatedText as="h2" className="section-title">
          Model architecture
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <GlassCard className="about-card">
            <p>
              The core detection engine is built using a ResNet50-based convolutional
              neural network implemented in PyTorch. The model leverages transfer
              learning to extract high-level visual features from video frames. Each
              frame is resized to 224×224 resolution and normalized using ImageNet
              statistics before being passed through the network.
            </p>
            <p>
              The final classification layer outputs probability scores using a
              Softmax activation function, generating confidence values for both REAL
              and FAKE classes. The system computes frame-level predictions and
              aggregates them to produce a stable video-level classification.
            </p>
          </GlassCard>
        </AnimatedText>
      </section>

      {/* METHODOLOGY TIMELINE */}
      <section className="about-section methodology-section">
        <AnimatedText as="h2" className="section-title">
          Methodology
        </AnimatedText>
        <div className="timeline">
          {methodology.map((step, i) => (
            <AnimatedText key={step} delay={i * 0.1}>
              <div className="timeline-item">
                <div className="timeline-marker">{`0${i + 1}`}</div>
                <p>{step}</p>
              </div>
            </AnimatedText>
          ))}
        </div>
        <AnimatedText delay={0.2}>
          <p className="methodology-note">
            By averaging predictions across multiple frames, the system reduces noise
            and improves robustness against false detections.
          </p>
        </AnimatedText>
      </section>

      {/* TECH STACK */}
      <section className="about-section">
        <AnimatedText as="h2" className="section-title">
          Technology stack
        </AnimatedText>
        <div className="tech-badges">
          {techStack.map((tech, i) => (
            <AnimatedText key={tech} delay={i * 0.06}>
              <span className="tech-badge">{tech}</span>
            </AnimatedText>
          ))}
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE FLOW */}
      <section className="about-section">
        <AnimatedText as="h2" className="section-title">
          System architecture
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <p className="architecture-intro">
            The application follows a modular full-stack architecture, ensuring
            separation of concerns, scalability, and real-time inference capability.
          </p>
        </AnimatedText>
        <div className="architecture-flow">
          {architecture.map((node, i) => (
            <React.Fragment key={node}>
              <AnimatedText delay={i * 0.1}>
                <div className="flow-node">{node}</div>
              </AnimatedText>
              {i < architecture.length - 1 && <span className="flow-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SOCIETAL IMPACT */}
      <section className="about-section">
        <AnimatedText as="h2" className="section-title">
          Societal impact
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <GlassCard className="about-card">
            <p>
              Deepfake technology poses significant threats in areas such as
              misinformation, political manipulation, identity fraud, and cybercrime.
              This system aims to contribute toward digital media verification and
              responsible AI deployment.
            </p>
            <p>
              By providing confidence-based predictions and automated analysis, the
              platform supports efforts in digital forensics, journalism verification,
              cybersecurity, and ethical AI research.
            </p>
          </GlassCard>
        </AnimatedText>
      </section>

      {/* DEVELOPER */}
      <section className="about-section developer-section">
        <AnimatedText as="h2" className="section-title">
          About the developer
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <GlassCard className="developer-card">
            <img src="/images/Subham.jpeg" alt="Subham Mandal" className="developer-avatar-img" />
            <div>
              <h3>Subham Mandal</h3>
              <p className="developer-role">B.Tech Computer Science and Engineering (Data Science)</p>
              <p className="developer-bio">
                Focused on building next-generation AI-powered applications and
                scalable backend systems. Specializes in system design, data
                structures &amp; algorithms, and practical AI integration — aiming to
                deliver intelligent, production-ready solutions that tackle real-world
                challenges in innovative ways.
              </p>
            </div>
          </GlassCard>
        </AnimatedText>
      </section>

      <section className="about-cta">
        <AnimatedText as="h2" className="section-title">
          Ready to see it in action?
        </AnimatedText>
        <Link to="/detect">
          <motion.button className="primary-btn">Try DeepShield</motion.button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default About;