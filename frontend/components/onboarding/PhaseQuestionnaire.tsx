'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';
import styles from './Onboarding.module.css';
import { PHASE_FLOWS } from './questions';
import { useRouter } from 'next/navigation';

export default function PhaseQuestionnaire({ phase }: { phase: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();

  const currentFlow = PHASE_FLOWS[phase] || [];
  const totalSteps = currentFlow.length;
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 100;

  useEffect(() => {
    // Removed: Loading existing answers from localStorage.
    // The user wants a clean sheet every time they enter the questionnaire.
    // Ensure we start fresh.
    setAnswers({});
  }, []);

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Finalize and save to backend
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/login');
        return;
      }

      try {
        const symList = answers.ML_SYM || [];
        const pmsList = answers.ML_PMS || [];
        const pcosList = answers.ML_PCOS_S || [];
        const combinedSymptomsList = [...symList, ...pmsList, ...pcosList];
        
        const modelSymptomsObj: Record<string, any> = {
          Exercise_Frequency:          answers.Exercise_Frequency,
          Sleep_Duration:              answers.Sleep_Duration,
          Stress_Level_1to5:           answers.Stress_Level_1to5,
          Junk_Food_Frequency_1to5:    answers.Junk_Food_Frequency_1to5,
          Sugar_Intake_Frequency_1to5: answers.Sugar_Intake_Frequency_1to5,
          Caffeine_Intake:             answers.Caffeine_Intake,
          Water_Intake_Litres:         answers.Water_Intake_Litres,
          Overall_Energy_Level:        answers.Overall_Energy_Level,
          sleep_quality:               answers.sleep,
          energy:                      answers.energy,
          activity:                    answers.activity,
          water_intake:                answers.water_intake,
          emotional_wellbeing:         answers.emotional_wellbeing,
        };

        if (answers.pregnancy_week) {
          const currentWeekInt = parseInt(answers.pregnancy_week);
          if (!isNaN(currentWeekInt)) {
            modelSymptomsObj.pregnancy_week_start = currentWeekInt;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - (currentWeekInt * 7));
            modelSymptomsObj.pregnancy_start_date = startDate.toISOString().split('T')[0];
          }
        }

        // Add binary flags for ML model items
        combinedSymptomsList.forEach((sym: string) => {
          modelSymptomsObj[sym] = 1;
        });

        // Add pregnant symptoms flags
        const pregnantSymptoms = answers.symptoms || [];
        pregnantSymptoms.forEach((sym: string) => {
          modelSymptomsObj[`sym_${sym}`] = 1;
        });

        // Map frontend answers to backend expectations
        const mappedData = {
          user_id:                  userId,
          last_period_date:         answers.Last_Period_Start,
          height_cm:                parseFloat(answers.height_cm),
          weight_kg:                parseFloat(answers.Weight_kg),
          cycle_length:             parseInt(answers.Avg_Cycle_Length_days),
          flow_intensity:           answers.Flow_Intensity,
          pcos_diagnosed:           answers.pcos_diagnosis,
          periods_regular:          answers.Periods_Regular,
          bleeding_duration:        parseInt(answers.Bleeding_Duration_days),
          clotting:                 answers.Clotting,
          pain_level:               parseInt(answers.Pain_Level_1to5),
          missed_periods_frequency: answers.Missed_Periods_Frequency,
          difficulty_losing_weight: answers.Difficulty_Losing_Weight,
          hormonal_contraceptive:   answers.Hormonal_Contraceptive_Use,
          skin_condition:           answers.Skin_Condition_During_Cycle,
          hair_fall:                answers.Hair_Fall_Level,
          model_symptoms:           modelSymptomsObj,
        };

        const response = await fetch(`${API_BASE_URL}/api/onboarding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mappedData)
        });

        // Always navigate to dashboard after attempt, even if backend had a minor issue
        router.push(`/dashboard/${phase}`);

      } catch (e) {
        console.error("Failed to save onboarding data:", e);
        // Fallback to local navigation
        router.push(`/dashboard/${phase}`);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      // Go back to phase selection
      router.push('/onboarding');
    }
  };

  const calculateBMI = (h: number, w: number) => {
    if (!h || !w || h <= 0) return null;
    const hm = h / 100;
    return (w / (hm * hm)).toFixed(1);
  };

  const updateAnswer = (qid: string, val: any) => {
    const newAnswers = { ...answers, [qid]: val };
    
    // Auto-calculate BMI if height and weight are present
    if (qid === 'height_cm' || qid === 'Weight_kg') {
      const h = parseFloat(qid === 'height_cm' ? val : answers.height_cm);
      const w = parseFloat(qid === 'Weight_kg' ? val : answers.Weight_kg);
      const bmi = calculateBMI(h, w);
      if (bmi) {
        newAnswers.bmi = bmi;
      }
    }
    
    setAnswers(newAnswers);
  };

  if (!currentFlow || currentFlow.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.question}>Invalid phase selected.</h2>
          <button className={styles.backBtn} onClick={() => router.push('/onboarding')}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const question = currentFlow[step];
    if (!question) return null;

    return (
      <div className={styles.stepContent}>
        <h2 className={styles.question}>{question.text}</h2>
        
        {question.type === 'select' && (
          <div className={styles.optionsGrid}>
            {question.options?.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.optionBtn} ${answers[question.id] === opt.value ? styles.optionBtnActive : ''}`}
                onClick={() => {
                  updateAnswer(question.id, opt.value);
                  setTimeout(() => handleNext(), 150); // slight delay for visual feedback
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <div className={styles.stepContent}>
            <div className={styles.optionsGrid}>
              {question.options?.map((opt) => {
                const currentList = answers[question.id] || [];
                const isActive = currentList.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${isActive ? styles.optionBtnActive : ''}`}
                    onClick={() => {
                      const newList = isActive 
                        ? currentList.filter((v: string) => v !== opt.value)
                        : [...currentList, opt.value];
                      updateAnswer(question.id, newList);
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button 
              className={styles.nextBtn} 
              onClick={handleNext}
              style={{marginTop: '1.5rem'}}
            >
              Next
            </button>
          </div>
        )}

        {question.type === 'slider' && (
          <div className={styles.sliderContainer}>
            <input 
              type="range" 
              min={question.min} 
              max={question.max} 
              defaultValue={question.defaultValue}
              className={styles.slider}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
            />
            <div className={styles.sliderValue}>
              {answers[question.id] || question.defaultValue}
            </div>
            <button className={styles.nextBtn} onClick={handleNext}>Next</button>
          </div>
        )}

        {question.type === 'date' && (
          <div className={styles.inputGroup}>
            <input 
              type="date" 
              className={styles.inputField}
              value={answers[question.id] || ''}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
            />
            <button 
              className={styles.nextBtn} 
              onClick={handleNext}
              disabled={!answers[question.id]}
              style={{marginTop: '2rem'}}
            >
              Next
            </button>
          </div>
        )}

        {question.type === 'input' && (
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper} style={{position: 'relative', width: '100%'}}>
              <input 
                type="number" 
                className={styles.inputField}
                placeholder={question.placeholder || "Type here..."}
                value={answers[question.id] || ''}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
              />
              {question.unit && (
                <span style={{
                  position: 'absolute', 
                  right: '1.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--foreground-muted)',
                  fontWeight: 600
                }}>
                  {question.unit}
                </span>
              )}
            </div>
            
            {answers.bmi && (question.id === 'height_cm' || question.id === 'Weight_kg') && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-soft)',
                  borderRadius: '1rem',
                  color: 'var(--primary)',
                  fontWeight: 700
                }}
              >
                Calculated BMI: {answers.bmi}
              </motion.div>
            )}

            <button 
              className={styles.nextBtn} 
              onClick={handleNext}
              disabled={!answers[question.id]}
              style={{marginTop: '2rem'}}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className={styles.footer}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ChevronLeft size={20} /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
