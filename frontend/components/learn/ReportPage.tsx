'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Book, 
  Calendar, 
  Activity, 
  Apple, 
  Dumbbell, 
  Heart, 
  ExternalLink,
  Info
} from 'lucide-react';
import styles from './ReportPage.module.css';
import { API_BASE_URL } from '@/utils/api';

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportType = searchParams.get('type') || 'cycle';

  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  
  // State for PCOS reports
  const [pcosData, setPcosData] = useState<{ pcos_active: any, pcos_history: any[] }>({
    pcos_active: {
      'Irregular periods': true,
      'Excessive hair growth': false,
      'Weight gain': true,
      'Acne': false,
      'Hair thinning': false
    },
    pcos_history: [
      {
        date: '2026-06-07T10:00:00Z',
        symptoms: {
          'Irregular periods': true,
          'Excessive hair growth': false,
          'Weight gain': true,
          'Acne': false,
          'Hair thinning': false
        }
      },
      {
        date: '2026-05-30T14:30:00Z',
        symptoms: {
          'Irregular periods': true,
          'Excessive hair growth': false,
          'Weight gain': false,
          'Acne': false,
          'Hair thinning': false
        }
      }
    ]
  });

  // State for user metrics
  const [userData, setUserData] = useState({
    name: 'Sarah Jenkins',
    age: 26,
    cycleDay: 8,
    phase: 'Follicular',
    cycleLength: 28,
    bleedingDuration: 5,
    bmi: 22.4,
    riskScore: 12.5
  });

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      // Guest mode: load dummy logs for visualization
      setIsGuest(true);
      setLogs([
        { log_date: '2026-06-07', mood: 4, stress_level: 2, sleep_quality: 4, water_glasses: 7, period_started: false, energy_level: 1 },
        { log_date: '2026-06-06', mood: 3, stress_level: 3, sleep_quality: 3, water_glasses: 6, period_started: false, energy_level: 1 },
        { log_date: '2026-06-05', mood: 5, stress_level: 1, sleep_quality: 5, water_glasses: 8, period_started: false, energy_level: 2 },
        { log_date: '2026-06-04', mood: 4, stress_level: 2, sleep_quality: 4, water_glasses: 7, period_started: false, energy_level: 1 },
        { log_date: '2026-06-03', mood: 3, stress_level: 4, sleep_quality: 2, water_glasses: 5, period_started: false, energy_level: 0 },
      ]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setIsGuest(false);

        // Fetch User Dashboard Data (Phase, Cycle Day, Profile details)
        const dashRes = await fetch(`${API_BASE_URL}/api/dashboard-data/${userId}`);
        const dashData = await dashRes.json();

        // Fetch Full User Profile for details (cycle length, bleeding duration)
        const profileRes = await fetch(`${API_BASE_URL}/api/user-profile/${userId}`);
        const profileData = await profileRes.json();

        // Fetch logs
        const logsRes = await fetch(`${API_BASE_URL}/api/logs/${userId}`);
        const logsData = await logsRes.json();

        if (!dashData.error) {
          const profile = profileData.profile || {};
          const user = profileData.user || {};
          
          setUserData({
            name: dashData.userName || user.name || 'User',
            age: user.age || 26,
            cycleDay: dashData.cycleDay || 1,
            phase: dashData.prediction?.cycle_phase || 'Follicular',
            cycleLength: profile.cycle_length || 28,
            bleedingDuration: profile.bleeding_duration || 5,
            bmi: user.bmi || dashData.wellness?.bmi || 22.0,
            riskScore: dashData.wellness?.riskScore || 0
          });
        }

        if (logsData.logs) {
          setLogs(logsData.logs);
        }

        if (reportType === 'pcos') {
          const pcosRes = await fetch(`${API_BASE_URL}/api/pcos-symptoms/${userId}`);
          const pcosJson = await pcosRes.json();
          if (pcosJson.pcos_active) {
            setPcosData({
              pcos_active: pcosJson.pcos_active,
              pcos_history: pcosJson.pcos_history || []
            });
          }
        }
      } catch (e) {
        console.error('Error fetching report data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getHormoneLevels = (phase: string) => {
    switch (phase) {
      case 'Menstrual':
        return { estrogen: 15, progesterone: 10, fsh: 25, lh: 10 };
      case 'Follicular':
        return { estrogen: 65, progesterone: 15, fsh: 55, lh: 30 };
      case 'Ovulation':
        return { estrogen: 95, progesterone: 20, fsh: 75, lh: 100 };
      case 'Luteal':
        return { estrogen: 40, progesterone: 85, fsh: 15, lh: 10 };
      default: // Guest / default
        return { estrogen: 60, progesterone: 20, fsh: 50, lh: 30 };
    }
  };

  const renderPcosReport = () => {
    return (
      <>
        {/* Active Symptoms Overview */}
        <div className={styles.sectionTitle}>
          <Heart size={20} color="var(--primary)" /> Current Active Symptoms
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
          {Object.entries(pcosData.pcos_active).map(([name, active]) => (
            <div 
              key={name} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--foreground-muted)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: active ? 'var(--primary)' : '#9CA3AF' }}></span>
              {name}: {active ? 'Reported' : 'Not Present'}
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className={styles.sectionTitle}>
          <Activity size={20} color="var(--primary)" /> Symptom Log History
        </div>
        
        {pcosData.pcos_history && pcosData.pcos_history.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Logged Symptoms State</th>
                </tr>
              </thead>
              <tbody>
                {pcosData.pcos_history.map((entry, index) => {
                  const date = new Date(entry.date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{date}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {Object.entries(entry.symptoms).map(([name, active]) => (
                            <span 
                              key={name}
                              style={{
                                display: 'inline-block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '0.5rem',
                                backgroundColor: active ? 'var(--accent)' : '#F3F4F6',
                                color: active ? 'var(--primary)' : '#9CA3AF'
                              }}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--foreground-muted)' }}>No historical logs available.</p>
          </div>
        )}

        {/* Recommendation Guide */}
        <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>
          <Info size={20} color="var(--primary)" /> Personalized Wellness Guidance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
          <div style={{ backgroundColor: 'var(--background)', padding: '1.25rem', borderRadius: '1rem' }}>
            <p style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Dietary Suggestions:</p>
            <p>• <b>Insulin Balance:</b> Prioritize low-GI carbohydrates (oats, legumes, whole grains) to prevent insulin spikes that trigger androgen production.</p>
            <p>• <b>Anti-Inflammatory:</b> Include berries, dark leafy greens, extra virgin olive oil, and fatty fish (salmon) to lower chronic inflammation.</p>
          </div>
          <div style={{ backgroundColor: 'var(--background)', padding: '1.25rem', borderRadius: '1rem' }}>
            <p style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Exercise & Lifestyle:</p>
            <p>• <b>Muscle Sensitivity:</b> Combine light resistance training with steady-state cardio (swimming, yoga) to increase insulin receptor expression.</p>
            <p>• <b>Cortisol Control:</b> Avoid chronic sleep deprivation and severe high-intensity stress, which trigger adrenal fatigue.</p>
          </div>
        </div>
      </>
    );
  };

  const renderCycleJournal = () => {
    return (
      <>
        <div className={styles.sectionTitle}>
          <Calendar size={20} color="var(--primary)" /> Your Recent Logging History
        </div>
        
        {logs.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Log Date</th>
                  <th>Mood</th>
                  <th>Energy</th>
                  <th>Stress Level</th>
                  <th>Sleep Quality</th>
                  <th>Water Intake</th>
                  <th>Period Day</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((log, index) => {
                  const date = new Date(log.log_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const moodLabel = ['Sad', 'Anxious', 'Neutral', 'Happy', 'Excellent'][log.mood - 1] || 'Neutral';
                  const stressLabel = ['Calm', 'Low', 'Medium', 'High', 'Stressed'][log.stress_level - 1] || 'Medium';
                  const energyLabel = ['Low', 'Medium', 'High'][log.energy_level] || 'Medium';
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600 }}>{date}</td>
                      <td>{moodLabel}</td>
                      <td>{energyLabel}</td>
                      <td>{stressLabel}</td>
                      <td>{log.sleep_quality}/5</td>
                      <td>{log.water_glasses} glasses</td>
                      <td>{log.period_started ? 'Yes (Day 1)' : 'No'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--foreground-muted)' }}>No logs submitted yet. Print this template to fill it manually!</p>
          </div>
        )}

        <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>
          <Info size={20} color="var(--primary)" /> Daily Tracking Key & Notes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
          <div style={{ backgroundColor: 'var(--background)', padding: '1.25rem', borderRadius: '1rem' }}>
            <p style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Wellness Indexes:</p>
            <p>• <b>Mood Rating:</b> 1 = Sad, 2 = Anxious, 3 = Neutral, 4 = Happy, 5 = Excellent</p>
            <p>• <b>Stress level:</b> 1 = Calm, 2 = Low, 3 = Medium, 4 = High, 5 = Extreme</p>
            <p>• <b>Sleep Quality:</b> 1 = Poor/Restless, 5 = Deep/Fully Rested</p>
          </div>
          <div style={{ backgroundColor: 'var(--background)', padding: '1.25rem', borderRadius: '1rem' }}>
            <p style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Flow Tracking Key:</p>
            <p>• <b>L (Light):</b> Minimal spotting, requires liner</p>
            <p>• <b>M (Moderate):</b> Standard flow, normal absorption</p>
            <p>• <b>H (Heavy):</b> Fast flow, requires high-absorption protection</p>
          </div>
        </div>
      </>
    );
  };

  const renderHormoneGuide = () => {
    const levels = getHormoneLevels(userData.phase);
    return (
      <>
        <div className={styles.sectionTitle}>
          <Activity size={20} color="var(--primary)" /> Your Estimated Hormone Activity Today
        </div>
        <div className={styles.hormoneGrid}>
          {/* Estrogen */}
          <div className={styles.hormoneProgressBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.hormoneName}>Estrogen</span>
              <span className={styles.hormoneValue}>
                {levels.estrogen < 30 ? 'Low' : levels.estrogen < 70 ? 'Moderate' : 'High'}
              </span>
            </div>
            <div className={styles.hormoneProgressBg}>
              <div className={styles.hormoneProgressBar} style={{ width: `${levels.estrogen}%`, backgroundColor: '#ff6b6b' }}></div>
            </div>
          </div>
          {/* Progesterone */}
          <div className={styles.hormoneProgressBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.hormoneName}>Progesterone</span>
              <span className={styles.hormoneValue}>
                {levels.progesterone < 30 ? 'Low' : levels.progesterone < 70 ? 'Moderate' : 'High'}
              </span>
            </div>
            <div className={styles.hormoneProgressBg}>
              <div className={styles.hormoneProgressBar} style={{ width: `${levels.progesterone}%`, backgroundColor: '#4797B1' }}></div>
            </div>
          </div>
          {/* LH */}
          <div className={styles.hormoneProgressBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.hormoneName}>LH (Luteinizing)</span>
              <span className={styles.hormoneValue}>
                {levels.lh < 30 ? 'Low' : levels.lh < 70 ? 'Moderate' : 'Peak'}
              </span>
            </div>
            <div className={styles.hormoneProgressBg}>
              <div className={styles.hormoneProgressBar} style={{ width: `${levels.lh}%`, backgroundColor: '#8B3A82' }}></div>
            </div>
          </div>
          {/* FSH */}
          <div className={styles.hormoneProgressBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.hormoneName}>FSH (Follicle)</span>
              <span className={styles.hormoneValue}>
                {levels.fsh < 30 ? 'Low' : levels.fsh < 70 ? 'Moderate' : 'High'}
              </span>
            </div>
            <div className={styles.hormoneProgressBg}>
              <div className={styles.hormoneProgressBar} style={{ width: `${levels.fsh}%`, backgroundColor: '#ffa07a' }}></div>
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>
          <Heart size={20} color="var(--primary)" /> Hormonal Status Summary
        </div>
        <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {userData.phase === 'Menstrual' && (
            <p>All primary sex hormones (Estrogen, Progesterone) are at their lowest levels to trigger uterine shedding. FSH begins a slight increase at the end of this phase to recruit new follicles. Energy levels may be low; prioritize rest and gentle recovery actions.</p>
          )}
          {userData.phase === 'Follicular' && (
            <p>Estrogen is actively climbing to rebuild the endometrial lining, which boosts serotonin and gives you a natural surge of physical energy and mental sharpness. Progesterone remains low, so your body is highly efficient at carbohydrate metabolism.</p>
          )}
          {userData.phase === 'Ovulation' && (
            <p>Estrogen peaks to trigger a sudden surge in Luteinizing Hormone (LH), which prompts the release of the egg. Testosterone also spikes briefly, maximizing your confidence, social energy, and libido. Keep active and capitalize on high confidence.</p>
          )}
          {userData.phase === 'Luteal' && (
            <p>Progesterone rises to its peak to maintain the uterine lining, introducing a calming effect but also slowing digestion slightly. Estrogen drops initially before rising to a secondary peak. If fertilization hasn't occurred, both hormones drop rapidly, which can trigger PMS symptoms.</p>
          )}
        </div>
      </>
    );
  };

  const renderNutritionPlanner = () => {
    return (
      <>
        <div className={styles.sectionTitle}>
          <Apple size={20} color="var(--primary)" /> Phase Nutrition Planner
        </div>
        <div className={styles.nutritionGrid}>
          <div className={styles.nutritionCard}>
            <h4 style={{ color: 'var(--primary)' }}>Foods to Focus On</h4>
            <ul className={styles.nutritionList}>
              {userData.phase === 'Menstrual' && (
                <>
                  <li><span className={styles.bullet}>•</span> Iron-rich proteins (lean beef, lentils, kidney beans)</li>
                  <li><span className={styles.bullet}>•</span> Anti-inflammatory fats (salmon, walnuts, flaxseeds)</li>
                  <li><span className={styles.bullet}>•</span> Warm, easy-to-digest stews, soups, and ginger tea</li>
                </>
              )}
              {userData.phase === 'Follicular' && (
                <>
                  <li><span className={styles.bullet}>•</span> Fresh, light vegetables (broccoli, carrots, zucchini)</li>
                  <li><span className={styles.bullet}>•</span> Fermented foods (kimchi, sauerkraut, kefir) for gut health</li>
                  <li><span className={styles.bullet}>•</span> Sprouted grains, oats, chicken, and eggs</li>
                </>
              )}
              {userData.phase === 'Ovulation' && (
                <>
                  <li><span className={styles.bullet}>•</span> Cruciferous veggies (cauliflower, Brussels sprouts) to flush estrogen</li>
                  <li><span className={styles.bullet}>•</span> High-fiber foods (chia seeds, berries, leafy greens)</li>
                  <li><span className={styles.bullet}>•</span> Hydrating smoothies, fresh fruit juices, and dark chocolate</li>
                </>
              )}
              {userData.phase === 'Luteal' && (
                <>
                  <li><span className={styles.bullet}>•</span> Complex, slow-burning carbs (sweet potato, squash, brown rice)</li>
                  <li><span className={styles.bullet}>•</span> Magnesium-rich foods (dark leafy greens, pumpkin seeds)</li>
                  <li><span className={styles.bullet}>•</span> B-vitamins (chickpeas, bananas, turkey)</li>
                </>
              )}
            </ul>
          </div>

          <div className={styles.nutritionCard}>
            <h4 style={{ color: '#EF4444' }}>Foods to Limit / Avoid</h4>
            <ul className={styles.nutritionList}>
              {userData.phase === 'Menstrual' && (
                <>
                  <li><span className={styles.bulletAvoid}>•</span> Cold foods and ice drinks (can trigger cramping)</li>
                  <li><span className={styles.bulletAvoid}>•</span> Heavy caffeine and coffee (constricts blood vessels)</li>
                  <li><span className={styles.bulletAvoid}>•</span> High-sodium snacks (increases fluid retention)</li>
                </>
              )}
              {userData.phase === 'Follicular' && (
                <>
                  <li><span className={styles.bulletAvoid}>•</span> Heavy, saturated greasy meals (makes you sluggish)</li>
                  <li><span className={styles.bulletAvoid}>•</span> Refined sugars and pastries (causes energy crashes)</li>
                  <li><span className={styles.bulletAvoid}>•</span> High alcohol intake (competes with estrogen processing)</li>
                </>
              )}
              {userData.phase === 'Ovulation' && (
                <>
                  <li><span className={styles.bulletAvoid}>•</span> Simple starches and white breads</li>
                  <li><span className={styles.bulletAvoid}>•</span> Carbonated soft drinks and artificial sweeteners</li>
                  <li><span className={styles.bulletAvoid}>•</span> Excess processed trans-fats</li>
                </>
              )}
              {userData.phase === 'Luteal' && (
                <>
                  <li><span className={styles.bulletAvoid}>•</span> Added table salt (intensifies premenstrual bloating)</li>
                  <li><span className={styles.bulletAvoid}>•</span> Excess caffeine (increases premenstrual anxiety and breast pain)</li>
                  <li><span className={styles.bulletAvoid}>•</span> High glycemic index sugars (worsens mood crashes)</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.mealPlanSection}>
          <h4 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Sample Phase Diet Suggestion</h4>
          <div className={styles.mealPlanGrid}>
            <div className={styles.mealPlanItem}>
              <span className={styles.mealLabel}>Breakfast</span>
              <span className={styles.mealText}>
                {userData.phase === 'Menstrual' && 'Warm oatmeal with walnuts'}
                {userData.phase === 'Follicular' && 'Avocado toast & boiled eggs'}
                {userData.phase === 'Ovulation' && 'Chia seed berry smoothie'}
                {userData.phase === 'Luteal' && 'Quinoa porridge with banana'}
              </span>
            </div>
            <div className={styles.mealPlanItem}>
              <span className={styles.mealLabel}>Lunch</span>
              <span className={styles.mealText}>
                {userData.phase === 'Menstrual' && 'Spinach salad with chicken'}
                {userData.phase === 'Follicular' && 'Fermented kimchi salad bowl'}
                {userData.phase === 'Ovulation' && 'Salmon salad with broccoli'}
                {userData.phase === 'Luteal' && 'Sweet potato & turkey wrap'}
              </span>
            </div>
            <div className={styles.mealPlanItem}>
              <span className={styles.mealLabel}>Dinner</span>
              <span className={styles.mealText}>
                {userData.phase === 'Menstrual' && 'Warm lentil soup & salmon'}
                {userData.phase === 'Follicular' && 'Zucchini noodles with tofu'}
                {userData.phase === 'Ovulation' && 'Steamed trout with cauliflower'}
                {userData.phase === 'Luteal' && 'Butternut squash & beef soup'}
              </span>
            </div>
            <div className={styles.mealPlanItem}>
              <span className={styles.mealLabel}>Snack</span>
              <span className={styles.mealText}>
                {userData.phase === 'Menstrual' && 'Ginger herbal infusion'}
                {userData.phase === 'Follicular' && 'Greek yogurt with almonds'}
                {userData.phase === 'Ovulation' && 'Berries & dark chocolate'}
                {userData.phase === 'Luteal' && 'Pumpkin seeds & dates'}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderExerciseCalendar = () => {
    return (
      <>
        <div className={styles.sectionTitle}>
          <Dumbbell size={20} color="var(--primary)" /> Cycle Workout Schedule
        </div>
        <div className={styles.exerciseGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>Current Intensity Level</span>
              <h3 style={{ margin: '0.2rem 0', color: 'var(--primary)', fontWeight: 800, fontSize: '1.4rem' }}>
                {userData.phase === 'Menstrual' && 'Gentle / Recovery'}
                {userData.phase === 'Follicular' && 'Moderate / Progressive'}
                {userData.phase === 'Ovulation' && 'Maximum / Intense'}
                {userData.phase === 'Luteal' && 'Steady / Active Recovery'}
              </h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>Hormonal Support Focus</span>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: 'var(--foreground)' }}>
                {userData.phase === 'Menstrual' && 'Relieving cramps, lowering cortisol, and restoring glycogen.'}
                {userData.phase === 'Follicular' && 'Building progressive load, boosting aerobic capacity, and building muscle.'}
                {userData.phase === 'Ovulation' && 'HIIT intervals, heavy lifting, and hitting personal strength records.'}
                {userData.phase === 'Luteal' && 'Combatting fluid retention, stabilizing blood sugar, and supporting mood.'}
              </p>
            </div>
          </div>

          <div className={styles.scheduleGrid}>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleDay}>Days 1–2</span>
              <span className={styles.scheduleWorkout}>
                {userData.phase === 'Menstrual' && 'Full Rest Day / Light Walk'}
                {userData.phase === 'Follicular' && 'Steady Jogging / Hiking'}
                {userData.phase === 'Ovulation' && 'HIIT Workout (30 mins)'}
                {userData.phase === 'Luteal' && 'Moderate Strength Lift'}
              </span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleDay}>Days 3–4</span>
              <span className={styles.scheduleWorkout}>
                {userData.phase === 'Menstrual' && 'Gentle Yin / Hatha Yoga'}
                {userData.phase === 'Follicular' && 'Moderate Weight Training'}
                {userData.phase === 'Ovulation' && 'Heavy Weightlifting PRs'}
                {userData.phase === 'Luteal' && 'Steady-State Swim / Cycle'}
              </span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleDay}>Days 5–7</span>
              <span className={styles.scheduleWorkout}>
                {userData.phase === 'Menstrual' && 'Low-intensity Pilates / Rest'}
                {userData.phase === 'Follicular' && 'Vinyasa Flow Yoga'}
                {userData.phase === 'Ovulation' && 'Spin Class / Athletic Cardio'}
                {userData.phase === 'Luteal' && 'Slow Mat Pilates / Barre'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>
          <Info size={20} color="var(--primary)" /> Injury Prevention Tip
        </div>
        <div style={{ backgroundColor: '#FEF2F4', borderLeft: '4px solid var(--primary)', padding: '1rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>
          {userData.phase === 'Ovulation' ? (
            <p style={{ margin: 0 }}><b>Ligament Warning:</b> Peak estrogen increases joint/ligament laxity (specifically the ACL). Warm up thoroughly and focus on strict form to prevent knee/ankle sprains during tough workouts.</p>
          ) : userData.phase === 'Luteal' ? (
            <p style={{ margin: 0 }}><b>Temperature Control:</b> Your basal body temperature rises about 0.5°C during this phase. Sweat begins earlier, so stay hydrated and avoid heavy exercise in hot, unventilated rooms.</p>
          ) : (
            <p style={{ margin: 0 }}>Listen to your biofeedback. If cramps are severe or fatigue is high, substitute active exercise with a rest day. Forcing training leads to cortisol build-up and slows overall progress.</p>
          )}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3 style={{ color: 'var(--primary)' }}>Compiling your health log report...</h3>
      </div>
    );
  }

  const pageTitle = {
    cycle: 'Cycle Tracking Journal Report',
    hormone: 'Personal Hormone Guide & Timeline',
    nutrition: 'Cycle-Syncing Nutrition Planner',
    exercise: 'Cycle-Syncing Exercise Calendar',
    pcos: 'PCOS Health & Symptom Tracker Report'
  }[reportType] || 'Health Report';

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        
        {/* Navigation & Action Header */}
        <div className={`${styles.headerActions} ${styles.noPrint}`}>
          <button className={styles.backBtn} onClick={() => router.push('/learn')}>
            <ArrowLeft size={18} /> Back to Educational Resources
          </button>
          <button className={styles.downloadBtn} onClick={handlePrint}>
            <Download size={18} /> Save as PDF
          </button>
        </div>

        {/* Guest Alert Banner */}
        {isGuest && (
          <div className={`${styles.noticeBanner} ${styles.noPrint}`}>
            <Info size={16} /> 
            <span>You are viewing this report in <b>Demo Mode</b>. Log in to personalize these metrics using your logged symptoms and history.</span>
          </div>
        )}

        {/* Report Card */}
        <div className={styles.reportCard}>
          {/* Top Doc Header */}
          <div className={styles.reportHeader}>
            <div className={styles.logoRow}>
              <div className={styles.logo}>
                <Heart fill="var(--primary)" color="var(--primary)" size={24} /> HerLife AI
              </div>
              <div className={styles.docType}>Health Document</div>
            </div>
            <h1 className={styles.reportTitle}>{pageTitle}</h1>
            <p className={styles.reportSub}>Empowering your hormonal health journey through personalized data correlation.</p>
          </div>

          {/* User profile details grid */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Name</span>
              <span className={styles.metaValue}>{userData.name}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Age / Stage</span>
              <span className={styles.metaValue}>{userData.age} yrs • Young Women</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Current Day</span>
              <span className={styles.metaValue}>Day {userData.cycleDay} of {userData.cycleLength}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Current Phase</span>
              <span className={styles.metaValue} style={{ color: 'var(--primary)' }}>{userData.phase}</span>
            </div>
          </div>

          {/* Dynamic Content Sections */}
          {reportType === 'cycle' && renderCycleJournal()}
          {reportType === 'hormone' && renderHormoneGuide()}
          {reportType === 'nutrition' && renderNutritionPlanner()}
          {reportType === 'exercise' && renderExerciseCalendar()}
          {reportType === 'pcos' && renderPcosReport()}

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--foreground-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            Report generated securely by HerLife AI • Confidential Medical Document • Privacy Protected.
          </div>
        </div>

      </main>
    </div>
  );
}
