import { useState, useEffect } from 'react';
import {
  Utensils,
  Sparkles,
  Flame,
  Droplet,
  Check,
  RefreshCw,
  Plus,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
  Heart,
  Zap,
} from 'lucide-react';
import { fetchDietRecommendations } from '../services/aiService';
import './DietRecommendations.css';

export default function DietRecommendations({
  profile = {},
  totals = {},
  onDirectAddMeal,
  onNavigateNutrition,
}) {
  const [dietFilter, setDietFilter] = useState('all');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedMeals, setAddedMeals] = useState({});
  const [error, setError] = useState('');

  const calorieGoal = Number(profile.customCalorieGoal || 2100);
  const proteinGoal = Number(profile.customProteinGoal || 110);
  const consumedCals = Number(totals.calories || 0);
  const remainingCals = Math.max(0, calorieGoal - consumedCals);

  async function loadPlan(filter = dietFilter) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDietRecommendations(profile, totals, filter);
      setPlan(data);
    } catch (err) {
      setError('Could not load AI diet recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlan(dietFilter);
  }, [dietFilter]);

  async function handleAddMeal(meal, index) {
    if (!onDirectAddMeal) return;
    try {
      const mealToSave = {
        name: meal.name,
        category: meal.slot === 'Evening Snack' ? 'Snack' : meal.slot,
        calories: Number(meal.calories),
        fat: Number(meal.fat || 0),
        protein: Number(meal.protein || 0),
        carbs: Number(meal.carbs || 0),
        consumedAt: new Date().toISOString(),
      };
      await onDirectAddMeal(mealToSave);
      setAddedMeals((prev) => ({ ...prev, [index]: true }));
    } catch (err) {
      console.error('Failed to log recommended meal:', err);
    }
  }

  return (
    <div className="diet-container">
      {/* Header Banner */}
      <div className="diet-header-banner">
        <div className="diet-header-left">
          <div className="diet-badge">
            <Sparkles size={16} />
            <span>AI Nutrition Intelligence</span>
          </div>
          <h1>Personalized Diet & Meal Recommendations</h1>
          <p>
            Tailored specifically for your fitness goal (
            <strong>{profile.fitnessGoal || 'Maintenance'}</strong>) and dietary preference (
            <strong>{profile.dietaryPreference || 'All Diets'}</strong>).
          </p>
        </div>

        <button
          className="btn-refresh-plan"
          onClick={() => loadPlan(dietFilter)}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Regenerate AI Plan</span>
        </button>
      </div>

      {/* Target Status Cards */}
      <div className="diet-status-grid">
        <div className="diet-status-card cals-target">
          <div className="card-icon orange">
            <Flame size={20} />
          </div>
          <div>
            <span className="card-label">Daily Energy Target</span>
            <h3>{calorieGoal.toLocaleString()} kcal</h3>
            <small>{remainingCals > 0 ? `${remainingCals} kcal remaining today` : 'Calorie target reached'}</small>
          </div>
        </div>

        <div className="diet-status-card protein-target">
          <div className="card-icon green">
            <Award size={20} />
          </div>
          <div>
            <span className="card-label">Daily Protein Target</span>
            <h3>{proteinGoal} g</h3>
            <small>Supports muscle recovery & satiety</small>
          </div>
        </div>

        <div className="diet-status-card fat-target">
          <div className="card-icon purple">
            <Droplet size={20} />
          </div>
          <div>
            <span className="card-label">Planned Total Fat</span>
            <h3>{plan?.planned_fat_grams || 45} g</h3>
            <small>{plan?.macro_split?.fat_percent || 25}% of energy intake</small>
          </div>
        </div>
      </div>

      {/* Diet Plan Filters */}
      <div className="diet-filter-bar">
        <div className="filter-title">Plan Mode:</div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${dietFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDietFilter('all')}
          >
            🌟 Balanced All-Day Plan
          </button>
          <button
            className={`filter-btn ${dietFilter === 'high_protein' ? 'active' : ''}`}
            onClick={() => setDietFilter('high_protein')}
          >
            💪 High Protein Muscle
          </button>
          <button
            className={`filter-btn ${dietFilter === 'low_fat' ? 'active' : ''}`}
            onClick={() => setDietFilter('low_fat')}
          >
            🔥 Fat Loss & Lean Deficit
          </button>
        </div>
      </div>

      {error && <div className="diet-error-banner">{error}</div>}

      {/* Loading Skeleton */}
      {loading && (
        <div className="diet-loading-box">
          <div className="ai-pulsing-spinner" />
          <p>NutriVibe AI is synthesizing your personalized meal schedule...</p>
        </div>
      )}

      {/* 4-Meal Plan Blueprint */}
      {!loading && plan && plan.meals && (
        <div className="diet-meals-grid">
          {plan.meals.map((meal, index) => {
            const isAdded = !!addedMeals[index];
            return (
              <div key={meal.slot} className="diet-meal-card">
                <div className="meal-card-top">
                  <div className="slot-badge">
                    <Clock size={14} />
                    <span>{meal.slot}</span>
                    <span className="time-sep">•</span>
                    <span className="slot-time">{meal.time_window}</span>
                  </div>

                  <div className="meal-cal-badge">
                    <Flame size={14} />
                    <strong>{meal.calories}</strong>
                    <span>kcal</span>
                  </div>
                </div>

                <div className="meal-info">
                  <h3>{meal.name}</h3>
                  <p className="meal-serving">{meal.serving || 'Standard serving'}</p>
                  <p className="meal-why">💡 {meal.why_recommended}</p>
                </div>

                {/* Macro Distribution Strip */}
                <div className="meal-macro-row">
                  <div className="macro-chip fat-chip">
                    <Droplet size={14} />
                    <span>Fat:</span>
                    <strong>{meal.fat}g</strong>
                  </div>
                  <div className="macro-chip protein-chip">
                    <span>Protein:</span>
                    <strong>{meal.protein}g</strong>
                  </div>
                  <div className="macro-chip carbs-chip">
                    <span>Carbs:</span>
                    <strong>{meal.carbs}g</strong>
                  </div>
                </div>

                {/* Direct 1-Click Add Action */}
                <button
                  className={`btn-add-plan-meal ${isAdded ? 'added' : ''}`}
                  onClick={() => handleAddMeal(meal, index)}
                  disabled={isAdded}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} /> Added to Today's Meals
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add This to Today's Meals
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Clinical Guidance Footer */}
      {!loading && plan && (
        <div className="diet-clinical-box">
          <ShieldCheck size={26} className="clinical-icon" />
          <div>
            <h4>NutriVibe Clinical Nutritionist Tip</h4>
            <p>{plan.clinical_tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}
