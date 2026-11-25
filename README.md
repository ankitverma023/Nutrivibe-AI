# NutriVibe 🥗🤖⚡

**Enterprise-Grade AI-Powered Nutrition Intelligence, Diet Planning & Clinical Health Risk Prediction Platform**

NutriVibe is a full-stack preventive healthcare and nutrition platform built on an asynchronous **MERN + Python FastAPI** decoupled microservices architecture. Moving beyond legacy manual calorie counters, NutriVibe combines real-time **WebRTC computer vision food recognition**, **ICMR-NIN & USDA nutritional tables**, **interactive portion scaling (plates & grams)**, **personalized medical health protocols (Pregnancy, Lactation, Diabetes, PCOS)**, and **clinical metabolic risk predictions (Type-2 Diabetes, Cardio/Fat, Hypertension, BMI)**.

---

## 🌟 Key Highlights & Features

### 1. 📸 Intelligent Food Vision & Nutrition Estimation (No Random Fallbacks)
- **Multi-Device Live Camera (WebRTC) & File Upload:** Seamlessly access live webcams on MacBooks/laptops or rear/front cameras on iOS/Android smartphones with clean aspect-ratio viewfinder.
- **Center-Weighted HSV & Texture Analysis:**
  - Extracts the center 65% of the food dish, eliminating plate rims, bowls, and dark tablecloth backgrounds.
  - Computes golden/saffron, green, crimson/curry, white, and wheat hue histograms.
  - Applies high-frequency edge texture filters (Laplacian) to accurately separate textured grain dishes (*Chicken Biryani, Veg Pulao, Poha*) from smooth liquid gravies (*Dal Tadka, Dal Makhani*) and flat discs (*Whole Wheat Roti, Paratha*).
- **Interactive Portion Size Controls (Optional):**
  - **Preset Plate Servings:** Quick-select `0.5 Plate`, `1 Plate (Default)`, `1.5 Plates`, or `2 Plates`.
  - **Custom Grams Input (Optional):** Enter exact measured weight (e.g., `150g`, `200g`, `350g`).
  - **Live Dynamic Recalculation:** Calories, total fat, protein, and carbs scale instantly as portion size or grams change!
- **User-Controlled Review & Confirmation:**
  - Scanned meals are displayed for visual verification first; no unwanted or misidentified meals are silently force-saved.
  - Users can adjust portion sizes, switch categories (Breakfast, Lunch, Dinner, Snack), or pick from 1-tap alternative staples before clicking **"Add Meal to Tracker"**.
- **Robust Error & Upload Failure Notification:**
  - Clear red banner alert if photo upload fails or file is invalid/corrupted (`Image upload / scan failed`).
  - Caution notice when visual match is approximate or low confidence (`<85%`).
- **Quick-Alternative Dish Switcher:** If the AI matches an approximate dish, 1-click chips let the user switch to their actual meal (e.g. *Chicken Biryani, Dal Tadka, Paneer Butter Masala, Roti, Garden Salad, Boiled Eggs, Oats, Idli Sambhar, Rajma Chawal*) without scanning again.

---

### 2. 🤰 Personalized Medical Health & Life Stages
Rather than giving generic recommendations, NutriVibe customizes diet plans, caloric targets, and exercise safety for each user's unique physiological condition:
- **Supported Medical Conditions & Life Stages:**
  - 🤰 **Pregnancy (1st, 2nd, 3rd Trimester):** ICMR-NIN +350 kcal/day allowance, Folate (600mcg), Elemental Iron (27mg), Calcium (1200mg), DHA; safe prenatal yoga & gentle walking; strictly avoids raw papaya (latex/papain), unpasteurized dairy, abdominal crunches, and heavy deadlifts.
  - 🤱 **Lactation / Nursing Mothers:** +500 kcal/day allowance, galactagogues (methi, saunf, oats), 12-14 glasses hydration.
  - 🩸 **Type-2 / Gestational Diabetes:** Low Glycemic Index (<55), >35g soluble fiber, 15-min post-meal walking to stimulate GLUT-4 insulin-independent glucose clearance.
  - 🫀 **Hypertension (DASH Protocol):** Sodium restriction (<1500mg), potassium-rich foods (tender coconut, bananas), aerobic walking, avoidance of heavy Valsalva maneuvers.
  - 🌸 **PCOS / PCOD:** Seed cycling (flax, pumpkin), spearmint tea, anti-inflammatory whole foods, progressive resistance training.
  - 🦋 **Thyroid Care (Hypothyroidism):** Iodine/selenium-rich foods, cooked cruciferous vegetables, moderate aerobic movement.
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

