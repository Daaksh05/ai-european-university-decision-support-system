# 🚀 Setup Guide - Running the Project

This guide will help you run the **AI European University Decision Support System** on your computer.

## Prerequisites

Before starting, make sure you have these installed:

1. **Git** - [Download here](https://git-scm.com/downloads)
2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - For Windows: Docker Desktop for Windows
   - For Mac: Docker Desktop for Mac
   - For Linux: Docker Engine

## Quick Start (Recommended - Using Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Daaksh05/ai-european-university-decision-support-system.git
cd ai-european-university-decision-support-system
```

### Step 2: Start Docker Desktop

- Open Docker Desktop application
- Wait until it shows "Docker Desktop is running"

### Step 3: Run the Project

```bash
docker-compose up
```

**That's it!** 🎉

The first time will take 5-10 minutes to download and build everything. Subsequent runs will be much faster.

### Step 4: Access the Application

Once you see these messages:
```
university-backend   | INFO:     Application startup complete.
university-frontend  | webpack compiled with 1 warning
```

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs

### Step 5: Stop the Project

Press `Ctrl+C` in the terminal, then run:
```bash
docker-compose down
```

---

## Alternative Setup (Without Docker)

If you prefer to run without Docker:

### Backend Setup

```bash
cd backend
python -m venv venv

# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
uvicorn app:app --reload
```

Backend will run on: http://localhost:8000

### Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
npm start
```

Frontend will run on: http://localhost:3000

---

## Troubleshooting

### Docker Issues

**Problem**: "Cannot connect to Docker daemon"
- **Solution**: Make sure Docker Desktop is running

**Problem**: "Port 3000 or 8000 already in use"
- **Solution**: Stop other applications using these ports, or change ports in `docker-compose.yml`

**Problem**: Changes not reflecting
- **Solution**: Restart containers:
  ```bash
  docker-compose down
  docker-compose up
  ```

### Without Docker

**Problem**: "Module not found" errors in backend
- **Solution**: Make sure virtual environment is activated and run `pip install -r requirements.txt`

**Problem**: "npm command not found"
- **Solution**: Install Node.js from https://nodejs.org/

---

## System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB
- **Disk Space**: ~2GB for Docker images and dependencies
- **OS**: Windows 10+, macOS 10.14+, or Linux

---

## Features to Try

Once running, explore these features:

1. **Profile Page** (`/profile`) - Enter your GPA, IELTS, budget
2. **Recommendations** (`/recommendations`) - See matching universities
3. **Analytics** (`/analytics`) - View interactive charts and ROI analysis
4. **Ask AI** (`/ask-ai`) - Ask questions about studying in Europe
5. **Resume Builder** (`/resume-builder`) - Create Europass-style CV
6. **SOP Assistant** (`/sop-assistant`) - Generate motivation letters
7. **Visa Tracker** (`/visa-tracker`) - Track visa requirements

---

## Getting Updates

To get the latest changes:

```bash
git pull origin main
docker-compose down
docker-compose up --build
```

---

## Need Help?

- Check the [README.md](README.md) for more details
- Open an issue on GitHub
- Contact the developer

---

**Happy Coding! 🎓**
