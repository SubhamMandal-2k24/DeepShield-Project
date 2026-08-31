# 🛡️ DeepShield

**AI-Powered Deepfake Detection Web Application**

DeepShield is a full-stack web application that uses deep learning to detect AI-generated and manipulated (deepfake) media. It combines a ResNet50-based classifier trained on FaceForensics++ with a modern React frontend and a secure FastAPI backend, giving users a simple interface to upload media and receive real-time authenticity predictions.

**Live Demo:** [deep-shield-project.vercel.app](https://deep-shield-project.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Model Performance](#-model-performance)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

- 🔍 **Deepfake Detection** — Upload an image or video frame and get an instant REAL/FAKE prediction powered by a ResNet50 CNN
- 🔐 **Secure Authentication** — JWT-based signup/login with protected routes
- 📊 **Detection History** — Logged-in users can view their past detection results
- 🎨 **Modern UI** — Responsive React frontend with smooth animations (Framer Motion)
- ☁️ **Cloud-Native** — Fully deployed with a managed cloud database and CDN-backed hosting

---

## 🛠️ Tech Stack

**Frontend**
- React
- React Router DOM
- Framer Motion
- Context API for auth state management

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- JWT authentication (`python-jose` / `passlib`)
- MySQL (Aiven managed cloud database)

**Machine Learning**
- PyTorch
- ResNet50 (fine-tuned for frame-level classification)
- Trained on the FaceForensics++ dataset

**Infrastructure**
- Frontend hosted on **Vercel**
- Backend containerized with **Docker** and hosted on **Render**
- Database hosted on **Aiven** (managed MySQL, SSL-secured)

---

## 🏗️ Architecture

```
┌──────────────┐        HTTPS/JWT        ┌──────────────┐        SQL (SSL)        ┌──────────────┐
│   React App   │ ─────────────────────▶ │  FastAPI API  │ ─────────────────────▶ │  Aiven MySQL  │
│  (Vercel)     │ ◀───────────────────── │  (Render)     │ ◀───────────────────── │   Database    │
└──────────────┘        JSON             └──────┬───────┘                          └──────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │ PyTorch ResNet50 │
                                          │ Deepfake Model   │
                                          └───────────────┘
```

- The **frontend** authenticates users via JWT stored client-side and calls the backend API for detection requests and history retrieval.
- The **backend** handles auth, request validation, model inference, and persistence to MySQL.
- The **ML model** performs frame-level classification, returning a REAL/FAKE label with a confidence score.

---

## 📈 Model Performance

| Metric | Value |
|---|---|
| Accuracy | ~95% |
| Inference Time | ~7 seconds per sample |
| Training Data | FaceForensics++ |
| Architecture | ResNet50 (fine-tuned) |

> **Note:** The model is trained on FaceForensics++ and performs best on face-forgery-style deepfakes. Performance on out-of-distribution content (e.g., diffusion-generated images) may vary, since these differ significantly from the training distribution.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+) and npm
- Python 3.9+
- A MySQL database (local or managed, e.g., Aiven)
- Docker (optional, for containerized backend deployment)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/SubhamMandal-2k24/DeepShield-Project.git
cd DeepShield-Project

# Set up a virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (see below)
cp .env.example .env

# Run the backend
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables (see below)
cp .env.example .env.local

# Run the development server
npm start
```

The app will be available at `http://localhost:3000`.

### Environment Variables

**Backend (`.env`)**

```env
DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:<port>/<database>
SSL_CA_PATH=certs/aiven-ca.pem
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000
```

**Frontend (`.env.local`)**

```env
REACT_APP_API_BASE=http://127.0.0.1:8000
```

> ⚠️ Never commit `.env` files or database certificates to version control. This repository's `.gitignore` is configured to exclude them.

---

## ☁️ Deployment

DeepShield is deployed using a fully cloud-based, cost-free stack:

| Component | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) (Docker Web Service) |
| Database | [Aiven](https://aiven.io) (Managed MySQL, free tier) |

**Backend (Render):**
1. Create a new Web Service, connect the GitHub repository, and select the Docker environment (auto-detected from the `Dockerfile` at the repo root).
2. Leave the Root Directory blank — the `Dockerfile` and backend source sit at the repository root.
3. Add the required environment variables (see above), and use Render's **Secret Files** feature for the database CA certificate if not committing it.
4. Deploy — Render exposes the app on a dynamic `$PORT`, which the Dockerfile is configured to use.

**Frontend (Vercel):**
1. Import the repository, set the project root to `frontend/`.
2. Set `REACT_APP_API_BASE` to the live Render backend URL.
3. Deploy.

**Note:** The Render free tier spins down after inactivity, so the first request after idle may take 30–50 seconds (cold start).

---

## 📁 Project Structure

```
DeepShield-Project/
├── Dockerfile
├── main.py                  # FastAPI entry point
├── auth.py                  # JWT authentication logic
├── database.py              # SQLAlchemy DB connection
├── db_models.py             # ORM models
├── schemas.py                # Pydantic schemas
├── Models/                  # Trained model weights (ResNet50 .pth)
├── Data/                    # Dataset / preprocessing utilities
├── certs/                   # DB SSL certificates (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProtectedRoute, PublicRoute, etc.
│   │   ├── context/         # AuthContext.js
│   │   ├── pages/           # Home, About, Detect, History, Contact
│   │   └── assets/          # Images and banners
│   └── public/
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Expand accuracy testing with Celeb-DF v2 benchmark clips
- [ ] Add video-level (multi-frame) inference, not just frame-level
- [ ] Improve generalization to diffusion-generated content
- [ ] Add user-facing confidence visualizations

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Subham Mandal**
B.Tech CSE (Data Science), Pranveer Singh Institute of Technology, Kanpur

- GitHub: [@SubhamMandal-2k24](https://github.com/SubhamMandal-2k24)
- LinkedIn: [linkedin.com/in/subham-mandal-215383343](https://linkedin.com/in/subham-mandal-215383343)
- Email: [2k24.csds1d.2413905@gmail.com](mailto:2k24.csds1d.2413905@gmail.com)