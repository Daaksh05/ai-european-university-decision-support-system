# 🎓 AI University Decision Support System (UniDecide)

An intelligent full-stack web application that helps students choose the right European universities based on their academic profile, budget, and preferences.

---

## 🚀 Features

### 👤 Student Profile Analysis
- Input GPA, IELTS, Budget, Country, Field of Study
- Calculates **Admission Chance** as:
  - 🟢 HIGH
  - 🟡 MEDIUM
  - 🔴 LOW
- Shows **probability (%)** and personalized feedback

### 🏫 University Recommendations
- Recommends **European universities** dynamically
- Matches universities based on:
  - GPA eligibility
  - IELTS requirements
  - Tuition budget
  - Country & field preference
- Sorted by **best match score**

### 📊 Analytics Dashboard
- Cost vs Ranking analysis
- Acceptance probability visualization
- ROI analysis (tuition vs expected salary)
- Real data (no mock values)

### 💬 Ask AI Assistant
- Students can ask questions about:
  - Universities
  - IELTS requirements
  - Scholarships
  - Study destinations
- Backend-driven intelligent responses

### 🎓 Scholarships Module
- View scholarships by country
- Filter by coverage & amount
- Scholarship statistics

---

## 🧠 Tech Stack

### Frontend
- React.js
- Axios
- CSS / Tailwind-style UI
- SessionStorage for profile flow

### Backend
- FastAPI
- Python
- Pydantic
- Pandas
- Rule-based + ML-assisted logic

---

## 📁 Project Structure

```text
ai-university-decision-support-system/
│
├── backend/
│   ├── app.py
│   ├── modules/
│   │   ├── admission_prediction.py
│   │   ├── recommendation_engine.py
│   │   ├── cost_roi_analysis.py
│   │   └── nlp_query_handler.py
│   ├── data/
│   │   ├── universities.csv
│   │   └── scholarships.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentProfileForm.jsx
│   │   │   ├── ChartsDashboard.jsx
│   │   │   └── UniversityList.jsx
│   │   ├── pages/
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AskAI.jsx
│   │   └── services/api.js
│
└── README.md
