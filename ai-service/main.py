"""
NutriVibe AI Microservice - FastAPI Server
Entrypoint for food recognition, nutrition estimation, personalized diet plans,
and multi-factor clinical health risk predictions.
"""

from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from nutrition_db import FOOD_ITEMS, search_food
from food_classifier import classifier
from recommender import (
    generate_recommendations,
    generate_diet_plan,
    predict_health_risks,
)

app = FastAPI(
    title="NutriVibe AI Microservice",
    description="Intelligent Food Recognition, Diet Planning & Clinical Risk Prediction API",
    version="1.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictFoodRequest(BaseModel):
    query: Optional[str] = Field(None, description="Food name or search prompt")
    image: Optional[str] = Field(None, description="Base64 encoded image string")
    fileName: Optional[str] = Field(None, description="Uploaded file name for semantic matching")


class RecommendationRequest(BaseModel):
    totals: Dict[str, float]
    goals: Dict[str, float]
    fitness_goal: Optional[str] = "maintenance"


class DietPlanRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    totals: Dict[str, Any] = Field(default_factory=dict)
    dietFilter: Optional[str] = "all"


class HealthRiskRequest(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    totals: Dict[str, Any] = Field(default_factory=dict)


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "NutriVibe AI Microservice",
        "database_items": len(FOOD_ITEMS),
        "standards": ["ICMR-NIN IFCT 2017", "USDA FoodData Central"],
    }


@app.post("/predict-food")
def predict_food(payload: PredictFoodRequest):
    """
    Identifies food item from user query, base64 photo, or filename,
    and returns exact calorie, fat, and macronutrient profile.
    """
    try:
        result = classifier.predict(
            query=payload.query,
            image_b64=payload.image,
            file_name=payload.fileName,
        )
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommendations")
def get_recommendations(payload: RecommendationRequest):
    try:
        advice = generate_recommendations(
            totals=payload.totals,
            goals=payload.goals,
            fitness_goal=payload.fitness_goal or "maintenance",
        )
        return {
            "success": True,
            "data": advice,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/diet-recommendations")
def get_diet_plan(payload: DietPlanRequest):
    """
    Generates tailored 4-meal daily blueprint (Breakfast, Lunch, Evening Snack, Dinner)
    with exact calories, fat, protein, carbs, and 1-click add metadata.
    """
    try:
        plan = generate_diet_plan(
            profile=payload.profile,
            current_totals=payload.totals,
            diet_filter=payload.dietFilter or "all",
        )
        return {
            "success": True,
            "data": plan,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/health-risk-prediction")
def get_health_risks(payload: HealthRiskRequest):
    """
    Computes clinical metabolic health risk scores:
    Diabetes, Cardiovascular/Cholesterol, Hypertension/Dehydration, BMI index.
    """
    try:
        risk_profile = predict_health_risks(
            profile=payload.profile,
            current_totals=payload.totals,
        )
        return {
            "success": True,
            "data": risk_profile,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/foods")
def list_foods(query: Optional[str] = None):
    if query:
        match = search_food(query)
        return {"results": [match] if match else []}
    return {"results": FOOD_ITEMS}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
