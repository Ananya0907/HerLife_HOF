'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Activity, 
  BookOpen,
  FileText,
  Book,
  Lightbulb,
  Video,
  Play
} from 'lucide-react';
import styles from './PostpartumLearn.module.css';
import UserMenu from '../shared/UserMenu';

export default function PostpartumLearnPage() {
  const router = useRouter();

  const facts = [
    { title: "Six Week Recovery", desc: "Most women recover from childbirth within 6-8 weeks, though everyone heals at their own pace." },
    { title: "Postpartum Bleeding", desc: "Bleeding (lochia) typically lasts 2-6 weeks as the uterus heals and returns to normal size." },
    { title: "Mood Changes", desc: "Baby blues affect up to 80% of new mothers. If symptoms persist beyond 2 weeks, talk to your doctor." },
    { title: "Period Return", desc: "Periods may return 6-8 weeks postpartum or later if breastfeeding. Cycles may be irregular at first." }
  ];

  const videos = [
    { title: "Postpartum Recovery Guide", author: "Mayo Clinic", duration: "11:30", color: "#F08A8A" },
    { title: "Newborn Care Basics", author: "Cleveland Clinic", duration: "14:20", color: "#C04A55" },
    { title: "Breastfeeding Support", author: "La Leche League", duration: "18:45", color: "#FCD3A1" }
  ];

  const topics = [
    { emoji: "🩺", title: "Physical Recovery", desc: "Healing after childbirth" },
    { emoji: "💚", title: "Mental Health", desc: "Emotional wellbeing & PPD awareness" },
    { emoji: "👶", title: "Baby Care", desc: "Feeding, sleep & development" },
    { emoji: "💪", title: "Exercise Return", desc: "When and how to start exercising" },
    { emoji: "😴", title: "Sleep & Rest", desc: "Getting rest with a newborn" },
    { emoji: "🍎", title: "Nutrition", desc: "Eating for recovery & breastfeeding" }
  ];

  const warnings = [
    "Heavy bleeding (soaking a pad in 1 hour)",
    "Severe headaches or vision changes",
    "Chest pain or difficulty breathing",
    "Signs of infection (fever, foul-smelling discharge)",
    "Thoughts of harming yourself or baby",
    "Severe abdominal pain"
  ];

  const amazingItems = [
    { emoji: "✨", text: "Recovery takes time - be patient with yourself" },
    { emoji: "💪", text: "Your body has done something incredible" },
    { emoji: "🫂", text: "Ask for help when you need it" },
    { emoji: "🌸", text: "Prioritize rest and self-care" },
    { emoji: "💖", text: "You're not alone in this journey" }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Heart fill="currentColor" color="var(--primary)" size={28} />
          HerLife
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push('/dashboard/postpartum')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/postpartum/wellness')}>
            <Activity size={20} /> Track Wellness
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => {}}>
            <BookOpen size={20} /> Learn
          </button>
          <button className={styles.navItem} onClick={() => router.push('/postpartum/log')}>
            <FileText size={20} /> Daily Log
          </button>
          <button className={styles.navItem} onClick={() => router.push('/postpartum/mental-health')}>
            <Heart size={20} /> Mental Health
          </button>
          <UserMenu />
        </div>
      </nav>

      <main className={styles.content}>
        
        {/* Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.headerTitle}>
            <Book color="var(--primary)" size={28} /> Postpartum Education
          </div>
          <div className={styles.headerSubtitle}>
            Understanding your postpartum journey helps you navigate recovery, care for your baby, and recognize when to seek support.
          </div>
        </div>

        {/* Quick Facts */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <Lightbulb color="var(--primary)" size={24} /> Postpartum Quick Facts
          </div>
          <div className={styles.factsGrid}>
            {facts.map((fact, idx) => (
              <div key={idx} className={styles.factCard}>
                <div className={styles.factTitle}>{fact.title}</div>
                <div className={styles.factDesc}>{fact.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <Video color="var(--primary)" size={24} /> Educational Videos
          </div>
          <div className={styles.videosGrid}>
            {videos.map((vid, idx) => (
              <div key={idx} className={styles.videoCard}>
                <div className={styles.videoThumbnail} style={{ backgroundColor: vid.color }}>
                  <div className={styles.playIcon}>
                    <Play fill="currentColor" size={24} />
                  </div>
                  <div className={styles.videoDuration}>{vid.duration}</div>
                </div>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{vid.title}</div>
                  <div className={styles.videoAuthor}>{vid.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            Topics to Explore
          </div>
          <div className={styles.topicsGrid}>
            {topics.map((topic, idx) => (
              <div key={idx} className={styles.topicCard}>
                <div className={styles.topicEmoji}>{topic.emoji}</div>
                <div className={styles.topicTitle}>{topic.title}</div>
                <div className={styles.topicDesc}>{topic.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            Warning Signs - When to Call Your Doctor
          </div>
          <div className={styles.warningGrid}>
            {warnings.map((warn, idx) => (
              <div key={idx} className={styles.warningItem}>
                <span className={styles.warningIcon}>⚠️</span>
                {warn}
              </div>
            ))}
          </div>
        </div>

        {/* Amazing Box */}
        <div className={styles.amazingBox}>
          <div className={styles.amazingTitle}>
            <Heart fill="currentColor" size={28} /> You're Doing Amazing
          </div>
          <div className={styles.amazingList}>
            {amazingItems.map((item, idx) => (
              <div key={idx} className={styles.amazingItem}>
                {item.emoji} {item.text}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
