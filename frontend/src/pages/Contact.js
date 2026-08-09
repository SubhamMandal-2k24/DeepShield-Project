import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import ContactScene from "../components/ContactScene";
import "./Contact.css";

const roles = [
  "Full-Stack Engineer",
  "Deep Learning Practitioner",
  "AI/ML Builder",
];

const contactMethods = [
  {
    label: "Phone",
    value: "+91 7488074287",
    href: "tel:+917488074287",
    icon: "TEL",
    copyValue: "+917488074287",
  },
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
];

function Contact() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(""), 1500);
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
            <span>Currently working as a</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[roleIndex]}
                className="rotating-role-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <AnimatedText delay={0.3}>
            <span className="availability-badge">
              <span className="availability-dot"></span>
              Open to opportunities
            </span>
          </AnimatedText>
        </div>
      </section>

      <section className="contact-body">
        <AnimatedText delay={0.1} className="contact-info-wrap">
          <GlassCard className="contact-info-card">
            <img
              src="/images/Subham.jpeg"
              alt="Subham Mandal"
              className="contact-avatar-img"
            />
            <h3>Subham Mandal</h3>
            <p className="contact-role">
              Full-Stack Engineer &middot; Deep Learning Practitioner
            </p>
          </GlassCard>
        </AnimatedText>

        <div className="contact-methods-grid">
          {contactMethods.map((method, i) => {
            const isExternal = method.external === true;
            return (
              <AnimatedText key={method.label} delay={0.15 + i * 0.08}>
                <GlassCard className="contact-method-card">
                  <div className="contact-method-top">
                    <span className="contact-method-icon">{method.icon}</span>
                    <span className="contact-method-label">{method.label}</span>
                  </div>

                  {isExternal ? (
                    <a
                      href={method.href}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-method-value"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <a href={method.href} className="contact-method-value">
                      {method.value}
                    </a>
                  )}

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
            );
          })}
        </div>
      </section>

      <section className="quick-facts-section">
        <AnimatedText as="h2" className="section-title">
          A bit more about my work
        </AnimatedText>
        <div className="quick-facts-grid">
          {[
            { icon: "1", text: "Builder of DeepShield, an AI deepfake detection platform" },
            { icon: "2", text: "Comfortable across the stack: React, FastAPI, MySQL" },
            { icon: "3", text: "Focused on applied deep learning and computer vision" },
            { icon: "4", text: "Usually replies within 24 hours" },
          ].map((fact, i) => (
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
