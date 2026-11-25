import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Upload,
  X,
  Check,
  RotateCcw,
  RefreshCw,
  Video,
  Image as ImageIcon,
  Flame,
  Droplet,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Zap,
  AlertTriangle,
  Scale,
  UtensilsCrossed,
} from 'lucide-react';
import { scanFood } from '../services/aiService';
import './AiScannerModal.css';

const SAMPLE_PRESETS = [
  { name: 'Dal Tadka & Roti', calories: 280, fat: 9, protein: 12, carbs: 42, baseGrams: 200, category: 'Lunch' },
  { name: 'Paneer Butter Masala', calories: 380, fat: 26, protein: 14, carbs: 18, baseGrams: 200, category: 'Dinner' },
  { name: 'Chicken Biryani', calories: 450, fat: 16, protein: 28, carbs: 52, baseGrams: 250, category: 'Dinner' },
  { name: 'Fresh Garden Salad', calories: 120, fat: 3, protein: 4, carbs: 16, baseGrams: 150, category: 'Lunch' },
  { name: '2 Boiled Eggs', calories: 155, fat: 11, protein: 13, carbs: 1.1, baseGrams: 100, category: 'Breakfast' },
  { name: 'Oatmeal with berries', calories: 220, fat: 4, protein: 8, carbs: 38, baseGrams: 180, category: 'Breakfast' },
  { name: 'Idli with Sambhar', calories: 230, fat: 4, protein: 9, carbs: 45, baseGrams: 180, category: 'Breakfast' },
  { name: 'Rajma Chawal', calories: 340, fat: 7, protein: 14, carbs: 58, baseGrams: 250, category: 'Lunch' },
];

function getDefaultCategoryByTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 16) return 'Lunch';
  if (hour >= 16 && hour < 19) return 'Snack';
  return 'Dinner';
}

