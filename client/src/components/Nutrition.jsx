import { useState, useMemo } from 'react';
import {
  Apple,
  Camera,
  Plus,
  Search,
  Trash2,
  Sparkles,
  CalendarDays,
  Clock,
  Flame,
  ChevronRight,
  Check,
} from 'lucide-react';
import './Nutrition.css';

const POPULAR_FOOD_ITEMS = [
  { name: 'Dal Tadka (1 bowl / 150g)', calories: 180, protein: 9, carbs: 24, fat: 5, category: 'Lunch' },
  { name: 'Wheat Roti (2 pieces / 80g)', calories: 170, protein: 6, carbs: 36, fat: 1, category: 'Lunch' },
  { name: 'Paneer Butter Masala (1 bowl)', calories: 345, protein: 14, carbs: 12, fat: 26, category: 'Dinner' },
  { name: 'Chicken Biryani (1 plate)', calories: 520, protein: 28, carbs: 62, fat: 17, category: 'Lunch' },
  { name: 'Grilled Chicken Breast (150g)', calories: 245, protein: 45, carbs: 0, fat: 5, category: 'Lunch' },
  { name: 'Oatmeal with berries & nuts', calories: 280, protein: 10, carbs: 48, fat: 6, category: 'Breakfast' },
  { name: '2 Boiled Eggs (100g)', calories: 150, protein: 13, carbs: 1, fat: 10, category: 'Breakfast' },
  { name: 'Steamed Idli with Sambhar (2 pcs)', calories: 165, protein: 6, carbs: 33, fat: 1, category: 'Breakfast' },
  { name: 'Plain Masala Dosa', calories: 290, protein: 6, carbs: 48, fat: 8, category: 'Breakfast' },
  { name: 'Greek Yogurt / Thick Curd (1 cup)', calories: 115, protein: 13, carbs: 6, fat: 4, category: 'Snack' },
  { name: 'Fresh Garden Salad', calories: 130, protein: 3, carbs: 11, fat: 8, category: 'Dinner' },
  { name: 'Mixed Roasted Nuts (30g)', calories: 175, protein: 6, carbs: 6, fat: 15, category: 'Snack' },
];