### 4. 🩺 Clinical Health Risk Prediction Engine
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

### 5. 🍽️ Dedicated Nutrition Studio
- **Diurnal Meal Categorization:** Workspaces for **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
- **Normalized Category Ingestion:** Robust Mongoose backend schema supporting standard enums with automatic alias normalization.
- **Visual Macronutrient Bars:** Real-time tracking of calories, protein, carbs, and fat per category.
- **Integrated Food Explorer:** Instant search across the ICMR IFCT database with pre-calculated portion sizes.

---

### 6. 💧 Persistent Hydration Tracker
- **MongoDB Atlas Persistence:** Date-indexed storage with atomic upsert operations (`{ user: 1, date: 1 }`).
- **Standard 250ml Multiplier:** Visual glass indicators with increment, decrement, and daily completion alerts.

---

### 7. 📊 7-Day Longitudinal Consistency Analytics
- **Responsive SVG Area Charts:** Real-time visualization of daily caloric adherence over a rolling 7-day window.
- **Macronutrient Distribution Donut:** Real-time ratio analysis of protein, carbohydrate, and lipid intake.

---

### 8. ⚡ Responsive Glassmorphic UI & Smooth Scrolling Sidebar
- **Full Viewport Scroll Support:** Sidebar incorporates smooth `overflow-y: auto` with custom slim scrollbars, ensuring that the **AI Power Health Card**, **User Profile**, and **Logout** buttons are always accessible on all screen resolutions (1080p, 13" laptops, tablets).
- **Instant Theme Switching:** Seamlessly toggle between Obsidian Dark Mode and Crisp Light Mode powered by CSS custom properties.

---

## 🔬 Dataset & Scientific Standards

NutriVibe's nutritional calculations and clinical algorithms are derived from official government and clinical databases:

1. **ICMR-NIN Indian Food Composition Tables (IFCT 2017):**
   - Published by the **National Institute of Nutrition (NIN)**, Indian Council of Medical Research (ICMR), Ministry of Health & Family Welfare, Govt. of India.
   - Provides laboratory-analyzed macro- and micronutrient values for authentic Indian recipes, cooking oils, dals, grains, and spice blends.
2. **USDA FoodData Central:**
   - Standard reference dataset from the **U.S. Department of Agriculture** for whole foods, poultry, fish, fruits, nuts, and global fitness staples.
3. **Clinical Guidelines & Equations:**
   - **Mifflin-St Jeor Equation (1990):** Clinical gold standard for Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
   - **ICMR Maternal Nutrition Guidelines:** Trimester-specific caloric additions (+350 kcal) and micronutrient thresholds (Folate, Iron, Calcium).
   - **American Diabetes Association (ADA) Standards of Care:** Low Glycemic Index (<55) and high soluble fiber benchmarks.
   - **American Heart Association (AHA) DASH Protocol:** Sodium limitation (<1,500mg/day) and potassium adequacy (>3,500mg/day).

---

## 🖼️ Computer Vision & Food Recognition Pipeline

Food photo recognition in NutriVibe operates via a multi-stage visual pipeline specifically engineered to handle complex regional dishes, varied lighting, and diverse tableware:

```
[ User Snaps / Uploads Photo ]
            │
            ▼
[ Stage 1: Adaptive Center-Crop ] ──> Focuses on center 65% area to eliminate plates, bowls & background
            │
            ▼
[ Stage 2: HSV Color Histogram ] ──> Evaluates Saffron/Golden, Crimson Gravy, Leafy Green, White, and Wheat hues
            │
            ▼
[ Stage 3: Edge Texture Energy ] ──> Applies Laplacian kernel to measure surface texture (grain vs liquid vs dough)
            │
            ▼
[ Stage 4: ICMR/USDA Database Match ] ──> Maps detected features to authentic nutritional data & returns top alternatives
            │
            ▼
[ Stage 5: Interactive Portion Review ] ──> User chooses 0.5/1/1.5/2 Plates or Grams with real-time recalculation
```

### Visual Decision Matrix:
| Food Class | Dominant HSV Hue | Edge Texture Energy | Texture Characteristics | Example Dish |
| :--- | :--- | :--- | :--- | :--- |
| **Biryani & Rice Dishes** | Golden / Saffron (10°-45°) | High ($\ge 20.0$) | Discrete grain edges, chicken pieces, fried onions | Chicken Biryani, Veg Pulao |
| **Lentils & Smooth Dals** | Golden / Yellow (15°-45°) | Low ($< 18.0$) | Homogeneous liquid puree with low surface variance | Dal Tadka, Dal Makhani |
| **Breads & Roti** | Wheat / Warm Brown (12°-32°) | Low ($< 22.0$) | Circular flat dough disc with uniform tone | Whole Wheat Roti, Paratha |
| **Gravies & Curries** | Crimson / Deep Red ($< 12°$ or $> 240°$) | Moderate ($15.0 - 24.0$) | Thick tomato/onion emulsion with paneer or meat cubes | Paneer Butter Masala, Chicken Curry |
| **Salads & Leafy Greens** | Green ($45° - 105°$) | Moderate to High | Fresh vegetable chunks and leafy foliage | Mediterranean Garden Salad, Palak Paneer |
| **Steamed / Dairy Staples** | White / Translucent (Sat $\le 40$) | Variable | Smooth or granular white surface | Steamed Idli, Basmati Rice, Boiled Eggs |

### 🚀 Future Roadmap: Multimodal Gemini Vision API Integration
To expand from the current core regional staples to 10,000+ open-world global dishes, NutriVibe is engineered to seamlessly integrate with **Google Gemini 1.5 Flash Vision API**:
- **Zero-Shot Open-World Recognition:** Deep visual understanding of rare regional street foods, multi-course thalis, and custom home recipes.
- **Hybrid Nutritional Pairing:** Gemini Vision identifies the exact food item and visual portion estimate from the photograph, while NutriVibe's local ICMR IFCT database provides certified Indian caloric and macronutrient values.

---

## 🏗️ Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │           React 19 Frontend            │
                                  │      (Vite + Glassmorphism UI)         │
                                  │  • WebRTC Camera & Canvas Snapshot     │
                                  │  • Portion Scaler (Plates / Grams)     │
                                  │  • Medical Health Protocols View       │
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
                        │   Compound B-Tree Idx) │        │  Port 8000 | Vision & HSV  │
                        │                        │        │  Texture / Edge Analyzer   │
                        │                        │        │  IFCT 2017 & USDA Mapper   │
                        │                        │        │  Diet Plan & Risk Predictor│
                        └────────────────────────┘        └────────────────────────────┘
