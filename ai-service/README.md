# NutriVibe AI Microservice 🥗🤖

FastAPI-powered Food Recognition and Nutritional Intelligence engine. Built using ICMR-NIN Indian Food Composition Tables (IFCT 2017) and USDA FoodData Central specifications.

## Features
- **Computer Vision & Food Recognition:** Accepts food image uploads (base64) and extracts detected dishes.
- **Nutritional Breakdown:** Instant calorie, protein, carb, fat, and fiber estimation.
- **AI Health Recommendations:** Gap analysis for daily protein, calorie targets, and hydration.
- **RESTful Endpoints:** Plugs directly into the NutriVibe Express backend gateway.

## Setup Instructions

```bash
# 1. Navigate to ai-service directory
cd ai-service

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the FastAPI microservice
uvicorn main:app --reload --port 8000
```

Interactive API documentation available at: `http://localhost:8000/docs`