export default function AiScannerModal({
  isOpen,
  onClose,
  onFoodDetected,
  onDirectAddMeal,
  onDeleteMeal,
}) {
  const [mode, setMode] = useState('camera'); // 'camera' or 'upload'
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [autoAdd, setAutoAdd] = useState(false); // Default to false so user can verify dish & portion!
  const [autoAddedMeal, setAutoAddedMeal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(getDefaultCategoryByTime());

  // Portion controls (Optional: Defaults to 1 plate)
  const [plates, setPlates] = useState(1);
  const [customGrams, setCustomGrams] = useState('');
  const [isCustomGramsActive, setIsCustomGramsActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera tracks cleanly
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  // Start live webcam or mobile phone camera
  async function startCamera(desiredFacing = facingMode) {
    stopCamera();
    setError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: desiredFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraActive(false);
      setError(
        'Could not access camera. Please allow camera permissions in browser settings or use the Upload Photo tab.'
      );
    }
  }

  function handleFlipCamera() {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (cameraActive) {
      startCamera(nextFacing);
    }
  }

  // Snap photo from live video stream
  function handleCapturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelectedImage(dataUrl);
    setUploadedFileName('camera_snapshot.jpg');
    stopCamera();
    setScanResult(null);
    setAutoAddedMeal(null);
    setPlates(1);
    setCustomGrams('');
    setIsCustomGramsActive(false);

    // Trigger AI analysis on the snapped photo
    handleAnalyze('', dataUrl, 'camera_snapshot.jpg');
  }

  useEffect(() => {
    if (isOpen && mode === 'camera' && !selectedImage && !autoAddedMeal) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, selectedImage, autoAddedMeal]);

  if (!isOpen) return null;

  // File upload handler with validation and explicit error notice
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setError('Image upload failed: No file was selected.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Image upload failed: Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image upload failed: File is larger than 10MB limit. Please choose a smaller image.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onerror = () => {
      setError('Image upload failed: Unable to read the selected file. Please try again.');
    };
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (!dataUrl) {
        setError('Image upload failed: Empty image content.');
        return;
      }
      setSelectedImage(dataUrl);
      setScanResult(null);
      setAutoAddedMeal(null);
      setError('');
      setPlates(1);
      setCustomGrams('');
      setIsCustomGramsActive(false);
      handleAnalyze('', dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  }

  // Run AI food recognition
  async function handleAnalyze(queryOverride, imageOverride, fileNameOverride) {
    const q = queryOverride !== undefined ? queryOverride : searchQuery;
    const img = imageOverride !== undefined ? imageOverride : selectedImage;
    const fName = fileNameOverride !== undefined ? fileNameOverride : uploadedFileName;

    if (!img && !q.trim()) {
      setError('Image upload failed: Please take a photo or enter a food name to scan.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAutoAddedMeal(null);

    try {
      const data = await scanFood(q.trim(), img, fName);
      if (!data) {
        throw new Error('No recognition data received from AI engine.');
      }
      setScanResult(data);
      const baseG = data.baseGrams || (data.food_name?.toLowerCase().includes('biryani') ? 300 : 150);
      setCustomGrams(String(baseG));
      if (data.category) {
        setSelectedCategory(data.category);
      }
    } catch (err) {
      console.error('AI Scan Error:', err);
      setError(
        err.response?.data?.message ||
          'Image scan failed: Unable to identify the food. Please ensure the image is clear or choose your dish below.'
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // Switch dish with 1-click alternative
  function handleSelectPreset(preset) {
    const baseG = preset.baseGrams || 150;
    setScanResult({
      food_name: preset.name,
      category: preset.category || selectedCategory,
      calories: preset.calories,
      fat: preset.fat,
      protein: preset.protein,
      carbs: preset.carbs,
      baseGrams: baseG,
      confidence: 0.99,
      is_unrecognized: false,
      is_low_confidence: false,
      health_verdict: `Balanced staple serving containing ${preset.calories} kcal and ${preset.fat}g fat.`,
    });
    setPlates(1);
    setCustomGrams(String(baseG));
    setIsCustomGramsActive(false);
    setError('');
  }

  // Dynamic portion scaling calculation
  const baseGrams = Number(scanResult?.baseGrams) || 150;
  const portionMultiplier = isCustomGramsActive && Number(customGrams) > 0
    ? Number(customGrams) / baseGrams
    : plates;

  const currentCalories = scanResult
    ? Math.max(10, Math.round(Number(scanResult.calories) * portionMultiplier))
    : 0;

  const currentFat = scanResult
    ? Math.max(0, Math.round(Number(scanResult.fat || 0) * portionMultiplier * 10) / 10)
    : 0;

  const currentProtein = scanResult
    ? Math.max(0, Math.round(Number(scanResult.protein || 0) * portionMultiplier * 10) / 10)
    : 0;

  const currentCarbs = scanResult
    ? Math.max(0, Math.round(Number(scanResult.carbs || 0) * portionMultiplier * 10) / 10)
    : 0;

  const currentWeightGrams = isCustomGramsActive && Number(customGrams) > 0
    ? Number(customGrams)
    : Math.round(baseGrams * plates);

  // Manual one-click add to MongoDB
  async function handleManualAddMeal() {
    if (!scanResult) return;
    const mealToSave = {
      name: `${scanResult.food_name} (${isCustomGramsActive ? `${currentWeightGrams}g` : `${plates} plate`})`,
      category: selectedCategory || scanResult.category || 'Lunch',
      calories: currentCalories,
      fat: currentFat,
      protein: currentProtein,
      carbs: currentCarbs,
      consumedAt: new Date().toISOString(),
    };

    try {
      if (onDirectAddMeal) {
        const savedDoc = await onDirectAddMeal(mealToSave);
        setAutoAddedMeal(savedDoc || mealToSave);
      } else if (onFoodDetected) {
        onFoodDetected(mealToSave);
        handleClose();
      }
    } catch (saveErr) {
      setError(saveErr.response?.data?.message || 'Could not save meal to database. Please try again.');
    }
  }

  async function handleUndoMeal() {
    if (autoAddedMeal && autoAddedMeal._id && onDeleteMeal) {
      await onDeleteMeal(autoAddedMeal);
    }
    setAutoAddedMeal(null);
  }

  function handleRetake() {
    setSelectedImage(null);
    setUploadedFileName('');
    setScanResult(null);
    setAutoAddedMeal(null);
    setError('');
    setPlates(1);
    setCustomGrams('');
    setIsCustomGramsActive(false);
    if (mode === 'camera') {
      startCamera();
    }
  }

  function handleClose() {
    stopCamera();
    setSelectedImage(null);
    setUploadedFileName('');
    setSearchQuery('');
    setScanResult(null);
    setAutoAddedMeal(null);
    setError('');
    setPlates(1);
    setCustomGrams('');
    setIsCustomGramsActive(false);
    onClose();
  }

  return (
    <div className="ai-modal-overlay" onClick={handleClose}>
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <header className="ai-modal-header">
          <div className="ai-header-title">
            <div className="ai-badge">
              <Sparkles size={16} />
              <span>NutriVibe AI Vision</span>
            </div>
            <h2>Scan Food & Auto-Log Calories & Fat</h2>
          </div>
          <button className="icon-close" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="ai-modal-body">
          {/* Explicit Error Banner for Image Upload or Recognition Failure */}
          {error && (
            <div className="ai-error-banner">
              <div className="error-title">
                <AlertTriangle size={18} />
                <strong>Scan Notice:</strong>
              </div>
              <p>{error}</p>
              <div className="error-quick-actions">
                <button type="button" onClick={handleRetake} className="btn-retry-scan">
                  <RefreshCw size={14} /> Try Another Photo
                </button>
                <span>Or select your dish below</span>
              </div>
            </div>
          )}

          {/* Meal Category & Scanner Notice Banner */}
          <div className="ai-auto-add-banner">
            <span className="auto-add-text">
              <Zap size={15} className="auto-icon" />
              <strong>AI Vision:</strong> Verify detected dish & portion before logging
            </span>
            <div className="category-mini-picker">
              <span>Log to:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </div>

          {/* Mode Switcher: Live Camera vs Upload File */}
          <div className="ai-mode-toggle">
            <button
              className={`ai-mode-btn ${mode === 'camera' ? 'active' : ''}`}
              onClick={() => {
                setMode('camera');
                setSelectedImage(null);
                setScanResult(null);
                setAutoAddedMeal(null);
                setError('');
              }}
            >
              <Camera size={16} />
              <span>Live Camera (Phone / Mac)</span>
            </button>
            <button
              className={`ai-mode-btn ${mode === 'upload' ? 'active' : ''}`}
              onClick={() => {
                setMode('upload');
                stopCamera();
                setSelectedImage(null);
                setScanResult(null);
                setAutoAddedMeal(null);
                setError('');
              }}
            >
              <Upload size={16} />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* 1. Live Camera View */}
          {mode === 'camera' && !selectedImage && !autoAddedMeal && (
            <div className="ai-camera-wrapper">
              <div className="ai-video-box">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="ai-live-video"
                />
                {!cameraActive && (
                  <div className="ai-camera-placeholder">
                    <Video size={36} />
                    <span>Connecting camera viewfinder...</span>
                  </div>
                )}
                {cameraActive && (
                  <div className="ai-camera-overlay-frame">
                    <div className="frame-corner top-left" />
                    <div className="frame-corner top-right" />
                    <div className="frame-corner bottom-left" />
                    <div className="frame-corner bottom-right" />
                    <span className="frame-label">Center your meal dish</span>
                  </div>
                )}
              </div>

              <div className="ai-camera-controls">
                <button
                  type="button"
                  className="ai-flip-btn"
                  onClick={handleFlipCamera}
                  title="Switch Front / Rear Camera"
                >
                  <RefreshCw size={18} />
                </button>

                <button
                  type="button"
                  className="ai-shutter-btn"
                  onClick={handleCapturePhoto}
                  disabled={!cameraActive}
                >
                  <div className="shutter-inner">
                    <Camera size={26} />
                  </div>
                  <span>Snap Meal</span>
                </button>

                <div style={{ width: '48px' }} />
              </div>
            </div>
          )}

          {/* 2. Photo Upload Dropzone */}
          {mode === 'upload' && !selectedImage && !autoAddedMeal && (
            <div
              className="ai-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="ai-upload-prompt">
                <div className="ai-camera-circle">
                  <ImageIcon size={32} />
                </div>
                <strong>Click to Upload or Drag Food Photo Here</strong>
                <span>Supports JPG, PNG, WebP from phone or computer</span>
                <span className="sub-hint">AI detects food name, calories, and fat with portion controls!</span>
              </div>
            </div>
          )}

          {/* 3. Image Preview after snap/upload */}
          {selectedImage && (
            <div className="ai-snapped-preview">
              <img src={selectedImage} alt="Captured food" className="ai-preview-img" />
              <div className="ai-preview-actions">
                <button type="button" className="ai-retake-btn" onClick={handleRetake}>
                  <RotateCcw size={15} /> Retake / Choose Another Photo
                </button>
              </div>
            </div>
          )}

          {/* Analyzing Spinner Banner */}
          {analyzing && (
            <div className="ai-analyzing-card">
              <div className="ai-pulsing-spinner" />
              <div>
                <strong>NutriVibe AI Vision is analyzing your meal...</strong>
                <span>Matching ICMR IFCT database & calculating portion nutrition</span>
              </div>
            </div>
          )}

          {/* SUCCESS BANNER: Auto-Added to Meals */}
          {autoAddedMeal && !analyzing && (
            <div className="ai-auto-success-card">
              <div className="success-header">
                <CheckCircle2 size={28} className="success-icon" />
                <div>
                  <h3>🎉 Meal Logged to Database!</h3>
                  <p>
                    <strong>{autoAddedMeal.name}</strong> was saved to{' '}
                    <span className="badge-cat">{autoAddedMeal.category}</span>.
                  </p>
                </div>
              </div>

              <div className="success-macro-strip">
                <div className="macro-pill highlight-cal">
                  <Flame size={15} />
                  <span>Calories:</span>
                  <strong>{autoAddedMeal.calories} kcal</strong>
                </div>
                <div className="macro-pill highlight-fat">
                  <Droplet size={15} />
                  <span>Fat:</span>
                  <strong>{autoAddedMeal.fat}g</strong>
                </div>
                <div className="macro-pill">
                  <span>Protein:</span>
                  <strong>{autoAddedMeal.protein}g</strong>
                </div>
                <div className="macro-pill">
                  <span>Carbs:</span>
                  <strong>{autoAddedMeal.carbs}g</strong>
                </div>
              </div>

              <div className="success-actions">
                <button className="btn-done" onClick={handleClose}>
                  Done (View Dashboard) <ArrowRight size={16} />
                </button>
                <button className="btn-scan-more" onClick={handleRetake}>
                  <Camera size={15} /> Add Another Photo
                </button>
                <button className="btn-undo" onClick={handleUndoMeal} title="Undo & Remove meal">
                  <Trash2 size={15} /> Undo
                </button>
              </div>
            </div>
          )}

          {/* Scan Results View & OPTIONAL PORTION SELECTOR */}
          {scanResult && !analyzing && !autoAddedMeal && (
            <div className="ai-result-card">
              {/* Notice if low confidence or unrecognized */}
              {(scanResult.is_unrecognized || scanResult.is_low_confidence) && (
                <div className="ai-uncertain-notice">
                  <AlertTriangle size={17} />
                  <span>
                    Photo match is approximate. Please verify portion or pick your exact dish below:
                  </span>
                </div>
              )}

              <div className="ai-result-header">
                <div>
                  <span className={`ai-confidence ${scanResult.is_low_confidence ? 'low' : ''}`}>
                    {Math.round(scanResult.confidence * 100)}% Match Confidence
                  </span>
                  <h3>{scanResult.food_name}</h3>
                  <span className="ai-portion">
                    Base: {baseGrams}g standard serving
                  </span>
                </div>
                <div className="ai-calories-badge">
                  <strong>{currentCalories}</strong>
                  <span>kcal</span>
                </div>
              </div>

              {/* PORTION SELECTOR CONTROLS (OPTIONAL: Plates or Grams) */}
              <div className="ai-portion-controller">
                <div className="portion-ctrl-header">
                  <div className="portion-label">
                    <Scale size={16} />
                    <strong>Portion Size (Optional):</strong>
                  </div>
                  <span className="portion-current-badge">
                    {isCustomGramsActive ? `${currentWeightGrams}g` : `${plates} Plate (${currentWeightGrams}g)`}
                  </span>
                </div>

                {/* Preset Plates Quick Buttons */}
                <div className="plate-button-row">
                  {[0.5, 1, 1.5, 2].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`btn-plate-option ${!isCustomGramsActive && plates === p ? 'active' : ''}`}
                      onClick={() => {
                        setPlates(p);
                        setIsCustomGramsActive(false);
                        setCustomGrams(String(Math.round(baseGrams * p)));
                      }}
                    >
                      {p === 1 ? '1 Plate (Default)' : `${p} Plate${p > 1 ? 's' : ''}`}
                    </button>
                  ))}
                </div>

                {/* Optional Custom Grams Input */}
                <div className="custom-grams-row">
                  <label htmlFor="custom-grams-input">Or enter exact Grams (optional):</label>
                  <div className="custom-grams-input-wrap">
                    <input
                      id="custom-grams-input"
                      type="number"
                      min="10"
                      max="1500"
                      step="5"
                      placeholder={`e.g. ${baseGrams}g`}
                      value={customGrams}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomGrams(val);
                        setIsCustomGramsActive(Boolean(val && Number(val) > 0));
                      }}
                    />
                    <span className="unit-label">grams</span>
                  </div>
                </div>
              </div>

              {/* Prominent Calories & Fat Highlights based on selected portion */}
              <div className="ai-highlight-metrics">
                <div className="metric-box orange-box">
                  <div className="box-top">
                    <Flame size={18} />
                    <span>Scaled Calories</span>
                  </div>
                  <strong>{currentCalories} kcal</strong>
                </div>
                <div className="metric-box purple-box">
                  <div className="box-top">
                    <Droplet size={18} />
                    <span>Total Fat</span>
                  </div>
                  <strong>{currentFat} g</strong>
                  <small>{Math.round(((currentFat * 9) / Math.max(1, currentCalories)) * 100)}% of energy</small>
                </div>
              </div>

              <div className="ai-macro-grid">
                <div className="ai-macro-item">
                  <span className="macro-dot green" />
                  <span>Protein</span>
                  <strong>{currentProtein}g</strong>
                </div>
                <div className="ai-macro-item">
                  <span className="macro-dot orange" />
                  <span>Carbs</span>
                  <strong>{currentCarbs}g</strong>
                </div>
                <div className="ai-macro-item">
                  <span className="macro-dot purple" />
                  <span>Fat</span>
                  <strong>{currentFat}g</strong>
                </div>
              </div>

              {scanResult.health_verdict && (
                <p className="ai-health-note">💡 {scanResult.health_verdict}</p>
              )}

              {/* Confirm & Save Button */}
              <button className="ai-save-meal-btn" onClick={handleManualAddMeal}>
                <Check size={18} /> Add Meal to Tracker ({currentCalories} kcal, {currentFat}g Fat • {isCustomGramsActive ? `${currentWeightGrams}g` : `${plates} Plate`})
              </button>
            </div>
          )}

          {/* Quick Alternatives & Staples Picker (Allows user to correct if AI guessed wrong) */}
          <div className="ai-alternatives-section">
            <div className="alternatives-header">
              <UtensilsCrossed size={16} />
              <span>Not what you're eating? Choose or search your dish:</span>
            </div>

            <div className="ai-search-row">
              <input
                type="text"
                placeholder="Search dish (e.g. Paneer Butter Masala, Chicken Biryani, Dal Tadka)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze();
                }}
              />
              <button
                className="ai-scan-btn"
                onClick={() => handleAnalyze()}
                disabled={analyzing}
              >
                {analyzing ? 'Searching...' : 'Find Food'}
              </button>
            </div>

            <div className="ai-preset-tags">
              {SAMPLE_PRESETS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`ai-preset-chip ${scanResult?.food_name === item.name ? 'active-preset' : ''}`}
                  onClick={() => handleSelectPreset(item)}
                >
                  {item.name} <small>({item.calories} kcal)</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
