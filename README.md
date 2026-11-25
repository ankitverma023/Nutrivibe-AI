# NutriVibe 🥗🤖⚡

**Enterprise-Grade AI-Powered Nutrition Intelligence, Diet Planning & Clinical Health Risk Prediction Platform**

NutriVibe is a full-stack preventive healthcare and nutrition platform built on an asynchronous **MERN + Python FastAPI** decoupled microservices architecture. Moving beyond legacy manual calorie counters, NutriVibe combines real-time **WebRTC computer vision food recognition**, **ICMR-NIN & USDA nutritional tables**, **instant photo auto-meal logging**, **personalized daily diet planning**, and **clinical health risk predictions (Type-2 Diabetes, Cardio/Fat, Hypertension, BMI)**.

---

## 🌟 Key Highlights & Features

### 1. 📸 Photo Scan & Food Recognition with Portion Control (Plates & Grams)
- **Multi-Device Live Camera (WebRTC) & File Upload:** Access live webcams on MacBooks/laptops or rear/front cameras on iOS/Android smartphones with clean aspect-ratio viewfinder.
- **Portion Size Controls (Optional):**
  - **Preset Plate Servings:** Quick-select `0.5 Plate`, `1 Plate (Default)`, `1.5 Plates`, or `2 Plates`.
  - **Custom Grams Input (Optional):** Enter exact measured weight (e.g., `150g`, `200g`, `350g`).
  - **Live Dynamic Recalculation:** Calories, total fat, protein, and carbs scale instantly as portion size changes!
- **Robust Error & Upload Failure Notification:**
  - Clear red banner alert if photo upload fails or file is invalid/corrupted (`Image upload / scan failed`).
  - Caution notice when visual match is uncertain or low confidence (`<85%`).
- **Quick-Alternative Dish Switcher:** If the AI matches an approximate dish, 1-click chips let the user switch to their actual meal (e.g. *Dal Tadka, Paneer Butter Masala, Chicken Biryani, Salad, Boiled Eggs, Oats, Idli Sambhar, Rajma Chawal*) without scanning again.
- **Instant Database Persistence:** Save directly to MongoDB Atlas with normalized categories and full transactional safety.

---

### 2. 🤰 Medical Health & Life Stages Personalization
- **Unique Recommendations Per User:** Diet plans, calorie calculations, and activities are tailored to the user's specific clinical health profile rather than generic advice.
- **Supported Medical Conditions & Life Stages:**
  - 🤰 **Pregnancy (1st, 2nd, 3rd Trimester):** ICMR-NIN +350 kcal/day allowance, Folate (600mcg), Elemental Iron (27mg), Calcium (1200mg), DHA; safe prenatal yoga & walking; strictly avoids raw papaya, unpasteurized milk, crunches, and heavy deadlifts.
  - 🤱 **Lactation / Nursing Mothers:** +500 kcal/day allowance, galactagogues (methi, saunf, oats), 12-14 glasses hydration.
  - 🩸 **Type-2 / Gestational Diabetes:** Low Glycemic Index (<55), >35g soluble fiber, 15-min post-meal walking to stimulate GLUT-4 insulin-independent glucose clearance.
  - 🫀 **Hypertension (DASH Protocol):** Sodium restriction (<1500mg), potassium-rich foods (tender coconut, bananas), aerobic walking, avoidance of heavy Valsalva maneuvers.
  - 🌸 **PCOS / PCOD:** Seed cycling, spearmint tea, anti-inflammatory whole foods, progressive resistance training.
  - 🦋 **Thyroid Care:** Iodine/selenium-rich foods, cooked cruciferous vegetables, moderate aerobic movement.
- **Condition-Specific Safe Physical Activity Guidance:** Dedicated safe workout logger and contraindications warning list in the Activity module.
- **1-Click Clinical Meal Logging:** Instantly log condition-specific meals directly into the daily tracker.

---

