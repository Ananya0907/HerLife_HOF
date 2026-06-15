# 🩷 HerLife — Your Entire Health Journey, On One Platform

> *"Finally, a health companion that talks to you like a friend and works like a doctor."*

HerLife is an AI-powered women's health platform that unifies period tracking, PCOS risk detection, cycle prediction, nutrition, fitness, and wellness into one intelligent web application. 
Built by **Team Amethyst**.

---

## 👩‍💻 Team Amethyst

| Name | Role |
|---|---|
| Neha Singh | Frontend + Backend |
| Palak Dasauni | Frontend + Backend |
| Ananya | ML |
| Dhruvika Rawat | ML |

---

## 🚨 The Problem

Women today juggle 5+ separate apps for periods, diet, sleep, and wellness. Platforms give generic advice that doesn't adapt to their unique body or changing life stages. Tools only track the past instead of preparing you for tomorrow.

---

## ✅ The Solution

HerLife replaces the clutter. It gathers scattered health routines into one smart platform that finally connects the dots between your cycle, sleep, stress, and overall wellness — and predicts what comes next.

---

## 🌸 Life Phases Supported

| Phase | Age Range | Features |
|---|---|---|
| Preteen | < 12 | Preteen | < 12 | Puberty education, menstrual awareness, and guided health literacy |
| Young Women | 13–44 | Full cycle tracking, PCOS detection, period prediction |
| Pregnant | Any | Pregnancy tracking, week-by-week updates |
| Postpartum | Any | Recovery tracking, return of period detection |
| Menopause | 45+ | Symptom management, hormone health tracking |

---

## 🤖 ML Models

### Model A — PCOS/PCOD Risk Classifier
- **Algorithm:** XGBoost (200 estimators)
- **Target:** Binary classification — PCOS risk (Yes/No)
- **Features:** 25 health indicators including BMI, cycle regularity, flow intensity, skin condition, hair fall, hormonal stress index
- **Performance:** ROC-AUC: 1.0 | F1 Score: ~1.0
- **Class Imbalance:** Handled via `scale_pos_weight`

### Model B — Period Cycle Predictor
- **Algorithm:** SVR with RBF Kernel
- **Target:** Regression — days until next period
- **Features:** 22 indicators including stress level, sleep quality, mood, hydration, cycle history
- **Performance:** MAE: 2.18 days | R²: 0.93
- **Scaling:** StandardScaler (mandatory for SVR)

### How Predictions Work
```
User fills onboarding + daily log
            ↓
Backend combines profile + 7-day log average
            ↓
Auto-calculates: BMI, Age, Days Since Period,
Hormonal Stress Index, Wellness Score,
Cycle Irregularity Score
            ↓
Model A → PCOS Risk Score (%)
Model B → Days Until Next Period
            ↓
Homepage cards update in real time
```

---

## 🗄️ Dataset

- **Size:** 1,200 rows × 42 columns
- **Source:** Real form responses + synthetic expansion
- **Life phases covered:** Young Women, Pregnant, Postpartum, Menopause, Preteen
- **Special features:**
  - Phase-aware null handling (Preteen/Menopause have no period data by design)
  - 5% anomaly injection for robust pattern recognition
  - NLP journal entries for sentiment analysis
  - Clinical ML correlations (PCOS ↔ BMI, irregular cycles, severe acne)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Flask (Python) |
| Database | Supabase (PostgreSQL) |
| ML Models | XGBoost, SVR (scikit-learn) |
| Auth | Supabase Auth |
| Hosting | Local / Render |

---

## 📁 Project Structure

