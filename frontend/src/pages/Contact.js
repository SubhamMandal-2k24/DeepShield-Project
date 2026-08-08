import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedText from "../components/AnimatedText";
import GlassCard from "../components/GlassCard";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      {/* =========================
          INTRO
      ========================== */}
      <section className="contact-intro">
        <AnimatedText className="contact-intro-content">

          <p className="eyebrow">
            GET IN TOUCH
          </p>

          <h1>
            Let's build something together
          </h1>

          <p className="contact-intro-text">
            Whether it's a question about DeepShield, feedback on the project,
            or an idea for a collaboration — I'd love to hear from you.
          </p>

          <div className="contact-status">
            <span className="status-dot"></span>
            Open to opportunities
          </div>

        </AnimatedText>
      </section>


      {/* =========================
          PROFILE + QUICK FACTS
      ========================== */}
      <section className="contact-body">

        {/* PROFILE CARD */}
        <AnimatedText
          delay={0.1}
          className="contact-info-wrap"
        >
          <GlassCard className="contact-info-card">

            <img
              src="/images/Subham.jpeg"
              alt="Subham Mandal"
              className="contact-avatar-img"
            />

            <h3>
              Subham Mandal
            </h3>

            <p className="contact-role">
              Full-Stack Engineer · Deep Learning Practitioner
            </p>


            {/* CONTACT DETAILS */}
            <div className="contact-details">

              {/* PHONE */}
              <div className="contact-detail-item">

                <span className="contact-detail-label">
                  Phone
                </span>

                <a href="tel:+917488074287">
                  +91 7488074287
                </a>

              </div>


              {/* EMAIL */}
              <div className="contact-detail-item">

                <span className="contact-detail-label">
                  Email
                </span>

                <a href="mailto:2k24.csds1d.2413905@gmail.com">
                  2k24.csds1d.2413905@gmail.com
                </a>

              </div>


              {/* LINKEDIN */}
              <div className="contact-detail-item">

                <span className="contact-detail-label">
                  LinkedIn
                </span>

                <a
                  href="https://www.linkedin.com/in/subham-mandal-215383343"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/subham-mandal-215383343
                </a>

              </div>


              {/* GITHUB */}
              <div className="contact-detail-item">

                <span className="contact-detail-label">
                  GitHub
                </span>

                <a
                  href="https://github.com/SubhamMandal-2k24"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/SubhamMandal-2k24
                </a>

              </div>

            </div>

          </GlassCard>
        </AnimatedText>


        {/* QUICK FACTS */}
        <AnimatedText
          delay={0.2}
          className="quick-facts-wrap"
        >

          <GlassCard className="quick-facts-card">

            <h4>
              Quick facts
            </h4>

            <ul className="quick-facts-list">

              <li>
                <span className="fact-icon">
                  ◈
                </span>

                Builder of DeepShield — AI deepfake detection platform
              </li>

              <li>
                <span className="fact-icon">
                  ◈
                </span>

                Comfortable across the stack: React, FastAPI, MySQL
              </li>

              <li>
                <span className="fact-icon">
                  ◈
                </span>

                Focused on applied deep learning &amp; computer vision
              </li>

              <li>
                <span className="fact-icon">
                  ◈
                </span>

                Usually replies within 24 hours
              </li>

            </ul>

          </GlassCard>

        </AnimatedText>

      </section>


      {/* =========================
          CLOSING CTA
      ========================== */}
      <section className="contact-cta-section">

        <AnimatedText
          as="h2"
          className="section-title"
        >
          Curious how DeepShield works?
        </AnimatedText>


        <AnimatedText delay={0.1}>

          <p className="contact-cta-text">
            Take a look under the hood, or try the detector yourself.
          </p>

        </AnimatedText>


        <AnimatedText delay={0.2}>

          <div className="contact-cta-buttons">

            {/* ABOUT BUTTON */}
            <Link to="/about">

              <motion.button
                className="ghost-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Read the Case Study
              </motion.button>

            </Link>


            {/* DETECT BUTTON */}
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


      {/* =========================
          FOOTER
      ========================== */}
      <Footer />

    </div>
  );
}

export default Contact;