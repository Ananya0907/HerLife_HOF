'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Apple, 
  Dumbbell,
  BookOpen,
  FileText,
  Baby
} from 'lucide-react';
import styles from './PregnantDashboard.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import ProfileBanner from './ProfileBanner';
import ProfileCompletionModal from './ProfileCompletionModal';
import { API_BASE_URL } from '@/utils/api';

const trimesterData = {
  '1st': {
    name: 'First Trimester',
    babySizeText: 'Size of a Raspberry',
    babyIcon: '🍓',
    babyDesc: 'Your baby is about 0.6 inches long and weighs around 0.04 ounces.',
    babyNotice: 'Heart is beating, and tiny arms and legs are forming!',
    tips: [
      { 
        title: "Ensure proper folate/prenatal intake", 
        desc: "Crucial for neural tube development.",
        colorClass: styles.tipColor1
      },
      { 
        title: "Prioritize rest - fatigue is common", 
        desc: "Your body is working hard to build the placenta.",
        colorClass: styles.tipColor2
      },
      { 
        title: "Stay hydrated - drink plenty of water", 
        desc: "Helps maintain amniotic fluid levels.",
        colorClass: styles.tipColor3
      }
    ]
  },
  '2nd': {
    name: 'Second Trimester',
    babySizeText: 'Size of a Bell Pepper',
    babyIcon: '🫑',
    babyDesc: 'Your baby is about 5.6 inches long and weighs around 6.7 ounces.',
    babyNotice: 'Baby can now yawn, hiccup, and make facial expressions!',
    tips: [
      { 
        title: "Stay hydrated - drink at least 8-10 glasses of water daily", 
        desc: "Hydration is crucial for amniotic fluid levels.",
        colorClass: styles.tipColor1
      },
      { 
        title: "Take your prenatal vitamins with food", 
        desc: "Helps with absorption and reduces nausea.",
        colorClass: styles.tipColor2
      },
      { 
        title: "Gentle exercise like walking is great for you and baby", 
        desc: "Aim for 30 minutes of moderate activity most days.",
        colorClass: styles.tipColor3
      }
    ]
  },
  '3rd': {
    name: 'Third Trimester',
    babySizeText: 'Size of a Honeydew Melon',
    babyIcon: '🍈',
    babyDesc: 'Your baby is about 18.5 inches long and weighs around 4.5 pounds.',
    babyNotice: 'Baby can open and close their eyes, and is practicing breathing!',
    tips: [
      { 
        title: "Prepare your hospital bag and birth plan", 
        desc: "Keep essentials ready for the big day.",
        colorClass: styles.tipColor1
      },
      { 
        title: "Monitor baby's kick count daily", 
        desc: "Track movements at consistent times.",
        colorClass: styles.tipColor2
      },
      { 
        title: "Sleep on your side to maximize circulation", 
        desc: "Use pregnancy pillows for extra comfort.",
        colorClass: styles.tipColor3
      }
    ]
  }
};