### 3. 🥗 AI Diet Recommendations & Personalized Meal Planner
- **Biometric & Goal Alignment:** Tailored dynamically to your target calories, fitness objective (*Weight Loss / Fat Loss, Muscle Hypertrophy, Maintenance*), and dietary preferences (*Vegetarian, Vegan, Non-Veg, High-Protein*).
- **Structured 4-Meal Daily Blueprint:**
  - 🌅 **Breakfast (8:00 AM - 9:30 AM):** High-protein, sustained-energy morning meals.
  - ☀️ **Lunch (1:00 PM - 2:30 PM):** Nutrient-dense anchor plates with balanced fiber.
  - ☕ **Evening Snack (5:00 PM - 6:00 PM):** Low-glycemic items to curb sugar spikes.
  - 🌙 **Dinner (8:00 PM - 9:30 PM):** Clean, light digestion recovery meals.
- **1-Click "Add to Today's Meals":** Each recommended card features a single-click button that logs the meal directly to your tracker with zero typing.
- **Interactive Mode Filters:** Switch between *Balanced All-Day*, *High Protein Muscle*, and *Fat Loss Deficit*.

---

### 3. 🩺 Clinical Health Risk Prediction Engine
- **Metabolic Vitality Score (0 to 100):** Visual health vitality score with dynamic color-coded indicators.
- **Biometrics & BMI Analysis:** Computes BMI ($BMI = \frac{\text{weight}}{\text{height}^2}$), classifies metabolic status (*Underweight, Normal, Overweight, Obese*), and determines the user's ideal weight range.
- **5 Multi-Factor Clinical Disease Risk Assessments:**
  1. **Type-2 Diabetes & Glycemic Risk:** Evaluates high carbohydrate/sugar ratio (>55% of energy), elevated BMI, and sedentary activity.
  2. **Cardiovascular & Cholesterol / High-Fat Risk:** Analyzes daily fat intake (flagging if fat > 35% of calories or > 65g/day) and provides cooking oil recommendations.
  3. **Hypertension & Chronic Dehydration Risk:** Monitors water deficit (< 6 glasses/day) and sodium retention risks.
  4. **Metabolic Syndrome & Obesity Index:** Tracks caloric surplus accumulation trajectory.
  5. **Sarcopenia & Muscle Wasting Risk:** Checks protein intake against the clinical $0.8\text{g/kg}$ body mass benchmark.
- **Interactive "What-If" Lifestyle Simulator:** Real-time sliders allow users to simulate improvements (e.g., adding +2 glasses of water, cutting 15g cooking fat, adding 30 min walking) and see their Vitality Score improve live.
- **Save & Export Assessment Report:** Single-click printable format for medical consultations.

---

### 4. 🍽️ Dedicated Nutrition Studio
- **Diurnal Meal Categorization:** Separate workspaces for **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
- **Visual Macronutrient Bars:** Real-time tracking of calories, protein, carbs, and fat per category.
- **Integrated Food Explorer:** Instant search across the 528+ item ICMR IFCT database with pre-calculated portion sizes.

---

### 5. 💧 Persistent Hydration Tracker
- **MongoDB Atlas Persistence:** Date-indexed storage with atomic upsert operations (`{ user: 1, date: 1 }`).
- **Standard 250ml Multiplier:** Visual glass indicators with increment, decrement, and daily completion alerts.

---

### 6. 📊 7-Day Longitudinal Consistency Analytics
- **Responsive SVG Area Charts:** Real-time visualization of daily caloric adherence over a rolling 7-day window.
- **Lifetime Macronutrient Distribution Donut:** Real-time ratio analysis of protein, carbohydrate, and lipid intake.

---

### 7. ⚡ AI Power Health Assistant & Dual-Theme UI
- **Instant Health Score & Daily Power Hacks:** Multi-factor metabolic score with 3 contextual action items.
- **Obsidian Dark Mode & Crisp Light Mode:** Instant theme switching powered by CSS custom properties and Glassmorphism design tokens.

---

