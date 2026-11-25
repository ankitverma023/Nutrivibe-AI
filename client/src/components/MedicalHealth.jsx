import { useState, useEffect } from 'react';
import {
  Heart,
  Baby,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Droplets,
  Plus,
  ShieldCheck,
  Info,
  Calendar,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { fetchProfile, updateProfile } from '../services/profileService';
import './MedicalHealth.css';

const MEDICAL_PROTOCOLS = {
  pregnancy: {
    title: 'Pregnancy Care & Fetal Nutrition Protocol',
    icon: '🤰',
    badge: 'Maternal & Fetal Health',
    subtitle: 'ICMR-NIN & WHO Clinical Guidelines for 1st, 2nd & 3rd Trimesters',
    calorieAdjustment: '+350 kcal / day (2nd & 3rd Trimesters)',
    waterTarget: '10 - 12 glasses (2.5 - 3.0 Liters / day)',
    coreNutrients: [
      { name: 'Folate (Vitamin B9)', target: '600 mcg/day', purpose: 'Prevents neural tube defects & supports rapid fetal cell division.' },
      { name: 'Elemental Iron', target: '27 mg/day', purpose: 'Expands maternal red blood cell volume and prevents gestational anemia.' },
      { name: 'Calcium', target: '1,200 mg/day', purpose: 'Builds baby skeleton, teeth, and prevents maternal bone depletion.' },
      { name: 'DHA Omega-3', target: '200 mg/day', purpose: 'Critical for fetal brain development and retina formation.' },
    ],
    recommendedFoods: [
      { name: 'Palak & Methi Dal', details: 'Abundant in natural bioavailable folate and dietary iron.' },
      { name: 'Fortified Milk, Curd & Paneer', details: 'Rich in easily absorbable calcium, protein, and probiotics.' },
      { name: 'Soaked Almonds & Walnuts', details: 'Plant-based Omega-3 fatty acids for cognitive baby development.' },
      { name: 'Steamed Sprouted Moong', details: 'Easily digestible protein without causing gastrointestinal acidity.' },
      { name: 'Boiled Eggs / Tofu', details: 'Complete amino acid profile + Choline for fetal neural pathways.' },
    ],
    foodsToAvoid: [
      { name: 'Raw or Semi-ripe Papaya (Papain)', reason: 'Contains latex and papain that may trigger uterine contractions.' },
      { name: 'Unpasteurized Milk & Soft Cheeses', reason: 'High risk of Listeria monocytogenes bacteria infection.' },
      { name: 'Raw / Soft Boiled Eggs', reason: 'Risk of Salmonella food poisoning; always consume fully cooked.' },
      { name: 'Excessive Caffeine (> 200mg/day)', reason: 'Crosses placenta, restricts fetal growth, and interferes with iron absorption.' },
      { name: 'High-Mercury Fish (King Mackerel)', reason: 'Mercury impairs developing fetal nervous system.' },
    ],
    safeActivities: [
      { name: 'Prenatal Yoga & Gentle Stretching', duration: '20 - 30 mins', note: 'Cat-cow pose, butterfly pose (Baddha Konasana), pelvic tilts.' },
      { name: 'Low-Impact Brisk Walking', duration: '20 - 30 mins daily', note: 'Maintains healthy gestational blood pressure and glucose.' },
      { name: 'Pelvic Floor (Kegel) Exercises', duration: '3 sets of 10 reps', note: 'Strengthens pelvic sling for labor and postpartum recovery.' },
      { name: 'Gentle Water Aerobics / Swimming', duration: '20 mins', note: 'Water buoyancy relieves spinal and lower back pressure.' },
    ],
    activitiesToAvoid: [
      { name: 'Abdominal Crunches & Sit-ups', reason: 'Risk of Diastasis Recti (abdominal muscle separation) and uterine pressure.' },
      { name: 'Heavy Deadlifts & High-Impact Jumping', reason: 'Joints are lax from relaxin hormone; high risk of ligament sprain.' },
      { name: 'Hot Yoga / Saunas', reason: 'Maternal hyperthermia can cause birth defects in early gestation.' },
      { name: 'Lying Flat on Back (Supine)', reason: 'Compresses the Vena Cava, reducing oxygen flow to baby after week 16.' },
    ],
    suggestedMeals: [
      { name: 'Pregnancy Morning: Oats Porridge with Walnuts & Milk', category: 'Breakfast', calories: 340, fat: 11, protein: 14, carbs: 48 },
      { name: 'Pregnancy Lunch: Spinach Paneer with 2 Multigrain Rotis', category: 'Lunch', calories: 420, fat: 18, protein: 18, carbs: 46 },
      { name: 'Pregnancy Snack: Roasted Makhana & Tender Coconut Water', category: 'Snack', calories: 160, fat: 3, protein: 4, carbs: 30 },
      { name: 'Pregnancy Dinner: Moong Dal Khichdi with Steamed Carrots', category: 'Dinner', calories: 350, fat: 7, protein: 13, carbs: 58 },
    ],
  },
  lactation: {
    title: 'Lactation & Postpartum Recovery Protocol',
    icon: '🤱',
    badge: 'Postnatal Nutrition',
    subtitle: 'Nourishing Mother and Baby During Active Breastfeeding',
    calorieAdjustment: '+500 kcal / day (0 - 6 months exclusive breastfeeding)',
    waterTarget: '12 - 14 glasses (3.0 - 3.5 Liters / day)',
    coreNutrients: [
      { name: 'Galactagogues', target: 'Daily', purpose: 'Fenugreek (methi), fennel (saunf), and garlic stimulate prolactin secretion.' },
      { name: 'High Biological Value Protein', target: '75 - 80 g/day', purpose: 'Replenishes maternal tissue and fuels breast milk whey/casein.' },
      { name: 'Calcium & Vitamin D', target: '1,200 mg/day', purpose: 'Protects maternal bone density and enriches breast milk minerals.' },
    ],
    recommendedFoods: [
      { name: 'Methi (Fenugreek) & Jeera Infusion', details: 'Traditional, clinically observed galactagogue for milk letdown.' },
      { name: 'Oatmeal & Dalia Porridge', details: 'High beta-glucan fiber and complex carbs for sustained milk production.' },
      { name: 'Almond & Sesame Seeds (Til)', details: 'Dense in calcium, vitamin E, and healthy plant lipids.' },
      { name: 'Lentil Soups & Moong Dal', details: 'Hydrating, easily digested lean protein.' },
    ],
    foodsToAvoid: [
      { name: 'Excess Alcohol & Nicotine', reason: 'Passes into breast milk within 30 minutes, impairing infant sleep and neural development.' },
      { name: 'Strong Peppermint / Sage in Excess', reason: 'High concentrations have been observed to suppress breast milk supply.' },
      { name: 'Deep Fried / Excess Greasy Curries', reason: 'May cause maternal discomfort and infant colic.' },
    ],
    safeActivities: [
      { name: 'Postnatal Gentle Walking', duration: '20 - 30 mins', note: 'Boosts circulation, elevates mood, and aids gentle fat mobilization.' },
      { name: 'Postnatal Core & Pelvic Re-education', duration: '15 mins', note: 'Gentle transverse abdominis activation and pelvic floor lifts.' },
    ],
    activitiesToAvoid: [
      { name: 'Crash Dieting / Severe Calorie Restriction', reason: 'Reduces breast milk volume and drains maternal energy stores.' },
      { name: 'Heavy High-Impact Sprints early on', reason: 'Allows pelvic floor and ligaments sufficient time to heal.' },
    ],
    suggestedMeals: [
      { name: 'Lactation Breakfast: Methi Paratha with Fresh Curd', category: 'Breakfast', calories: 360, fat: 12, protein: 12, carbs: 50 },
      { name: 'Lactation Lunch: Dal Tadka with Steamed Rice & Ghee', category: 'Lunch', calories: 480, fat: 14, protein: 16, carbs: 72 },
      { name: 'Lactation Snack: Soaked Almonds with Warm Saffron Milk', category: 'Snack', calories: 210, fat: 11, protein: 9, carbs: 18 },
      { name: 'Lactation Dinner: Vegetable Dalia with Paneer Cubes', category: 'Dinner', calories: 380, fat: 10, protein: 16, carbs: 56 },
    ],
  },
  diabetes: {
    title: 'Type 2 / Gestational Diabetes Glycemic Protocol',
    icon: '🩸',
    badge: 'Glycemic Control',
    subtitle: 'Low Glycemic Index & Insulin Sensitivity Management',
    calorieAdjustment: 'Gentle Calorie Balance with Carb Moderation',
    waterTarget: '9 - 11 glasses (2.5 - 3.0 Liters / day)',
    coreNutrients: [
      { name: 'Soluble Fiber', target: '> 35 g/day', purpose: 'Forms a gel matrix in intestines, slowing glucose absorption and blunting spikes.' },
      { name: 'Chromium & Magnesium', target: 'Targeted', purpose: 'Essential mineral cofactors for GLUT-4 insulin receptor signaling.' },
      { name: 'Low Glycemic Index Foods (<55)', target: '100% of Meals', purpose: 'Prevents rapid postprandial glucose excursions.' },
    ],
    recommendedFoods: [
      { name: 'Methi (Fenugreek) Water on Empty Stomach', details: 'Contains 4-hydroxyisoleucine, which stimulates glucose-dependent insulin secretion.' },
      { name: 'Karela (Bitter Gourd) & Jamun Seed Powder', details: 'Contains charantin and polypeptide-p which act similarly to natural insulin.' },
      { name: 'Barley, Steel-cut Oats & Ragi', details: 'Complex, low-GI whole grains with sustained digestion rates.' },
      { name: 'Sprouted Chana & Green Moong', details: 'High protein-to-carb ratio that prevents sugar spikes.' },
    ],
    foodsToAvoid: [
      { name: 'Refined White Sugar & Jaggery', reason: 'High GI (>80) causing immediate severe blood glucose surges.' },
      { name: 'Fruit Juices & Colas (Liquid Sugar)', reason: 'Lacks fiber; liquid fructose and glucose rush directly into bloodstream.' },
      { name: 'Maida, White Bread & Bakery Goods', reason: 'Rapidly hydrolyzes into blood glucose within 15 minutes.' },
      { name: 'Deep-Fried Samosas / Pakoras', reason: 'High trans-fat combined with refined flour worsens insulin resistance.' },
    ],
    safeActivities: [
      { name: '15-Minute Post-Meal Walking', duration: '15 mins after Lunch/Dinner', note: 'Activates skeletal muscle glucose uptake independent of insulin!' },
      { name: 'Progressive Resistance Training', duration: '30 mins (3x/week)', note: 'Increases skeletal muscle mass, the body’s largest glucose reservoir.' },
    ],
    activitiesToAvoid: [
      { name: 'Prolonged Sedentary Sitting (> 2 hrs)', reason: 'Downregulates lipoprotein lipase and impairs insulin sensitivity.' },
      { name: 'Exercising During Hypoglycemia (< 70 mg/dL)', reason: 'Always check blood glucose; consume 15g fast carbs if low.' },
    ],
    suggestedMeals: [
      { name: 'Diabetic Breakfast: Sprouted Moong Cheela with Mint Chutney', category: 'Breakfast', calories: 260, fat: 6, protein: 14, carbs: 38 },
      { name: 'Diabetic Lunch: Mixed Veg Salad + 2 Missi Roti + Palak Dal', category: 'Lunch', calories: 390, fat: 10, protein: 18, carbs: 54 },
      { name: 'Diabetic Snack: Roasted Chana (Bengal Gram) + Green Tea', category: 'Snack', calories: 150, fat: 4, protein: 8, carbs: 22 },
      { name: 'Diabetic Dinner: Grilled Paneer/Tofu with Steamed Broccoli', category: 'Dinner', calories: 310, fat: 14, protein: 22, carbs: 16 },
    ],
  },
  hypertension: {
    title: 'Hypertension & Cardiovascular Health (DASH Protocol)',
    icon: '🫀',
    badge: 'Blood Pressure & Heart',
    subtitle: 'Dietary Approaches to Stop Hypertension & Vascular Protection',
    calorieAdjustment: 'Maintenance with Low Sodium Focus',
    waterTarget: '8 - 10 glasses (2.0 - 2.5 Liters / day)',
    coreNutrients: [
      { name: 'Low Dietary Sodium', target: '< 1,500 mg/day (< 1/2 tsp salt)', purpose: 'Reduces fluid retention and relieves hydrostatic arterial pressure.' },
      { name: 'Potassium', target: '3,500 - 4,700 mg/day', purpose: 'Causes vasodilation and promotes renal sodium excretion.' },
      { name: 'Magnesium', target: '400 mg/day', purpose: 'Relaxes smooth muscle lining of blood vessels.' },
    ],
    recommendedFoods: [
      { name: 'Tender Coconut Water', details: 'Natural powerhouse of bioavailable potassium to counteract excess sodium.' },
      { name: 'Bananas & Beetroot Juice', details: 'Rich in dietary nitrates that convert to nitric oxide, relaxing blood vessels.' },
      { name: 'Garlic (Allicin)', details: 'Clinically proven to stimulate hydrogen sulfide and nitric oxide production.' },
      { name: 'Unsalted Walnuts & Flaxseeds', details: 'Anti-inflammatory alpha-linolenic acid (ALA) protects arterial endothelium.' },
    ],
    foodsToAvoid: [
      { name: 'Pickles (Achaar) & Papad', reason: 'Extreme sodium density (often >1000mg per single serving).' },
      { name: 'Processed Meats & Canned Soups', reason: 'High hidden sodium chloride and preservative phosphates.' },
      { name: 'Soy Sauce, MSG & Commercial Sauces', reason: 'High sodium content causes acute arterial constriction.' },
      { name: 'Energy Drinks & Excessive Stimulants', reason: 'Triggers vasoconstriction and acute blood pressure elevation.' },
    ],
    safeActivities: [
      { name: 'Moderate Aerobic Brisk Walking', duration: '30 - 45 mins daily', note: 'Reduces resting systolic blood pressure by 5 - 8 mmHg.' },
      { name: 'Anulom Vilom & Deep Pranayama', duration: '15 mins daily', note: 'Activates parasympathetic nervous system, lowering heart rate.' },
    ],
    activitiesToAvoid: [
      { name: 'Heavy Isometric Straining (Valsalva)', reason: 'Holding breath during heavy lifts creates dangerous spikes in arterial BP.' },
    ],
    suggestedMeals: [
      { name: 'DASH Breakfast: Oatmeal with Sliced Banana & Flaxseed', category: 'Breakfast', calories: 290, fat: 6, protein: 9, carbs: 52 },
      { name: 'DASH Lunch: Brown Rice with Bottle Gourd (Lauki) & Dal', category: 'Lunch', calories: 380, fat: 7, protein: 14, carbs: 64 },
      { name: 'DASH Snack: Fresh Beetroot & Pomegranate Bowl', category: 'Snack', calories: 120, fat: 1, protein: 3, carbs: 26 },
      { name: 'DASH Dinner: Steamed Fish / Tofu with Stir-fry Spinach', category: 'Dinner', calories: 320, fat: 9, protein: 26, carbs: 18 },
    ],
  },
  pcos: {
    title: 'PCOS / PCOD Hormonal & Metabolic Protocol',
    icon: '🌸',
    badge: 'Hormonal Balance',
    subtitle: 'Addressing Androgen Excess, Insulin Resistance & Ovulatory Health',
    calorieAdjustment: 'Metabolic Balance with Anti-Inflammatory Focus',
    waterTarget: '9 - 11 glasses / day',
    coreNutrients: [
      { name: 'Myo-Inositol & D-Chiro-Inositol', target: 'Dietary Sources', purpose: 'Improves ovarian response to insulin and restores regular menstrual cycles.' },
      { name: 'Zinc & Magnesium', target: 'Daily', purpose: 'Reduces 5-alpha reductase activity, combating excess facial hair and acne.' },
      { name: 'Spearmint Tea', target: '2 cups/day', purpose: 'Clinically shown to reduce free testosterone levels in women with PCOS.' },
    ],
    recommendedFoods: [
      { name: 'Seed Cycling (Pumpkin & Flax in Follicular / Sunflower & Sesame in Luteal)', details: 'Provides essential lignans and zinc to balance estrogen and progesterone.' },
      { name: 'Cinnamon Infusion / Water', details: 'Improves insulin receptor phosphorylation and regulates menstrual cyclicity.' },
      { name: 'Avocado & Extra Virgin Olive Oil', details: 'Healthy monounsaturated fats that dampen systemic inflammation.' },
      { name: 'Leafy Greens & Broccoli', details: 'Contains DIM (Diindolylmethane) which supports healthy estrogen clearance.' },
    ],
    foodsToAvoid: [
      { name: 'High-Fructose Corn Syrup & Sugary Beverages', reason: 'Triggers hepatic de novo lipogenesis and worsens visceral fat.' },
      { name: 'Refined White Grains (Maida, White Bread)', reason: 'Causes high insulin spikes that signal ovaries to produce excess testosterone.' },
      { name: 'Inflammatory Dairy (if acne prone)', reason: 'Contains IGF-1 which can stimulate sebaceous glands and follicular inflammation.' },
    ],
    safeActivities: [
      { name: 'Strength & Hypertrophy Training', duration: '35 - 45 mins (3x/week)', note: 'Increases peripheral glucose clearance and lowers androgen index.' },
      { name: 'Low-Impact Steady State (LISS) Walking', duration: '8,000 - 10,000 steps', note: 'Reduces cortisol levels without exhausting adrenal reserves.' },
    ],
    activitiesToAvoid: [
      { name: 'Excessive Chronic Exhaustive Cardio', reason: 'Chronically elevates cortisol, which can worsen ovulatory disruption.' },
    ],
    suggestedMeals: [
      { name: 'PCOS Breakfast: Chia & Flax Seed Pudding with Berries', category: 'Breakfast', calories: 270, fat: 12, protein: 10, carbs: 28 },
      { name: 'PCOS Lunch: Quinoa Salad with Chickpeas & Greens', category: 'Lunch', calories: 390, fat: 10, protein: 16, carbs: 58 },
      { name: 'PCOS Snack: 2 Cups Spearmint Tea + Roasted Pumpkin Seeds', category: 'Snack', calories: 130, fat: 8, protein: 6, carbs: 6 },
      { name: 'PCOS Dinner: Grilled Paneer Tikka with Sautéed Veggies', category: 'Dinner', calories: 340, fat: 16, protein: 20, carbs: 18 },
    ],
  },
  none: {
    title: 'General Optimal Health & Longevity Protocol',
    icon: '🌿',
    badge: 'Whole Body Wellness',
    subtitle: 'Balanced Micronutrients, Lean Protein & Sustainable Vitality',
    calorieAdjustment: 'Calibrated to your Mifflin-St Jeor TDEE',
    waterTarget: '8 - 10 glasses (2.0 - 2.5 Liters / day)',
    coreNutrients: [
      { name: 'Balanced Protein', target: '1.2 - 1.6 g/kg body weight', purpose: 'Maintains lean muscle mass and promotes satiety.' },
      { name: 'Dietary Fiber', target: '28 - 35 g/day', purpose: 'Nurtures gut microbiome and regulates cholesterol.' },
      { name: 'Antioxidants & Polyphenols', target: 'Rainbow of Colors', purpose: 'Neutralizes free radicals and mitigates cellular aging.' },
    ],
    recommendedFoods: [
      { name: 'Rainbow Salad (Carrots, Cucumbers, Tomatoes, Greens)', details: 'Broad spectrum carotenoids, lycopene, and vitamin C.' },
      { name: 'Dal & Legumes (Chana, Rajma, Moong)', details: 'Plant protein paired with slow-burning complex carbs.' },
      { name: 'Seasonal Whole Fruits', details: 'Natural hydration, vitamins, and pectin fiber.' },
    ],
    foodsToAvoid: [
      { name: 'Ultra-Processed Packaged Snacks', reason: 'High in industrial seed oils, excess sodium, and empty calories.' },
      { name: 'Sugary Carbonated Sodas', reason: 'Drives rapid insulin spikes and hepatic lipid accumulation.' },
    ],
    safeActivities: [
      { name: 'Moderate Daily Movement', duration: '30 - 45 mins', note: 'Mix of walking, cycling, or swimming for cardiorespiratory fitness.' },
      { name: 'Full Body Resistance Training', duration: '2 - 3x per week', note: 'Preserves bone mineral density and muscle mass.' },
    ],
    activitiesToAvoid: [
      { name: 'Sedentary Lifestyle (>8 hours motionless)', reason: 'Increases all-cause metabolic risk factors.' },
    ],
    suggestedMeals: [
      { name: 'Wellness Breakfast: Oats with Almonds & Banana', category: 'Breakfast', calories: 310, fat: 7, protein: 10, carbs: 54 },
      { name: 'Wellness Lunch: Dal Tadka with 2 Rotis & Salad', category: 'Lunch', calories: 410, fat: 9, protein: 15, carbs: 65 },
      { name: 'Wellness Snack: Fresh Fruit Bowl with Chia Seeds', category: 'Snack', calories: 140, fat: 2, protein: 3, carbs: 28 },
      { name: 'Wellness Dinner: Paneer / Tofu Curry with Brown Rice', category: 'Dinner', calories: 420, fat: 14, protein: 20, carbs: 52 },
    ],
  },
};

export default function MedicalHealth({ onDirectAddMeal }) {
  const [currentCondition, setCurrentCondition] = useState('none');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [loggedMealNotice, setLoggedMealNotice] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        if (data) {
          setProfile(data);
          setCurrentCondition(data.medicalCondition || 'none');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleConditionChange(cond) {
    setCurrentCondition(cond);
    setSaving(true);
    setNotice('');
    try {
      const updated = await updateProfile({ medicalCondition: cond });
      setProfile(updated);
      setNotice(`Health condition updated to ${cond.toUpperCase()}. Your entire diet, calorie targets & activities are now tailored for this condition!`);
      window.dispatchEvent(new CustomEvent('nutrivibe-profile-updated'));
    } catch (err) {
      console.error('Failed to update condition:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickAddMeal(meal) {
    if (!onDirectAddMeal) return;
    try {
      await onDirectAddMeal({
        name: meal.name,
        category: meal.category,
        calories: meal.calories,
        fat: meal.fat,
        protein: meal.protein,
        carbs: meal.carbs,
        consumedAt: new Date().toISOString(),
      });
      setLoggedMealNotice(`Added "${meal.name}" (${meal.calories} kcal, ${meal.fat}g fat) to today's tracker!`);
      setTimeout(() => setLoggedMealNotice(''), 4000);
    } catch (err) {
      console.error('Could not add meal:', err);
    }
  }

  const activeProtocol = MEDICAL_PROTOCOLS[currentCondition] || MEDICAL_PROTOCOLS.none;

  if (loading) {
    return <div className="medical-loading"><p>Loading personal medical health protocol...</p></div>;
  }

  return (
    <div className="medical-container">
      {/* Header */}
      <header className="medical-header">
        <div className="medical-header-left">
          <div className="medical-icon-circle">
            <Heart size={26} />
          </div>
          <div>
            <div className="med-badge">
              <ShieldCheck size={14} />
              <span>Evidence-Based Clinical Nutrition</span>
            </div>
            <h2>Personalized Medical Health & Life Stages</h2>
            <p>
              Recommendations are dynamically customized for your condition (Pregnancy, Lactation, Diabetes, etc.) so your nutrition and exercises are 100% unique to you.
            </p>
          </div>
        </div>
      </header>

      {/* Notice Banner */}
      {notice && (
        <div className="medical-notice-banner">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      {loggedMealNotice && (
        <div className="medical-notice-banner success">
          <CheckCircle2 size={18} />
          <span>{loggedMealNotice}</span>
        </div>
      )}

      {/* CONDITION SWITCHER SELECTOR TABS */}
      <section className="condition-selector-section">
        <h3>Choose Your Condition / Life Stage:</h3>
        <div className="condition-chips-grid">
          {[
            { id: 'none', label: '🌿 General Health' },
            { id: 'pregnancy', label: '🤰 Pregnancy (Trimester 1, 2, 3)' },
            { id: 'lactation', label: '🤱 Lactation / Nursing Mother' },
            { id: 'diabetes', label: '🩸 Diabetes / Insulin Resistance' },
            { id: 'hypertension', label: '🫀 Hypertension (High BP)' },
            { id: 'pcos', label: '🌸 PCOS / PCOD Care' },
          ].map((cond) => (
            <button
              key={cond.id}
              type="button"
              className={`condition-chip-btn ${currentCondition === cond.id ? 'active' : ''}`}
              onClick={() => handleConditionChange(cond.id)}
              disabled={saving}
            >
              <span>{cond.label}</span>
              {currentCondition === cond.id && <CheckCircle2 size={16} className="active-check" />}
            </button>
          ))}
        </div>
      </section>

      {/* ACTIVE CLINICAL PROTOCOL HERO CARD */}
      <section className="protocol-hero-card">
        <div className="protocol-hero-top">
          <div className="hero-title-area">
            <span className="protocol-emoji">{activeProtocol.icon}</span>
            <div>
              <span className="protocol-pill-tag">{activeProtocol.badge}</span>
              <h2>{activeProtocol.title}</h2>
              <p>{activeProtocol.subtitle}</p>
            </div>
          </div>
          <div className="hero-metric-badges">
            <div className="metric-badge cal-badge">
              <Flame size={16} />
              <div>
                <small>Calorie Adjustment</small>
                <strong>{activeProtocol.calorieAdjustment}</strong>
              </div>
            </div>
            <div className="metric-badge water-badge">
              <Droplets size={16} />
              <div>
                <small>Hydration Target</small>
                <strong>{activeProtocol.waterTarget}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Micronutrient Targets */}
        <div className="core-nutrients-section">
          <h4>Essential Clinical Targets for this Condition:</h4>
          <div className="nutrient-grid">
            {activeProtocol.coreNutrients.map((item) => (
              <div key={item.name} className="nutrient-card">
                <div className="nutrient-top">
                  <strong>{item.name}</strong>
                  <span className="nutrient-target">{item.target}</span>
                </div>
                <p>{item.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO COLUMN GRID: FOODS TO EAT VS FOODS TO AVOID */}
      <div className="diet-guidance-grid">
        {/* DO: Recommended Foods */}
        <section className="guidance-card green-card">
          <div className="card-header">
            <div className="header-icon green">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3>Recommended Foods to Include</h3>
              <p>Nutrient-dense staples that support this health condition</p>
            </div>
          </div>
          <ul className="guidance-list">
            {activeProtocol.recommendedFoods.map((food) => (
              <li key={food.name} className="guidance-item">
                <div className="item-title-row">
                  <span className="item-dot green" />
                  <strong>{food.name}</strong>
                </div>
                <p>{food.details}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* DON'T: Foods to Avoid */}
        <section className="guidance-card red-card">
          <div className="card-header">
            <div className="header-icon red">
              <XCircle size={20} />
            </div>
            <div>
              <h3>Foods to Strictly Avoid / Minimize</h3>
              <p>Potential risks, contraindications or adverse metabolic triggers</p>
            </div>
          </div>
          <ul className="guidance-list">
            {activeProtocol.foodsToAvoid.map((food) => (
              <li key={food.name} className="guidance-item">
                <div className="item-title-row">
                  <span className="item-dot red" />
                  <strong>{food.name}</strong>
                </div>
                <p>{food.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* PHYSICAL ACTIVITY & EXERCISE GUIDANCE */}
      <section className="activity-guidance-section">
        <div className="section-title-wrap">
          <Activity size={22} className="act-icon" />
          <div>
            <h3>Personalized Physical Activity & Safe Workouts</h3>
            <p>Exercises specifically verified for {activeProtocol.title}</p>
          </div>
        </div>

        <div className="activity-columns-grid">
          {/* SAFE WORKOUTS */}
          <div className="activity-column safe-col">
            <div className="col-top">
              <CheckCircle2 size={18} />
              <h4>Safe & Recommended Activities</h4>
            </div>
            <div className="workout-cards-wrap">
              {activeProtocol.safeActivities.map((act) => (
                <div key={act.name} className="workout-card safe">
                  <div className="workout-card-top">
                    <strong>{act.name}</strong>
                    <span className="time-badge">{act.duration}</span>
                  </div>
                  <p>{act.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WORKOUTS TO AVOID */}
          <div className="activity-column avoid-col">
            <div className="col-top">
              <XCircle size={18} />
              <h4>Exercises to Avoid / High Risk</h4>
            </div>
            <div className="workout-cards-wrap">
              {activeProtocol.activitiesToAvoid.map((act) => (
                <div key={act.name} className="workout-card avoid">
                  <div className="workout-card-top">
                    <strong>{act.name}</strong>
                    <span className="warn-badge">Avoid</span>
                  </div>
                  <p>{act.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONDITION-SPECIFIC 4-MEAL BLUEPRINT WITH 1-CLICK ADD */}
      <section className="suggested-blueprint-section">
        <div className="section-title-wrap">
          <Utensils size={22} className="utensil-icon" />
          <div>
            <h3>Suggested Daily Meals for {activeProtocol.title}</h3>
            <p>Click any meal to log it directly into today's calorie & fat tracker</p>
          </div>
        </div>

        <div className="blueprint-cards-grid">
          {activeProtocol.suggestedMeals.map((meal) => (
            <div key={meal.name} className="blueprint-meal-card">
              <div className="meal-card-top">
                <span className="category-pill">{meal.category}</span>
                <span className="cal-tag">{meal.calories} kcal</span>
              </div>
              <h4>{meal.name}</h4>
              <div className="meal-macro-row">
                <span>Fat: <strong>{meal.fat}g</strong></span>
                <span>Protein: <strong>{meal.protein}g</strong></span>
                <span>Carbs: <strong>{meal.carbs}g</strong></span>
              </div>
              <button
                type="button"
                className="btn-quick-add-med-meal"
                onClick={() => handleQuickAddMeal(meal)}
              >
                <Plus size={15} /> Add to Today's Tracker
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
