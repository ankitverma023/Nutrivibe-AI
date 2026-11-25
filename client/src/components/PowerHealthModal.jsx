import { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle,
  Droplets,
  Flame,
  Apple,
  X,
  Camera,
  Footprints,
} from 'lucide-react';
import './PowerHealthModal.css';

export default function PowerHealthModal({
  isOpen,
  onClose,
  totals,
  goals,
  onTriggerCamera,
  onQuickAddWater,
}) {
  const [activeTab, setActiveTab] = useState('boost');

  if (!isOpen) return null;

  const calories = Number(totals?.calories || 0);
  const protein = Number(totals?.protein || 0);
  const carbs = Number(totals?.carbs || 0);
  const fat = Number(totals?.fat || 0);
  const water = Number(totals?.water || 0);

  const calorieGoal = Number(goals?.calorieGoal || 2000);
  const proteinGoal = Number(goals?.proteinGoal || 100);
  const waterGoal = Number(goals?.waterGoal || 8);

  const calScore = Math.min(100, Math.round((Math.min(calories, calorieGoal) / Math.max(calorieGoal, 1)) * 100));
  const proteinScore = Math.min(100, Math.round((protein / Math.max(proteinGoal, 1)) * 100));
  const waterScore = Math.min(100, Math.round((water / Math.max(waterGoal, 1)) * 100));
  const overallPowerScore = Math.round((calScore * 0.4) + (proteinScore * 0.4) + (waterScore * 0.2));

  return (
    <div className="power-modal-overlay" onClick={onClose}>
      <div className="power-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="power-modal-header">
          <div className="power-title-wrap">
            <div className="power-glow-icon">
              <Zap size={22} />
            </div>
            <div>
              <span className="power-kicker">NUTRIVIBE INTELLIGENCE</span>
              <h2>AI Power Health Assistant</h2>
            </div>
          </div>
          <button className="icon-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="power-modal-body">
          {/* Power Health Score Banner */}
          <div className="power-score-banner">
            <div className="power-score-circle">
              <strong>{overallPowerScore}</strong>
              <span>/100</span>
            </div>
            <div className="power-score-details">
              <h3>Today's Metabolic Power Score</h3>
              <p>
                {overallPowerScore >= 80
                  ? '🔥 Peak performance! Your nutrition and hydration are primed for optimal health.'
                  : '⚡ Good progress! Follow the 3 AI Power Boosts below to reach peak health today.'}
              </p>
              <div className="power-mini-metrics">
                <span><Flame size={13} color="#f97316" /> Calories: {calScore}%</span>
                <span><Apple size={13} color="#10b981" /> Protein: {proteinScore}%</span>
                <span><Droplets size={13} color="#0284c7" /> Water: {waterScore}%</span>
              </div>
            </div>
          </div>

          {/* 3 AI Power Health Boosts for Today */}
          <div className="power-boosts-section">
            <h4>⚡ 3 AI Power Boosts for Today</h4>

            <div className="power-boost-card">
              <div className="boost-icon-wrap green">
                <Apple size={18} />
              </div>
              <div className="boost-content">
                <strong>Protein Optimization Protocol</strong>
                <p>
                  {protein < proteinGoal
                    ? `You are ${proteinGoal - protein}g below optimal amino acid synthesis. Boost with 100g Paneer, 2 Eggs, or Greek Yogurt.`
                    : 'Protein intake is ideal for cellular repair and lean mass retention.'}
                </p>
              </div>
            </div>

            <div className="power-boost-card">
              <div className="boost-icon-wrap blue">
                <Droplets size={18} />
              </div>
              <div className="boost-content">
                <strong>Thermogenic Hydration Protocol</strong>
                <p>
                  {water < waterGoal
                    ? `Drink 1 glass of cold water now. Hydration boosts resting metabolic rate by up to 10-15%.`
                    : 'Hydration goal reached! Optimal blood volume and electrolyte balance.'}
                </p>
              </div>
            </div>

            <div className="power-boost-card">
              <div className="boost-icon-wrap orange">
                <Flame size={18} />
              </div>
              <div className="boost-content">
                <strong>Post-Prandial Glycemic Control</strong>
                <p>
                  A 15-minute gentle stroll after your heaviest meal flattens insulin spikes by up to 25% and accelerates gastric transit.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Power Actions */}
          <div className="power-actions-section">
            <h4>Quick One-Click Health Actions</h4>
            <div className="power-action-buttons">
              <button
                className="power-btn primary"
                onClick={() => {
                  onClose();
                  if (onTriggerCamera) onTriggerCamera();
                }}
              >
                <Camera size={16} />
                <span>📸 Scan Food with Live Camera</span>
              </button>

              <button
                className="power-btn secondary"
                onClick={() => {
                  if (onQuickAddWater) onQuickAddWater();
                }}
              >
                <Droplets size={16} />
                <span>+1 Glass Water (+250ml)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
