# DeepShield

A web app where you upload an image or a short video and a ResNet50 model tells you whether the face looks real or manipulated. React on the front, FastAPI and PyTorch on the back, MySQL for accounts and history.

Live demo: https://deep-shield-project.vercel.app

The backend sits on a free Render instance that goes to sleep when nobody uses it, so the first request after a pause can take a minute or two. After that it's fine.

This is my first full project, from training the model to getting it online. I built it mostly to learn how all the pieces fit together, and it has real problems, which I've listed further down instead of hiding.

## What it does

You sign up, log in, and upload a JPG, PNG, MP4, MOV, AVI or WEBM file (up to 50 MB). You get back REAL or FAKE with a confidence percentage, and every scan is saved to your history page.

For videos the backend picks 10 frames spread evenly through the file, runs each one through the model, and averages the "fake" probability. If the average is 0.5 or higher the video is called FAKE. Images work the same way, they just count as a one-frame video.

Uploads are only kept in a temp file while the model runs and then deleted. The database stores the filename, the result, the confidence and the time, never the file itself.

## Results

| | |
|---|---|
| Model | ResNet50, trained from scratch |
| Data | FaceForensics++ (DeepFakeDetection subset) |
| Training | 3 epochs, Adam, lr 1e-4, batch size 8 |
| Validation accuracy | 74.88% (599 of 800 held-out frames) |
| Speed | about 7 s on my laptop, about 15 s on the live demo |

For a while I was saying 95%. That number came from me trying 70 or 80 samples by hand, which isn't a real measurement. When I finally ran the model over a proper held-out set it came out at 74.88%, so I changed the README and the homepage. Even this number is probably a bit generous, see below.

## Limitations and next steps

- **Evaluation:** accuracy is measured per frame on a random 80/20 split, so frames from one video can appear on both sides. I treat 74.88% as an optimistic estimate. Next step: split by video and re-measure.
- **Training:** this was a 3-epoch baseline trained from scratch. Pretrained ImageNet weights, face cropping and augmentation are the obvious upgrades.
- **Scope:** it's trained on one face-swap dataset (FaceForensics++), so it works best on that kind of deepfake. Diffusion-generated images are out of its training distribution.
- **Engineering:** automated tests, rate limiting and an account-deletion option are still to do.

## Things that broke along the way

- **.gitignore ate my files.** I had blanket rules for `*.jpg`, `*.png` and `*.pth`, which silently kept the site images and the 94 MB model weights out of git. Everything worked locally and would have been broken once deployed. I only caught it by checking what was actually in the repo.
- **Connecting to Aiven.** PyMySQL doesn't accept `ssl-mode` in the connection URL, and my Windows path to the CA certificate (it has a colon in it) broke the URL when I tried to put it there. Passing the certificate through SQLAlchemy's `connect_args` fixed it.
- **Hosting.** I first planned on Hugging Face Spaces, then found out Docker Spaces needed a paid plan. I moved to Render's free tier, which works but has a slow cold start.
- **A privacy claim that wasn't true.** At one point the homepage said uploads weren't stored longer than needed, while the backend was copying every upload to disk and never deleting it. I found it while reviewing my own code, and now files are deleted right after analysis.
- **Running out of memory.** The free instance has 512 MB of RAM. Two scans at once pushed it over and Render restarted it, so inference now runs one request at a time.

## Stack

React, React Router, Framer Motion, Three.js for the hero scene. FastAPI, SQLAlchemy, JWT login with bcrypt-hashed passwords. PyTorch, torchvision, OpenCV. MySQL on Aiven. Frontend on Vercel, backend in Docker on Render.

## Running it locally

You'll need Python 3.11, Node 18+ and a MySQL database.

```bash
git clone https://github.com/SubhamMandal-2k24/DeepShield-Project.git
cd DeepShield-Project

python -m venv venv
venv\Scripts\activate          # on Linux/Mac: source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env           # fill in the values below
uvicorn main:app --reload
```

The backend runs on http://127.0.0.1:8000. In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm start
```

The frontend runs on http://localhost:3000.

Backend `.env`:

```env
DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:<port>/<database>
SSL_CA_PATH=certs/aiven-ca.pem
SECRET_KEY=<long random string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000
```

Frontend `.env.local`:

```env
REACT_APP_API_BASE=http://127.0.0.1:8000
```

`CORS_ORIGINS` can hold several origins separated by commas. If the frontend opens from `127.0.0.1` instead of `localhost`, add that one too, otherwise sign up fails with a 400 on the preflight request. The `.env` files and the certificate are gitignored, don't commit them.

The backend code is at the repo root (`main.py`, `auth.py`, `db_models.py`), the model and prediction code is in `src/`, the weights are in `Models/`, and the React app is in `frontend/`.

## Contact

Subham Mandal, B.Tech CSE (Data Science) at Pranveer Singh Institute of Technology, Kanpur.

GitHub: https://github.com/SubhamMandal-2k24
LinkedIn: https://linkedin.com/in/subham-mandal-215383343
Email: 2k24.csds1d.2413905@gmail.com

MIT licensed, see LICENSE.