
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  weight_loss: -500,
  maintenance: 0,
  weight_gain: 300,
};

const CONDITION_ADJUSTMENTS = {
  pregnancy: 350,   // ICMR/NIN: +350 kcal/day in pregnancy for fetal & placental growth
  lactation: 500,   // ICMR/NIN: +500 kcal/day during lactation for breastmilk production
  diabetes: -100,   // Gentle deficit or weight management
  hypertension: 0,
  pcos: -150,       // Insulin resistance calorie optimization
  cholesterol: 0,
  thyroid: -150,    // Compensate for lowered metabolic rate in hypothyroidism
  none: 0,
};

/**
 * Calculate estimated daily calorie requirements.
 *
 * Uses the Mifflin-St Jeor equation:
 * Male:   BMR = 10W + 6.25H - 5A + 5
 * Female: BMR = 10W + 6.25H - 5A - 161
 *
 * W = weight in kg
 * H = height in cm
 * A = age in years
 *
 * @param {Object} profile - User profile information
 * @returns {Object|null} Calorie estimates or null if data is invalid
 */
export function calculateDailyCalories(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const age = Number(profile.age);
  const height = Number(profile.height);
  const weight = Number(profile.weight);

  const activityFactor = ACTIVITY_FACTORS[profile.activityLevel];
  const goalAdjustment = GOAL_ADJUSTMENTS[profile.fitnessGoal];

  // Validate required profile information.
  if (
    !Number.isFinite(age) ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    age < 18 ||
    age > 100 ||
    height < 50 ||
    height > 250 ||
    weight < 20 ||
    weight > 500 ||
    !activityFactor ||
    goalAdjustment === undefined
  ) {
    return null;
  }

  // Determine the applicable Mifflin-St Jeor coefficient.
  let coefficients;

  if (profile.gender === "male") {
    coefficients = [5];
  } else if (profile.gender === "female") {
    coefficients = [-161];
  } else if (
    profile.gender === "other" ||
    profile.gender === "prefer_not_to_say"
  ) {
    // Return a range based on both equation variants.
    coefficients = [5, -161];
  } else {
    return null;
  }

  const conditionKey = (profile.medicalCondition || 'none').toLowerCase();
  const conditionAdjustment = CONDITION_ADJUSTMENTS[conditionKey] || 0;

  const estimates = coefficients.map((coefficient) => {
    const bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      coefficient;

    const tdee = bmr * activityFactor;
    const target = tdee + goalAdjustment + conditionAdjustment;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      conditionAdjustment,
    };
  });

  // Return a single estimate when one coefficient applies.
  if (estimates.length === 1) {
    return {
      ...estimates[0],
      isRange: false,
    };
  }

  // Return a range when gender does not map to one coefficient.
  const getRange = (key) => {
    const values = estimates.map((item) => item[key]);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  return {
    bmr: getRange("bmr"),
    tdee: getRange("tdee"),
    target: getRange("target"),
    isRange: true,
  };
}
