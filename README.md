# ✈️ SafeTrail – AI Travel Planner

SafeTrail is a full-stack AI-powered travel planning application that helps users generate smart, personalized travel itineraries.

It combines **modern frontend, backend APIs, and DevOps practices** to deliver a production-ready system.

---

## 🚀 Live Demo

- 🌐 Live At: https://safe-trail-one.vercel.app/

---

## 🧠 Features

- 🔐 User Authentication (Signup/Login with JWT)
- 🧳 AI-based Travel Itinerary Generation
- 📍 Destination-based planning
- 📅 Multi-day trip breakdown
- 🧾 History of generated itineraries
- 🎯 Clean and responsive UI
- ⚡ Fast API responses

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- FastAPI
- MongoDB (Atlas)
- JWT Authentication
- Async APIs

### DevOps & Deployment
- GitHub Actions (CI Pipeline)
- Docker (Backend Containerization)
- Vercel (Frontend Hosting)
- Render (Backend Hosting)

---

## ⚙️ System Architecture
```bash
User → React Frontend → FastAPI Backend → MongoDB
↓
GitHub Actions (CI)
↓
Vercel & Render Deployment
```


---

## 🔄 CI/CD Pipeline

This project includes a **CI pipeline using GitHub Actions**.

### What it does:

- ✅ Validates frontend build (`npm run build`)
- ✅ Checks backend code correctness
- ✅ Builds Docker image for backend
- ❌ Fails if any step breaks

### Workflow:
```bash 
Code Push → CI Runs → Build + Validation → Deployment
```


---

## 🐳 Docker Integration

The backend is containerized using Docker.

### Why Docker?

- Ensures consistent environment across systems  
- Avoids “works on my machine” issues  
- Enables production-ready deployments  

### Run locally using Docker:

```bash
cd backend
docker build -t safetrail-backend .
docker run -p 8000:8000 --env-file .env safetrail-backend
```


## 🔐 Environment Variables
```bash
JWT_SECRET=your_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
MONGO_URI=your_mongodb_uri
```
## 📁 Project Structure

```bash
SafeTrail/
│
├── frontend/        # React + Vite frontend
├── backend/         # FastAPI backend
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│       └── ci.yml   # CI pipeline
│
└── README.md

```
## 🧪 How to Run Locally

### 1. Clone repo
```bash
git clone https://github.com/your-username/safetrail.git
cd safetrail
```
### 2. Run Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
## 🎯 DevOps Highlights
- Implemented CI pipeline using GitHub Actions
- Automated frontend and backend validation
- Integrated Docker for backend containerization
- Ensured production-ready deployment workflow

## 💡 Future Improvements
- Add hotel recommendations with images
- Integrate maps & location APIs
- Add AI-based travel recommendations
- Implement testing (pytest + frontend tests)

## 👨‍💻 Author
### Lokendra Sinha
- E-mail : lokendrasinha2003@gmail.com
- LinkedIn: https://linkedin.com/in/lokendra-sinha-792909277

## ⭐ Conclusion
### SafeTrail demonstrates:
- Full-stack development
- Cloud deployment
- CI/CD pipeline integration
- Docker-based backend