```

---

## 📂 Project Structure

```text
nutrivibe-ai/
├── client/                               # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiScannerModal.jsx        # WebRTC camera capture, portion controls (plates/grams) & photo review
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
│   │   ├── utils/
│   │   │   └── calorieCalculator.js      # Mifflin-St Jeor BMR & medical condition adjustment engine
│   │   ├── App.jsx                       # Master Dashboard & view router
│   │   └── App.css                       # Responsive Glassmorphic styles & scrollable sidebar
│   └── .env                              # VITE_API_URL=http://localhost:5001/api
│
├── server/                               # Node.js + Express.js API Gateway
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js           # Food scan, diet plans, health risk prediction
│   │   │   ├── mealController.js         # Meal persistence & normalized category ingestion
│   │   │   ├── waterController.js        # Date-indexed atomic hydration upserts
│   │   │   ├── analyticsController.js    # 7-day rolling window analytics engine
│   │   │   ├── authController.js         # Bcrypt registration & JWT issuance
│   │   │   └── profileController.js      # Biometrics, medical condition & profile engine
│   │   ├── models/
│   │   │   ├── User.js                   # User schema with biometric goals & medicalCondition enum
│   │   │   ├── Meal.js                   # Meal document schema with compound indexes
│   │   │   └── WaterLog.js               # Unique { user, date } hydration document
│   │   ├── routes/                       # Express route definitions
│   │   ├── middleware/                   # JWT verification & request sanitization
│   │   └── app.js                        # Express setup with CORS & 10MB payload limit
│   └── .env                              # PORT=5001, MONGODB_URI, JWT_SECRET, AI_SERVICE_URL
│
├── ai-service/                           # Python 3.11 FastAPI Machine Learning Microservice
│   ├── main.py                           # ASGI application with OpenAPI Swagger docs
│   ├── food_classifier.py                # Center-crop HSV color & edge texture computer vision
│   ├── nutrition_db.py                   # In-memory ICMR IFCT 2017 & USDA food dictionary
│   ├── recommender.py                    # Diet plan builder & clinical health risk engine
│   └── requirements.txt                  # fastapi, uvicorn, pydantic, pillow
│
└── README.md                             # Project Documentation
```

---

## 🔌 API Endpoints Reference

### 1. AI & Computer Vision Service (`/api/ai`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/scan-food` | Yes | Parses base64 photo/query; returns food name, calories, fat, protein, carbs, and alternatives. |
| `POST` | `/api/ai/diet-recommendations` | Yes | Generates personalized 4-meal daily schedule tailored to user goals and medical condition. |
| `POST` | `/api/ai/health-risk-prediction` | Yes | Computes Diabetes, Cardio/Fat, Hypertension, BMI, and Vitality Score. |
| `POST` | `/api/ai/insights` | Yes | Generates automated NutriVibe Health Score (0-100) and power recommendations. |

