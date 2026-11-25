import { useState, useEffect } from 'react';
import {
  Activity as ActivityIcon,
  Flame,
  Footprints,
  Dumbbell,
  Plus,
  Check,
  ShieldAlert,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { fetchProfile } from '../services/profileService';
import './Activity.css';

const CONDITION_ACTIVITY_DATA = {
  pregnancy: {
    title: '🤰 Prenatal Safe Exercise Protocol',
    badge: 'Maternal Safety Approved',
    badgeClass: 'pregnant-badge',
    note: 'Moderate, low-impact exercise supports healthy gestational weight, reduces back pain, and eases delivery.',
    safeActivities: [
      { name: 'Gentle Prenatal Walking', duration: '25 mins', burned: 95, icon: '🚶‍♀️' },
      { name: 'Prenatal Yoga & Pelvic Stretches', duration: '30 mins', burned: 110, icon: '🧘‍♀️' },
      { name: 'Pelvic Floor (Kegels) Session', duration: '15 mins', burned: 45, icon: '🌸' },
      { name: 'Light Water Aerobics', duration: '20 mins', burned: 120, icon: '🏊‍♀️' },
    ],
    contraindications: [
      'Avoid high-impact jumping or contact sports',
      'Never do abdominal crunches or sit-ups (protect against Diastasis Recti)',
      'Avoid hot yoga or exercising in extreme heat',
      'Avoid lying flat on back after the 1st trimester (prevents Vena Cava compression)',
    ],
  },
  lactation: {
    title: '🤱 Postnatal Recovery & Gentle Movement',
    badge: 'Postpartum Safe',
    badgeClass: 'lactation-badge',
    note: 'Gentle aerobic movement and core re-education without draining milk-producing hydration.',
    safeActivities: [
      { name: 'Stroller Walking with Baby', duration: '30 mins', burned: 120, icon: '👶' },
      { name: 'Postnatal Core Re-education', duration: '20 mins', burned: 80, icon: '🧘‍♀️' },
      { name: 'Light Bodyweight Squats', duration: '15 mins', burned: 70, icon: '🦵' },
    ],
    contraindications: [
      'Avoid exhaustive, dehydrating cardio sessions',
      'Always hydrate with 1-2 glasses of water before and after exercise',
    ],
  },
  diabetes: {
    title: '🩸 Diabetic Glucose Disposal Protocol',
    badge: 'Insulin Sensitivity Boost',
    badgeClass: 'diabetic-badge',
    note: 'Post-meal physical activity drives GLUT-4 translocation to clear blood glucose into muscles without requiring extra insulin.',
    safeActivities: [
      { name: '15-Min Post-Meal Brisk Walk', duration: '15 mins', burned: 75, icon: '🚶' },
      { name: 'Full-Body Resistance Training', duration: '35 mins', burned: 210, icon: '🏋️' },
      { name: 'Evening Steady State Cycling', duration: '25 mins', burned: 160, icon: '🚴' },
    ],
    contraindications: [
      'Avoid prolonged sitting (> 2 hrs) after meals',
      'Always test blood sugar if feeling shaky or dizzy',
    ],
  },
  hypertension: {
    title: '🫀 Cardiovascular Health (DASH Protocol)',
    badge: 'Vascular Protection',
    badgeClass: 'cardio-badge',
    note: 'Aerobic exercises and rhythmic breathing widen blood vessels and decrease resting systolic blood pressure.',
    safeActivities: [
      { name: 'Brisk Aerobic Walking', duration: '30 mins', burned: 140, icon: '🚶' },
      { name: 'Anulom Vilom & Deep Pranayama', duration: '20 mins', burned: 45, icon: '🫁' },
      { name: 'Low-Resistance Swimming', duration: '25 mins', burned: 175, icon: '🏊' },
    ],
    contraindications: [
      'Strictly avoid heavy Valsalva maneuvers (holding breath during heavy lifts)',
      'Avoid sudden rapid changes from floor to standing',
    ],
  },
  pcos: {
    title: '🌸 PCOS Insulin & Cortisol Balance',
    badge: 'Hormonal Harmony',
    badgeClass: 'pcos-badge',
    note: 'Progressive strength training combined with steady walking lowers testosterone levels and supports regular ovulation.',
    safeActivities: [
      { name: 'Hypertrophy Strength Training', duration: '40 mins', burned: 230, icon: '🏋️‍♀️' },
      { name: '8,000 Step Daily Walk', duration: '45 mins', burned: 190, icon: '👟' },
      { name: 'Low-Impact Pilates Flow', duration: '30 mins', burned: 130, icon: '🤸‍♀️' },
    ],
    contraindications: [
      'Avoid excessive high-intensity chronic cardio that spikes cortisol',
    ],
  },
  none: {
    title: '🌿 General Fitness & Longevity Protocol',
    badge: 'Optimal Wellness',
    badgeClass: 'general-badge',
    note: 'Balanced mix of cardiovascular aerobic health and resistance training for longevity.',
    safeActivities: [
      { name: 'Morning Brisk Walk', duration: '30 mins', burned: 145, icon: '🚶' },
      { name: 'Strength Training / Gym', duration: '45 mins', burned: 280, icon: '🏋️' },
      { name: 'Evening Light Jogging', duration: '20 mins', burned: 165, icon: '🏃' },
    ],
    contraindications: [
      'Avoid sedentary behavior; take movement breaks every 60 minutes',
    ],
  },
};

export default function Activity() {
  const [medicalCondition, setMedicalCondition] = useState('none');
  const [steps, setSteps] = useState(6450);
  const [stepGoal, setStepGoal] = useState(10000);
  const [activities, setActivities] = useState([
    { id: 1, name: 'Morning Brisk Walk', duration: '30 mins', burned: 145, icon: '🚶' },
    { id: 2, name: 'Strength Training / Gym', duration: '45 mins', burned: 280, icon: '🏋️' },
  ]);
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [burned, setBurned] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        if (data?.medicalCondition) {
          setMedicalCondition(data.medicalCondition);
          if (data.medicalCondition === 'pregnancy') {
            setStepGoal(7000); // Gentle, safe target for pregnant mothers
            setActivities([
              { id: 1, name: 'Gentle Prenatal Walking', duration: '25 mins', burned: 95, icon: '🚶‍♀️' },
              { id: 2, name: 'Prenatal Yoga (Cat-Cow & Butterfly)', duration: '20 mins', burned: 85, icon: '🧘‍♀️' },
            ]);
          } else if (data.medicalCondition === 'diabetes') {
            setActivities([
              { id: 1, name: '15-Min Post-Meal Brisk Walk', duration: '15 mins', burned: 75, icon: '🚶' },
              { id: 2, name: 'Resistance Band Exercises', duration: '25 mins', burned: 150, icon: '🏋️' },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load profile for activity:', err);
      }
    }
    load();
  }, []);

  function handleAddActivity(e) {
    e.preventDefault();
    if (!activityName.trim() || !burned) return;

    setActivities([
      ...activities,
      {
        id: Date.now(),
        name: activityName.trim(),
        duration: duration ? `${duration} mins` : '30 mins',
        burned: Number(burned),
        icon: '⚡',
      },
    ]);
    setActivityName('');
    setDuration('');
    setBurned('');
    setShowForm(false);
  }

  function handleLogPreset(item) {
    setActivities([
      ...activities,
      {
        id: Date.now(),
        name: item.name,
        duration: item.duration,
        burned: item.burned,
        icon: item.icon,
      },
    ]);
  }

  const totalBurned = activities.reduce((acc, curr) => acc + curr.burned, 0);
  const conditionGuide = CONDITION_ACTIVITY_DATA[medicalCondition] || CONDITION_ACTIVITY_DATA.none;

  return (
    <div className="activity-container">
      <header className="activity-header">
        <div className="activity-icon-circle">
          <ActivityIcon size={24} />
        </div>
        <div>
          <h2>Daily Activity & Safe Energy Expenditure</h2>
          <p>
            Track your active calories burned and step goals, calibrated for your medical condition ({medicalCondition.toUpperCase()}).
          </p>
        </div>
      </header>

      {/* CONDITION SPECIFIC SAFE WORKOUT PROTOCOL BANNER */}
      <section className="condition-activity-card">
        <div className="cond-act-top">
          <div className="cond-title-row">
            <span className="cond-act-badge">{conditionGuide.badge}</span>
            <h3>{conditionGuide.title}</h3>
          </div>
          <p>{conditionGuide.note}</p>
        </div>

        {/* 1-Click Safe Workout Loggers */}
        <div className="safe-presets-section">
          <span className="safe-presets-label">
            <Sparkles size={15} /> 1-Click Recommended Activities for Your Condition:
          </span>
          <div className="presets-button-grid">
            {conditionGuide.safeActivities.map((act) => (
              <button
                key={act.name}
                type="button"
                className="btn-quick-log-activity"
                onClick={() => handleLogPreset(act)}
              >
                <span>{act.icon} {act.name}</span>
                <small>{act.duration} (-{act.burned} kcal)</small>
              </button>
            ))}
          </div>
        </div>

        {/* Contraindications Warning */}
        <div className="contraindications-box">
          <div className="contra-title">
            <XCircle size={16} />
            <strong>Safety Precautions / Exercises to Avoid:</strong>
          </div>
          <ul>
            {conditionGuide.contraindications.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="activity-cards-grid">
        {/* Step Counter Card */}
        <div className="activity-card">
          <div className="card-top">
            <span className="badge-pill blue"><Footprints size={16} /> Steps</span>
            <span className="pct-pill">{Math.round((steps / stepGoal) * 100)}%</span>
          </div>
          <h3>Daily Step Count</h3>
          <div className="step-display">
            <strong>{steps.toLocaleString()}</strong>
            <span>/ {stepGoal.toLocaleString()} steps</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill blue"
              style={{ width: `${Math.min(100, (steps / stepGoal) * 100)}%` }}
            />
          </div>
          <div className="step-buttons">
            <button onClick={() => setSteps((s) => s + 500)}>+500 steps</button>
            <button onClick={() => setSteps((s) => s + 1000)}>+1,000 steps</button>
          </div>
        </div>

        {/* Calories Burned Card */}
        <div className="activity-card">
          <div className="card-top">
            <span className="badge-pill orange"><Flame size={16} /> Active Burn</span>
          </div>
          <h3>Energy Burned Today</h3>
          <div className="step-display">
            <strong>{totalBurned}</strong>
            <span>kcal active burn</span>
          </div>
          <p className="card-subtext">Calculated from your logged workouts and movement.</p>
          <button className="add-act-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> {showForm ? 'Cancel' : 'Log Custom Workout'}
          </button>
        </div>
      </section>

      {showForm && (
        <form className="workout-form" onSubmit={handleAddActivity}>
          <h4>Log Custom Workout / Physical Exercise</h4>
          <div className="form-row">
            <input
              placeholder="e.g. Evening Cycling or Yoga"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Duration (mins)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <input
              type="number"
              placeholder="Calories burned (kcal)"
              value={burned}
              onChange={(e) => setBurned(e.target.value)}
              required
            />
            <button type="submit">Save Activity</button>
          </div>
        </form>
      )}

      {/* Activity Logs */}
      <section className="activities-list-panel">
        <h3>Today's Movement Log</h3>
        <div className="activities-list">
          {activities.map((act) => (
            <div key={act.id} className="activity-row">
              <span className="act-emoji">{act.icon}</span>
              <div className="act-details">
                <strong>{act.name}</strong>
                <span>{act.duration}</span>
              </div>
              <div className="act-burn">
                <strong>-{act.burned}</strong>
                <span>kcal</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
