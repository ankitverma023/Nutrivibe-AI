"""
NutriVibe AI - Dietary Recommendation & Clinical Health Risk Prediction Engine
Provides personalized meal plans, fat/calorie optimization, and multi-factor
clinical risk predictions (Type-2 Diabetes, Cardiovascular/Cholesterol, Hypertension, BMI).
"""

from typing import Dict, Any, List
from nutrition_db import FOOD_ITEMS


def generate_recommendations(
    totals: Dict[str, float], goals: Dict[str, float], fitness_goal: str = "maintenance"
) -> Dict[str, Any]:
    """Legacy compatibility helper."""
    calories = float(totals.get("calories", 0))
    protein = float(totals.get("protein", 0))
    carbs = float(totals.get("carbs", 0))
    fat = float(totals.get("fat", 0))
    water = float(totals.get("water_glasses", 0))

    calorie_goal = float(goals.get("calorie_goal", 2000))
    protein_goal = float(goals.get("protein_goal", 100))
    water_goal = float(goals.get("water_goal", 8))

    insights: List[Dict[str, str]] = []
    meal_suggestions: List[Dict[str, Any]] = []

    protein_gap = protein_goal - protein
    if protein_gap > 20:
        insights.append({
            "type": "protein_deficit",
            "message": f"Protein gap detected: You need {int(protein_gap)}g more protein to hit your daily recovery target."
        })
        for item in [f for f in FOOD_ITEMS if f["protein"] >= 14][:3]:
            meal_suggestions.append({
                "name": item["name"],
                "reason": f"Provides {item['protein']}g protein with {item['calories']} kcal and {item['fat']}g fat.",
                "category": item["category"],
            })
    else:
        insights.append({
            "type": "protein_optimal",
            "message": "Excellent protein pacing! Your muscles have adequate amino acid support."
        })

    return {
        "status": "success",
        "insights": insights,
        "suggested_meals": meal_suggestions,
        "summary_score": min(100, max(45, int((protein / max(protein_goal, 1)) * 40 + (min(calories, calorie_goal) / max(calorie_goal, 1)) * 40 + (water / max(water_goal, 1)) * 20))),
    }


def generate_diet_plan(
    profile: Dict[str, Any],
    current_totals: Dict[str, Any],
    diet_filter: str = "all",
) -> Dict[str, Any]:
    """
    Generates a complete 4-meal daily blueprint (Breakfast, Lunch, Evening Snack, Dinner)
    with exact calories, fat, protein, carbs, and 1-click logging metadata.
    """
    fitness_goal = profile.get("fitnessGoal", "maintenance")
    dietary_pref = profile.get("dietaryPreference", "all").lower()
    target_cals = float(profile.get("customCalorieGoal") or 2100)
    target_protein = float(profile.get("customProteinGoal") or 110)

    # Filter available foods based on dietary preference
    pool = FOOD_ITEMS
    if dietary_pref in ["vegetarian", "veg"]:
        pool = [f for f in FOOD_ITEMS if f["diet"] in ["vegetarian", "vegan"]]
    elif dietary_pref == "vegan":
        pool = [f for f in FOOD_ITEMS if f["diet"] == "vegan"]

    # Categorize items
    breakfast_items = [f for f in pool if f["category"] == "Breakfast"] or [FOOD_ITEMS[3]]
    lunch_items = [f for f in pool if f["category"] == "Lunch"] or [FOOD_ITEMS[0]]
    snack_items = [f for f in pool if f["category"] == "Snack"] or [FOOD_ITEMS[12]]
    dinner_items = [f for f in pool if f["category"] == "Dinner"] or [FOOD_ITEMS[1]]

    # Pick top tailored options
    if diet_filter == "high_protein" or fitness_goal == "weight_gain":
        b_item = max(breakfast_items, key=lambda x: x["protein"])
        l_item = max(lunch_items, key=lambda x: x["protein"])
        s_item = max(snack_items, key=lambda x: x["protein"])
        d_item = max(dinner_items, key=lambda x: x["protein"])
    elif diet_filter == "low_fat" or fitness_goal == "weight_loss":
        b_item = min(breakfast_items, key=lambda x: x["fat"])
        l_item = min(lunch_items, key=lambda x: x["fat"])
        s_item = min(snack_items, key=lambda x: x["fat"])
        d_item = min(dinner_items, key=lambda x: x["fat"])
    else:
        b_item = breakfast_items[0]
        l_item = lunch_items[0]
        s_item = snack_items[0]
        d_item = dinner_items[0]

    plan_meals = [
        {
            "slot": "Breakfast",
            "time_window": "8:00 AM - 9:30 AM",
            "name": b_item["name"],
            "serving": b_item["serving_size"],
            "calories": b_item["calories"],
            "fat": b_item["fat"],
            "protein": b_item["protein"],
            "carbs": b_item["carbs"],
            "why_recommended": "Kickstarts morning metabolism with sustained slow-release energy and essential micronutrients.",
            "health_tags": b_item["tags"][:3],
        },
        {
            "slot": "Lunch",
            "time_window": "1:00 PM - 2:30 PM",
            "name": l_item["name"],
            "serving": l_item["serving_size"],
            "calories": l_item["calories"],
            "fat": l_item["fat"],
            "protein": l_item["protein"],
            "carbs": l_item["carbs"],
            "why_recommended": "Nutrient-dense midday anchor with high dietary fiber and lean amino acids for daytime focus.",
            "health_tags": l_item["tags"][:3],
        },
        {
            "slot": "Evening Snack",
            "time_window": "5:00 PM - 6:00 PM",
            "name": s_item["name"],
            "serving": s_item["serving_size"],
            "calories": s_item["calories"],
            "fat": s_item["fat"],
            "protein": s_item["protein"],
            "carbs": s_item["carbs"],
            "why_recommended": "Curbs late-afternoon sugar cravings while protecting metabolic rate with low glycemic density.",
            "health_tags": s_item["tags"][:3],
        },
        {
            "slot": "Dinner",
            "time_window": "8:00 PM - 9:30 PM",
            "name": d_item["name"],
            "serving": d_item["serving_size"],
            "calories": d_item["calories"],
            "fat": d_item["fat"],
            "protein": d_item["protein"],
            "carbs": d_item["carbs"],
            "why_recommended": "Light, easily digestible evening meal to support overnight muscle protein synthesis and deep sleep.",
            "health_tags": d_item["tags"][:3],
        },
    ]

    total_cals = sum(m["calories"] for m in plan_meals)
    total_fat = sum(m["fat"] for m in plan_meals)
    total_protein = sum(m["protein"] for m in plan_meals)
    total_carbs = sum(m["carbs"] for m in plan_meals)

    return {
        "status": "success",
        "plan_type": diet_filter,
        "target_calories": target_cals,
        "planned_calories": total_cals,
        "planned_fat_grams": round(total_fat, 1),
        "planned_protein_grams": round(total_protein, 1),
        "planned_carbs_grams": round(total_carbs, 1),
        "macro_split": {
            "protein_percent": round((total_protein * 4 / max(1, total_cals)) * 100, 1),
            "carbs_percent": round((total_carbs * 4 / max(1, total_cals)) * 100, 1),
            "fat_percent": round((total_fat * 9 / max(1, total_cals)) * 100, 1),
        },
        "meals": plan_meals,
        "clinical_tip": (
            "Aim to consume your final meal at least 2 hours before sleep to optimize circadian insulin sensitivity and growth hormone release."
        ),
    }


