import { useState } from 'react';
import { Settings as SettingsIcon, User, Download, ShieldCheck, LogOut, Check } from 'lucide-react';
import './Settings.css';

export default function Settings({ currentUser, onLogout }) {
  const [unitSystem, setUnitSystem] = useState('metric');
  const [downloadNotice, setDownloadNotice] = useState('');

  function handleExportData() {
    const data = {
      user: currentUser,
      exportDate: new Date().toISOString(),
      platform: 'NutriVibe AI Health Platform',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrivibe-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadNotice('Profile data exported successfully.');
    setTimeout(() => setDownloadNotice(''), 4000);
  }

  return (
    <div className="settings-container">
      <header className="settings-header">
        <div className="settings-icon-circle">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2>Account & App Preferences</h2>
          <p>Manage your account settings, measurement units, and data security.</p>
        </div>
      </header>

      {downloadNotice && (
        <div className="settings-notice">
          <Check size={16} /> {downloadNotice}
        </div>
      )}

      <div className="settings-cards">
        {/* Account Info */}
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={20} className="icon-sub" />
            <div>
              <h3>Account Profile</h3>
              <span>Signed in user credentials</span>
            </div>
          </div>
          <div className="settings-details">
            <div className="detail-row">
              <span className="label">Full Name:</span>
              <strong>{currentUser?.name || 'User'}</strong>
            </div>
            <div className="detail-row">
              <span className="label">Email Address:</span>
              <strong>{currentUser?.email || 'N/A'}</strong>
            </div>
            <div className="detail-row">
              <span className="label">Authentication:</span>
              <span className="auth-chip">JWT Token Verified</span>
            </div>
          </div>
        </div>

        {/* Units & Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <ShieldCheck size={20} className="icon-sub" />
            <div>
              <h3>Measurement Units</h3>
              <span>Choose your preferred unit standard</span>
            </div>
          </div>
          <div className="unit-options">
            <label className={`unit-radio ${unitSystem === 'metric' ? 'active' : ''}`}>
              <input
                type="radio"
                name="units"
                value="metric"
                checked={unitSystem === 'metric'}
                onChange={() => setUnitSystem('metric')}
              />
              <div>
                <strong>Metric System (Recommended)</strong>
                <span>Kilograms (kg), Centimeters (cm), Milliliters (ml)</span>
              </div>
            </label>

            <label className={`unit-radio ${unitSystem === 'imperial' ? 'active' : ''}`}>
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={unitSystem === 'imperial'}
                onChange={() => setUnitSystem('imperial')}
              />
              <div>
                <strong>Imperial System</strong>
                <span>Pounds (lbs), Feet & Inches (ft/in), Fluid Ounces (fl oz)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Download size={20} className="icon-sub" />
            <div>
              <h3>Data Portability & Security</h3>
              <span>Export or manage your nutrition logs</span>
            </div>
          </div>
          <p className="settings-info-text">
            All your meal data, calorie logs, and hydration counts are stored securely in MongoDB
            and tied specifically to your authenticated user account.
          </p>
          <div className="settings-action-row">
            <button className="export-btn" onClick={handleExportData}>
              <Download size={16} /> Export Account Data (JSON)
            </button>
            <button className="logout-danger-btn" onClick={onLogout}>
              <LogOut size={16} /> Sign Out of NutriVibe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
