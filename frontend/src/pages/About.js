import React from "react";

function About() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto", lineHeight: "1.7" }}>
      
      <h1><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;About DeepShield</i></h1>
      <h2>AI-Powered DeepFake Detection System</h2>
      <p>
        This project is an end-to-end AI-driven DeepFake Detection System designed to identify 
        manipulated or synthetic media using advanced Deep Learning and Computer Vision techniques. 
        With the rapid advancement of generative AI technologies, detecting forged digital content 
        has become critical for maintaining digital trust and media authenticity.
      </p>

      <h3>Project Objective</h3>
      <p>
        The primary objective of this project is to demonstrate the practical 
        implementation of Deep Learning in solving real-world challenges through 
        full-stack AI integration. It showcases expertise in Data Science, 
        Machine Learning, Backend Development, and Frontend Engineering.
      </p>

      <h3>Model Architecture</h3>
      <p>
        The core detection engine is built using a ResNet50-based Convolutional Neural Network 
        implemented in PyTorch. The model leverages transfer learning to extract high-level 
        visual features from video frames. Each frame is resized to 224x224 resolution and 
        normalized using ImageNet statistics before being passed through the network.
      </p>

      <p>
        The final classification layer outputs probability scores using a Softmax activation 
        function, generating confidence values for both REAL and FAKE classes. 
        The system computes frame-level predictions and aggregates them to produce 
        a stable video-level classification.
      </p>

      <h3>Methodology</h3>
      <p>
        • Video or Image Upload and Temporary Storage<br/>
        • Frame Extraction using OpenCV<br/>
        • Frame Sampling and Preprocessing<br/>
        • Deep Neural Network Inference<br/>
        • Probability Aggregation and Confidence Scoring<br/>
        • Final Classification (REAL / FAKE)
      </p>

      <p>
        By averaging predictions across multiple frames, the system reduces noise 
        and improves robustness against false detections.
      </p>

      <h3>Technology Stack</h3>
      <p>
        • Deep Learning Framework: PyTorch<br/>
        • Model Architecture: ResNet50 (Transfer Learning)<br/>
        • Backend API: FastAPI<br/>
        • Frontend: React.js<br/>
        • Computer Vision: OpenCV<br/>
        • Model Deployment: REST API Integration
      </p>

      <h3>System Architecture</h3>
      <p>
        The application follows a modular full-stack architecture:
      </p>

      <p>
        React Frontend → FastAPI Backend → PyTorch Model → Prediction Response → UI Display
      </p>

      <p>
        This architecture ensures separation of concerns, scalability, and real-time inference capability.
      </p>

      <h3>Societal Impact</h3>
      <p>
        DeepFake technology possess significant threats in areas such as misinformation, 
        political manipulation, identity fraud, and cybercrime. This system aims to 
        contribute toward digital media verification and responsible AI deployment.
      </p>

      <p>
        By providing confidence-based predictions and automated analysis, 
        the platform supports efforts in digital forensics, journalism verification, 
        cybersecurity, and ethical AI research.
      </p>

      <h3>About Developer</h3>
      <p><i><b>Subham Mandal</b></i> – B.Tech Computer Science (Data Science) student focused on building next-generation AI-powered applications and scalable backend systems. Specializes in System Design, Data Structures & Algorithms, and practical AI integration, aiming to deliver intelligent, production-ready solutions that tackle real-world challenges in innovative ways.
      </p>
    </div>
  );
}

export default About;