```
HerLife_HOF/
├── frontend/                  ← Next.js app
│   ├── components/
│   │   ├── auth/              ← Login, Signup
│   │   ├── dashboard/         ← Phase dashboards
│   │   ├── onboarding/        ← Onboarding flow
│   │   ├── pregnant/          ← Pregnancy features
│   │   ├── postpartum/        ← Postpartum features
│   │   ├── menopause/         ← Menopause features
│   │   └── preteen/           ← Preteen features
│   └── app/
│       ├── onboarding/        ← Phase-based question pages
│       └── dashboard/         ← Homepage
│
├── backend/                   ← Flask API
│   ├── app.py                 ← Main Flask application
│   ├── .env                   ← Supabase credentials
│   ├── models/                ← Trained ML models
│   │   ├── herlife_pcos_xgb_model.pkl
│   │   ├── herlife_pcos_features.pkl
│   │   ├── herlife_period_svr_model.pkl
│   │   ├── herlife_period_scaler.pkl
│   │   └── herlife_period_features.pkl
│   └── venv/                  ← Python virtual environment
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/signup` | Create new user |
| POST | `/api/update-phase` | Save life phase |
| POST | `/api/onboarding` | Save health profile + calculate BMI |
| POST | `/api/profile` | Update lifestyle data |
| POST | `/api/daily-log` | Save daily log + run ML predictions |
| GET | `/api/predictions/<user_id>` | Fetch latest predictions |

---

## 🗃️ Database Schema (Supabase PostgreSQL)

```sql
users              → id, email, name, dob, age, life_phase, height, weight, bmi
health_profile     → user_id, last_period_date, cycle_length, flow_intensity,
                     pcos_diagnosed, periods_regular, bleeding_duration,
                     clotting, pain_level, missed_periods_frequency,
                     exercise_frequency, sleep_duration, diet_type,
                     caffeine_intake, junk_food_frequency, sugar_intake,
                     water_intake, skin_condition, hair_fall,
                     hormonal_contraceptive
daily_logs         → user_id, log_date, mood, stress_level, sleep_quality,
                     water_glasses, period_started, energy_level
predictions        → user_id, cycle_phase, days_until_period,
                     pcos_risk_score, next_period_date, updated_at
```

---

## 📋 User Flow

```
Sign Up (name, email, DOB, password)
        ↓
Life Phase Selection
        ↓
Onboarding Questions (phase-specific, ~14 questions)
        ↓
Profile Page (lifestyle questions, filled once)
        ↓
Homepage Dashboard
  ├── Current cycle phase card
  ├── Period calendar
  ├── Days until next period
  ├── PCOS risk score
  └── Daily log (mood, stress, sleep, water)
        ↓
☰ Menu → Nutrition | Exercise | Education | Water tracker
```

---

## 🔄 Auto-Calculated Fields (never asked to user)

| Field | Calculated From |
|---|---|
| `BMI` | height + weight |
| `Age` | date of birth |
| `Days_Since_Last_Period` | last period date vs today |
| `Hormonal_Stress_Index` | stress × sleep formula |
| `Wellness_Score` | sleep + mood + energy - stress - junk |
| `Cycle_Irregularity_Score` | regularity + missed + cycle length |
| `Current_Cycle_Phase` | days since period ÷ cycle length |
| `Next_Period_Date` | today + days until period |

---

## 🚀 Running Locally

### Backend
```bash
cd backend
source venv/bin/activate
python3 app.py
# Running on http://127.0.0.1:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### Environment Variables
Create `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_secret_key
```

---

## 📊 ML Pipeline Summary

```
1. Data Collection    → 1,200 row dataset from real form responses
2. Preprocessing      → Phase-aware nulls, ordinal encoding,
                        symptom expansion, IQR outlier clipping
3. Feature Engineering → Hormonal Stress Index, Wellness Score,
                         Cycle Irregularity Score
4. Feature Selection  → ANOVA F-score top 15 features per target
5. Model Training     → XGBoost (PCOS) + SVR (Period prediction)
6. Evaluation         → ROC-AUC 1.0 | MAE 2.18 days | R² 0.93
7. Deployment         → Flask REST API serving .pkl model files
```

---

## 🌟 Key Features

- **Lifelong companion** — supports every phase from teen to menopause
- **Proactive predictions** — warns about delayed periods before they happen
- **PCOS early detection** — flags risk even for undiagnosed users
- **7-day averaging** — predictions improve with daily use
- **Phase-aware** — questions, dashboard and features adapt to life stage
- **Privacy first** — all data stored securely in PostgreSQL

---

## 🏆 Built For

HerLife was built for a hackathon by Team Amethyst with the goal of creating a women's health platform that is lifelong, unified, and personal.

---

*Made with 🩷 by Team Amethyst*
