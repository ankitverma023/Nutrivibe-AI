import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Info, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchAiInsights } from '../services/aiService';
import './AiInsightsCard.css';

export default function AiInsightsCard({ totals, goals, onQuickAddSuggestion }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadInsights() {
    setLoading(true);
    try {
      const res = await fetchAiInsights(totals, goals);
      setData(res);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsights();
  }, [totals?.calories, totals?.protein, totals?.waterGlasses, goals?.calorieGoal]);

  if (!data && !loading) return null;

  return (
    <article className="ai-insights-panel">
      <div className="ai-panel-header">
        <div className="ai-title-wrap">
          <div className="ai-sparkle-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <h3>NutriVibe AI Advisor</h3>
            <span>Real-time diet & macro intelligence</span>
          </div>
        </div>
        <div className="ai-header-right">
          {data?.summary && <span className="ai-score-pill">{data.summary}</span>}
          <button
            className="ai-refresh-btn"
            onClick={loadInsights}
            disabled={loading}
            title="Refresh insights"
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      <div className="ai-insights-list">
        {data?.insights?.map((item, index) => (
          <div key={index} className={`ai-insight-item ${item.type}`}>
            {item.type === 'success' && <CheckCircle size={18} className="insight-icon" />}
            {item.type === 'warning' && <AlertTriangle size={18} className="insight-icon" />}
            {(item.type === 'info' || item.type === 'action') && (
              <Info size={18} className="insight-icon" />
            )}
            <div className="insight-copy">
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {data?.recommendations?.length > 0 && (
        <div className="ai-recommendations-section">
          <h4>Smart Action Items:</h4>
          <div className="ai-rec-chips">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="ai-rec-chip">
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
