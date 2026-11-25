
import { useEffect, useState } from 'react';

import {
  User,
  Activity,
  Target,
  Save,
  Flame,
  Zap,
  TrendingUp,
  Heart,
} from 'lucide-react';

import {
  fetchProfile,
  updateProfile,
} from '../services/profileService';

import {
  calculateDailyCalories,
} from '../utils/calorieCalculator';

import './Profile.css';

const initialForm = {
  name: '',
  email: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  activityLevel: 'moderate',
  fitnessGoal: 'maintenance',
  medicalCondition: 'none',
};

function Profile() {
  const [profile, setProfile] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Load profile from the backend.
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await fetchProfile();

        if (!cancelled) {
          setProfile({
            ...initialForm,
            ...(data || {}),
            age: data?.age ?? '',
            height: data?.height ?? '',
            weight: data?.weight ?? '',
            medicalCondition: data?.medicalCondition || 'none',
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load profile. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle input changes.
  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage('');
    setError('');
  }

  // Calculate BMI.
  const heightInMeters = Number(profile.height) / 100;
  const weight = Number(profile.weight);

  const bmi =
    heightInMeters > 0 &&
    weight > 0 &&
    Number.isFinite(heightInMeters) &&
    Number.isFinite(weight)
      ? (weight / (heightInMeters * heightInMeters)).toFixed(1)
      : null;

  // Get BMI category.
  function getBmiCategory(value) {
    if (!value) return '';

    if (Number(profile.age) < 18) {
      return 'Adult BMI categories not applicable';
    }

    if (Number(value) < 18.5) return 'Underweight';
    if (Number(value) < 25) return 'Normal range';
    if (Number(value) < 30) return 'Overweight';

    return 'Obesity range';
  }

  // Calculate daily calorie requirements.
  const calorieData = calculateDailyCalories(profile);

  // Format calorie values.
  function formatCalorie(value) {
    if (typeof value === 'number') {
      return Math.round(value).toLocaleString('en-IN');
    }

    if (
      value &&
      typeof value === 'object' &&
      Number.isFinite(value.min) &&
      Number.isFinite(value.max)
    ) {
      return `${Math.round(value.min).toLocaleString('en-IN')} - ${Math.round(value.max).toLocaleString('en-IN')}`;
    }

    return '--';
  }

  // Save profile to the backend.
  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    // Basic frontend validation.
    if (!profile.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    const age = Number(profile.age);
    const height = Number(profile.height);
    const weight = Number(profile.weight);

    if (
      !Number.isFinite(age) ||
      age < 13 ||
      age > 100
    ) {
      setError('Please enter a valid age between 13 and 100.');
      return;
    }

    if (
      !Number.isFinite(height) ||
      height < 50 ||
      height > 250
    ) {
      setError('Please enter a valid height between 50 and 250 cm.');
      return;
    }

    if (
      !Number.isFinite(weight) ||
      weight < 20 ||
      weight > 500
    ) {
      setError('Please enter a valid weight between 20 and 500 kg.');
      return;
    }

    if (!profile.gender) {
      setError('Please select your gender.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: profile.name.trim(),
        age,
        gender: profile.gender,
        height,
        weight,
        activityLevel: profile.activityLevel,
        fitnessGoal: profile.fitnessGoal,
        medicalCondition: profile.medicalCondition || 'none',
      };

      const updatedProfile = await updateProfile(payload);

      const savedProfile = {
        ...profile,
        ...updatedProfile,
        age: updatedProfile.age ?? age,
        height: updatedProfile.height ?? height,
        weight: updatedProfile.weight ?? weight,
      };

      setProfile(savedProfile);

      // Update the stored user's displayed name.
      const storedUser = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          name: updatedProfile.name || payload.name,
        })
      );

      setMessage('Profile updated successfully!');

      // Notify App.jsx to refresh personalized dashboard targets.
      window.dispatchEvent(
        new CustomEvent('nutrivibe-profile-updated')
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and health goals.
          </p>
        </div>

        <div className="profile-avatar">
          <User size={30} />
        </div>
      </header>

      {error && (
        <div className="profile-alert error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="profile-alert success" role="status">
          {message}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>

        {/* Personal Information */}
        <section className="profile-section">
          <h2>
            <User size={20} />
            Personal Information
          </h2>

          <div className="profile-grid">
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                value={profile.email}
                readOnly
              />
            </label>

            <label>
              Age
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="13"
                max="100"
                required
              />
            </label>

            <label>
              Gender
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">
                  Prefer not to say
                </option>
              </select>
            </label>
          </div>
        </section>

        {/* Body Measurements */}
        <section className="profile-section">
          <h2>
            <Activity size={20} />
            Body Measurements
          </h2>

          <div className="profile-grid">
            <label>
              Height (cm)
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
                min="50"
                max="250"
                step="0.1"
                required
              />
            </label>

            <label>
              Weight (kg)
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                min="20"
                max="500"
                step="0.1"
                required
              />
            </label>
          </div>

          <div className="bmi-card">
            <div>
              <span>Your BMI</span>
              <h3>{bmi || '--'}</h3>
              <p>{getBmiCategory(bmi)}</p>
            </div>

            <Activity size={32} />
          </div>

          {Number(profile.age) < 18 &&
            Number(profile.age) >= 13 && (
              <p className="profile-note">
                BMI for people under 18 should be interpreted
                using age- and sex-specific growth charts.
              </p>
            )}
        </section>

        {/* Fitness Preferences */}
        <section className="profile-section">
          <h2>
            <Target size={20} />
            Fitness Preferences
          </h2>

          <div className="profile-grid">
            <label>
              Activity Level
              <select
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">
                  Sedentary
                </option>
                <option value="light">
                  Lightly active
                </option>
                <option value="moderate">
                  Moderately active
                </option>
                <option value="active">
                  Very active
                </option>
                <option value="very_active">
                  Extra active
                </option>
              </select>
            </label>

            <label>
              Fitness Goal
              <select
                name="fitnessGoal"
                value={profile.fitnessGoal}
                onChange={handleChange}
              >
                <option value="weight_loss">
                  Weight loss
                </option>
                <option value="maintenance">
                  Maintain weight
                </option>
                <option value="weight_gain">
                  Weight gain
                </option>
              </select>
            </label>
          </div>
        </section>

        {/* Medical Condition & Life Stage */}
        <section className="profile-section">
          <h2>
            <Heart size={20} />
            Medical Health Condition & Life Stage
          </h2>
          <p className="profile-subtext" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Personalizes your dietary guidelines, ICMR calorie calculations, and safe workout activities.
          </p>

          <div className="profile-grid">
            <label style={{ gridColumn: '1 / -1' }}>
              Condition / Life Stage
              <select
                name="medicalCondition"
                value={profile.medicalCondition || 'none'}
                onChange={handleChange}
              >
                <option value="none">None / General Healthy Maintenance</option>
                <option value="pregnancy">🤰 Pregnancy (Trimester 1, 2, or 3)</option>
                <option value="lactation">🤱 Lactation / Breastfeeding Mother</option>
                <option value="diabetes">🩸 Diabetes / Prediabetes (Low Glycemic Focus)</option>
                <option value="hypertension">🫀 Hypertension / High Blood Pressure (DASH Protocol)</option>
                <option value="pcos">🌸 PCOS / PCOD (Hormonal Balance & Low GI)</option>
                <option value="cholesterol">🫀 High Cholesterol / Lipid Management</option>
                <option value="thyroid">🦋 Thyroid / Hypothyroidism Care</option>
              </select>
            </label>
          </div>

          {profile.medicalCondition === 'pregnancy' && (
            <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.875rem' }}>
              <strong>🤰 Pregnancy Protocol Active:</strong> Daily target adjusted by +350 kcal/day (ICMR standards). Focus on Folate (600mcg), Elemental Iron, Calcium & safe prenatal yoga/walking.
            </div>
          )}

          {profile.medicalCondition === 'lactation' && (
            <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', color: '#1e40af', fontSize: '0.875rem' }}>
              <strong>🤱 Lactation Protocol Active:</strong> Daily energy requirement adjusted by +500 kcal/day for breast milk synthesis, plus increased hydration targets (12 glasses/day).
            </div>
          )}

          {profile.medicalCondition === 'diabetes' && (
            <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', color: '#92400e', fontSize: '0.875rem' }}>
              <strong>🩸 Diabetes Care Active:</strong> Recommendations prioritize low-GI complex carbs, high soluble fiber (&gt;35g), and 15-min post-meal walks to stabilize blood glucose.
            </div>
          )}
        </section>

        {/* Daily Calorie Requirements */}
        <section className="profile-section calorie-section">
          <h2>
            <Flame size={20} />
            Daily Calorie Requirements
          </h2>

          {calorieData ? (
            <>
              <p className="calorie-description">
                Your estimated calorie requirements are calculated
                using your body measurements, age, activity level,
                and fitness goal.
              </p>

              <div className="calorie-grid">
                <div className="calorie-card">
                  <Zap size={24} />
                  <span>Basal Metabolic Rate (BMR)</span>
                  <h3>
                    {formatCalorie(calorieData.bmr)}
                  </h3>
                  <small>kcal/day</small>
                </div>

                <div className="calorie-card">
                  <Activity size={24} />
                  <span>
                    Total Daily Energy Expenditure
                  </span>
                  <h3>
                    {formatCalorie(calorieData.tdee)}
                  </h3>
                  <small>kcal/day</small>
                </div>

                <div className="calorie-card calorie-target">
                  <TrendingUp size={24} />
                  <span>
                    Estimated Daily Calorie Target
                  </span>
                  <h3>
                    {formatCalorie(calorieData.target)}
                  </h3>
                  <small>kcal/day</small>
                </div>
              </div>

              <p className="calorie-note">
                These values are estimates, not medical
                prescriptions. Your actual energy needs may differ.
              </p>
            </>
          ) : (
            <p className="calorie-description">
              Calorie estimates are available for complete adult
              profiles (18+). Check your age, height, weight,
              gender, activity level, and fitness goal.
            </p>
          )}
        </section>

        {/* Save Button */}
        <button
          className="profile-save"
          type="submit"
          disabled={saving}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

      </form>
    </main>
  );
}

export default Profile;