### 2. Transactional Meal Management (`/api/meals`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/meals` | Yes | Retrieves user meals with optional date & category filters. |
| `POST` | `/api/meals` | Yes | Creates and logs a meal with normalized category handling. |
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

## 👥 Contributors

We welcome contributions from the community! This project has been built with the efforts of the following contributors:

| Contributor | Role | GitHub | Contributions |
| :--- | :--- | :--- | :--- |
| **Ankit Verma** | Project Lead & Full-Stack Developer | [@ankitverma023](https://github.com/ankitverma023) | Architecture design, AI microservice (FastAPI, computer vision), Express API gateway, MongoDB schemas, clinical algorithms (Mifflin-St Jeor, ICMR protocols, risk prediction), diet recommendation engine, health risk predictor |
| **Vishal Mandal** | Frontend & UI/UX Engineer | [@vishalmandal713](https://github.com/vishalmandal713) | React 19 frontend (Vite), glassmorphic UI components, WebRTC camera integration, responsive dark/light themes, SVG charts (Recharts), Nutrition Studio, Activity & Progress pages, AI Scanner modal, portion scaler, sidebar navigation, theme switching, CI/CD pipeline |
| **Dhruv Gupta** | Backend & Database Engineer | [@CODER-1905-UMANG](https://github.com/CODER-1905-UMANG) | Express.js REST API, JWT authentication, meal & hydration controllers, analytics aggregation, MongoDB compound indexes, API documentation, deployment configuration |

---

### 🤝 How to Contribute

We love contributions! Here's how you can help:

1. **Fork the repository** and create your branch from `main`
2. **Run the tests** (if available) and ensure the linter passes
3. **Make your changes** with clear, descriptive commit messages
4. **Open a Pull Request** with a detailed description of your changes

#### Areas where we'd love help:
- 🌐 **Internationalization (i18n)** — Add support for Hindi, Tamil, Bengali, etc.
- 📱 **PWA Support** — Service worker for offline meal logging
- 🧪 **Test Coverage** — Unit tests (Vitest/Jest) and E2E tests (Cypress/Playwright)
- ♿ **Accessibility** — ARIA labels, focus management, screen reader testing
- 📊 **Charts & Visualizations** — Additional chart types, export to PDF/CSV
- 🤖 **AI Model Expansion** — More food classes, Gemini Vision integration
- 🏥 **Clinical Protocols** — Additional medical conditions (CKD, Gout, etc.)

#### Code Style Guidelines:
- **Frontend:** ESLint + Prettier (configured), TypeScript preferred for new files
- **Backend:** ESLint + Prettier, JSDoc for public functions
- **AI Service:** Black formatter, type hints (Pydantic), docstrings
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

---

## 🛡️ License & Acknowledgements

- **License:** MIT License — see [LICENSE](LICENSE) for details.
- Food composition standards synthesized from the **ICMR - National Institute of Nutrition (IFCT 2017)** and the **United States Department of Agriculture (USDA FoodData Central)**.
- Clinical guidelines referenced from **ICMR Maternal Nutrition Guidelines**, **ADA Standards of Care**, **AHA DASH Protocol**.
- Designed and built with ❤️ by the **NutriVibe Team** for modern, intelligent, and proactive healthcare.

---

<p align="center">
  <strong>NutriVibe — Eat Smart. Live Better. 🥗🤖⚡</strong>
</p>

<p align="center">
  <a href="https://github.com/ankitverma023/Nutrivibe-AI/stargazers">
    <img src="https://img.shields.io/github/stars/ankitverma023/Nutrivibe-AI?style=social" alt="GitHub Stars">
  </a>
  <a href="https://github.com/ankitverma023/Nutrivibe-AI/network/members">
    <img src="https://img.shields.io/github/forks/ankitverma023/Nutrivibe-AI?style=social" alt="GitHub Forks">
  </a>
  <a href="https://github.com/ankitverma023/Nutrivibe-AI/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ankitverma023/Nutrivibe-AI" alt="License">
  </a>
</p>
