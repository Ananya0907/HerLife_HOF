'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Activity,
  Lightbulb,
  CheckCircle2,
  Circle,
  Salad,
  Dumbbell,
  Leaf,
  Pill,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';
import styles from './PcosSupport.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { API_BASE_URL } from '@/utils/api';

export default function PcosSupportPage() {
  const router = useRouter();

  // Initial state matches the screenshot
  const [symptoms, setSymptoms] = useState({
    'Irregular periods': true,
    'Excessive hair growth': false,
    'Weight gain': true,
    'Acne': false,
    'Hair thinning': false
  });

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setIsGuest(true);
      // Mock history for guest
      setHistory([
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
      ]);
      return;
    }

    setIsGuest(false);
    const fetchSymptoms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/pcos-symptoms/${userId}`);
        const data = await res.json();
        if (data.pcos_active) {
          setSymptoms(prev => ({
            ...prev,
            ...data.pcos_active
          }));
        }
        if (data.pcos_history) {
          setHistory(data.pcos_history);
        }
      } catch (e) {
        console.error('Error fetching PCOS symptoms:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const handleUpdate = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      const nowStr = new Date().toISOString();
      setHistory(prev => [
        { date: nowStr, symptoms: { ...symptoms } },
        ...prev
      ]);
      alert("Demo Mode: Symptoms updated locally. Log in to save permanently!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/pcos-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          symptoms: symptoms
        })
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.pcos_history);
        alert("PCOS symptoms updated successfully!");
      } else {
        alert("Failed to update symptoms: " + data.error);
      }
    } catch (e) {
      console.error("Error updating symptoms:", e);
      alert("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [selectedStory, setSelectedStory] = useState<{id: number, user: string, title: string, fullText: string} | null>(null);

  const stories = [
    { id: 1, user: '@sarah_wellness', title: "After 3 months of following a low-GI diet...", fullText: "My cycles became more regular, and I lost 15 pounds. Small changes really do add up! I also focused on eating more protein which helped curb my cravings significantly." },
    { id: 2, user: '@emma_health', title: "Combining strength training with stress management...", fullText: "My energy levels improved dramatically, and my hormones started to balance naturally. Yoga and lifting weights twice a week changed my entire PCOS experience!" },
    { id: 3, user: '@mia_lifestyle', title: "Taking inositol and Vitamin D daily...", fullText: "It took a few months, but I finally got my period back naturally! Consistency with my supplements has been the absolute key to my PCOS management." }
  ];

  const toggleSymptom = (name: string) => {
    setSymptoms(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const dietTips = [
    'Focus on low-glycemic index foods',
    'Include anti-inflammatory foods (berries, fatty fish, leafy greens)',
    'Reduce refined carbohydrates and sugars',
    'Eat protein with every meal to balance blood sugar'
  ];

  const exerciseTips = [
    'Regular moderate exercise (30 minutes, 5 times a week)',
    'Combine cardio with strength training',
    'Try stress-reducing exercises like yoga',
    'Avoid over-exercising which can increase cortisol'
  ];

  const lifestyleTips = [
    'Prioritize 7-9 hours of quality sleep',
    'Practice stress management techniques',
    'Maintain a consistent daily routine',
    'Limit caffeine and alcohol intake'
  ];

  const supplementTips = [
    'Inositol (consult your doctor)',
    'Vitamin D3',
    'Omega 3 fatty acids',
    'Magnesium for better sleep and insulin sensitivity'
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="pcos" />

      <main className={styles.content}>
        {/* Hero Card */}
        <div className={`${styles.card} ${styles.heroCard}`}>
          <div className={styles.heroTitle}>
            <Heart fill="currentColor" size={28} /> PCOS Support Center
          </div>
          <div className={styles.heroText}>
            Polycystic Ovary Syndrome (PCOS) affects 1 in 10 women. You're not alone, and with the right approach, symptoms can be managed effectively.
          </div>
          <div className={styles.heroSubBox}>
            <div className={styles.heroSubBoxTitle}>
              <Lightbulb fill="currentColor" color="#FCD34D" size={20} /> Remember
            </div>
            <div className={styles.heroSubBoxText}>
              Small, consistent lifestyle changes can make a significant difference in managing PCOS symptoms.
            </div>
          </div>
        </div>

        {/* Symptom Tracker */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Symptom Tracker</div>
          <div className={styles.symptomGrid}>
            {Object.entries(symptoms).map(([name, active]) => (
              <div 
                key={name}
                className={`${styles.symptomItem} ${active ? styles.symptomActive : styles.symptomInactive}`}
                onClick={() => toggleSymptom(name)}
              >
                {name}
                {active ? <CheckCircle2 size={20} color="currentColor" /> : <Circle size={20} color="currentColor" />}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className={styles.updateBtn} onClick={handleUpdate} disabled={loading} style={{ flex: 1, margin: 0 }}>
              {loading ? 'Updating...' : 'Update Symptoms'}
            </button>
            <button 
              className={styles.reportBtn} 
              onClick={() => router.push('/learn/report?type=pcos')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'white',
                backgroundColor: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(209, 77, 114, 0.2)',
                flex: 1
              }}
            >
              Generate PDF Report
            </button>
          </div>
        </div>

        {/* Symptom Logging History */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <Activity size={24} color="var(--primary)" /> Symptom Logging History
          </div>
          {isGuest && (
            <div style={{ backgroundColor: '#FFFBEB', color: '#D97706', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
              You are in <b>Demo Mode</b>. History entries are saved locally in memory. Log in to sync across devices.
            </div>
          )}
          {history.length > 0 ? (
            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Log Timestamp</th>
                    <th>Reported PCOS Symptoms</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => {
                    const formattedDate = new Date(entry.date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formattedDate}</td>
                        <td>
                          {Object.entries(entry.symptoms).map(([name, active]) => (
                            <span 
                              key={name} 
                              className={active ? styles.activeBadge : styles.inactiveBadge}
                            >
                              {name}
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '1rem', color: 'var(--foreground-muted)' }}>
              No symptom logs recorded yet. Select symptoms above and press "Update Symptoms" to begin tracking.
            </div>
          )}
        </div>

        {/* Advice Grid */}
        <div className={styles.adviceGrid}>
          {/* Diet */}
          <div className={styles.adviceCard}>
            <div className={styles.adviceHeader}>
              <Salad color="var(--primary)" size={24} /> Diet
            </div>
            <div className={styles.adviceList}>
              {dietTips.map((tip, idx) => (
                <div key={idx} className={styles.adviceItem}>
                  <div className={styles.adviceDot}></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Exercise */}
          <div className={styles.adviceCard}>
            <div className={styles.adviceHeader}>
              <Activity color="var(--primary)" size={24} /> Exercise
            </div>
            <div className={styles.adviceList}>
              {exerciseTips.map((tip, idx) => (
                <div key={idx} className={styles.adviceItem}>
                  <div className={styles.adviceDot}></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle */}
          <div className={styles.adviceCard}>
            <div className={styles.adviceHeader}>
              <Leaf color="var(--primary)" size={24} /> Lifestyle
            </div>
            <div className={styles.adviceList}>
              {lifestyleTips.map((tip, idx) => (
                <div key={idx} className={styles.adviceItem}>
                  <div className={styles.adviceDot}></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Supplements */}
          <div className={styles.adviceCard}>
            <div className={styles.adviceHeader}>
              <Pill color="var(--primary)" size={24} /> Supplements
            </div>
            <div className={styles.adviceList}>
              {supplementTips.map((tip, idx) => (
                <div key={idx} className={styles.adviceItem}>
                  <div className={styles.adviceDot}></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* When to see a doctor */}
        <div className={`${styles.card} ${styles.doctorCard}`}>
          <div className={styles.sectionTitle}>
            <AlertCircle color="#C2410C" size={24} /> When to See a Doctor
          </div>
          <div className={styles.doctorText}>
            Consult with a healthcare provider if you experience:
          </div>
          <ul className={styles.doctorList}>
            <li>Missed periods for 3 months or longer</li>
            <li>Difficulty getting pregnant</li>
            <li>Significant weight gain or difficulty losing weight</li>
            <li>Unusual hair growth or hair loss</li>
            <li>Severe acne that doesn't respond to treatment</li>
          </ul>
        </div>

        {/* Success Stories */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <TrendingUp color="var(--primary)" size={24} /> Success Stories & Motivation
          </div>
          <div className={styles.storiesContainer}>
            {stories.map(story => (
               <button key={story.id} className={styles.storyBoxBtn} onClick={() => setSelectedStory(story)}>
                 <span className={styles.storyUser}>{story.user}</span>
                 <span className={styles.storyPreview}>"{story.title}"</span>
                 <span className={styles.storyReadMore}>Read More...</span>
               </button>
            ))}
          </div>
        </div>

        {/* Story Modal */}
        {selectedStory && (
          <div className={styles.modalOverlay} onClick={() => setSelectedStory(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span className={styles.modalUser}>{selectedStory.user}</span>
                <button className={styles.closeBtn} onClick={() => setSelectedStory(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalText}>{selectedStory.fullText}</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
