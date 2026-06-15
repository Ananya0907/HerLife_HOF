'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Dumbbell,
  Apple,
  Moon
} from 'lucide-react';
import styles from './Wellness.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { exerciseData } from './exerciseData';
import { API_BASE_URL } from '@/utils/api';

export default function WellnessPage() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<string>('Follicular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhase = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard-data/${userId}`);
        const data = await res.json();
        if (data.prediction?.cycle_phase) {
          setCurrentPhase(data.prediction.cycle_phase);
        }
      } catch (e) {
        console.error("Failed to load user phase:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPhase();
  }, []);

  const getIntensityClass = (intensity: string) => {
    const normalized = intensity.toLowerCase();
    if (normalized.includes('high')) return styles.badgeHigh;
    if (normalized.includes('moderate') && !normalized.includes('low')) return styles.badgeModerate;
    return styles.badgeLow;
  };

  const phaseKeyMap: Record<string, string> = {
    'menstrual': 'menstrual',
    'follicular': 'follicular',
    'ovulation': 'ovulation',
    'luteal': 'luteal',
  };

  const activeKey = phaseKeyMap[currentPhase.toLowerCase()] || 'follicular';
  const activePhaseData = exerciseData[activeKey];

  const foods = [
    'Lean proteins (chicken, fish)',
    'Fresh vegetables',
    'Fermented foods',
    'Eggs',
    'Nuts and seeds'
  ];

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background)' }}>
        <h2 style={{ color: 'var(--primary)' }}>Syncing wellness plan...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="wellness" />

      {/* Main Content */}
      <main className={styles.content}>
        
        <div className={styles.gridContainer}>
          {/* Exercise Recommendations */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Dumbbell color="var(--primary)" size={24} />
              <h2 className={styles.cardTitle}>Exercise Recommendations</h2>
            </div>
            
            <div className={`${styles.infoBox} ${styles.pinkBox}`}>
              <div className={styles.infoLabel}>Current Phase</div>
              <div className={styles.infoValue}>{activePhaseData.phaseName} Phase</div>
            </div>

            <div style={{ fontSize: '0.95rem', color: 'var(--foreground-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              {activePhaseData.blurb}
            </div>

            <div className={styles.listTitle}>Recommended workouts for this phase:</div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {activePhaseData.exercises.map((workout, index) => (
                <div key={index} className={`${styles.listItem} ${styles.listItemPink}`} style={{ display: 'flex', alignItems: 'flex-start', padding: '1rem 1.25rem' }}>
                  <div className={styles.listDotPink} style={{ marginTop: '0.1rem' }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {workout.exerciseName}
                      <span className={getIntensityClass(workout.intensity)}>
                        {workout.intensity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>
                      {workout.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${styles.tipBox} ${styles.tipBoxBlue}`}>
              <div className={styles.tipHeader}>
                <Moon size={18} /> Pro Tip
              </div>
              <div className={styles.tipContent}>
                {activePhaseData.proTip}
              </div>
            </div>
          </div>

          {/* Nutrition Guide */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Apple color="var(--primary)" size={24} />
              <h2 className={styles.cardTitle}>Nutrition Guide</h2>
            </div>
            
            <div className={`${styles.infoBox} ${styles.greenBox}`}>
              <div className={styles.infoLabel}>Focus Area</div>
              <div className={styles.infoValue}>Light, fresh foods</div>
            </div>

            <div className={styles.listTitle}>Recommended foods:</div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {foods.map((food, index) => (
                <div key={index} className={`${styles.listItem} ${styles.listItemGreen}`}>
                  <div className={styles.listDotGreen}></div>
                  <div>{food}</div>
                </div>
              ))}
            </div>

            <div className={`${styles.tipBox} ${styles.tipBoxOrange}`}>
              <div className={styles.tipContent}>
                <div style={{ marginBottom: '0.2rem' }}>Try to avoid:</div>
                <div>Heavy, greasy foods</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
