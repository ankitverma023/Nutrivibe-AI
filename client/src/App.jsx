import { useEffect, useState, useCallback } from 'react';
import {
  fetchMeals,
  createMeal,
  removeMeal,
} from './services/mealService';
import {
  fetchWater,
  updateWater,
  addWaterGlass,
  resetWater,
} from './services/waterService';
import { fetchWeeklyAnalytics } from './services/analyticsService';
import { fetchProfile } from './services/profileService';
import { calculateDailyCalories } from './utils/calorieCalculator';
import { getCurrentUser, logoutUser } from './services/authService';

import Auth from './Auth_temp.jsx';
import Profile from './components/Profile.jsx';
import Goals from './components/Goals.jsx';
import Progress from './components/Progress.jsx';
import Activity from './components/Activity.jsx';
import Settings from './components/Settings.jsx';
import Nutrition from './components/Nutrition.jsx';
import AiScannerModal from './components/AiScannerModal.jsx';
import AiInsightsCard from './components/AiInsightsCard.jsx';
import PowerHealthModal from './components/PowerHealthModal.jsx';
import DietRecommendations from './components/DietRecommendations.jsx';
import HealthRiskPredictor from './components/HealthRiskPredictor.jsx';
import MedicalHealth from './components/MedicalHealth.jsx';

