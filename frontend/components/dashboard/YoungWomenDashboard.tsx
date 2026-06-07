'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Calendar, 
  Activity, 
  BrainCircuit, 
  Dumbbell,
  Apple,
  Droplet
} from 'lucide-react';
import styles from './YoungWomenDashboard.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import ProfileBanner from './ProfileBanner';
import ProfileCompletionModal from './ProfileCompletionModal';
import { 
  calculateBMI, 
  calculateHormonalStressIndex, 
  calculateWellnessScore 
} from '../../utils/healthUtils';
import { API_BASE_URL } from '@/utils/api';

export default function YoungWomenDashboard({ userName }: { userName: string }) {
  const router = useRouter();
  const [cycleData, setCycleData] = useState({
    nextPeriod: 0,
    cycleDay: 1,
    currentPhase: 'Analyzing...'
  });
  const [displayedName, setDisplayedName] = useState(userName);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const [metrics, setMetrics] = useState({
    wellnessScore: 0,
    stressIndex: 0,
    bmi: 0,
    riskScore: 0
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [latestLog, setLatestLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadHealthData = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch Dashboard Data (Metrics + Predictions)
      const dashRes = await fetch(`${API_BASE_URL}/api/dashboard-data/${userId}`);
      const dashData = await dashRes.json();

      if (dashData.error) {
        if (dashData.error === "Profile incomplete") {
          setIsProfileComplete(false);
        }
      } else {
        if (dashData.userName) {
          setDisplayedName(dashData.userName);
        }
      }

      // 2. Profile Sync
      if (dashData.needs_details !== undefined) {
        setIsProfileComplete(!dashData.needs_details);
      }

      // 3. Update basic metrics (Always update cycleDay if present)
      setCycleData({
        nextPeriod:   dashData.prediction?.days_until_period ?? 0,
        cycleDay:     dashData.cycleDay || 1,
        currentPhase: dashData.prediction?.cycle_phase || 'Follicular'
      });

      setMetrics({
        wellnessScore: 80, 
        stressIndex:   3,
        bmi:           dashData.wellness?.bmi || 0,
        riskScore:     dashData.wellness?.riskScore || 0
      });

      // 3. Fetch Recommendations
      const RecRes  = await fetch(`${API_BASE_URL}/api/recommendations/${userId}`);
      const RecData = await RecRes.json();
      setRecommendations(RecData.recommendations || []);

      // 4. Fetch Logs for Daily Wellness Balance
      const logsRes = await fetch(`${API_BASE_URL}/api/logs/${userId}`);
      const logsData = await logsRes.json();
      if (logsData.logs && logsData.logs.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const logForToday = logsData.logs.find((l: any) => l.log_date === todayStr);
        setLatestLog(logForToday || logsData.logs[0]);
      }

    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  const handleProfileComplete = async (data: any) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      // Map frontend strings to backend expectations
      const mappedData = {
        user_id: userId,
        exercise_frequency:  data.exercise, // Backend ordinal_map handles "Never", "Sometimes", etc.
        sleep_duration:      data.sleep,
        junk_food_frequency: data.junk === 'Never' ? 1 : data.junk === 'Rarely' ? 2 : data.junk === 'Sometimes' ? 3 : data.junk === 'Often' ? 4 : 5,
        sugar_intake:        data.sugar === 'Never' ? 1 : data.sugar === 'Rarely' ? 2 : data.sugar === 'Sometimes' ? 3 : data.sugar === 'Often' ? 4 : 5,
        caffeine_intake:     data.caffeine,
        water_intake:        data.water === 'Less than 1L' ? 0.5 : data.water === '1-2L' ? 1.5 : data.water === '2-3L' ? 2.5 : 3.5,
      };

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedData)
      });

      if (response.ok) {
        setIsProfileComplete(true);
        setShowProfileModal(false);
        loadHealthData(); // Refresh metrics
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '0.75rem' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.6rem' }}>Analyzing your health data...</h2>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '1rem', margin: 0 }}>Customizing your personal dashboard</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="home" />

      {/* Main Content */}
      <main className={styles.content}>
        {!isProfileComplete && (
          <ProfileBanner onOpenModal={() => setShowProfileModal(true)} />
        )}

        {/* Hero Card */}
        <motion.div 
          className={styles.mainCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Welcome Back{displayedName ? `, ${displayedName}` : ''}! 🌸</h1>
          <p>You're currently in your {cycleData.currentPhase}</p>
          
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Day of Cycle</div>
              <div className={styles.statValue}>Day {cycleData.cycleDay}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Phase you are in</div>
              <div className={styles.statValue}>{cycleData.currentPhase}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Next Period Day</div>
              <div className={styles.statValue}>In {cycleData.nextPeriod} Days</div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className={styles.actionGrid}>
          <motion.button 
            className={styles.actionCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => router.push('/wellness/exercise')}
          >
            <div className={styles.iconWrapper}>
              <Dumbbell size={24} />
            </div>
            <h3>Exercise Plan</h3>
            <p>Personalized workouts for your cycle</p>
          </motion.button>

          <motion.button 
            className={styles.actionCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => router.push('/wellness/nutrition')}
          >
            <div className={styles.iconWrapper}>
              <Apple size={24} />
            </div>
            <h3>Nutrition Guide</h3>
            <p>Diet tips for your current phase</p>
          </motion.button>

          <motion.button 
            className={styles.actionCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => router.push('/pcos')}
          >
            <div className={styles.iconWrapper}>
              <BrainCircuit size={24} />
            </div>
            <h3>PCOS Support</h3>
            <p>Risk Score: {metrics.riskScore}%</p>
            <span style={{ fontSize: '12px', color: metrics.riskScore > 50 ? '#ff6b6b' : '#4ecdc4' }}>
              {metrics.riskScore > 50 ? 'High probability detected' : 'Low probability detected'}
            </span>
          </motion.button>
        </div>

        {/* Daily Wellness Balance Section */}
        <motion.div
          className={styles.wellnessBalanceSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.wellnessBalanceHeader}>
            <h2>Daily Wellness Balance</h2>
            {latestLog ? (
              <span className={`${styles.logStatusBadge} ${latestLog.log_date === new Date().toISOString().split('T')[0] ? styles.logStatusBadgeActive : styles.logStatusBadgePending}`}>
                {latestLog.log_date === new Date().toISOString().split('T')[0] ? '✓ Logged Today' : `Last Logged: ${latestLog.log_date}`}
              </span>
            ) : (
              <span className={`${styles.logStatusBadge} ${styles.logStatusBadgePending}`}>No Logs Registered</span>
            )}
          </div>

          {latestLog ? (
            <div className={styles.wellnessGrid}>
              {/* Hydration Card */}
              <div className={styles.wellnessCard}>
                <div className={styles.wellnessCardTitle}>Hydration (Water)</div>
                <div className={styles.wellnessCardContent}>
                  <span className={styles.wellnessCardMainVal}>{latestLog.water_glasses || 0}</span>
                  <span className={styles.wellnessCardSubVal}>/ 8 glasses</span>
                </div>
                <div className={styles.wellnessCardProgressBg}>
                  <div 
                    className={styles.wellnessCardProgressBar} 
                    style={{ 
                      width: `${Math.min(100, ((latestLog.water_glasses || 0) / 8) * 100)}%`,
                      backgroundColor: '#4ecdc4'
                    }}
                  ></div>
                </div>
              </div>

              {/* Sleep Card */}
              <div className={styles.wellnessCard}>
                <div className={styles.wellnessCardTitle}>Sleep Quality</div>
                <div className={styles.wellnessCardContent}>
                  <span className={styles.wellnessCardMainVal}>{latestLog.sleep_quality || 0}</span>
                  <span className={styles.wellnessCardSubVal}>/ 5 rating</span>
                </div>
                <div className={styles.wellnessCardProgressBg}>
                  <div 
                    className={styles.wellnessCardProgressBar} 
                    style={{ 
                      width: `${((latestLog.sleep_quality || 0) / 5) * 100}%`,
                      backgroundColor: '#ffe66d'
                    }}
                  ></div>
                </div>
              </div>

              {/* Stress Card */}
              <div className={styles.wellnessCard}>
                <div className={styles.wellnessCardTitle}>Stress Level</div>
                <div className={styles.wellnessCardContent}>
                  <span className={styles.wellnessCardMainVal}>
                    {latestLog.stress_level === 1 ? 'Calm' : latestLog.stress_level === 2 ? 'Low' : latestLog.stress_level === 3 ? 'Medium' : latestLog.stress_level === 4 ? 'High' : 'Stressed'}
                  </span>
                  <span className={styles.wellnessCardSubVal}>({latestLog.stress_level || 0}/5)</span>
                </div>
                <div className={styles.wellnessCardProgressBg}>
                  <div 
                    className={styles.wellnessCardProgressBar} 
                    style={{ 
                      width: `${((latestLog.stress_level || 0) / 5) * 100}%`,
                      backgroundColor: (latestLog.stress_level || 0) > 3 ? '#ff6b6b' : '#4ecdc4'
                    }}
                  ></div>
                </div>
              </div>

              {/* Mood Card */}
              <div className={styles.wellnessCard}>
                <div className={styles.wellnessCardTitle}>Current Mood</div>
                <div className={styles.wellnessCardContent}>
                  <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>
                    {['😢', '😟', '😐', '🙂', '😊'][latestLog.mood - 1] || '😐'}
                  </span>
                  <span className={styles.wellnessCardSubVal} style={{ marginLeft: '0.5rem' }}>
                    {['Sad', 'Anxious', 'Neutral', 'Happy', 'Excellent'][latestLog.mood - 1] || 'Neutral'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noLogContainer}>
              <p className={styles.noLogText}>You haven't logged your health data yet. Log today's state to unlock your wellness balance tracking!</p>
              <button className={styles.noLogBtn} onClick={() => router.push('/daily-log')}>
                Log Symptoms Now 📝
              </button>
            </div>
          )}

          {latestLog && latestLog.log_date !== new Date().toISOString().split('T')[0] && (
            <div className={styles.noLogContainer} style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.5rem', paddingBottom: 0 }}>
              <p className={styles.noLogText} style={{ margin: 0, fontSize: '0.95rem' }}>
                Don't forget to submit today's log to keep your metrics fresh! 
                <button 
                  className={styles.noLogBtn} 
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', marginLeft: '1rem' }} 
                  onClick={() => router.push('/daily-log')}
                >
                  Log Today 📝
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {showProfileModal && (
        <ProfileCompletionModal 
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
}
