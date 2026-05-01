import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>

      {/* Hero Section */}
      <section className="hero">
        <h1>AI Powered DeepFake Detection</h1>
        <p>Upload a video or image and let AI analyze authenticity in seconds!</p>

        <button
          className="primary-btn"
          onClick={() => navigate("/detect")}
        >
          Try Now
        </button>
      </section>

      {/* Cards Section */}
      <section className="cards">
        <div className="card">
          <h3>Upload Video/Image</h3>
          <p>Select your file securely.</p>
        </div>

        <div className="card">
          <h3>AI Analysis</h3>
          <p>Model checks manipulation patterns.</p>
        </div>

        <div className="card">
          <h3>Instant Result</h3>
          <p>Real or Deepfake detection.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;