export default function Nutrition({
  meals = [],
  selectedDate,
  onDateChange,
  onAddMeal,
  onDeleteMeal,
  onTriggerScan,
  savingMeal,
  deletingMealId,
  macroGoals,
  calorieGoal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [quickLogNotice, setQuickLogNotice] = useState('');

  // Group logged meals by category
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const mealsByCategory = useMemo(() => {
    const grouped = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: [],
      Other: [],
    };

    meals.forEach((meal) => {
      const cat = meal.category || 'Other';
      if (grouped[cat]) {
        grouped[cat].push(meal);
      } else {
        grouped.Other.push(meal);
      }
    });

    return grouped;
  }, [meals]);

  // Compute daily totals
  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + Number(m.calories || 0),
        protein: acc.protein + Number(m.protein || 0),
        carbs: acc.carbs + Number(m.carbs || 0),
        fat: acc.fat + Number(m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  // Filter food search database
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_FOOD_ITEMS.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return POPULAR_FOOD_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Quick log item from database
  async function handleQuickLog(item, category = 'Lunch') {
    try {
      await onAddMeal({
        name: item.name,
        category: category || item.category,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      });
      setQuickLogNotice(`Logged "${item.name}" to ${category}!`);
      setTimeout(() => setQuickLogNotice(''), 3500);
    } catch (err) {
      console.error('Quick log failed:', err);
    }
  }

  // Handle custom manual form submit
  async function handleCustomSubmit(e) {
    e.preventDefault();
    if (!customName.trim() || !customCalories) return;

    await onAddMeal({
      name: customName.trim(),
      category: selectedCategory,
      calories: Number(customCalories),
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
    });

    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setShowAddDrawer(false);
  }

  function openCategoryAdd(cat) {
    setSelectedCategory(cat);
    setShowAddDrawer(true);
  }

  return (
    <div className="nutrition-studio-container">
      {/* Top Header Row */}
      <header className="nutrition-header">
        <div>
          <span className="nutrition-kicker">NUTRITION STUDIO</span>
          <h2>Meals & Nutrition Planner</h2>
          <p>Track breakfast, lunch, dinner and explore verified food composition tables.</p>
        </div>

        <div className="nutrition-header-actions">
          <input
            type="date"
            className="nutrition-date-picker"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />

          <button className="nutrition-scan-btn" onClick={onTriggerScan} type="button">
            <Camera size={16} />
            <span>Scan Food (AI)</span>
          </button>

          <button
            className="nutrition-add-btn"
            onClick={() => setShowAddDrawer(!showAddDrawer)}
            type="button"
          >
            <Plus size={16} />
            <span>{showAddDrawer ? 'Close Form' : 'Add Custom Meal'}</span>
          </button>
        </div>
      </header>

      {quickLogNotice && (
        <div className="quick-notice-banner">
          <Check size={16} /> {quickLogNotice}
        </div>
      )}

      {/* Daily Macro Bar Glance */}
      <section className="nutrition-summary-bar">
        <div className="macro-bar-card calories">
          <span className="macro-bar-label">Total Calories</span>
          <strong className="macro-bar-val">{totals.calories.toLocaleString()} <small>/ {calorieGoal} kcal</small></strong>
          <div className="progress-track">
            <div className="progress-fill green" style={{ width: `${Math.min(100, (totals.calories / calorieGoal) * 100)}%` }} />
          </div>
        </div>

        <div className="macro-bar-card protein">
          <span className="macro-bar-label">Protein</span>
          <strong className="macro-bar-val">{totals.protein}g <small>/ {macroGoals.protein}g</small></strong>
          <div className="progress-track">
            <div className="progress-fill green" style={{ width: `${Math.min(100, (totals.protein / macroGoals.protein) * 100)}%` }} />
          </div>
        </div>

        <div className="macro-bar-card carbs">
          <span className="macro-bar-label">Carbohydrates</span>
          <strong className="macro-bar-val">{totals.carbs}g <small>/ {macroGoals.carbs}g</small></strong>
          <div className="progress-track">
            <div className="progress-fill orange" style={{ width: `${Math.min(100, (totals.carbs / macroGoals.carbs) * 100)}%` }} />
          </div>
        </div>

        <div className="macro-bar-card fat">
          <span className="macro-bar-label">Healthy Fats</span>
          <strong className="macro-bar-val">{totals.fat}g <small>/ {macroGoals.fat}g</small></strong>
          <div className="progress-track">
            <div className="progress-fill purple" style={{ width: `${Math.min(100, (totals.fat / macroGoals.fat) * 100)}%` }} />
          </div>
        </div>
      </section>

      {/* Custom Meal Form Drawer */}
      {showAddDrawer && (
        <form className="nutrition-custom-form" onSubmit={handleCustomSubmit}>
          <div className="form-title-row">
            <h4>Log Meal for {selectedCategory}</h4>
            <span className="badge-cat">{selectedCategory}</span>
          </div>

          <div className="form-inputs-grid">
            <div className="input-field">
              <label>Meal / Dish Name</label>
              <input
                placeholder="e.g. Paneer Bhurji with Roti"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <label>Meal Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Breakfast">Breakfast 🌅</option>
                <option value="Lunch">Lunch ☀️</option>
                <option value="Dinner">Dinner 🌙</option>
                <option value="Snack">Snack / Drinks 🍎</option>
              </select>
            </div>

            <div className="input-field">
              <label>Calories (kcal)</label>
              <input
                type="number"
                min="0"
                placeholder="350"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <label>Protein (g)</label>
              <input
                type="number"
                min="0"
                placeholder="20"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label>Carbs (g)</label>
              <input
                type="number"
                min="0"
                placeholder="35"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label>Fat (g)</label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={customFat}
                onChange={(e) => setCustomFat(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="save-custom-meal-btn" disabled={savingMeal}>
            <Plus size={16} />
            {savingMeal ? 'Saving to Database...' : 'Save Meal to Log'}
          </button>
        </form>
      )}

      {/* Main 2-Column: Categories Breakdown (Left) & Food Database Search (Right) */}
      <div className="nutrition-studio-layout">
        {/* Left: Meal Categories Section */}
        <section className="categories-column">
          {categories.map((cat) => {
            const catMeals = mealsByCategory[cat] || [];
            const catCalories = catMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0);
            const catProtein = catMeals.reduce((acc, m) => acc + Number(m.protein || 0), 0);

            const iconMap = {
              Breakfast: '🌅',
              Lunch: '☀️',
              Dinner: '🌙',
              Snack: '🍎',
            };

            return (
              <article key={cat} className="category-meal-card">
                <div className="category-card-header">
                  <div className="cat-header-title">
                    <span className="cat-emoji">{iconMap[cat]}</span>
                    <div>
                      <h3>{cat}</h3>
                      <span className="cat-subtext">
                        {catMeals.length} item{catMeals.length !== 1 ? 's' : ''} logged
                      </span>
                    </div>
                  </div>

                  <div className="cat-header-stats">
                    <strong>{catCalories} <span>kcal</span></strong>
                    <small>{catProtein}g protein</small>
                    <button
                      className="cat-add-icon-btn"
                      onClick={() => openCategoryAdd(cat)}
                      title={`Add ${cat} item`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="category-meals-list">
                  {catMeals.length === 0 ? (
                    <div className="empty-category-row">
                      <span>No {cat.toLowerCase()} logged yet.</span>
                      <button onClick={() => openCategoryAdd(cat)}>+ Log {cat}</button>
                    </div>
                  ) : (
                    catMeals.map((meal) => (
                      <div key={meal._id} className="cat-meal-item">
                        <div className="cat-meal-info">
                          <strong>{meal.name}</strong>
                          <span>
                            {meal.time} · P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                          </span>
                        </div>
                        <div className="cat-meal-calories">
                          <strong>{meal.calories}</strong>
                          <span>kcal</span>
                        </div>
                        <button
                          className="cat-remove-btn"
                          disabled={deletingMealId === meal._id}
                          onClick={() => onDeleteMeal(meal)}
                          aria-label={`Remove ${meal.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* Right: Instant Food & Nutrition Database Explorer */}
        <aside className="food-explorer-column">
          <div className="food-explorer-card">
            <div className="explorer-header">
              <div className="explorer-title">
                <Sparkles size={18} className="text-emerald-500" />
                <div>
                  <h3>Food & Nutrition Explorer</h3>
                  <span>ICMR IFCT 2017 & USDA Verified Database</span>
                </div>
              </div>
            </div>

            <div className="explorer-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search food (e.g. Dal, Paneer, Biryani, Oats, Eggs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="explorer-items-list">
              {filteredFoods.map((item, idx) => (
                <div key={idx} className="explorer-item-row">
                  <div className="explorer-item-info">
                    <strong>{item.name}</strong>
                    <div className="explorer-macros">
                      <span>{item.calories} kcal</span>
                      <span>· P: {item.protein}g</span>
                      <span>· C: {item.carbs}g</span>
                      <span>· F: {item.fat}g</span>
                    </div>
                  </div>

                  <button
                    className="quick-log-pill-btn"
                    onClick={() => handleQuickLog(item, item.category || 'Lunch')}
                    title="1-Click Log to Today's Meals"
                  >
                    <Plus size={13} />
                    <span>Log</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="explorer-footer">
              <span>💡 Need automated portion estimation? Use the Live Camera Scanner above.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
