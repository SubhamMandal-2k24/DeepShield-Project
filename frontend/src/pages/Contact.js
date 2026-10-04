import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import ContactScene from "../components/ContactScene";
import "./Contact.css";

const contactMethods = [
  {
    label: "Email",
    value: "2k24.csds1d.2413905@gmail.com",
    href: "mailto:2k24.csds1d.2413905@gmail.com",
    icon: "MAIL",
    copyValue: "2k24.csds1d.2413905@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/subham-mandal-215383343",
    href: "https://www.linkedin.com/in/subham-mandal-215383343",
    icon: "in",
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/SubhamMandal-2k24",
    href: "https://github.com/SubhamMandal-2k24",
    icon: "GH",
    external: true,
  },
    {
    label: "LeetCode",
    value: "leetcode.com/u/Subham_Mandal_2006",
    href: "https://leetcode.com/u/Subham_Mandal_2006",
    icon: "LC",
    external: true,
  },
];

const quickFacts = [
  { icon: "1", text: "Builder of DeepShield, an AI deepfake detection platform" },
  { icon: "2", text: "Building RadiantXAI, an explainable chest X-ray classifier with Grad-CAM" },
  { icon: "3", text: "Hands-on with React, FastAPI, MySQL, PyTorch, OpenCV and Docker" },
  { icon: "4", text: "Focused on applied deep learning and computer vision" },
];

function Contact() {
  const [copiedLabel, setCopiedLabel] = useState("");
  const resetTimer = useRef(null);

  // Clear any pending timeout when the page unmounts
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
    } catch (err) {
      // Clipboard can be blocked (non-HTTPS, permissions); show a fallback
      setCopiedLabel("");
      window.prompt("Copy this manually:", value);
      return;
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopiedLabel(""), 1500);
  };

  return (
    <div className="contact-page">
      <section className="contact-intro">
        <ContactScene />
        <div className="contact-intro-content">
          <AnimatedText as="span" className="eyebrow">
            GET IN TOUCH
          </AnimatedText>
          <AnimatedText as="h1" delay={0.1}>
            Let's build something <span className="text-gradient">together</span>
          </AnimatedText>

          <div className="rotating-role">
            <span className="rotating-role-text">
              B.Tech CSE (Data Science) Student
            </span>
          </div>

          <AnimatedText delay={0.3}>
            <span className="availability-badge">
              <span className="availability-dot"></span>
              Open to internships
            </span>
          </AnimatedText>
        </div>
      </section>

      <section className="contact-body">
        <AnimatedText delay={0.1} className="contact-info-wrap">
          <GlassCard className="contact-info-card">
            <h3>Subham Mandal</h3>
            <p className="contact-role">
              B.Tech CSE (Data Science) &middot; Building Full-Stack & ML Projects
            </p>
          </GlassCard>
        </AnimatedText>

        <div className="contact-methods-grid">
          {contactMethods.map((method, i) => (
            <AnimatedText key={method.label} delay={0.15 + i * 0.08}>
              <GlassCard className="contact-method-card">
                <div className="contact-method-top">
                  <span className="contact-method-icon">{method.icon}</span>
                  <span className="contact-method-label">{method.label}</span>
                </div>

                <a
                  href={method.href}
                  className="contact-method-value"
                  {...(method.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {method.value}
                </a>

                {method.copyValue ? (
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(method.label, method.copyValue)}
                  >
                    {copiedLabel === method.label ? "Copied!" : "Copy"}
                  </button>
                ) : null}
              </GlassCard>
            </AnimatedText>
          ))}
        </div>
      </section>

      <section className="quick-facts-section">
        <AnimatedText as="h2" className="section-title">
          A bit more about my work
        </AnimatedText>
        <div className="quick-facts-grid">
          {quickFacts.map((fact, i) => (
            <AnimatedText key={fact.text} delay={i * 0.1}>
              <GlassCard className="fact-card">
                <span className="fact-card-icon">{fact.icon}</span>
                <p>{fact.text}</p>
              </GlassCard>
            </AnimatedText>
          ))}
        </div>
      </section>

      <section className="contact-cta-section">
        <AnimatedText as="h2" className="section-title">
          Curious how DeepShield works?
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <p className="contact-cta-text">
            Take a look under the hood, or try the detector yourself.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <div className="contact-cta-buttons">
            <Link to="/about">
              <motion.button
                className="ghost-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Read the Case Study
              </motion.button>
            </Link>
            <Link to="/detect">
              <motion.button
                className="primary-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Try DeepShield
              </motion.button>
            </Link>
          </div>
        </AnimatedText>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;