## 🏗️ Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │           React 19 Frontend            │
                                  │      (Vite + Glassmorphism UI)         │
                                  │  • WebRTC Camera & Canvas Snapshot     │
                                  │  • Diet Plan & Health Risk Predictor   │
                                  │  • Obsidian Dark / Crisp Light Themes  │
                                  └───────────────────┬────────────────────┘
                                                      │ HTTP / REST (JWT Bearer)
                                                      ▼
                                  ┌────────────────────────────────────────┐
                                  │          Node.js + Express.js          │
                                  │          (REST API Gateway)            │
                                  │  Port 5001 | Auth | Meals | Water      │
                                  │  Analytics | Failover Circuit Breaker  │
                                  └─────────┬────────────────────┬─────────┘
                                            │                    │
                        ┌───────────────────┴────┐        ┌──────┴─────────────────────┐
                        │     MongoDB Atlas      │        │    Python 3.11 FastAPI     │
                        │  (Users, Meals, Water, │        │     (AI Microservice)      │
                        │   Compound B-Tree Idx) │        │  Port 8000 | CNN Vision    │
                        └────────────────────────┘        │  IFCT 2017 & USDA Mapper   │
                                                          │  Diet Plan & Risk Predictor│
                                                          └────────────────────────────┘
```

---

## 📂 Project Structure

```text
nutrivibe-ai/
├── client/                               # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiScannerModal.jsx        # WebRTC camera capture, portion controls (plates/grams) & photo auto-add
│   │   │   ├── MedicalHealth.jsx         # Clinical protocols: Pregnancy, Lactation, Diabetes, PCOS & Safe Workouts
│   │   │   ├── DietRecommendations.jsx   # 4-Meal personalized diet plans with 1-click add
│   │   │   ├── HealthRiskPredictor.jsx   # Clinical risk predictor (Diabetes, Cardio, BMI)
│   │   │   ├── Nutrition.jsx             # Dedicated Nutrition Studio by meal categories
│   │   │   ├── PowerHealthModal.jsx      # AI Health Assistant with score & power hacks
│   │   │   ├── Goals.jsx                 # Mifflin-St Jeor BMR/TDEE goals setup
│   │   │   ├── Progress.jsx              # 7-day SVG consistency & macro charts
│   │   │   ├── Activity.jsx              # Physical activity & condition-specific safe workouts
│   │   │   ├── Profile.jsx               # Biometric measurements, medical conditions & account management
│   │   │   └── Settings.jsx              # Theme switcher, security, preferences
│   │   ├── services/
│   │   │   ├── aiService.js              # Scan food, diet plan, health risk API callers
│   │   │   ├── mealService.js            # Transactional meal CRUD methods
│   │   │   ├── waterService.js           # Atomic hydration logging methods
│   │   │   ├── analyticsService.js       # 7-day longitudinal query services
│   │   │   └── authService.js            # JWT token & session management
│   │   ├── App.jsx                       # Master Dashboard & view router
│   │   └── App.css                       # Responsive Glassmorphic styles & CSS variables
│   └── .env                              # VITE_API_URL=http://localhost:5001/api
│
├── server/                               # Node.js + Express.js API Gateway
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js           # Food scan, diet plans, health risk prediction
│   │   │   ├── mealController.js         # Meal persistence & aggregation
│   │   │   ├── waterController.js        # Date-indexed atomic hydration upserts
│   │   │   ├── analyticsController.js    # 7-day rolling window analytics engine
│   │   │   ├── authController.js         # Bcrypt registration & JWT issuance
│   │   │   └── profileController.js      # Biometrics & Mifflin-St Jeor engine
│   │   ├── models/
│   │   │   ├── User.js                   # User schema with biometric goals
│   │   │   ├── Meal.js                   # Meal document schema with compound indexes
│   │   │   └── WaterLog.js               # Unique { user, date } hydration document
│   │   ├── routes/                       # Express route definitions
│   │   ├── middleware/                   # JWT verification & request sanitization
│   │   └── app.js                        # Express setup with CORS & 10MB payload limit
│   └── .env                              # PORT=5001, MONGODB_URI, JWT_SECRET, AI_SERVICE_URL
│
├── ai-service/                           # Python 3.11 FastAPI Machine Learning Microservice
│   ├── main.py                           # ASGI application with OpenAPI Swagger docs
│   ├── food_classifier.py                # Visual color detection, filename matching & macros
│   ├── nutrition_db.py                   # In-memory ICMR IFCT 2017 & USDA food dictionary
│   ├── recommender.py                    # Diet plan builder & clinical health risk engine
│   └── requirements.txt                  # fastapi, uvicorn, pydantic, pillow
│
├── NutriVibe_BTech_Major_Project_Report_MAIT.pdf   # 49-Page Academic Dissertation (MAIT CSE-AIML)
├── NutriVibe_BTech_Major_Project_Report_MAIT.docx  # Editable Word Document for Dissertation
└── README.md                             # Project Documentation
```

---

## 🔌 API Endpoints Reference

### 1. AI & Computer Vision Service (`/api/ai`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/scan-food` | Yes | Parses base64 photo/query; returns food name, calories, fat, protein, carbs. |
| `POST` | `/api/ai/diet-recommendations` | Yes | Generates personalized 4-meal daily schedule tailored to user goals. |
| `POST` | `/api/ai/health-risk-prediction` | Yes | Computes Diabetes, Cardio/Fat, Hypertension, BMI, and Vitality Score. |
| `POST` | `/api/ai/insights` | Yes | Generates automated NutriVibe Health Score (0-100) and power recommendations. |

