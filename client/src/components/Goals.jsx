import { useState, useEffect } from 'react';
import { Target, Flame, Apple, Droplets, Save, Sparkles, Check } from 'lucide-react';
import { fetchProfile, updateProfile } from '../services/profileService';
import './Goals.css';

export default function Goals({ onGoalsUpdated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('8');
  const [dietaryPref, setDietaryPref] = useState('standard');
  const [fitnessGoal, setFitnessGoal] = useState('maintenance');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        if (data) {
          setProfile(data);
          setCalorieGoal(data.customCalorieGoal ? String(data.customCalorieGoal) : '');
          setProteinGoal(data.customProteinGoal ? String(data.customProteinGoal) : '');
          setWaterGoal(String(data.customWaterGoal || 8));
          setDietaryPref(data.dietaryPreference || 'standard');
          setFitnessGoal(data.fitnessGoal || 'maintenance');
        }
      } catch (err) {
        setError('Failed to load profile goals');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    setError('');

    try {
      const updates = {
        customCalorieGoal: calorieGoal ? Number(calorieGoal) : null,
        customProteinGoal: proteinGoal ? Number(proteinGoal) : null,
        customWaterGoal: Number(waterGoal) || 8,
        dietaryPreference: dietaryPref,
        fitnessGoal,
      };

      const updated = await updateProfile(updates);
      setProfile(updated);
      setNotice('Health goals saved successfully!');
      window.dispatchEvent(new CustomEvent('nutrivibe-profile-updated'));
      if (onGoalsUpdated) onGoalsUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update goals.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="goals-container"><p>Loading goals...</p></div>;
  }

  return (
    <div className="goals-container">
      <header className="goals-header">
        <div className="goals-icon-circle">
          <Target size={24} />
        </div>
        <div>
          <h2>Personalized Health Goals</h2>
          <p>Customize your daily nutritional targets or rely on Mifflin-St Jeor calculation.</p>
        </div>
      </header>

      {notice && (
        <div className="goals-notice success">
          <Check size={18} /> {notice}
        </div>
      )}
      {error && <div className="goals-notice error">{error}</div>}

      <form onSubmit={handleSave} className="goals-form">
        <div className="goals-grid">
          {/* Calorie Goal */}
          <div className="goal-card">
            <div className="goal-card-top">
              <span className="goal-badge orange"><Flame size={16} /> Daily Energy</span>
            </div>
            <h3>Calorie Target</h3>
            <p>Leave blank to auto-calculate using your age, weight & activity.</p>
            <div className="goal-input-wrap">
              <input
                type="number"
                min="800"
                max="8000"
                placeholder="e.g. 2200"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
              />
              <span className="unit">kcal</span>
            </div>
          </div>

          {/* Protein Goal */}
          <div className="goal-card">
            <div className="goal-card-top">
              <span className="goal-badge green"><Apple size={16} /> Muscle Repair</span>
            </div>
            <h3>Daily Protein Target</h3>
            <p>Recommended 1.6g to 2.2g per kg body weight for active individuals.</p>
            <div className="goal-input-wrap">
              <input
                type="number"
                min="20"
                max="400"
                placeholder="e.g. 120"
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value)}
              />
              <span className="unit">grams</span>
            </div>
          </div>

          {/* Water Target */}
          <div className="goal-card">
            <div className="goal-card-top">
              <span className="goal-badge blue"><Droplets size={16} /> Hydration</span>
            </div>
            <h3>Water Intake Goal</h3>
            <p>Standard recommended intake is 8 glasses (2,000 ml) per day.</p>
            <div className="goal-input-wrap">
              <input
                type="number"
                min="4"
                max="25"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
                required
              />
              <span className="unit">glasses (250ml each)</span>
            </div>
          </div>

          {/* Dietary Preference & Fitness Goal */}
          <div className="goal-card">
            <div className="goal-card-top">
              <span className="goal-badge purple"><Sparkles size={16} /> Lifestyle</span>
            </div>
            <h3>Diet & Objective</h3>
            <div className="goal-select-group">
              <label>Dietary Style:</label>
              <select value={dietaryPref} onChange={(e) => setDietaryPref(e.target.value)}>
                <option value="standard">Standard Balanced</option>
                <option value="vegetarian">Vegetarian (Indian / Lacto)</option>
                <option value="vegan">100% Plant-Based / Vegan</option>
                <option value="high_protein">High-Protein Fitness</option>
                <option value="keto">Ketogenic / Low-Carb</option>
              </select>

              <label style={{ marginTop: '0.75rem' }}>Primary Fitness Goal:</label>
              <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
                <option value="weight_loss">Weight Loss / Caloric Deficit (-500 kcal)</option>
                <option value="maintenance">Maintenance / Balance</option>
                <option value="weight_gain">Muscle Building / Surplus (+300 kcal)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="goals-save-btn" disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Health Goals'}
        </button>
      </form>
    </div>
  );
}
