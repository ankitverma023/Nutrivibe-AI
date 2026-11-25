import Meal from '../models/Meal.js';
import User from '../models/User.js';

// Helper to format date to YYYY-MM-DD
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// BMR / TDEE calculator fallback on backend
function calculateUserCalorieGoal(user) {
  if (user?.customCalorieGoal && user.customCalorieGoal > 0) {
    return user.customCalorieGoal;
  }

  if (user?.weight && user?.height && user?.age && user?.gender) {
    const w = Number(user.weight);
    const h = Number(user.height);
    const a = Number(user.age);
    const s = user.gender === 'female' ? -161 : 5;
    const bmr = 10 * w + 6.25 * h - 5 * a + s;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const factor = activityMultipliers[user.activityLevel] || 1.55;
    const tdee = bmr * factor;

    if (user.fitnessGoal === 'weight_loss') return Math.round(tdee - 500);
    if (user.fitnessGoal === 'weight_gain') return Math.round(tdee + 300);
    return Math.round(tdee);
  }

  return 2000;
}

// GET /api/analytics/weekly
export async function getWeeklyAnalytics(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select(
      'age gender height weight activityLevel fitnessGoal customCalorieGoal'
    );
    const calorieGoal = calculateUserCalorieGoal(user);

    // End date defaults to today
    const now = new Date();
    const endDateStr = req.query.endDate || formatDate(now);
    const [year, month, day] = endDateStr.split('-').map(Number);
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    // Start date is 6 days prior (total 7 days)
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    start.setUTCHours(0, 0, 0, 0);

    // Query meals in this range
    const meals = await Meal.find({
      user: req.user.id,
      consumedAt: { $gte: start, $lte: end },
    }).sort({ consumedAt: 1 });

    // Build day map for the 7 days
    const daysData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      const dateKey = formatDate(d);
      const dayName = DAY_NAMES[d.getUTCDay()];

      daysData.push({
        day: dayName,
        date: dateKey,
        calories: 0,
        goal: calorieGoal,
        protein: 0,
        carbs: 0,
        fat: 0,
        mealCount: 0,
      });
    }

    // Populate with real meals
    for (const meal of meals) {
      const mealDate = formatDate(new Date(meal.consumedAt));
      const targetDay = daysData.find((item) => item.date === mealDate);
      if (targetDay) {
        targetDay.calories += Number(meal.calories || 0);
        targetDay.protein += Number(meal.protein || 0);
        targetDay.carbs += Number(meal.carbs || 0);
        targetDay.fat += Number(meal.fat || 0);
        targetDay.mealCount += 1;
      }
    }

    // Calculate weekly summary metrics
    const totalWeeklyCalories = daysData.reduce((acc, curr) => acc + curr.calories, 0);
    const daysWithMeals = daysData.filter((d) => d.mealCount > 0);
    const averageCalories = daysWithMeals.length > 0
      ? Math.round(totalWeeklyCalories / daysWithMeals.length)
      : Math.round(totalWeeklyCalories / 7);

    return res.status(200).json({
      success: true,
      data: {
        weekly: daysData,
        summary: {
          totalCalories: totalWeeklyCalories,
          averageCalories,
          calorieGoal,
          loggedDays: daysWithMeals.length,
          totalMeals: meals.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/analytics/summary (General progress & stats)
export async function getOverallSummary(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const totalMeals = await Meal.countDocuments({ user: req.user.id });

    // Macro breakdown across all user meals
    const macroAggregate = await Meal.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' },
        },
      },
    ]);

    const macroStats = macroAggregate[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalMealsLogged: totalMeals,
        lifetimeNutrition: macroStats,
        fitnessGoal: user?.fitnessGoal || 'maintenance',
      },
    });
  } catch (error) {
    next(error);
  }
}
