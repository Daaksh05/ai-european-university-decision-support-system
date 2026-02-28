# 🇪🇺 EuroPath AI: Your intelligent guide to Study, SOP, and Visa.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Logic-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

**EuroPath AI** is an intelligent, end-to-end platform designed to help international students navigate the entire journey of studying in Europe—from initial university selection to landing your student visa dream.

---

## ✨ Key Features

### 🔍 1. AI University Recommender
- **Smart Profile Matching**: Input your GPA, IELTS, and Budget to get a ranked list of universities.
- **Admission Probability**: Real-time calculation of your chances (🔴 LOW, 🟡 MEDIUM, 🟢 HIGH) with detailed feedback.
- **Cost & ROI Analytics**: Visual dashboards comparing tuition vs. ranking and future career ROI.

### 📝 2. AI Resume Builder (Europass Style)
- **Completeness Meter**: Interactive progress tracking to ensure your CV meets professional European standards.
- **✨ AI Summary Generator**: One-click professional bio generation tailored to your unique academic and work background.
- **Modern & Classic Templates**: Switch between traditional Europass and contemporary professional layouts.
- **CEFR Language Grid**: Expert-level language proficiency self-assessment (Listening, Reading, Speaking, Writing).

### 🖋️ 3. AI SOP & Motivation Letter Assistant
- **Tailored Letters**: Generate personalized Statement of Purpose (SOP) based on your target university requirements.
- **Tone Selection**: Customize your application with **Professional**, **Academic**, or **Enthusiastic** styles.
- **Live Preview**: Review your letter in a classic academic typeface before downloading as a file.

### 🛂 4. Interactive Visa Tracker
- **Country-Specific Intelligence**: Specialized student visa checklists for **Germany**, **France**, **Italy**, and **Spain**.
- **Blocked Account Helper**: Clear guidance on financial requirements (e.g., German Sperrkonto calculations).
- **Progress Persistence**: Your checklist status is saved automatically, allowing you to track your visa progress over time.

### 🤖 5. Ask AI Assistant
- An interactive chatbot to answer complex questions about European universities, local living costs, and scholarships.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Axios, CSS Modules, Chart.js, Framer Motion |
| **Backend** | FastAPI (Python 3.9+), Pydantic, Pandas |
| **Data Engine** | Multi-dimensional Rule Engine & ML-based Probability Models |
| **Persistence** | SessionStorage & LocalStorage for high-privacy data management |

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📁 Architecture

- **`backend/routes/`**: Moduralized API services for AI Resume, SOP, Visa, and Recommendations.
- **`frontend/src/services/`**: Centralized service layer for AI-driven frontend interactions.
- **`frontend/src/pages/`**: Premium, responsive React views for each specialized tool.

---

## 🌟 Our Mission
Applying for higher education abroad is a life-changing but high-stress process. **EuroPath AI** aims to replace dozens of messy spreadsheets and confusing embassy websites with a single, AI-guided dashboard that makes the "European Dream" organized, data-driven, and accessible to everyone.

---
*Created with ❤️ for future international scholars.*
