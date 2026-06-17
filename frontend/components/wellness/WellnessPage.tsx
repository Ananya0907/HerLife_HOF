'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Dumbbell,
  Apple,
  Moon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import styles from './Wellness.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { exerciseData } from './exerciseData';
import { dietData, recipeData } from './dietData';
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

  const activeDietKey = `${activeKey}Phase`;
  const activeDiet = dietData[activeDietKey] || dietData.follicularPhase;
  const activeRecipes = recipeData[activeDietKey] || recipeData.follicularPhase;

  const [expandedRecipes, setExpandedRecipes] = useState<Record<string, boolean>>({});

  const toggleRecipe = (recipeKey: string) => {
    setExpandedRecipes(prev => ({
      ...prev,
      [recipeKey]: !prev[recipeKey]
    }));
  };

  const focusAreaMap: Record<string, string> = {
    menstrualPhase: 'Iron-rich & hydrating foods',
    follicularPhase: 'Light, fresh foods',
    ovulationPhase: 'Antioxidant & fiber-rich foods',
    lutealPhase: 'Complex carbs & magnesium',
  };

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
              <div className={styles.infoValue}>{focusAreaMap[activeDietKey] || 'Light, fresh foods'}</div>
            </div>

            <div className={styles.listTitle}>Prioritize This Phase:</div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {activeDiet.prioritizeFoods.map((food, index) => (
                <div key={index} className={`${styles.listItem} ${styles.listItemGreen}`}>
                  <div className={styles.listDotGreen}></div>
                  <div>{food}</div>
                </div>
              ))}
            </div>

            <div className={styles.listTitle}>Foods to Avoid:</div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {activeDiet.foodsToAvoid.map((food, index) => (
                <div key={index} className={`${styles.listItem} ${styles.listItemPinkSimple}`}>
                  <div className={styles.listDotPinkSimple}></div>
                  <div>{food}</div>
                </div>
              ))}
            </div>

            <div className={styles.recipeSectionTitle}>Recipes for This Phase</div>

            {activeRecipes.map((recipe, index) => {
              if (!recipe.recipeName) {
                return (
                  <div key={index} className={styles.recipePlaceholder}>
                    Recipe coming soon 🌿
                  </div>
                );
              }

              const recipeKey = `${activeDietKey}-${index}`;
              const isExpanded = !!expandedRecipes[recipeKey];

              return (
                <div key={index} className={styles.recipeCard}>
                  <div className={styles.recipeName}>{recipe.recipeName}</div>
                  <div className={styles.recipeDesc}>{recipe.description}</div>
                  
                  <div className={styles.ingredientsTitle}>Ingredients:</div>
                  <div className={styles.ingredientsList}>
                    {recipe.ingredients.join(', ')}
                  </div>
                  
                  <button 
                    onClick={() => toggleRecipe(recipeKey)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginTop: '0.5rem',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    {isExpanded ? 'Hide Instructions' : 'View Instructions'}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--foreground-muted)', 
                      marginTop: '0.5rem', 
                      borderTop: '1px dashed var(--border)',
                      paddingTop: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      {recipe.howToMake}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
