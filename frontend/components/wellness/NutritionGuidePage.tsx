'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Apple, ArrowLeft, Heart, Sparkles, Check, AlertCircle } from 'lucide-react';
import styles from './NutritionGuidePage.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { API_BASE_URL } from '@/utils/api';

interface NutritionPhase {
  phase: string;
  days: string;
  focusArea: string;
  description: string;
  benefits: string[];
  foodsToFocus: string[];
  foodsToLimit: string[];
}

export default function NutritionGuidePage() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<string>('Follicular');
  const [loading, setLoading] = useState(true);

  const nutritionData: NutritionPhase[] = [
    {
      phase: 'Menstrual',
      days: 'Days 1-5',
      focusArea: 'Warm, Iron-Rich & Remineralizing',
      description: 'Your body is shedding the uterine lining, causing a drop in iron, energy, and warmth. Focus on warm, easily digestible foods rich in iron, zinc, and healthy fats.',
      benefits: [
        'Replenishes blood iron loss and supports red blood cells',
        'Relieves pelvic congestions and cramps',
        'Supports stable energy during natural fatigue'
      ],
      foodsToFocus: [
        'Iron-rich foods (red meat, spinach, lentils, beans)',
        'Vitamin C sources (citrus fruits, bell peppers - to aid iron absorption)',
        'Healthy fats (avocado, olive oil)',
        'Warm teas (ginger, chamomile, red raspberry leaf)'
      ],
      foodsToLimit: [
        'Excessive caffeine (can constrict blood vessels and increase cramping)',
        'Cold/raw foods (harder for the body to digest during menstruation)',
        'High-sodium snacks (increases water retention)'
      ]
    },
    {
      phase: 'Follicular',
      days: 'Days 6-13',
      focusArea: 'Light, Probiotic-Rich & Phytoestrogens',
      description: 'Estrogen is rising, metabolic rate is slightly slower, and digestive capacity is high. Opt for fresh, light foods that help your liver metabolize and clear estrogen efficiently.',
      benefits: [
        'Supports follicle maturation and uterine lining growth',
        'Aids estrogen metabolism and gut health',
        'Maintains slow-burning energy levels'
      ],
      foodsToFocus: [
        'Cruciferous vegetables (broccoli, cabbage, cauliflower)',
        'Probiotic foods (kimchi, sauerkraut, yogurt)',
        'Light proteins (chicken, white fish, tofu)',
        'Whole grains (quinoa, oats, brown rice)'
      ],
      foodsToLimit: [
        'Highly processed grains (can spike blood sugar)',
        'Heavy, greasy dishes (may make you feel sluggish)',
        'Refined sugars'
      ]
    },
    {
      phase: 'Ovulation',
      days: 'Days 14-16',
      focusArea: 'Anti-Inflammatory, Hydrating & Fiber-Dense',
      description: 'Estrogen and luteinizing hormone peak, and you have high energy. Support the liver in clearing peak hormones and maintain low systemic inflammation.',
      benefits: [
        'Enhances egg quality and cellular health',
        'Promotes liver clearance of excess hormones',
        'Maintains high energy and prevents mood crashes'
      ],
      foodsToFocus: [
        'Anti-inflammatory foods (salmon, walnuts, turmeric)',
        'High-fiber foods (chia seeds, flaxseeds, raspberries)',
        'Hydrating fruits & vegetables (cucumber, watermelon)',
        'Lean proteins and fresh leafy greens'
      ],
      foodsToLimit: [
        'Excessive alcohol (impacts liver hormone clearance)',
        'Heavy, starch-dense meals',
        'Saturated/trans fats'
      ]
    },
    {
      phase: 'Luteal',
      days: 'Days 17-28',
      focusArea: 'Magnesium-Rich, Complex Carbs & Blood Sugar Balancing',
      description: 'Progesterone dominates, causing a higher metabolic rate but making you more sensitive to blood sugar drops and cravings. Eat slow-release carbohydrates and magnesium-dense foods.',
      benefits: [
        'Calms the nervous system to ease anxiety and mood swings',
        'Combats cravings for sweets and simple carbs',
        'Reduces PMS bloating and supports thyroid function'
      ],
      foodsToFocus: [
        'Magnesium-dense foods (dark chocolate (70%+), pumpkin seeds, spinach)',
        'Complex, slow carbs (sweet potatoes, squash, quinoa)',
        'B-vitamin rich foods (eggs, poultry, whole grains)',
        'Herbal teas (peppermint for digestion, dandelion root for bloating)'
      ],
      foodsToLimit: [
        'Refined sugars and sweets (will trigger a crash and worsen PMS)',
        'Heavy dairy products (can increase inflammatory PMS cramps)',
        'Excessive salt and carbonated drinks'
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
        <h2>Loading your nutrition guide...</h2>
      </div>
    );
  }

  const activePhaseDetail = nutritionData.find(
    (p) => p.phase.toLowerCase() === currentPhase.toLowerCase()
  ) || nutritionData[1]; // Default to Follicular

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
              <Sparkles size={14} /> Personalized Nutrition Guide
            </div>
            <h1>Your Cycle-Synced Nutrition Plan</h1>
            <p>
              Your nutritional requirements fluctuate with your hormones. Nourishing your body with the right focus area during each phase helps control carvings, maintain balanced energy, and ease menstrual discomfort.
            </p>
          </div>
          <div className={styles.heroIcon}>
            <Apple size={80} strokeWidth={1} />
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
            <h2>Currently Customizing for: <span>{currentPhase} Phase</span></h2>
          </div>

          <div className={styles.activePhaseCard}>
            <div className={styles.activeLeft}>
              <div className={styles.phaseTitleBox}>
                <h3>{activePhaseDetail.phase}</h3>
                <span className={styles.daysBadge}>{activePhaseDetail.days}</span>
              </div>
              <div className={styles.focusPill}>Focus: {activePhaseDetail.focusArea}</div>
              <p className={styles.phaseDesc}>{activePhaseDetail.description}</p>
              
              <div className={styles.benefitsSection}>
                <h4>Phase Benefits:</h4>
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
              <div className={styles.nutritionListSection}>
                <div className={styles.listSectionTitle}>
                  <Check size={18} className={styles.focusCheck} /> Foods to Focus On
                </div>
                <div className={styles.foodsGrid}>
                  {activePhaseDetail.foodsToFocus.map((food, idx) => (
                    <div key={idx} className={styles.foodItem}>
                      <span className={styles.bulletPink}></span>
                      <span>{food}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.nutritionListSection} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div className={styles.listSectionTitle} style={{ color: '#E14D72' }}>
                  <AlertCircle size={18} className={styles.limitCheck} /> Try to Avoid / Limit
                </div>
                <div className={styles.foodsGrid}>
                  {activePhaseDetail.foodsToLimit.map((food, idx) => (
                    <div key={idx} className={styles.foodItem}>
                      <span className={styles.bulletGray}></span>
                      <span className={styles.limitedText}>{food}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Complete Cycle Guide */}
        <div className={styles.cycleGuideSection}>
          <h2 className={styles.sectionTitle}>Full Menstrual Cycle Diet Guide</h2>
          <div className={styles.phaseGrid}>
            {nutritionData.map((p, idx) => {
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
                  <div className={styles.cardType}>{p.focusArea}</div>
                  <p className={styles.cardDesc}>{p.description}</p>
                  
                  <div className={styles.cardWorkouts}>
                    <h5>Key Foods:</h5>
                    <ul>
                      {p.foodsToFocus.slice(0, 3).map((w, i) => (
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