export default function PregnantDashboard({ userName }: { userName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [displayedName, setDisplayedName] = useState(userName || '');
  
  // Dynamic pregnancy calculation states
  const [currentWeek, setCurrentWeek] = useState<number>(18); // Default fallback
  const [trimester, setTrimester] = useState<'1st' | '2nd' | '3rd'>('2nd');
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const loadHealthData = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      // 1. Fetch dashboard data (checks needs_details, BMI)
      const dashRes = await fetch(`${API_BASE_URL}/api/dashboard-data/${userId}`);
      const dashData = await dashRes.json();
      
      if (!dashData.error) {
        if (dashData.userName) {
          setDisplayedName(dashData.userName);
        }
        if (dashData.needs_details !== undefined) {
          setIsProfileComplete(!dashData.needs_details);
        }
        if (dashData.wellness) {
          setHeight(dashData.wellness.height_cm);
          setWeight(dashData.wellness.weight_kg);
        }
      }

      // 2. Fetch full profile to get pregnancy start date
      const profRes = await fetch(`${API_BASE_URL}/api/user-profile/${userId}`);
      const profData = await profRes.json();
      
      if (!profData.error) {
        const symptoms = profData.health?.model_symptoms || {};
        const startDateStr = symptoms.pregnancy_start_date;
        
        if (startDateStr) {
          const start = new Date(startDateStr);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          let weekVal = Math.floor(diffDays / 7);
          
          if (weekVal < 1) weekVal = 1;
          if (weekVal > 40) weekVal = 40;
          
          setCurrentWeek(weekVal);
          
          let triVal: '1st' | '2nd' | '3rd' = '2nd';
          if (weekVal <= 13) {
            triVal = '1st';
          } else if (weekVal >= 14 && weekVal <= 27) {
            triVal = '2nd';
          } else {
            triVal = '3rd';
          }
          setTrimester(triVal);
        }
      }
    } catch (e) {
      console.error("Failed to load pregnant dashboard health data:", e);
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
      const mappedData = {
        user_id: userId,
        height_cm: parseFloat(data.height_cm),
        weight_kg: parseFloat(data.weight_kg),
        exercise_frequency: data.exercise,
        sleep_duration: data.sleep,
        junk_food_frequency: data.junk === 'Never' ? 1 : data.junk === 'Rarely' ? 2 : data.junk === 'Sometimes' ? 3 : data.junk === 'Often' ? 4 : 5,
        sugar_intake: data.sugar === 'Never' ? 1 : data.sugar === 'Rarely' ? 2 : data.sugar === 'Sometimes' ? 3 : data.sugar === 'Often' ? 4 : 5,
        caffeine_intake: data.caffeine,
        water_intake: data.water === 'Less than 1L' ? 0.5 : data.water === '1-2L' ? 1.5 : data.water === '2-3L' ? 2.5 : 3.5,
      };

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedData)
      });

      if (response.ok) {
        setIsProfileComplete(true);
        setShowProfileModal(false);
        loadHealthData(); // Refresh details
      }
    } catch (e) {
      console.error("Failed to complete profile:", e);
    }
  };

  const getDueDateString = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const currentTriData = trimesterData[trimester];
  const moods = ["Energetic", "Nauseous", "Tired", "Good"];

  // Total duration of pregnancy is 40 weeks
  const daysLeft = Math.max(0, (40 - currentWeek) * 7);

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="home" />

      <main className={styles.content}>
        
        {!isProfileComplete && (
          <ProfileBanner onOpenModal={() => setShowProfileModal(true)} />
        )}

        {/* Hero Card */}
        <div className={`${styles.card} ${styles.heroCard}`}>
          <div className={styles.heroHeaderRow}>
            <div className={styles.heroTitle}>
              <Baby size={32} /> {currentTriData.name}
            </div>
          </div>

          <div className={styles.heroSubtitle}>
            Week {currentWeek} of your pregnancy
          </div>
          
          <div className={styles.heroStatsGrid}>
            <div className={styles.heroStatBox}>
              <div className={styles.statLabel}>Current Week</div>
              <div className={styles.statValue}>
                {currentWeek}
              </div>
            </div>
            <div className={styles.heroStatBox}>
              <div className={styles.statLabel}>Days Until Due</div>
              <div className={styles.statValue}>{daysLeft}</div>
            </div>
            <div className={styles.heroStatBox}>
              <div className={styles.statLabel}>Due Date</div>
              <div className={styles.statValue}>{getDueDateString(daysLeft)}</div>
            </div>
          </div>
        </div>

        {/* Baby This Week */}
        <div className={`${styles.card} ${styles.babyCard}`}>
          <div className={styles.babyTitle}>Your Baby This Week</div>
          <div className={styles.babyContent}>
            <div className={styles.babyIcon}>{currentTriData.babyIcon}</div>
            <div className={styles.babyInfo}>
              <div className={styles.sectionHeader} style={{ marginBottom: '0.5rem' }}>{currentTriData.babySizeText}</div>
              <div className={styles.babyDesc}>{currentTriData.babyDesc}</div>
              <div className={styles.babyNotice}>
                <span style={{ color: '#F59E0B' }}>💫</span> {currentTriData.babyNotice}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.quickLinksGrid}>
          <button className={styles.quickLinkCard} onClick={() => router.push('/pregnant/nutrition')}>
            <div className={styles.quickLinkIcon}>
              <Apple size={24} />
            </div>
            <div className={styles.quickLinkTitle}>Nutrition</div>
            <div className={styles.quickLinkDesc}>What to eat during pregnancy</div>
          </button>

          <button className={styles.quickLinkCard} onClick={() => router.push('/pregnant/exercise')}>
            <div className={styles.quickLinkIcon}>
              <Dumbbell size={24} />
            </div>
            <div className={styles.quickLinkTitle}>Exercise</div>
            <div className={styles.quickLinkDesc}>Safe workouts for pregnancy</div>
          </button>

          <button className={`${styles.quickLinkCard} ${styles.quickLinkCardPink}`} onClick={() => router.push('/pregnant/learn')}>
            <div className={`${styles.quickLinkIcon} ${styles.quickLinkIconPink}`}>
              <BookOpen size={24} />
            </div>
            <div className={styles.quickLinkTitle}>Learn</div>
            <div className={styles.quickLinkDesc}>Pregnancy education</div>
          </button>

          <button className={styles.quickLinkCard} onClick={() => router.push('/pregnant/log')}>
            <div className={styles.quickLinkIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.quickLinkTitle}>Daily Log</div>
            <div className={styles.quickLinkDesc}>Track your day</div>
          </button>
        </div>



      </main>

      {showProfileModal && (
        <ProfileCompletionModal 
          initialHeight={height}
          initialWeight={weight}
          onClose={() => setShowProfileModal(false)}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
}
