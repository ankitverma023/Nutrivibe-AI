import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Droplet,
  Flame,
  Scale,
  Sparkles,
  ArrowUpRight,
  Download,
  Sliders,
} from 'lucide-react';
import { fetchHealthRiskPrediction } from '../services/aiService';
import './HealthRiskPredictor.css';

export default function HealthRiskPredictor({ profile = {}, totals = {} }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // What-If Simulation Sliders
  const [waterBonus, setWaterBonus] = useState(0);
  const [fatCut, setFatCut] = useState(0);
  const [activityBonus, setActivityBonus] = useState(0);

  async function loadPredictions() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchHealthRiskPrediction(profile, totals);
      setData(result);
    } catch (err) {
      setError('Could not load health risk prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPredictions();
  }, [profile, totals]);

  // Compute simulated vitality score improvement
  const simulatedScore = data
    ? Math.min(
        99,
        data.vitality_score +
          Math.round(waterBonus * 2.5) +
          Math.round((fatCut / 5) * 2) +
          (activityBonus ? 8 : 0)
      )
    : 80;

  function getLevelBadgeClass(level) {
    if (level === 'High') return 'level-badge high';
    if (level === 'Moderate') return 'level-badge moderate';
    return 'level-badge low';
  }

  return (
    <div className="risk-container">
      {/* Top Banner */}
      <div className="risk-header-banner">
        <div>
          <div className="risk-badge">
            <HeartPulse size={16} />
            <span>Clinical AI Predictive Engine</span>
          </div>
          <h1>Metabolic Health Risk Assessment</h1>
          <p>
            Evaluates your biometric index (BMI), dietary fat density, carbohydrate glycemic load, and hydration
            to predict lifestyle disease probabilities.
          </p>
        </div>

        <button className="btn-print-report" onClick={() => window.print()}>
          <Download size={16} />
          <span>Save Assessment</span>
        </button>
      </div>

      {error && <div className="risk-error-banner">{error}</div>}

      {loading && (
        <div className="risk-loading-card">
          <div className="ai-pulsing-spinner" />
          <p>NutriVibe AI is computing clinical risk markers...</p>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Top Metric Showcase */}
          <div className="risk-top-grid">
            {/* Vitality Score Card */}
            <div className="vitality-score-card">
              <span className="vitality-label">Overall Metabolic Vitality</span>
              <div className="vitality-gauge">
                <span className="vitality-num">{simulatedScore}</span>
                <span className="vitality-denom">/ 100</span>
              </div>
              <p className="vitality-verdict">{data.vitality_verdict}</p>
              <div className="vitality-bar-track">
                <div
                  className={`vitality-bar-fill ${
                    simulatedScore >= 80 ? 'green' : simulatedScore >= 60 ? 'orange' : 'red'
                  }`}
                  style={{ width: `${simulatedScore}%` }}
                />
              </div>
            </div>

            {/* BMI & Biometric Card */}
            <div className="bmi-card">
              <div className="bmi-top">
                <div className="bmi-icon">
                  <Scale size={20} />
                </div>
                <div>
                  <span className="card-label">Body Mass Index (BMI)</span>
                  <h3>{data.biometrics.bmi}</h3>
                </div>
                <span className={`bmi-status-pill ${data.biometrics.bmi >= 25 ? 'warn' : 'ok'}`}>
                  {data.biometrics.bmi_status}
                </span>
              </div>

              <div className="bmi-specs-grid">
                <div>
                  <span>Current Weight:</span>
                  <strong>{data.biometrics.weight_kg} kg</strong>
                </div>
                <div>
                  <span>Height:</span>
                  <strong>{data.biometrics.height_cm} cm</strong>
                </div>
                <div>
                  <span>Ideal Healthy Range:</span>
                  <strong>{data.biometrics.ideal_weight_range_kg}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Clinical Risk Cards */}
          <div className="risk-cards-grid">
            {data.risks.map((risk) => (
              <div key={risk.id} className="risk-eval-card">
                <div className="risk-card-header">
                  <div className="risk-title-box">
                    <ShieldAlert size={19} className="risk-icon" />
                    <h4>{risk.name}</h4>
                  </div>
                  <span className={getLevelBadgeClass(risk.level)}>
                    {risk.level} Risk ({risk.score_percent}%)
                  </span>
                </div>

                <div className="risk-driver-box">
                  <strong>Diagnostic Driver:</strong>
                  <p>{risk.driver}</p>
                </div>

                <div className="risk-recommendation-box">
                  <div className="rec-header">
                    <Sparkles size={14} />
                    <span>AI Preventative Protocol:</span>
                  </div>
                  <p>{risk.recommendation}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What-If Lifestyle Simulator */}
          <div className="simulator-card">
            <div className="simulator-header">
              <div className="sim-title">
                <Sliders size={20} className="sim-icon" />
                <h3>Interactive "What-If" Health Simulator</h3>
              </div>
              <span className="sim-badge">
                Simulated Score: <strong>{simulatedScore}/100</strong> (+{simulatedScore - data.vitality_score} pts)
              </span>
            </div>

            <p className="sim-subtitle">
              Adjust dietary habits below to see real-time predicted reductions in metabolic disease risk:
            </p>

            <div className="sim-sliders-grid">
              <div className="slider-control">
                <label>
                  <span>💧 Add Extra Hydration:</span>
                  <strong>+{waterBonus} glasses (+{waterBonus * 250} ml)</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={waterBonus}
                  onChange={(e) => setWaterBonus(Number(e.target.value))}
                />
              </div>

              <div className="slider-control">
                <label>
                  <span>🥑 Reduce Cooking Fat:</span>
                  <strong>-{fatCut} grams daily</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={fatCut}
                  onChange={(e) => setFatCut(Number(e.target.value))}
                />
              </div>

              <div className="slider-control checkbox-control">
                <label>
                  <input
                    type="checkbox"
                    checked={activityBonus === 1}
                    onChange={(e) => setActivityBonus(e.target.checked ? 1 : 0)}
                  />
                  <span>🏃 Commit to 30 min daily brisk walking</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
