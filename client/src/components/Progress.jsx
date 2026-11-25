import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Apple,
  Weight,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { fetchWeeklyAnalytics, fetchOverallSummary } from '../services/analyticsService';
import './Progress.css';

export default function Progress() {
  const [weekly, setWeekly] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [weeklyRes, summaryRes] = await Promise.all([
          fetchWeeklyAnalytics(),
          fetchOverallSummary(),
        ]);
        if (weeklyRes?.weekly) setWeekly(weeklyRes.weekly);
        if (summaryRes) setSummary(summaryRes);
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="progress-container"><p>Loading historical analytics...</p></div>;
  }

  const macroTotals = summary?.lifetimeNutrition || {};
  const totalGrams =
    (macroTotals.totalProtein || 0) +
    (macroTotals.totalCarbs || 0) +
    (macroTotals.totalFat || 0);

  const proteinPct = totalGrams > 0 ? Math.round((macroTotals.totalProtein / totalGrams) * 100) : 25;
  const carbsPct = totalGrams > 0 ? Math.round((macroTotals.totalCarbs / totalGrams) * 100) : 50;
  const fatPct = totalGrams > 0 ? Math.round((macroTotals.totalFat / totalGrams) * 100) : 25;

  return (
    <div className="progress-container">
      <header className="progress-header">
        <div className="progress-icon-circle">
          <TrendingUp size={24} />
        </div>
        <div>
          <h2>My Health Progress & Analytics</h2>
          <p>Real-time historical consistency aggregated from your MongoDB food logs.</p>
        </div>
      </header>

      {/* Summary KPI Cards */}
      <section className="progress-kpis">
        <div className="kpi-card">
          <div className="kpi-icon orange"><Flame size={20} /></div>
          <div>
            <span className="kpi-label">Weekly Logged Meals</span>
            <strong className="kpi-value">{summary?.totalMealsLogged || 0}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green"><Award size={20} /></div>
          <div>
            <span className="kpi-label">Active Days Logged</span>
            <strong className="kpi-value">
              {weekly.filter((d) => d.mealCount > 0).length} / 7
            </strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon purple"><Layers size={20} /></div>
          <div>
            <span className="kpi-label">Total Calories Tracked</span>
            <strong className="kpi-value">
              {macroTotals.totalCalories ? macroTotals.totalCalories.toLocaleString() : '0'} kcal
            </strong>
          </div>
        </div>
      </section>

      {/* 7-Day Calorie Trend Area Chart */}
      <section className="progress-panel">
        <div className="panel-title-row">
          <div>
            <h3>7-Day Calorie Consistency Trend</h3>
            <span>Daily intake vs target goal</span>
          </div>
          <span className="live-badge">Live Database Data</span>
        </div>

        <div className="progress-chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(val, name) => [
                  `${val} kcal`,
                  name === 'calories' ? 'Consumed' : 'Daily Goal',
                ]}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#progressGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Macronutrient Distribution & Intake */}
      <section className="progress-panel">
        <div className="panel-title-row">
          <div>
            <h3>Lifetime Macronutrient Balance</h3>
            <span>Ratio of Protein, Carbohydrates, and Fats logged</span>
          </div>
        </div>

        <div className="macro-ratio-bar">
          <div className="ratio-segment green" style={{ width: `${proteinPct}%` }} title={`Protein: ${proteinPct}%`} />
          <div className="ratio-segment orange" style={{ width: `${carbsPct}%` }} title={`Carbs: ${carbsPct}%`} />
          <div className="ratio-segment purple" style={{ width: `${fatPct}%` }} title={`Fat: ${fatPct}%`} />
        </div>

        <div className="macro-ratio-legend">
          <div className="legend-item">
            <span className="dot green" />
            <span>Protein: <strong>{proteinPct}%</strong> ({macroTotals.totalProtein || 0}g)</span>
          </div>
          <div className="legend-item">
            <span className="dot orange" />
            <span>Carbs: <strong>{carbsPct}%</strong> ({macroTotals.totalCarbs || 0}g)</span>
          </div>
          <div className="legend-item">
            <span className="dot purple" />
            <span>Fat: <strong>{fatPct}%</strong> ({macroTotals.totalFat || 0}g)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