import {
  Activity as ActivityIcon,
  Apple,
  Salad,
  HeartPulse,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  Droplets,
  Flame,
  Heart,
  Home,
  Leaf,
  LogOut,
  Menu,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  TrendingUp,
  Weight,
  UserRound,
  X,
  Camera,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import './App.css';

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeMeal(meal) {
  return {
    ...meal,
    id: meal._id,
    icon: '🍽️',
    color: 'green',
    time: meal.consumedAt
      ? new Date(meal.consumedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Time unavailable',
  };
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  goal,
  percent,
  color,
  trend,
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
        <span className="stat-trend">
          <ArrowUpRight size={14} /> {trend}
        </span>
      </div>
      <p className="stat-label">{label}</p>
      <div className="stat-value">
        {value}<span> {unit}</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${Math.min(Math.max(Number(percent) || 0, 0), 100)}%` }}
        />
      </div>
      <div className="stat-footer">
        <span>{goal}</span>
        <strong>{percent}%</strong>
      </div>
    </article>
  );
}

function App() {
  // Theme state: Dark Mode vs Light Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nutrivibe-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutrivibe-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
  }

  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem('token') ? getCurrentUser() : null;
    } catch {
      logoutUser();
      return null;
    }
  });

  // Meal & Date state
  const [meals, setMeals] = useState([]);
  const [nutritionProfile, setNutritionProfile] = useState(null);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [savingMeal, setSavingMeal] = useState(false);
  const [deletingMealId, setDeletingMealId] = useState(null);
  const [apiError, setApiError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // Water Tracker persistent state
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);

  // Weekly historical analytics state
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  // Navigation & Modals
  const [activeNav, setActiveNav] = useState('Overview');
  const [showMealForm, setShowMealForm] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');

  // Add meal form fields
  const [mealName, setMealName] = useState('');
  const [mealCategory, setMealCategory] = useState('Lunch');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');

  // Authentication callbacks
  function handleAuthenticated(user) {
    setCurrentUser(user);
    setApiError('');
    setNotice('');
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    setMeals([]);
    setNutritionProfile(null);
    setNotice('');
    setApiError('');
    setShowMealForm(false);
    setShowAiModal(false);
    setShowPowerModal(false);
    setMobileMenu(false);
  }

  // Load meals from MongoDB for the selected date
  const loadMeals = useCallback(async () => {
    if (!currentUser) return;
    setLoadingMeals(true);
    try {
      const data = await fetchMeals(selectedDate);
      setMeals(Array.isArray(data) ? data.map(normalizeMeal) : []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        setApiError(error.response?.data?.message || 'Unable to load meals.');
      }
    } finally {
      setLoadingMeals(false);
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  // Load Water intake from MongoDB
  const loadWater = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await fetchWater(selectedDate);
      if (data) {
        setWater(data.glasses || 0);
        if (data.targetGlasses) setWaterGoal(data.targetGlasses);
      }
    } catch (error) {
      console.error('Failed to load water log:', error);
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    loadWater();
  }, [loadWater]);

  // Load 7-Day Weekly Analytics
  const loadWeeklyAnalytics = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await fetchWeeklyAnalytics(selectedDate);
      if (data?.weekly) {
        setWeeklyData(data.weekly);
        setWeeklyAverage(data.summary?.averageCalories || 0);
      }
    } catch (error) {
      console.error('Failed to load weekly analytics:', error);
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    loadWeeklyAnalytics();
  }, [loadWeeklyAnalytics, meals]);

  // Load User Profile for Personalized Calorie/Macro goals
  const loadNutritionProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await fetchProfile();
      if (data) {
        setNutritionProfile(data);
        if (data.customWaterGoal) setWaterGoal(data.customWaterGoal);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadNutritionProfile();
    const handleProfileUpdate = () => loadNutritionProfile();
    window.addEventListener('nutrivibe-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('nutrivibe-profile-updated', handleProfileUpdate);
  }, [loadNutritionProfile]);

  // Water interactions with MongoDB
  async function handleSetWater(glassesCount) {
    setWater(glassesCount);
    try {
      await updateWater(selectedDate, glassesCount, waterGoal);
    } catch (err) {
      console.error('Failed to update water:', err);
    }
  }

  async function handleAddGlass() {
    setWater((c) => Math.min(waterGoal, c + 1));
    try {
      await addWaterGlass(selectedDate);
    } catch (err) {
      console.error('Failed to add glass:', err);
    }
  }

  async function handleResetWater() {
    setWater(0);
    try {
      await resetWater(selectedDate);
    } catch (err) {
      console.error('Failed to reset water:', err);
    }
  }

  // Calculate daily nutrition totals
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + Number(meal.calories || 0),
      protein: acc.protein + Number(meal.protein || 0),
      carbs: acc.carbs + Number(meal.carbs || 0),
      fat: acc.fat + Number(meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calorie target logic (Mifflin-St Jeor formula or custom override)
  const calorieData = nutritionProfile ? calculateDailyCalories(nutritionProfile) : null;
  const calculatedCalorieGoal = calorieData
    ? typeof calorieData.target === 'number'
      ? calorieData.target
      : Math.round((calorieData.target.min + calorieData.target.max) / 2)
    : 2000;

  const calorieGoal = nutritionProfile?.customCalorieGoal || calculatedCalorieGoal;

  // Macronutrient goals
  const macroGoals = {
    protein: nutritionProfile?.customProteinGoal || Math.round((calorieGoal * 0.20) / 4),
    carbs: nutritionProfile?.customCarbsGoal || Math.round((calorieGoal * 0.50) / 4),
    fat: nutritionProfile?.customFatGoal || Math.round((calorieGoal * 0.30) / 9),
  };

  const caloriePercent = calorieGoal ? Math.round((totals.calories / calorieGoal) * 100) : 0;

  // Add meal handler (used in both custom form & quick log)
  async function handleSaveDirectMeal(mealObj) {
    setSavingMeal(true);
    setApiError('');
    try {
      const saved = await createMeal({
        name: mealObj.name.trim(),
        category: mealObj.category || 'Other',
        calories: Number(mealObj.calories),
        protein: Number(mealObj.protein) || 0,
        carbs: Number(mealObj.carbs) || 0,
        fat: Number(mealObj.fat) || 0,
        consumedAt: new Date(`${selectedDate}T12:00:00`).toISOString(),
      });
      setMeals((current) => [...current, normalizeMeal(saved)]);
      setNotice(`Saved "${mealObj.name}" to database!`);
      return saved;
    } catch (error) {
      setApiError(error.response?.data?.message || 'Could not save meal.');
      throw error;
    } finally {
      setSavingMeal(false);
    }
  }

  // Add meal form submit
  async function addMeal(event) {
    if (event) event.preventDefault();
    if (!mealName.trim()) {
      setNotice('Please enter a meal name.');
      return;
    }

    if (!mealCalories || Number(mealCalories) < 0) {
      setNotice('Calories must be a valid positive number.');
      return;
    }

    await handleSaveDirectMeal({
      name: mealName,
      category: mealCategory,
      calories: mealCalories,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFat,
    });

    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFat('');
    setShowMealForm(false);
  }

  // Handle AI food detection callback
  function handleFoodDetected(detectedFood) {
    setMealName(detectedFood.name);
    setMealCategory(detectedFood.category || 'Lunch');
    setMealCalories(String(detectedFood.calories));
    setMealProtein(String(detectedFood.protein));
    setMealCarbs(String(detectedFood.carbs));
    setMealFat(String(detectedFood.fat));
    setShowMealForm(true);
    setNotice(`AI recognized "${detectedFood.name}"! Form auto-filled. Click Save meal to confirm.`);
  }

  // Handle direct automatic meal addition from AI camera/upload scanner
  async function handleDirectAddMealFromAi(mealData) {
    try {
      setSavingMeal(true);
      const created = await createMeal(mealData);
      const normalized = normalizeMeal(created);
      setMeals((current) => [normalized, ...current]);
      setNotice(
        `🎉 Auto-Added "${created.name}" to ${created.category}! (${created.calories} kcal, ${created.fat || 0}g Fat)`
      );
      return created;
    } catch (error) {
      console.error('Failed to auto-add meal:', error);
      setApiError(error.response?.data?.message || 'Could not save meal to database.');
      throw error;
    } finally {
      setSavingMeal(false);
    }
  }

  // Delete meal
  async function handleDeleteMeal(meal) {
    if (!meal._id || deletingMealId !== null) return;
    setDeletingMealId(meal._id);
    try {
      await removeMeal(meal._id);
      setMeals((current) => current.filter((item) => item._id !== meal._id));
      setNotice('Meal deleted from MongoDB successfully.');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Could not delete meal.');
    } finally {
      setDeletingMealId(null);
    }
  }

  // Navigation items
  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Nutrition', icon: Apple },
    { label: 'Diet Plan', icon: Salad },
    { label: 'Medical Health', icon: Heart },
    { label: 'Health Risk AI', icon: HeartPulse },
    { label: 'Activity', icon: ActivityIcon },
    { label: 'My Progress', icon: TrendingUp },
    { label: 'Goals', icon: Target },
    { label: 'My Profile', icon: UserRound },
  ];

  if (!currentUser) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* AI Food Live Camera Scanner Modal */}
      <AiScannerModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onFoodDetected={handleFoodDetected}
        onDirectAddMeal={handleDirectAddMealFromAi}
        onDeleteMeal={handleDeleteMeal}
      />

      {/* AI Power Health Assistant Modal */}
      <PowerHealthModal
        isOpen={showPowerModal}
        onClose={() => setShowPowerModal(false)}
        totals={{ ...totals, water }}
        goals={{
          calorieGoal,
          proteinGoal: macroGoals.protein,
          waterGoal,
        }}
        onTriggerCamera={() => setShowAiModal(true)}
        onQuickAddWater={handleAddGlass}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <a
          className="brand"
          href="#overview"
          onClick={() => {
            setActiveNav('Overview');
            setMobileMenu(false);
          }}
        >
          <span className="brand-mark">
            <Leaf size={23} />
          </span>
          <span>
            nutri<span className="brand-highlight">vibe</span>
            <small>AI HEALTH PLATFORM</small>
          </span>
        </a>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(label);
                setMobileMenu(false);
                setNotice('');
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === 'Goals' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="nav-caption tools-caption">PREFERENCES</div>
        <nav className="side-nav" aria-label="Preferences">
          <button
            className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('Settings');
              setMobileMenu(false);
              setNotice('');
            }}
          >
            <SettingsIcon size={19} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Interactive AI Power Health Card in Sidebar */}
        <div className="sidebar-tip" onClick={() => setShowPowerModal(true)}>
          <div className="tip-icon">
            <Zap size={19} />
          </div>
          <h3>AI Power Health</h3>
          <p>Click for instant metabolic health score and 3 daily power hacks.</p>
          <span className="tip-action-badge">
            <Sparkles size={11} /> Open Assistant
          </span>
          <div className="tip-decoration">✳</div>
        </div>

        {/* User Profile Footer in Sidebar */}
        <div className="profile">
          <div className="avatar">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-copy">
            <strong>{currentUser?.name || 'User'}</strong>
            <span>{currentUser?.email || 'Health enthusiast'}</span>
          </div>
          <button
            className="icon-button profile-menu"
            aria-label="Log out"
            title="Log out"
            onClick={handleLogout}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area" id="overview">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={21} />
            </button>
            <div>
              <span className="breadcrumb">NutriVibe /</span>{' '}
              <strong>{activeNav}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            {/* AI Power Health Quick Action in Topbar */}
            <button
              className="power-health-topbar-btn"
              onClick={() => setShowPowerModal(true)}
              type="button"
            >
              <Zap size={15} />
              <span>AI Power Health</span>
            </button>

            {/* Dark Mode / Light Mode Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              type="button"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <span className="date-label">
              <CalendarDays size={16} />
              {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotice('Health tracking is 100% synchronized!')}
            >
              <Bell size={19} />
              <span />
            </button>

            <button
              className="user-chip"
              onClick={() => setActiveNav('My Profile')}
            >
              <span className="avatar avatar-small">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span>{currentUser?.name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {apiError && (
            <div className="notice" role="alert">
              <span>{apiError}</span>
              <button aria-label="Dismiss" onClick={() => setApiError('')}>
                <X size={16} />
              </button>
            </div>
          )}

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button aria-label="Dismiss" onClick={() => setNotice('')}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Conditional View Routing */}
          {activeNav === 'My Profile' && <Profile />}
          {activeNav === 'Goals' && <Goals onGoalsUpdated={loadNutritionProfile} />}
          {activeNav === 'My Progress' && <Progress />}
          {activeNav === 'Activity' && <Activity />}
          {activeNav === 'Diet Plan' && (
            <DietRecommendations
              profile={nutritionProfile || {}}
              totals={{ ...totals, water }}
              onDirectAddMeal={handleDirectAddMealFromAi}
              onNavigateNutrition={() => setActiveNav('Nutrition')}
            />
          )}
          {activeNav === 'Medical Health' && (
            <MedicalHealth onDirectAddMeal={handleDirectAddMealFromAi} />
          )}
          {activeNav === 'Health Risk AI' && (
            <HealthRiskPredictor
              profile={nutritionProfile || {}}
              totals={{ ...totals, water }}
            />
          )}
          {activeNav === 'Settings' && (
            <Settings currentUser={currentUser} onLogout={handleLogout} />
          )}

          {/* DEDICATED NUTRITION STUDIO PAGE */}
          {activeNav === 'Nutrition' && (
            <Nutrition
              meals={meals}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onAddMeal={handleSaveDirectMeal}
              onDeleteMeal={handleDeleteMeal}
              onTriggerScan={() => setShowAiModal(true)}
              savingMeal={savingMeal}
              deletingMealId={deletingMealId}
              macroGoals={macroGoals}
              calorieGoal={calorieGoal}
            />
          )}

          {/* MASTER OVERVIEW DASHBOARD PAGE */}
          {activeNav === 'Overview' && (
            <>
              {/* Welcome Row */}
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    AI-POWERED NUTRITION INTELLIGENCE
                  </div>
                  <h1>
                    A healthier you, <span>one meal at a time.</span>
                  </h1>
                  <p>
                    Every choice counts. Here is your real-time nutrition & hydration tracking.
                  </p>
                </div>

                <div
                  className="welcome-decoration"
                  onClick={() => setShowPowerModal(true)}
                  title="Click to open AI Power Health Assistant"
                >
                  <Zap size={22} />
                  <span>⚡ AI Power Health</span>
                </div>
              </section>

              {/* Quick AI Feature Launchers */}
              <div className="overview-ai-quick-strip">
                <div
                  className="ai-quick-pill diet-pill"
                  onClick={() => setActiveNav('Diet Plan')}
                  role="button"
                  tabIndex={0}
                >
                  <Salad size={18} className="pill-icon" />
                  <div className="pill-content">
                    <strong>AI Diet Recommendations</strong>
                    <span>Personalized meals for your goal</span>
                  </div>
                  <ArrowUpRight size={16} />
                </div>

                <div
                  className="ai-quick-pill risk-pill"
                  onClick={() => setActiveNav('Health Risk AI')}
                  role="button"
                  tabIndex={0}
                >
                  <HeartPulse size={18} className="pill-icon" />
                  <div className="pill-content">
                    <strong>Health Risk Prediction</strong>
                    <span>Diabetes, Cardiac & BMI assessment</span>
                  </div>
                  <ArrowUpRight size={16} />
                </div>

                <div
                  className="ai-quick-pill medical-pill"
                  onClick={() => setActiveNav('Medical Health')}
                  role="button"
                  tabIndex={0}
                >
                  <Heart size={18} className="pill-icon" />
                  <div className="pill-content">
                    <strong>Medical Health & Life Stages</strong>
                    <span>Pregnancy, Lactation, Diabetes Care</span>
                  </div>
                  <ArrowUpRight size={16} />
                </div>

                <div
                  className="ai-quick-pill scan-pill"
                  onClick={() => setShowAiModal(true)}
                  role="button"
                  tabIndex={0}
                >
                  <Camera size={18} className="pill-icon" />
                  <div className="pill-content">
                    <strong>Photo Scan & Auto-Add</strong>
                    <span>Instant calorie & fat detection</span>
                  </div>
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* NutriVibe AI Advisor Card */}
              <AiInsightsCard
                totals={{ ...totals, waterGlasses: water }}
                goals={{
                  calorieGoal,
                  proteinGoal: macroGoals.protein,
                  waterGoal,
                  fitnessGoal: nutritionProfile?.fitnessGoal || 'maintenance',
                }}
              />

              {/* Stats Summary Grid */}
              <section className="stats-grid" aria-label="Nutrition summary">
                <StatCard
                  icon={Flame}
                  label="Calories consumed"
                  value={totals.calories.toLocaleString()}
                  unit="kcal"
                  goal={`Goal: ${calorieGoal.toLocaleString()} kcal`}
                  percent={caloriePercent}
                  color="orange"
                  trend={selectedDate === getLocalDateString() ? 'Today' : 'Selected day'}
                />

                <StatCard
                  icon={Apple}
                  label="Protein intake"
                  value={totals.protein}
                  unit="g"
                  goal={`Goal: ${macroGoals.protein} g`}
                  percent={Math.round((totals.protein / Math.max(macroGoals.protein, 1)) * 100)}
                  color="green"
                  trend="Daily"
                />

                <StatCard
                  icon={Droplets}
                  label="Water intake"
                  value={water * 250}
                  unit="ml"
                  goal={`Goal: ${waterGoal * 250} ml`}
                  percent={Math.round((water / Math.max(waterGoal, 1)) * 100)}
                  color="blue"
                  trend={`${water} / ${waterGoal} glasses`}
                />

                <StatCard
                  icon={Weight}
                  label="Carbohydrates"
                  value={totals.carbs}
                  unit="g"
                  goal={`Goal: ${macroGoals.carbs} g`}
                  percent={Math.round((totals.carbs / Math.max(macroGoals.carbs, 1)) * 100)}
                  color="purple"
                  trend="Daily"
                />
              </section>

              {/* Calorie & Weekly Chart Grid */}
              <section className="dashboard-grid">
                {/* Calorie Ring & Breakdown */}
                <article className="panel calorie-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">YOUR DAILY TARGET</span>
                      <h2>Calorie overview</h2>
                    </div>
                    <span className="pill">
                      <span />
                      {selectedDate === getLocalDateString() ? 'Today' : 'Selected day'}
                    </span>
                  </div>

                  <div className="calorie-main">
                    <div
                      className="calorie-ring"
                      style={{
                        '--ring-percent': `${Math.min(caloriePercent, 100)}%`,
                      }}
                    >
                      <div className="ring-inner">
                        <Flame size={23} />
                        <strong>
                          {Math.max(0, calorieGoal - totals.calories).toLocaleString()}
                        </strong>
                        <span>kcal left</span>
                      </div>
                    </div>

                    <div className="calorie-details">
                      <div>
                        <span className="legend-dot consumed-dot" />
                        <span>Consumed</span>
                        <strong>{totals.calories.toLocaleString()} kcal</strong>
                      </div>
                      <div>
                        <span className="legend-dot goal-dot" />
                        <span>Daily goal</span>
                        <strong>{calorieGoal.toLocaleString()} kcal</strong>
                      </div>
                      <div>
                        <span className="legend-dot remaining-dot" />
                        <span>Remaining</span>
                        <strong>
                          {Math.max(0, calorieGoal - totals.calories).toLocaleString()} kcal
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="panel-divider" />

                  <div className="macro-heading">
                    <h3>Macronutrients</h3>
                    <span>Daily breakdown</span>
                  </div>

                  {[
                    { name: 'Protein', amount: totals.protein, goal: macroGoals.protein, color: 'green' },
                    { name: 'Carbs', amount: totals.carbs, goal: macroGoals.carbs, color: 'orange' },
                    { name: 'Fat', amount: totals.fat, goal: macroGoals.fat, color: 'purple' },
                  ].map((macro) => (
                    <div className="macro-row" key={macro.name}>
                      <div className="macro-label">
                        <span>{macro.name}</span>
                        <strong>
                          {macro.amount} <small>/ {macro.goal} g</small>
                        </strong>
                      </div>
                      <div className="progress-track">
                        <div
                          className={`progress-fill ${macro.color}`}
                          style={{
                            width: `${Math.min(
                              100,
                              macro.goal > 0 ? (macro.amount / macro.goal) * 100 : 0
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </article>

                {/* Live Weekly Consistency Chart */}
                <article className="panel weekly-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">7-DAY HISTORICAL TREND</span>
                      <h2>Weekly activity</h2>
                    </div>
                    <span className="pill">
                      <span /> MongoDB Sync
                    </span>
                  </div>

                  <div className="weekly-summary">
                    <strong>
                      {weeklyAverage.toLocaleString()} <span>kcal/day</span>
                    </strong>
                    <span className="weekly-change">
                      <ArrowUpRight size={15} /> 7-day average
                    </span>
                  </div>

                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={weeklyData.length > 0 ? weeklyData : [
                          { day: 'Mon', calories: totals.calories, goal: calorieGoal }
                        ]}
                        margin={{ top: 12, right: 4, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.015} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 5" vertical={false} />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                          dy={9}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            fontSize: 12,
                          }}
                          formatter={(value) => [`${value} kcal`, 'Calories']}
                        />
                        <Area
                          type="monotone"
                          dataKey="calories"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fill="url(#calorieGradient)"
                          activeDot={{ r: 5, fill: '#10b981' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-legend">
                    <span>
                      <i /> Calories consumed
                    </span>
                    <span className="chart-goal-label">
                      <i /> Target Goal: {calorieGoal.toLocaleString()} kcal
                    </span>
                  </div>
                </article>
              </section>

              {/* Bottom Grid: Quick Meals & Water Tracker */}
              <section className="bottom-grid">
                {/* Recent Meals Panel */}
                <article className="panel meals-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">TODAY'S FUEL</span>
                      <h2>Recent meals</h2>
                    </div>

                    <div className="meal-heading-actions">
                      <button
                        className="ai-scan-trigger-btn"
                        onClick={() => setShowAiModal(true)}
                        type="button"
                      >
                        <Camera size={15} />
                        <span>Scan Food (AI)</span>
                      </button>

                      <button
                        className="primary-button compact"
                        onClick={() => setActiveNav('Nutrition')}
                        type="button"
                      >
                        <span>Open Nutrition Studio</span>
                      </button>
                    </div>
                  </div>

                  {/* Meal List */}
                  <div className="meal-list">
                    {loadingMeals && (
                      <p className="empty-meals">Loading meals from MongoDB...</p>
                    )}

                    {!loadingMeals && !apiError && meals.length === 0 && (
                      <p className="empty-meals">
                        No meals logged yet today. Use the Live Camera or add a meal in the Nutrition Studio!
                      </p>
                    )}

                    {meals.map((meal) => (
                      <div className="meal-item" key={meal._id}>
                        <div className={`meal-emoji ${meal.color}`}>{meal.icon}</div>
                        <div className="meal-info">
                          <strong>{meal.name}</strong>
                          <span>
                            {meal.time} · {meal.category} · P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                          </span>
                        </div>
                        <div className="meal-calories">
                          <strong>{meal.calories}</strong>
                          <span>kcal</span>
                        </div>
                        <button
                          className="remove-meal"
                          aria-label={`Remove ${meal.name}`}
                          disabled={deletingMealId !== null || savingMeal}
                          onClick={() => handleDeleteMeal(meal)}
                        >
                          {deletingMealId === meal._id ? '...' : <X size={15} />}
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="sample-disclaimer">
                    Synchronized with MongoDB. For full breakfast, lunch, and dinner category planning, open the <strong>Nutrition Studio</strong> tab.
                  </p>
                </article>

                {/* Persistent Water Tracker Panel */}
                <article className="panel water-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="panel-kicker">STAY HYDRATED</span>
                      <h2>Water tracker</h2>
                    </div>
                    <div className="water-icon">
                      <Droplets size={20} />
                    </div>
                  </div>

                  <div className="water-count">
                    <strong>{water * 250}</strong>
                    <span> / {waterGoal * 250} ml</span>
                  </div>

                  <p className="water-subtitle">
                    {water >= waterGoal ? '🎉 Daily goal achieved!' : 'One glass at a time.'}
                  </p>

                  <div className="water-glasses">
                    {Array.from({ length: waterGoal }, (_, index) => (
                      <button
                        key={index}
                        className={`water-glass ${index < water ? 'filled' : ''}`}
                        aria-label={`Set water intake to ${index + 1} glasses`}
                        onClick={() => handleSetWater(index + 1)}
                      >
                        <Droplets size={21} />
                      </button>
                    ))}
                  </div>

                  <div className="water-actions">
                    <button
                      className="water-add"
                      onClick={handleAddGlass}
                      disabled={water >= waterGoal}
                    >
                      <Plus size={16} /> Add a glass
                    </button>
                    <button className="water-reset" onClick={handleResetWater}>
                      Reset
                    </button>
                  </div>

                  <div className="hydration-note">
                    <Sparkles size={16} />
                    <span>
                      Hydration data is persisted in MongoDB for {selectedDate}. Keep drinking water!
                    </span>
                  </div>
                </article>
              </section>
            </>
          )}

          {/* Footer */}
          <footer className="dashboard-footer">
            <span>© {new Date().getFullYear()} NutriVibe AI Health Platform</span>
            <span>
              <Heart size={13} /> Built for healthier everyday choices
            </span>
            <span className="demo-label">IFCT 2017 & USDA STANDARDS · NOT MEDICAL ADVICE</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
