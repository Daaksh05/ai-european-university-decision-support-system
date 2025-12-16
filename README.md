# AI University Decision Support System

An AI-driven decision support system designed to assist students in selecting suitable international (European) universities through personalized, data-driven recommendations. The system analyzes academic profiles, test scores, financial constraints, and career goals to predict admission eligibility and recommend best-fit universities and programs.

This project integrates **Machine Learning, Natural Language Processing (NLP), FastAPI, and a React frontend** to provide an intelligent, scalable, and user-friendly platform for overseas higher education decision-making.

---

## 🚀 Key Features

- Student profile analysis (academics, test scores, budget, preferences)
- Admission eligibility prediction using ML
- University and course recommendation engine
- Cost, scholarship, and ROI comparison
- NLP-based enquiry handling
- Modular backend with RESTful APIs
- React-based frontend for user interaction

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Axios
- HTML, CSS, JavaScript

**Backend**
- Python
- FastAPI
- Uvicorn

**AI / Data**
- Scikit-learn (ML logic)
- Pandas
- NLP (rule-based / extensible)

**Tools**
- Git & GitHub
- PowerShell
- VS Code

---

## 📁 Project Folder Structure

ai-university-decision-support-system/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   │
│   ├── modules/
│   │   ├── profile_analysis.py
│   │   ├── admission_prediction.py
│   │   ├── recommendation_engine.py
│   │   ├── nlp_query_handler.py
│   │   ├── cost_roi_analysis.py
│   │   └── admin_management.py
│   │
│   ├── data/
│   │   ├── universities.csv
│   │   └── scholarships.csv
│   │
│   ├── models/
│   │   └── admission_model.pkl
│   │
│   ├── data_fetcher/
│   │   ├── fetch_universities.py
│   │   ├── fetch_scholarships.py
│   │   └── clean_data.py
│   │
│   └── utils/
│       └── helpers.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentProfileForm.jsx
│   │   │   ├── EligibilityResult.jsx
│   │   │   ├── UniversityList.jsx
│   │   │   ├── QueryBox.jsx
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Admin.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── docs/
│   ├── abstract.md
│   ├── methodology.md
│   └── system_architecture.md
│
├── diagrams/
│   └── architecture.png
│
├── .gitignore
├── README.md
└── LICENSE
