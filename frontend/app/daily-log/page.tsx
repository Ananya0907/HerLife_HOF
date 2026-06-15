'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Calendar, 
  Activity, 
} from 'lucide-react';
import styles from './DailyLog.module.css';
import DailyLogCard from '../../components/dashboard/DailyLogCard';
import DashboardNavbar from '../../components/shared/DashboardNavbar';

export default function DailyLogPage() {
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('herlife_onboarding');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.phase === 'pregnant') {
          router.replace('/pregnant/log');
        } else if (parsed.phase === 'postpartum') {
          router.replace('/postpartum/log');
        }
      } catch (e) {}
    }
  }, [router]);

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="log" />

      <main className={styles.content}>
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
        >
          <DailyLogCard onSave={() => router.push('/dashboard/young_women')} />
        </motion.div>
      </main>
    </div>
  );
}

// Inline motion component since framer-motion is used
import { motion } from 'framer-motion';
