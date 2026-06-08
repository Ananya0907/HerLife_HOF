'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Apple, 
  Dumbbell,
  BookOpen,
  FileText,
  Droplet,
  Activity,
  Sparkles,
  Scale,
  Calendar,
  AlertTriangle,
  X,
  Plus,
  Minus,
  Check,
  ClipboardList,
  Baby,
  Moon
} from 'lucide-react';
import styles from './PregnantLog.module.css';
import UserMenu from '../shared/UserMenu';
import { API_BASE_URL } from '@/utils/api';

const symptomLabels: Record<string, string> = {
  nausea: 'Nausea',
  vomiting: 'Vomiting',
  fatigue: 'Fatigue',
  backPain: 'Back pain',
  pelvicPain: 'Pelvic pain',
  headache: 'Headache',
  swelling: 'Swelling in hands/feet',
  heartburn: 'Heartburn',
  constipation: 'Constipation',
  dizziness: 'Dizziness',
  shortnessOfBreath: 'Shortness of breath'
};

export default function PregnantLogPage() {
  const router = useRouter();

  // Basic Daily Check-in
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(18);
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');

  // Symptoms (0–10 sliders)
  const [symptoms, setSymptoms] = useState({
    nausea: 0,
    vomiting: 0,
    fatigue: 0,
    backPain: 0,
    pelvicPain: 0,
    headache: 0,
    swelling: 0,
    heartburn: 0,
    constipation: 0,
    dizziness: 0,
    shortnessOfBreath: 0
  });

  // Baby Activity
  const [feltMovement, setFeltMovement] = useState<boolean>(true);
  const [kickCount, setKickCount] = useState('');
  const [movementType, setMovementType] = useState<'Normal' | 'More' | 'Less'>('Normal');

  // Sleep
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<'Poor' | 'Fair' | 'Good' | 'Excellent'>('Good');

  // Nutrition & Hydration
  const [water, setWater] = useState(8);
  const [meals, setMeals] = useState(3);
  const [tookVitamins, setTookVitamins] = useState<boolean>(true);
  const [avoidedCravings, setAvoidedCravings] = useState('');

  // Mental Well-Being
  const [mood, setMood] = useState<'Happy' | 'Neutral' | 'Sad' | 'Anxious'>('Happy');
  const [stress, setStress] = useState<number>(3);
  const [emotionalNotes, setEmotionalNotes] = useState('');

  // Physical Activity
  const [exercise, setExercise] = useState<boolean>(false);
  const [activityType, setActivityType] = useState('');
  const [activityDuration, setActivityDuration] = useState('');

  // Medical Concerns
  const [bleeding, setBleeding] = useState<boolean>(false);
  const [fluidLeakage, setFluidLeakage] = useState<boolean>(false);
  const [contractions, setContractions] = useState<boolean>(false);
  const [unusualSymptoms, setUnusualSymptoms] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  // History & Report states
  const [history, setHistory] = useState<any[]>([]);
  const [showReport, setShowReport] = useState(false);

  const loadHistoryAndStats = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user-profile/${userId}`);
      const data = await res.json();
      if (!data.error) {
        // Pre-fill weight with current weight from user profile if not set yet
        if (data.user?.weight_kg) {
          setWeight(String(data.user.weight_kg));
        }

        // Calculate dynamic current week of pregnancy
        const startDateStr = data.health?.model_symptoms?.pregnancy_start_date;
        if (startDateStr) {
          const start = new Date(startDateStr);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          let weekVal = Math.floor(diffDays / 7);
          if (weekVal < 1) weekVal = 1;
          if (weekVal > 40) weekVal = 40;
          setPregnancyWeek(weekVal);
        }

        // Load pregnancy history
        const logs = data.health?.model_symptoms?.pregnancy_logs || [];
        setHistory(logs);
      }
    } catch (e) {
      console.error("Failed to load user profile or logging history:", e);
    }
  };

  useEffect(() => {
    loadHistoryAndStats();
  }, []);

  const handleWaterAdd = () => {
    if (water < 12) setWater(water + 1);
  };

  const handleWaterRemove = () => {
    if (water > 0) setWater(water - 1);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      const moodScoreMap = { 'Happy': 5, 'Neutral': 3, 'Anxious': 2, 'Sad': 1 };
      const moodNum = moodScoreMap[mood] || 3;

      const payload = {
        user_id: userId,
        mood: moodNum,
        mood_label: mood,
        sleep_quality: sleepQuality === 'Excellent' ? 5 : sleepQuality === 'Good' ? 4 : sleepQuality === 'Fair' ? 3 : 1,
        water_glasses: water,
        energy_level: symptoms.fatigue > 6 ? 'Low' : symptoms.fatigue > 3 ? 'Medium' : 'High',
        weight_kg: weight ? parseFloat(weight) : undefined,
        pregnancy_week_start: pregnancyWeek,
        
        // Save full set of questions under model_symptoms by passing extra keys
        kick_count: feltMovement && kickCount ? parseInt(kickCount) : 0,
        nausea_level: symptoms.nausea > 7 ? 'Severe' : symptoms.nausea > 3 ? 'Moderate' : symptoms.nausea > 0 ? 'Mild' : 'None',
        back_pain: symptoms.backPain > 7 ? 'Severe' : symptoms.backPain > 3 ? 'Moderate' : symptoms.backPain > 0 ? 'Mild' : 'None',
        swelling: symptoms.swelling > 7 ? 'Severe' : symptoms.swelling > 3 ? 'Moderate' : symptoms.swelling > 0 ? 'Mild' : 'None',
        heartburn: symptoms.heartburn > 7 ? 'Severe' : symptoms.heartburn > 3 ? 'Moderate' : symptoms.heartburn > 0 ? 'Mild' : 'None',
        exercise: exercise ? 'Yes' : 'No',
        
        // Pregnancy logs history payload elements
        bp: bp,
        symptoms: symptoms,
        felt_movement: feltMovement ? 'Yes' : 'No',
        movement_type: movementType,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : undefined,
        sleep_rating: sleepQuality,
        meals_count: meals,
        took_vitamins: tookVitamins ? 'Yes' : 'No',
        avoided_cravings: avoidedCravings,
        stress_score: stress,
        emotional_notes: emotionalNotes,
        activity_type: activityType,
        activity_duration: activityDuration ? parseInt(activityDuration) : undefined,
        bleeding: bleeding ? 'Yes' : 'No',
        fluid_leakage: fluidLeakage ? 'Yes' : 'No',
        contractions: contractions ? 'Yes' : 'No',
        unusual_symptoms: unusualSymptoms,
        notes: notes
      };

      const response = await fetch(`${API_BASE_URL}/api/daily-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Daily log saved successfully!");
        setNotes('');
        setKickCount('');
        setAvoidedCravings('');
        setEmotionalNotes('');
        setActivityType('');
        setActivityDuration('');
        setUnusualSymptoms('');
        setSymptoms({
          nausea: 0,
          vomiting: 0,
          fatigue: 0,
          backPain: 0,
          pelvicPain: 0,
          headache: 0,
          swelling: 0,
          heartburn: 0,
          constipation: 0,
          dizziness: 0,
          shortnessOfBreath: 0
        });
        loadHistoryAndStats(); // Reload history
      } else {
        alert("Failed to save log. Please try again.");
      }
    } catch (e) {
      console.error("Failed to save daily log:", e);
      alert("Error saving daily log.");
    }
  };

  const handleDeleteLog = async (logDate: string) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    if (!confirm(`Are you sure you want to delete the daily log for ${formatDate(logDate)}?`)) return;

    try {
      const updatedHistory = history.filter(item => item.date !== logDate);
      
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          pregnancy_logs: updatedHistory
        })
      });

      if (response.ok) {
        alert("Log deleted successfully!");
        loadHistoryAndStats();
      } else {
        alert("Failed to delete log.");
      }
    } catch (e) {
      console.error("Failed to delete log:", e);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSymptomChange = (key: keyof typeof symptoms, value: number) => {
    setSymptoms(prev => ({ ...prev, [key]: value }));
  };

  // Report Generator aggregation logic
  const averageSleep = history.length 
    ? (history.reduce((sum, item) => sum + (item.sleep_hours || 0), 0) / history.filter(item => item.sleep_hours !== undefined).length || 8).toFixed(1)
    : '8.0';

  const averageWater = history.length
    ? (history.reduce((sum, item) => sum + (item.water_glasses || 0), 0) / history.length).toFixed(1)
    : '8.0';

  const exerciseCount = history.filter(item => item.exercise === 'Yes').length;

  const weightTrend = history.length >= 2 
    ? (parseFloat(history[0].weight_kg || 0) - parseFloat(history[history.length - 1].weight_kg || 0)).toFixed(1)
    : '0.0';

  // Check for risk alerts
  const riskAlerts: { date: string; message: string }[] = [];
  history.forEach(item => {
    if (item.bleeding === 'Yes') {
      riskAlerts.push({ date: item.date, message: "⚠️ Vaginal bleeding reported." });
    }
    if (item.fluid_leakage === 'Yes') {
      riskAlerts.push({ date: item.date, message: "⚠️ Fluid leakage reported." });
    }
    if (item.contractions === 'Yes') {
      riskAlerts.push({ date: item.date, message: "⚠️ Contractions / labor pains reported." });
    }
    if (item.symptoms?.headache >= 7) {
      riskAlerts.push({ date: item.date, message: `⚠️ Severe headache reported (Rating: ${item.symptoms.headache}/10).` });
    }
    if (item.felt_movement === 'No') {
      riskAlerts.push({ date: item.date, message: "⚠️ Reduced fetal movement (No baby movements felt today)." });
    }
    if (item.felt_movement === 'Yes' && item.kick_count !== undefined && item.kick_count > 0 && item.kick_count < 6) {
      riskAlerts.push({ date: item.date, message: `⚠️ Reduced fetal movements (only ${item.kick_count} kicks counted in 1hr).` });
    }
    // BP check
    if (item.bp) {
      const parts = item.bp.split('/');
      if (parts.length === 2) {
        const sys = parseInt(parts[0]);
        const dia = parseInt(parts[1]);
        if (sys >= 140 || dia >= 90) {
          riskAlerts.push({ date: item.date, message: `⚠️ High blood pressure reading: ${item.bp} mmHg.` });
        }
      }
    }
  });

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Heart fill="currentColor" color="var(--primary)" size={28} />
          HerLife
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push('/dashboard/pregnant')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/nutrition')}>
            <Apple size={20} /> Nutrition
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/exercise')}>
            <Dumbbell size={20} /> Exercise
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/learn')}>
            <BookOpen size={20} /> Learn
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => {}}>
            <FileText size={20} /> Daily Log
          </button>
          <UserMenu />
        </div>
      </nav>

      <main className={styles.content}>
        
        {/* Header Card */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`} style={{ marginBottom: '0.25rem' }}>
              <FileText size={28} color="var(--primary)" /> Pregnancy Daily Log
            </div>
            <div className={styles.heroDesc}>
              Track your vitals, baby kicks, and pregnancy symptoms.
            </div>
          </div>
          <button className={styles.reportBtn} onClick={() => setShowReport(true)}>
            Generate Health Report 📊
          </button>
        </div>

        {/* Basic Daily Check-In */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Scale size={24} color="var(--primary)" /> 1. Vitals & Basic Check-In
          </div>
          <div className={styles.inputGrid}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Date</label>
              <input 
                type="text" 
                className={styles.logNumInput} 
                value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                disabled
              />
            </div>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Current Week of Pregnancy</label>
              <input 
                type="number" 
                className={styles.logNumInput} 
                value={pregnancyWeek}
                onChange={e => setPregnancyWeek(parseInt(e.target.value) || 18)}
              />
            </div>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Weight (kg) - Optional</label>
              <input 
                type="number" 
                className={styles.logNumInput} 
                placeholder="e.g. 62.5" 
                value={weight}
                onChange={e => setWeight(e.target.value)}
              />
            </div>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Blood Pressure (mmHg) - Optional</label>
              <input 
                type="text" 
                className={styles.logNumInput} 
                placeholder="e.g. 120/80" 
                value={bp}
                onChange={e => setBp(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Symptoms 0-10 Sliders */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Activity size={24} color="var(--primary)" /> 2. Symptoms Tracker (Rate 0 to 10)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            {(Object.keys(symptoms) as Array<keyof typeof symptoms>).map(sym => (
              <div key={sym} className={styles.symptomRow}>
                <span className={styles.symptomRowLabel}>
                  {symptomLabels[sym] || sym}
                </span>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  className={styles.rangeInput}
                  value={symptoms[sym]}
                  onChange={e => handleSymptomChange(sym, parseInt(e.target.value))}
                />
                <span className={styles.rangeVal}>{symptoms[sym]}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* Baby Activity */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Baby size={24} color="var(--primary)" /> 3. Baby Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Did you feel the baby move today?</label>
              <div className={styles.optionsFlex}>
                <button className={`${styles.pillBtn} ${feltMovement ? styles.pillBtnActive : ''}`} onClick={() => setFeltMovement(true)}>Yes</button>
                <button className={`${styles.pillBtn} ${!feltMovement ? styles.pillBtnActive : ''}`} onClick={() => setFeltMovement(false)}>No</button>
              </div>
            </div>

            {feltMovement && (
              <>
                <div className={styles.logInputItem}>
                  <label className={styles.inputLabel}>Approximate number of movements (kicks counted in 1 hour)</label>
                  <input 
                    type="number" 
                    className={styles.logNumInput} 
                    placeholder="e.g. 10" 
                    value={kickCount}
                    onChange={e => setKickCount(e.target.value)}
                  />
                </div>
                <div className={styles.logInputItem}>
                  <label className={styles.inputLabel}>Movements compared to usual</label>
                  <div className={styles.optionsFlex}>
                    {(['Normal', 'More', 'Less'] as const).map(type => (
                      <button
                        key={type}
                        className={`${styles.pillBtn} ${movementType === type ? styles.pillBtnActive : ''}`}
                        onClick={() => setMovementType(type)}
                      >
                        {type === 'More' ? '🚀 More than usual' : type === 'Less' ? '⚠️ Less than usual' : '✅ Normal'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sleep tracker */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Moon size={24} color="var(--primary)" /> 4. Sleep check
          </div>
          <div className={styles.inputGrid}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Hours slept last night</label>
              <input 
                type="number" 
                className={styles.logNumInput} 
                placeholder="e.g. 8" 
                value={sleepHours}
                onChange={e => setSleepHours(e.target.value)}
              />
            </div>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Sleep Quality</label>
              <div className={styles.optionsFlex}>
                {(['Poor', 'Fair', 'Good', 'Excellent'] as const).map(opt => (
                  <button
                    key={opt}
                    className={`${styles.pillBtn} ${sleepQuality === opt ? styles.pillBtnActive : ''}`}
                    onClick={() => setSleepQuality(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hydration & Nutrition */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Droplet size={24} color="var(--primary)" /> 5. Hydration & Nutrition
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className={styles.waterTrackerCard}>
              <div className={styles.waterCount}>{water} / 12 glasses</div>
              <div className={styles.waterBarBg}>
                <div className={styles.waterBarFill} style={{ width: `${(water / 12) * 100}%` }}></div>
              </div>
              <div className={styles.waterActions}>
                <button className={styles.waterBtnAdd} onClick={handleWaterAdd}>+ Add Glass</button>
                <button className={styles.waterBtnRemove} onClick={handleWaterRemove}>- Remove</button>
              </div>
            </div>

            <div className={styles.inputGrid}>
              <div className={styles.logInputItem}>
                <label className={styles.inputLabel}>Number of meals eaten today</label>
                <div className={styles.optionsFlex}>
                  {[1, 2, 3, 4, 5].map(m => (
                    <button key={m} className={`${styles.pillBtn} ${meals === m ? styles.pillBtnActive : ''}`} onClick={() => setMeals(m)}>{m}</button>
                  ))}
                </div>
              </div>
              
              <div className={styles.logInputItem}>
                <label className={styles.inputLabel}>Took prenatal vitamins?</label>
                <div className={styles.optionsFlex}>
                  <button className={`${styles.pillBtn} ${tookVitamins ? styles.pillBtnActive : ''}`} onClick={() => setTookVitamins(true)}>Yes</button>
                  <button className={`${styles.pillBtn} ${!tookVitamins ? styles.pillBtnActive : ''}`} onClick={() => setTookVitamins(false)}>No</button>
                </div>
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Food Cravings / Avoided Foods</label>
              <input 
                type="text" 
                className={styles.logNumInput} 
                placeholder="e.g. Craving citrus fruits, avoided coffee" 
                value={avoidedCravings}
                onChange={e => setAvoidedCravings(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mental Well-Being */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Heart size={24} color="var(--primary)" /> 6. Mental Well-Being
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Mood today</label>
              <div className={styles.optionsFlex}>
                {(['Happy', 'Neutral', 'Sad', 'Anxious'] as const).map(opt => (
                  <button
                    key={opt}
                    className={`${styles.pillBtn} ${mood === opt ? styles.pillBtnActive : ''}`}
                    onClick={() => setMood(opt)}
                  >
                    {opt === 'Happy' ? '😊 Happy' : opt === 'Neutral' ? '😐 Neutral' : opt === 'Sad' ? '😢 Sad' : '😰 Anxious'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Stress Level (1 - 10)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  className={styles.rangeInput}
                  value={stress}
                  onChange={e => setStress(parseInt(e.target.value))}
                />
                <span className={styles.rangeVal}>{stress}/10</span>
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Notes about emotional state</label>
              <input 
                type="text" 
                className={styles.logNumInput} 
                placeholder="Feeling slightly excited, nested today..." 
                value={emotionalNotes}
                onChange={e => setEmotionalNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Physical Activity */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Dumbbell size={24} color="var(--primary)" /> 7. Physical Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Did you exercise today?</label>
              <div className={styles.optionsFlex}>
                <button className={`${styles.pillBtn} ${exercise ? styles.pillBtnActive : ''}`} onClick={() => setExercise(true)}>Yes</button>
                <button className={`${styles.pillBtn} ${!exercise ? styles.pillBtnActive : ''}`} onClick={() => setExercise(false)}>No</button>
              </div>
            </div>

            {exercise && (
              <div className={styles.inputGrid}>
                <div className={styles.logInputItem}>
                  <label className={styles.inputLabel}>Type of activity</label>
                  <input 
                    type="text" 
                    className={styles.logNumInput} 
                    placeholder="e.g. Walking, Prenatal Yoga" 
                    value={activityType}
                    onChange={e => setActivityType(e.target.value)}
                  />
                </div>
                <div className={styles.logInputItem}>
                  <label className={styles.inputLabel}>Duration (minutes)</label>
                  <input 
                    type="number" 
                    className={styles.logNumInput} 
                    placeholder="e.g. 30" 
                    value={activityDuration}
                    onChange={e => setActivityDuration(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medical Concerns */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`} style={{ color: '#DC2626' }}>
            <AlertTriangle size={24} color="#DC2626" /> 8. Medical Concerns & Safety
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Any spot bleeding / vaginal discharge?</label>
              <div className={styles.optionsFlex}>
                <button className={`${styles.pillBtn} ${bleeding ? styles.pillBtnActive : ''}`} onClick={() => setBleeding(true)}>Yes</button>
                <button className={`${styles.pillBtn} ${!bleeding ? styles.pillBtnActive : ''}`} onClick={() => setBleeding(false)}>No</button>
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Any fluid leakage?</label>
              <div className={styles.optionsFlex}>
                <button className={`${styles.pillBtn} ${fluidLeakage ? styles.pillBtnActive : ''}`} onClick={() => setFluidLeakage(true)}>Yes</button>
                <button className={`${styles.pillBtn} ${!fluidLeakage ? styles.pillBtnActive : ''}`} onClick={() => setFluidLeakage(false)}>No</button>
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Any contractions or labor pain?</label>
              <div className={styles.optionsFlex}>
                <button className={`${styles.pillBtn} ${contractions ? styles.pillBtnActive : ''}`} onClick={() => setContractions(true)}>Yes</button>
                <button className={`${styles.pillBtn} ${!contractions ? styles.pillBtnActive : ''}`} onClick={() => setContractions(false)}>No</button>
              </div>
            </div>

            <div className={styles.logInputItem}>
              <label className={styles.inputLabel}>Any other unusual symptoms?</label>
              <input 
                type="text" 
                className={styles.logNumInput} 
                placeholder="e.g. Severe blurred vision, sudden swelling" 
                value={unusualSymptoms}
                onChange={e => setUnusualSymptoms(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Generic Notes */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitleDark}`}>
            <ClipboardList size={24} /> 9. Daily Notes
          </div>
          <textarea 
            className={styles.notesArea}
            placeholder="Anything else you'd like to record today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Save Button */}
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Today's Log
        </button>

        {/* Historical Logs List */}
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>
            <Calendar size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'bottom' }} /> Logging History
          </div>
          
          {history.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center', color: '#9CA3AF' }}>
              No pregnancy logs registered yet. Submit your first log above!
            </div>
          ) : (
            <div className={styles.historyList}>
              {history.map((item, idx) => (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyItemHeader}>
                    <div className={styles.historyItemDate}>{formatDate(item.date)}</div>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteLog(item.date)}>
                      Delete Log
                    </button>
                  </div>
                  
                  <div className={styles.historyGrid}>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>Week</span>
                      <span className={styles.historyGridVal}>Week {item.pregnancy_week_start || pregnancyWeek}</span>
                    </div>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>Weight</span>
                      <span className={styles.historyGridVal}>{item.weight_kg ? `${item.weight_kg} kg` : '—'}</span>
                    </div>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>BP</span>
                      <span className={styles.historyGridVal}>{item.bp || '—'}</span>
                    </div>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>Mood</span>
                      <span className={styles.historyGridVal}>{item.mood || 'Neutral'}</span>
                    </div>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>Baby Movt</span>
                      <span className={styles.historyGridVal}>{item.kick_count ? `${item.kick_count} kicks` : 'None'}</span>
                    </div>
                    <div className={styles.historyGridItem}>
                      <span className={styles.historyGridLabel}>Hydration</span>
                      <span className={styles.historyGridVal}>{item.water_glasses ? `${item.water_glasses} glasses` : '—'}</span>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className={styles.historyNotes}>
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Pregnancy Health Report Modal */}
      {showReport && (
        <div className={styles.reportOverlay} onClick={() => setShowReport(false)}>
          <div className={styles.reportContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowReport(false)}>
              <X size={20} />
            </button>

            <div className={styles.modalHeader} style={{ textAlign: 'left', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                📊 Pregnancy Health Report
              </h2>
              <p>Generated automatically based on your daily logs history.</p>
            </div>

            {/* Risk Alert Section */}
            {riskAlerts.length > 0 ? (
              <div className={styles.alertBox}>
                <div className={styles.alertBoxTitle}>
                  <AlertTriangle size={20} /> Attention: Risk Alerts Detected
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {riskAlerts.map((alert, idx) => (
                    <div key={idx} className={styles.alertItem}>
                      <strong>{formatDate(alert.date)}</strong>: {alert.message}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginTop: '0.75rem', fontWeight: 600 }}>
                  * Please share this report with your OB/GYN doctor. If bleeding or contractions occur repeatedly, contact emergency care.
                </p>
              </div>
            ) : (
              <div className={styles.alertBox} style={{ backgroundColor: '#F0FDF4', borderLeft: '5px solid #22C55E', border: '1px solid #DCFCE7' }}>
                <div className={styles.alertBoxTitle} style={{ color: '#166534' }}>
                  <Check size={20} color="#166534" /> Clean Health Bill
                </div>
                <p style={{ color: '#15803D', margin: 0, fontSize: '0.95rem' }}>
                  No severe headache, bleeding, fluid leakage, contractions, or low kick count issues recorded.
                </p>
              </div>
            )}

            {/* Averages & Stats Grid */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1F2937' }}>Weekly / Monthly Aggregates</h3>
            <div className={styles.grid3}>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>{weightTrend} kg</div>
                <div className={styles.reportStatLabel}>Weight Trend</div>
              </div>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>{averageSleep} hrs</div>
                <div className={styles.reportStatLabel}>Sleep Average</div>
              </div>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>{averageWater} glasses</div>
                <div className={styles.reportStatLabel}>Water Average</div>
              </div>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>{exerciseCount} days</div>
                <div className={styles.reportStatLabel}>Exercise Days</div>
              </div>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>
                  {history.length ? `${((history.filter(i => i.took_vitamins === 'Yes').length / history.length) * 100).toFixed(0)}%` : '0%'}
                </div>
                <div className={styles.reportStatLabel}>Vitamin Intake</div>
              </div>
              <div className={styles.reportStatCard}>
                <div className={styles.reportStatNum}>
                  {history.length ? history.filter(i => i.felt_movement === 'Yes').length : 0} / {history.length}
                </div>
                <div className={styles.reportStatLabel}>Baby Active Days</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className={styles.submitBtn} 
                style={{ margin: 0, flex: 1 }}
                onClick={() => window.print()}
              >
                Print Report
              </button>
              <button 
                className={styles.submitBtn} 
                style={{ margin: 0, flex: 1, backgroundColor: '#9CA3AF' }}
                onClick={() => setShowReport(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