### 2. Transactional Meal Management (`/api/meals`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/meals` | Yes | Retrieves user meals with optional date & category filters. |
| `POST` | `/api/meals` | Yes | Creates and logs a meal (used by manual entry and AI photo auto-add). |
| `DELETE`| `/api/meals/:id` | Yes | Permanently removes a meal record owned by the authenticated user. |

### 3. Persistent Hydration Tracker (`/api/water`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/water` | Yes | Fetches water consumption record for specified calendar date. |
| `POST` | `/api/water/add-glass` | Yes | Atomically increments hydration count by 1 glass (+250ml). |
| `POST` | `/api/water/remove-glass`| Yes | Decrements hydration count by 1 glass (-250ml, non-negative). |

### 4. Longitudinal Analytics (`/api/analytics`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/weekly` | Yes | Returns 7-day chronological stats for SVG area & donut charts. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ or v20+ LTS
- **Python** 3.10+ or 3.11+
- **MongoDB** (Local instance or free MongoDB Atlas cluster)

---

### 2. Backend Gateway Setup
```bash
cd server
npm install
npm run dev
# Server listens on http://localhost:5001 (Port 5000 is avoided due to macOS AirPlay)
```

---

### 3. Python AI Microservice Setup
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# AI microservice runs on http://localhost:8000 (Interactive docs at http://localhost:8000/docs)
```

---

### 4. Frontend Client Setup
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 🎓 Academic Dissertation Report (MAIT CSE-AIML)

This repository includes the complete **B.Tech Major Project Dissertation Report** prepared for the **Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)** at **Maharaja Agrasen Institute of Technology (MAIT), Delhi**:

- **PDF Document:** [`NutriVibe_BTech_Major_Project_Report_MAIT.pdf`](NutriVibe_BTech_Major_Project_Report_MAIT.pdf) (49 pages, print-accurate, ready for Navy Blue Hard Binding with Golden Engraved Print).
- **Word Document:** [`NutriVibe_BTech_Major_Project_Report_MAIT.docx`](NutriVibe_BTech_Major_Project_Report_MAIT.docx) (Editable `.docx` format).
- **Compliance:** 100% compliant with MAIT guidelines (A4 single-sided, Left 1.5", Times New Roman 12pt, non-table dot-leader TOC, IEEE references, complete SRS, DFDs, ER diagrams, test cases, and OpenAPI matrices).

---

## 🛡️ License & Acknowledgements
- Food composition standards synthesized from the **ICMR - National Institute of Nutrition (IFCT 2017)** and the **United States Department of Agriculture (USDA FoodData Central)**.
- Designed and built with ❤️ by **Ankit** for modern, intelligent, and proactive healthcare.