def predict_health_risks(
    profile: Dict[str, Any],
    current_totals: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Evaluates clinical metabolic risk parameters:
    1. Type-2 Diabetes / Glycemic Risk
    2. Cardiovascular & Atherosclerosis / Cholesterol Risk
    3. Hypertension & Chronic Dehydration Risk
    4. Metabolic Syndrome & BMI Index
    5. Sarcopenia / Muscle Loss Risk
    """
    weight = float(profile.get("weight") or 70)
    height = float(profile.get("height") or 175)
    age = int(profile.get("age") or 25)
    gender = profile.get("gender", "male").lower()
    activity = profile.get("activityLevel", "moderate").lower()

    # Calculate BMI: kg / (m^2)
    height_m = height / 100.0
    bmi = round(weight / (height_m * height_m), 1)

    bmi_status = "Normal Weight"
    bmi_risk_points = 0
    if bmi < 18.5:
        bmi_status = "Underweight"
        bmi_risk_points = 15
    elif 18.5 <= bmi <= 24.9:
        bmi_status = "Normal (Healthy)"
        bmi_risk_points = 0
    elif 25.0 <= bmi <= 29.9:
        bmi_status = "Overweight"
        bmi_risk_points = 25
    else:
        bmi_status = "Obese (Elevated Risk)"
        bmi_risk_points = 45

    # Intake metrics
    cals = float(current_totals.get("calories", 0))
    fat = float(current_totals.get("fat", 0))
    carbs = float(current_totals.get("carbs", 0))
    protein = float(current_totals.get("protein", 0))
    water_glasses = float(current_totals.get("waterGlasses", current_totals.get("water", 0)))

    # 1. Type-2 Diabetes / Glycemic Risk Assessment
    # High carb ratio (>60% of cals), high BMI, low activity increase risk
    carb_energy_pct = (carbs * 4 / max(1, cals)) * 100 if cals > 0 else 50
    diabetes_score = 15 + (15 if bmi >= 25 else 0) + (20 if bmi >= 30 else 0)
    if carb_energy_pct > 62:
        diabetes_score += 25
    elif carb_energy_pct > 55:
        diabetes_score += 15
    if activity in ["sedentary", "low"]:
        diabetes_score += 15
    diabetes_score = min(95, max(10, diabetes_score))

    diabetes_level = "Low"
    if diabetes_score > 65:
        diabetes_level = "High"
    elif diabetes_score > 35:
        diabetes_level = "Moderate"

    # 2. Cardiovascular / Cholesterol / Lipid Risk Assessment
    # High fat intake (>35% of energy or >65g), high age, elevated BMI
    fat_energy_pct = (fat * 9 / max(1, cals)) * 100 if cals > 0 else 25
    cardio_score = 12 + (15 if fat > 65 else 0) + (20 if fat_energy_pct > 35 else 0)
    if bmi >= 26:
        cardio_score += 20
    if age > 40:
        cardio_score += 15
    cardio_score = min(95, max(10, cardio_score))

    cardio_level = "Low"
    if cardio_score > 65:
        cardio_level = "High"
    elif cardio_score > 35:
        cardio_level = "Moderate"

    # 3. Hypertension & Dehydration Risk Assessment
    # Water < 6 glasses (1.5L), excess sodium processing risk
    hyper_score = 10
    if water_glasses < 4:
        hyper_score += 45
    elif water_glasses < 6:
        hyper_score += 25
    if bmi >= 27:
        hyper_score += 15
    hyper_score = min(95, max(10, hyper_score))

    hyper_level = "Low"
    if hyper_score > 65:
        hyper_level = "High"
    elif hyper_score > 35:
        hyper_level = "Moderate"

    # 4. Sarcopenia / Protein Deficiency Risk Assessment
    # Protein intake < 0.8g per kg body weight
    min_protein_needed = round(weight * 0.9, 1)
    sarcopenia_score = 10
    if protein < min_protein_needed * 0.6:
        sarcopenia_score += 45
    elif protein < min_protein_needed:
        sarcopenia_score += 20
    sarcopenia_score = min(95, max(10, sarcopenia_score))

    sarcopenia_level = "Low"
    if sarcopenia_score > 60:
        sarcopenia_level = "High"
    elif sarcopenia_score > 30:
        sarcopenia_level = "Moderate"

    # Overall Metabolic Vitality Score (100 is best, lower means higher aggregate risk)
    avg_risk = (diabetes_score + cardio_score + hyper_score + sarcopenia_score) / 4.0
    vitality_score = max(35, min(98, int(100 - (avg_risk * 0.65) - (bmi_risk_points * 0.35))))

    return {
        "status": "success",
        "biometrics": {
            "weight_kg": weight,
            "height_cm": height,
            "bmi": bmi,
            "bmi_status": bmi_status,
            "ideal_weight_range_kg": f"{round(18.5 * height_m * height_m, 1)} - {round(24.9 * height_m * height_m, 1)} kg",
        },
        "vitality_score": vitality_score,
        "vitality_verdict": (
            "Optimal Metabolic Vitality — Low systemic risk"
            if vitality_score >= 80
            else (
                "Moderate Metabolic Health — Preventive tweaks recommended"
                if vitality_score >= 60
                else "Elevated Risk Detected — Dietary and lifestyle intervention strongly advised"
            )
        ),
        "risks": [
            {
                "id": "diabetes",
                "name": "Type-2 Diabetes & Glycemic Risk",
                "score_percent": diabetes_score,
                "level": diabetes_level,
                "driver": f"Carbs contribute {round(carb_energy_pct, 1)}% of your calories; BMI is {bmi}.",
                "recommendation": "Replace refined grains with complex high-fiber carbohydrates (millets, oats, lentils) and maintain 30 min daily aerobic movement.",
            },
            {
                "id": "cardio",
                "name": "Cardiovascular & Lipid / Fat Risk",
                "score_percent": cardio_score,
                "level": cardio_level,
                "driver": f"Fat intake is {round(fat, 1)}g ({round(fat_energy_pct, 1)}% of daily calories).",
                "recommendation": "Limit saturated butter/ghee and deep-fried snacks. Choose cold-pressed oils, walnuts, and omega-3 rich foods to protect lipid balance.",
            },
            {
                "id": "hypertension",
                "name": "Hypertension & Dehydration Risk",
                "score_percent": hyper_score,
                "level": hyper_level,
                "driver": f"Logged {int(water_glasses)} glasses of water today (Recommended: 8-10 glasses).",
                "recommendation": "Hydration directly eases arterial pressure and kidney filtration. Increase water intake to 2.5L and enjoy potassium-rich foods (tender coconut water, spinach).",
            },
            {
                "id": "sarcopenia",
                "name": "Muscle Loss & Sarcopenia Risk",
                "score_percent": sarcopenia_score,
                "level": sarcopenia_level,
                "driver": f"Logged {round(protein, 1)}g protein vs minimum metabolic benchmark of {min_protein_needed}g.",
                "recommendation": "Include a protein source in every meal (paneer, eggs, pulses, Greek yogurt) to preserve lean skeletal muscle and bone density.",
            },
        ],
    }
