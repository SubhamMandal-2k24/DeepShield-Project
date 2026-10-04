# DeepShield

**Upload a face image or a short video and find out if it looks real or manipulated.**

A ResNet50 model does the checking, FastAPI serves it, React is the front end, and MySQL holds accounts and scan history.

**Live demo:** https://deep-shield-project.vercel.app

> The backend runs on a free Render instance that sleeps when nobody is using it, so the first request after a pause can take a minute or two. After that it's quick.

<!-- Add a screenshot or demo GIF here, for example: ![DeepShield demo](docs/demo.gif) -->

I built DeepShield as my first full project, from training the model all the way to putting it online. I wanted to understand how every piece connects, and I learned most of it by getting things wrong, so I've kept those parts in here.

---

## What it does

You sign up, log in, and upload a JPG, PNG, MP4, MOV, AVI or WEBM file of up to 50 MB. A few seconds later you get REAL or FAKE with a confidence percentage, and the scan is saved to your history page.

For a video, the backend picks 10 frames spread evenly through the file, runs each one through the model and averages the "fake" probability. If the average is 0.5 or higher, the video is called FAKE. An image works the same way and just counts as a one-frame video.

Your upload only exists as a temporary file while the model runs, then it's deleted. The database keeps the filename, the result, the confidence and the time, never the file itself.

---

## Along the way

A few things that went wrong while building it, and what I did about them:

- **My .gitignore was hiding files.** Blanket rules for `*.jpg`, `*.png` and `*.pth` quietly kept my site images and the 94 MB model weights out of git. Everything worked on my laptop and would have been broken once deployed. I noticed when I checked what the repo actually contained.
- **Aiven would not accept my connection.** PyMySQL doesn't take `ssl-mode` in the URL, and my Windows certificate path (it has a colon) broke the URL anyway. Passing the certificate through SQLAlchemy's `connect_args` fixed it.
- **Hosting changed twice.** I planned on Hugging Face Spaces, found out Docker Spaces needed a paid plan, and moved to Render's free tier. It works, with a slow cold start as the price.
- **My own homepage was wrong.** It claimed uploads weren't stored longer than needed, while the backend copied every upload to disk and never deleted it. I found this reviewing my own code. Files are now deleted right after analysis.
- **The server ran out of memory.** The free instance has 512 MB of RAM, and two scans at the same moment made Render restart it. Inference now runs one request at a time.

---

## Results

| | |
|---|---|
| Model | ResNet50, trained from scratch |
| Data | FaceForensics++ (DeepFakeDetection subset) |
| Training | 3 epochs, Adam, learning rate 1e-4, batch size 8 |
| Validation accuracy | **74.88%** (599 of 800 held-out frames) |
| Speed | about 7 s on my laptop, about 15 s on the live demo |

---

## Limitations and next steps

- **Evaluation:** accuracy is measured per frame on a random 80/20 split, so frames from one video can land on both sides. I treat 74.88% as an optimistic number. Next step is to split by video and measure again.
- **Training:** this is a 3-epoch baseline trained from scratch. Pretrained ImageNet weights, face cropping and augmentation are the obvious upgrades.
- **Scope:** it was trained on one face-swap dataset, so it works best on that kind of deepfake. Diffusion-generated images are outside what it has seen.
- **Engineering:** automated tests, rate limiting and an account-deletion option are still on the list.

---

## Stack

- **Frontend:** React, React Router, Framer Motion, Three.js
- **Backend:** FastAPI, SQLAlchemy, JWT login with bcrypt-hashed passwords
- **Model:** PyTorch, torchvision, OpenCV
- **Database:** MySQL on Aiven
- **Hosting:** Vercel for the frontend, Docker on Render for the backend

---

## Contact

**Subham Mandal**, B.Tech CSE (Data Science), Pranveer Singh Institute of Technology, Kanpur

- GitHub: [SubhamMandal-2k24](https://github.com/SubhamMandal-2k24)
- LinkedIn: [subham-mandal-215383343](https://linkedin.com/in/subham-mandal-215383343)
- Email: [2k24.csds1d.2413905@gmail.com](mailto:2k24.csds1d.2413905@gmail.com)

MIT licensed, see [LICENSE](LICENSE).