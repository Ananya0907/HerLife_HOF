'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowLeft, Heart, Sparkles, CheckCircle } from 'lucide-react';
import styles from './ExercisePlanPage.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { API_BASE_URL } from '@/utils/api';

interface PhaseDetail {
  phase: string;
  days: string;
  exerciseType: string;
  intensity: 'Low' | 'Medium' | 'High';
  description: string;
  benefits: string[];
  workouts: string[];
}

export default function ExercisePlanPage() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<string>('Follicular');
  const [loading, setLoading] = useState(true);

  const phasesData: PhaseDetail[] = [
    {
      phase: 'Menstrual',
      days: 'Days 1-5',
      exerciseType: 'Restorative & Low Impact',
      intensity: 'Low',
      description: 'Your energy levels are at their lowest due to drop in estrogen and progesterone. Honor your body by focusing on slow, restorative movements that promote circulation without adding stress.',
      benefits: [
        'Relieves menstrual cramps and lower back pain',
        'Reduces inflammation and stress levels',
        'Supports lymphatic drainage and recovery'
      ],
      workouts: [
        'Restorative Yoga or Yin Yoga (focus on hip openers)',
        'Light Walking (20-30 minutes in nature)',
        'Gentle Stretching & Deep Breathing Exercises',
        'Pilates mobility work'
      ]
    },
    {
      phase: 'Follicular',
      days: 'Days 6-13',
      exerciseType: 'Strength & Progressive Cardio',
      intensity: 'Medium',
      description: 'Estrogen levels start rising, bringing back your energy and endurance. This is the optimal time to build muscle and increase the intensity of your workouts.',
      benefits: [
        'Optimal time for building lean muscle mass',
        'Higher pain threshold and faster recovery times',
        'Improves cardiovascular endurance'
      ],
      workouts: [
        'Resistance/Strength Training (moderate weights)',
        'Vinyasa Flow Yoga (more active paces)',
        'Steady-state Jogging or Cycling',
        'Dance cardio classes'
      ]
    },
    {
      phase: 'Ovulation',
      days: 'Days 14-16',
      exerciseType: 'High Intensity & Peak Power',
      intensity: 'High',
      description: 'Estrogen and testosterone peak, giving you maximum energy, strength, and confidence. Capitalize on this window for your hardest, most intense workouts.',
      benefits: [
        'Peak physical performance and calorie burn',
        'High mental focus and power output',
        'Builds maximal strength and speed'
      ],
      workouts: [
        'High-Intensity Interval Training (HIIT)',
        'Heavy Strength/Weight Lifting',
        'Sprint intervals or Kickboxing',
        'Power Yoga or challenging circuits'
      ]
    },
    {
      phase: 'Luteal',
      days: 'Days 17-28',
      exerciseType: 'Active Recovery & Endurance',
      intensity: 'Medium',
      description: 'Progesterone rises, which increases your core body temperature and heart rate, making heavy workouts feel tougher. Transition into moderate, steady exercises.',
      benefits: [
        'Combats PMS symptoms, bloating, and mood swings',
        'Promotes sweating to release fluid retention',
        'Protects joints (which are more lax due to progesterone)'
      ],
      workouts: [
        'Pilates or Barre (great for core and stabilization)',
        'LISS (Low-Intensity Steady State) Cardio',
        'Moderate hiking or swimming',
        'Flow Yoga and mobility work'
      ]
    }
  ];

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

  const backToDashboard = () => {
    const phase = localStorage.getItem('life_phase') || 'young_women';
    router.push(`/dashboard/${phase}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading your exercise guide...</h2>
      </div>
    );
  }

  // Find the active phase object
  const activePhaseDetail = phasesData.find(
    (p) => p.phase.toLowerCase() === currentPhase.toLowerCase()
  ) || phasesData[1]; // Default to Follicular

  return (
    <div className={styles.container}>
      <DashboardNavbar activeTab="wellness" />

      <main className={styles.content}>
        {/* Header Navigation */}
        <div className={styles.headerNav}>
          <button onClick={backToDashboard} className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>

        {/* Hero Banner */}
        <motion.div 
          className={styles.heroBanner}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <Sparkles size={14} /> Personalized Fitness Guide
            </div>
            <h1>Your Cycle-Synced Exercise Plan</h1>
            <p>
              Your body goes through distinct biological changes during each phase of your cycle. Syncing your workouts with these phases helps maximize energy, accelerate recovery, and balance hormones.
            </p>
          </div>
          <div className={styles.heroIcon}>
            <Dumbbell size={80} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Current Active Phase Box */}
        <motion.div 
          className={styles.activePhaseSection}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className={styles.activePhaseHeader}>
            <div className={styles.dot}></div>
            <h2>You are currently in the <span>{currentPhase} Phase</span></h2>
          </div>

          <div className={styles.activePhaseCard}>
            <div className={styles.activeLeft}>
              <div className={styles.phaseTitleBox}>
                <h3>{activePhaseDetail.phase}</h3>
                <span className={styles.daysBadge}>{activePhaseDetail.days}</span>
              </div>
              <p className={styles.phaseDesc}>{activePhaseDetail.description}</p>
              
              <div className={styles.benefitsSection}>
                <h4>Benefits of exercising now:</h4>
                <ul>
                  {activePhaseDetail.benefits.map((benefit, i) => (
                    <li key={i}>
                      <Heart size={14} className={styles.benefitIcon} /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.activeRight}>
              <div className={styles.workoutBoxTitle}>
                <Dumbbell size={18} /> Recommended Workouts Today
              </div>
              <div className={styles.workoutList}>
                {activePhaseDetail.workouts.map((workout, idx) => (
                  <div key={idx} className={styles.workoutItem}>
                    <CheckCircle size={18} className={styles.workoutCheck} />
                    <span>{workout}</span>
                  </div>
                ))}
              </div>
              <div className={styles.intensityTracker}>
                <span>Recommended Intensity: </span>
                <span className={`${styles.intensityVal} ${styles[`intensity${activePhaseDetail.intensity}`]}`}>
                  {activePhaseDetail.intensity}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Complete Cycle Guide */}
        <div className={styles.cycleGuideSection}>
          <h2 className={styles.sectionTitle}>Full Menstrual Cycle Fitness Guide</h2>
          <div className={styles.phaseGrid}>
            {phasesData.map((p, idx) => {
              const isActive = p.phase.toLowerCase() === currentPhase.toLowerCase();
              return (
                <div 
                  key={idx} 
                  className={`${styles.gridCard} ${isActive ? styles.gridCardActive : ''}`}
                >
                  {isActive && <div className={styles.activeCornerBadge}>Current Phase</div>}
                  <div className={styles.cardHeaderRow}>
                    <h3>{p.phase}</h3>
                    <span className={styles.daysBadge}>{p.days}</span>
                  </div>
                  <div className={styles.cardType}>{p.exerciseType}</div>
                  <p className={styles.cardDesc}>{p.description}</p>
                  
                  <div className={styles.cardWorkouts}>
                    <h5>Suggested Movements:</h5>
                    <ul>
                      {p.workouts.slice(0, 3).map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
