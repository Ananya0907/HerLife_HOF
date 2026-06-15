'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Check } from 'lucide-react';
import styles from './DailyLogCard.module.css';
import { API_BASE_URL } from '@/utils/api';

interface DailyLogData {
  energy: 'Low' | 'Medium' | 'High';
  stress: number;
  sleep: number;
  water: number;
  mood: number;
  periodStart: boolean;
  junkFood: number;
}

export default function DailyLogCard({ onSave }: { onSave?: (data: any) => void }) {
  const [log, setLog] = useState<DailyLogData>({
    energy: 'Medium',
    stress: 3,
    sleep: 3,
    water: 4,
    mood: 3,
    periodStart: false,
    junkFood: 2
  });

  const moods = ['😢', '😟', '😐', '🙂', '😊'];
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("Please login first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:        userId,
          mood:           log.mood,
          stress_level:   log.stress,
          sleep_quality:  log.sleep,
          water_glasses:  log.water,
          period_started: log.periodStart,
          energy_level:   log.energy,
        })
      });

      const data = await response.json();

      if (data.error) {
        alert("Error saving log: " + data.error);
        return;
      }

      // Success
      if (onSave) onSave(data);
      alert('Daily log saved! Your health insights are being updated... 🩷');
      
    } catch (err) {
      alert("Failed to connect to backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Daily Health Log</h2>
      <p className={styles.subtitle}>How are you feeling today, Gorgeous?</p>

      {/* Energy */}
      <div className={styles.section}>
        <label className={styles.label}>How is your energy today?</label>
        <div className={styles.optionsGrid}>
          {['Low', 'Medium', 'High'].map((level) => (
            <button
              key={level}
              className={`${styles.optionBtn} ${log.energy === level ? styles.optionBtnActive : ''}`}
              onClick={() => setLog({ ...log, energy: level as any })}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stress & Sleep */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className={styles.section}>
          <label className={styles.label}>Stress Level (1-5)</label>
          <div className={styles.sliderWrapper}>
            <input
              type="range"
              min="1"
              max="5"
              value={log.stress}
              className={styles.slider}
              onChange={(e) => setLog({ ...log, stress: parseInt(e.target.value) })}
            />
            <div className={styles.sliderLabels}>
              <span>Calm</span>
              <span>Stressed</span>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <label className={styles.label}>Sleep Quality (1-5)</label>
          <div className={styles.sliderWrapper}>
            <input
              type="range"
              min="1"
              max="5"
              value={log.sleep}
              className={styles.slider}
              onChange={(e) => setLog({ ...log, sleep: parseInt(e.target.value) })}
            />
            <div className={styles.sliderLabels}>
              <span>Poor</span>
              <span>Perfect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Counter */}
      <div className={styles.section}>
        <label className={styles.label}>Hydration (Glasses of Water)</label>
        <div className={styles.counterWrapper}>
          <button 
            className={styles.counterBtn} 
            onClick={() => setLog({ ...log, water: Math.max(0, log.water - 1) })}
          >
            <Minus size={20} />
          </button>
          <div className={styles.counterValue}>{log.water}</div>
          <button 
            className={styles.counterBtn} 
            onClick={() => setLog({ ...log, water: log.water + 1 })}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Mood */}
      <div className={styles.section}>
        <label className={styles.label}>How is your mood today?</label>
        <div className={styles.moodGrid}>
          {moods.map((emoji, index) => (
            <button
              key={index}
              className={`${styles.moodBtn} ${log.mood === index + 1 ? styles.moodBtnActive : ''}`}
              onClick={() => setLog({ ...log, mood: index + 1 })}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Junk Food */}
      <div className={styles.section}>
        <label className={styles.label}>Junk food intake today?</label>
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="1"
            max="5"
            value={log.junkFood}
            className={styles.slider}
            onChange={(e) => setLog({ ...log, junkFood: parseInt(e.target.value) })}
          />
          <div className={styles.sliderLabels}>
            <span>None</span>
            <span>A lot</span>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className={styles.section}>
        <label className={styles.label}>Did your period start today?</label>
        <div className={styles.toggleWrapper}>
          <button
            className={`${styles.toggleBtn} ${log.periodStart ? styles.toggleBtnActive : ''}`}
            onClick={() => setLog({ ...log, periodStart: true })}
          >
            Yes
          </button>
          <button
            className={`${styles.toggleBtn} ${!log.periodStart ? styles.toggleBtnActive : ''}`}
            onClick={() => setLog({ ...log, periodStart: false })}
          >
            No
          </button>
        </div>
      </div>

      <button 
        className={styles.submitBtn} 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Saving Health Data...' : 'Save Entry'}
      </button>
    </div>
  );
}
