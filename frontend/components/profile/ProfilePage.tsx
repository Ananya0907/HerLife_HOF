'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCircle, Activity, Calendar, Heart, Droplet, Moon, Brain, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/utils/api';
import styles from './Profile.module.css';

type LogEntry = {
  log_date: string;
  mood: number;
  stress_level: number;
  sleep_quality: number;
  water_glasses: number;
  energy_level: number;
  period_started: boolean;
};

type ProfileState = {
  user: {
    name: string;
    email: string;
    age: number;
    life_phase: string;
    bmi: number;
    height_cm: number;
    weight_kg: number;
  };
  health: {
    cycle_length: number;
    last_period_date: string;
    flow_intensity: number;
    periods_regular: number;
    pcos_diagnosed: number;
  };
  prediction: {
    cycle_phase: string;
    days_until_period: number;
    pcos_risk_score: number;
    next_period_date: string;
  };
  logs: LogEntry[];
};

const moodEmojis = ['', '😢', '😟', '😐', '🙂', '😊'];
const flowLabels = ['None', 'Light', 'Moderate', 'Heavy', 'Very Heavy'];

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }
    
    fetch(`${API_BASE_URL}/api/user-profile/${userId}`)
      .then(res => res.json())
      .then(d => {
        if (!d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPhase = (phase: string) => {
    const map: Record<string, string> = {
      preteen: 'Pre-Teens', young_women: 'Young Women',
      pregnant: 'Pregnant', postpartum: 'Postpartum', menopause: 'Menopause'
    };
    return map[phase] || phase;
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <h2 style={{ color: '#6B7280' }}>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p style={{ color: '#6B7280' }}>Could not load profile. Please log in again.</p>
        </div>
      </div>
    );
  }

  const { user, health, prediction, logs } = data;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.title}>Your Profile</div>
        </div>

        {/* User Info Card */}
        <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={40} />}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name || 'Guest'}</div>
              <div className={styles.userPhase}>Phase: {formatPhase(user.life_phase)}</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickStatLabel}>Age</span>
              <span className={styles.quickStatValue}>{user.age || '—'}</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatLabel}>BMI</span>
              <span className={styles.quickStatValue}>{user.bmi || '—'}</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatLabel}>Height</span>
              <span className={styles.quickStatValue}>{user.height_cm ? `${user.height_cm} cm` : '—'}</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatLabel}>Weight</span>
              <span className={styles.quickStatValue}>{user.weight_kg ? `${user.weight_kg} kg` : '—'}</span>
            </div>
          </div>
        </motion.div>

        {/* Health Overview Card */}
        <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className={styles.sectionTitle}>
            <Activity size={20} color="var(--primary)" /> Health Overview
          </div>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <div className={styles.dataLabel}>Cycle Length</div>
              <div className={styles.dataValue}>{health.cycle_length || 28} days</div>
            </div>
            <div className={styles.dataItem}>
              <div className={styles.dataLabel}>Last Period</div>
              <div className={styles.dataValue}>{formatDate(health.last_period_date)}</div>
            </div>
            <div className={styles.dataItem}>
              <div className={styles.dataLabel}>Flow</div>
              <div className={styles.dataValue}>{flowLabels[health.flow_intensity] || 'Moderate'}</div>
            </div>
            <div className={styles.dataItem}>
              <div className={styles.dataLabel}>Regular Periods</div>
              <div className={styles.dataValue}>{health.periods_regular ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </motion.div>

        {/* AI Predictions Card */}
        <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className={styles.sectionTitle}>
            <Brain size={20} color="var(--primary)" /> AI Predictions
          </div>
          <div className={styles.predictionGrid}>
            <div className={styles.predictionItem}>
              <div className={styles.predictionIcon}>🌙</div>
              <div className={styles.predictionLabel}>Current Phase</div>
              <div className={styles.predictionValue}>{prediction.cycle_phase || '—'}</div>
            </div>
            <div className={styles.predictionItem}>
              <div className={styles.predictionIcon}>📅</div>
              <div className={styles.predictionLabel}>Next Period In</div>
              <div className={styles.predictionValue}>{prediction.days_until_period ?? '—'} days</div>
            </div>
            <div className={styles.predictionItem}>
              <div className={styles.predictionIcon}>🩺</div>
              <div className={styles.predictionLabel}>PCOS Risk</div>
              <div className={styles.predictionValue} style={{ color: (prediction.pcos_risk_score || 0) > 50 ? '#EF4444' : '#10B981' }}>
                {prediction.pcos_risk_score || 0}%
              </div>
            </div>
            <div className={styles.predictionItem}>
              <div className={styles.predictionIcon}>🗓️</div>
              <div className={styles.predictionLabel}>Expected Date</div>
              <div className={styles.predictionValue}>{formatDate(prediction.next_period_date)}</div>
            </div>
          </div>
        </motion.div>

        {/* History Tracker */}
        <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <div className={styles.sectionTitle}>
            <TrendingUp size={20} color="var(--primary)" /> History Tracker
          </div>

          {logs.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={48} color="#D1D5DB" />
              <p>No daily logs yet. Start logging to see your trends!</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {logs.map((log, idx) => (
                <motion.div 
                  key={idx} 
                  className={styles.historyItem}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div className={styles.historyDate}>
                    <div className={styles.historyDateDay}>{new Date(log.log_date).getDate()}</div>
                    <div className={styles.historyDateMonth}>{new Date(log.log_date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                  </div>

                  <div className={styles.historyContent}>
                    <div className={styles.historyMetrics}>
                      <span className={styles.historyMetric} title="Mood">
                        {moodEmojis[log.mood] || '😐'} Mood
                      </span>
                      <span className={styles.historyMetric} title="Stress">
                        <Brain size={14} /> {log.stress_level}/5
                      </span>
                      <span className={styles.historyMetric} title="Sleep">
                        <Moon size={14} /> {log.sleep_quality}/5
                      </span>
                      <span className={styles.historyMetric} title="Water">
                        <Droplet size={14} /> {log.water_glasses} glasses
                      </span>
                    </div>
                    {log.period_started && (
                      <span className={styles.periodBadge}>🩸 Period Started</span>
                    )}
                  </div>

                  {/* Mini bar visualization */}
                  <div className={styles.historyBars}>
                    <div className={styles.miniBar} title={`Mood: ${log.mood}/5`}>
                      <div className={styles.miniBarFill} style={{ height: `${(log.mood / 5) * 100}%`, background: '#F472B6' }} />
                    </div>
                    <div className={styles.miniBar} title={`Sleep: ${log.sleep_quality}/5`}>
                      <div className={styles.miniBarFill} style={{ height: `${(log.sleep_quality / 5) * 100}%`, background: '#818CF8' }} />
                    </div>
                    <div className={styles.miniBar} title={`Stress: ${log.stress_level}/5`}>
                      <div className={styles.miniBarFill} style={{ height: `${(log.stress_level / 5) * 100}%`, background: '#FB923C' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
