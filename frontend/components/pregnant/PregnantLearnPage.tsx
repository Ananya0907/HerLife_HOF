'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Apple, 
  Dumbbell,
  BookOpen,
  FileText,
  Lightbulb,
  Video,
  Play
} from 'lucide-react';
import styles from './PregnantLearn.module.css';
import UserMenu from '../shared/UserMenu';

export default function PregnantLearnPage() {
  const router = useRouter();

  const facts = [
    {
      title: "Three Trimesters",
      desc: "Pregnancy is divided into three trimesters, each about 13 weeks long.",
      colorClass: styles.fact1
    },
    {
      title: "Baby's Heart",
      desc: "Your baby's heart begins beating around 6 weeks of pregnancy.",
      colorClass: styles.fact2
    },
    {
      title: "Growing Baby",
      desc: "Your baby grows from the size of a poppy seed to a watermelon in 40 weeks.",
      colorClass: styles.fact3
    },
    {
      title: "Increased Blood Volume",
      desc: "Your blood volume increases by 40-50% during pregnancy to support your baby.",
      colorClass: styles.fact4
    }
  ];

  const topics = [
    { icon: "🗓️", title: "Trimester Changes", desc: "What to expect each trimester" },
    { icon: "👩‍⚕️", title: "Labor & Delivery", desc: "Preparing for birth" },
    { icon: "👶", title: "Baby Development", desc: "How your baby grows" },
    { icon: "🩺", title: "Prenatal Appointments", desc: "What to expect at checkups" },
    { icon: "😴", title: "Common Symptoms", desc: "Managing pregnancy discomforts" },
    { icon: "💪", title: "Staying Healthy", desc: "Wellness during pregnancy" }
  ];

  const videos = [
    {
      title: "First Trimester Guide",
      source: "Mayo Clinic",
      time: "9:30",
      thumbClass: styles.thumbGreen
    },
    {
      title: "Preparing for Labor",
      source: "Cleveland Clinic",
      time: "12:45",
      thumbClass: styles.thumbPink
    },
    {
      title: "Baby Development Week by Week",
      source: "Johns Hopkins",
      time: "15:20",
      thumbClass: styles.thumbLightGreen
    }
  ];

  const rememberTips = [
    { icon: "✨", text: "Every pregnancy is unique and special" },
    { icon: "💪", text: "Your body is doing amazing work growing a new life" },
    { icon: "👥", text: "Don't hesitate to ask questions and seek support" },
    { icon: "🌸", text: "Trust your instincts and listen to your body" },
    { icon: "💖", text: "Taking care of yourself means taking care of your baby" }
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
          <button className={styles.navItem} onClick={() => router.push('/dashboard/pregnant')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/nutrition')}>
            <Apple size={20} /> Nutrition
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/exercise')}>
            <Dumbbell size={20} /> Exercise
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => {}}>
            <BookOpen size={20} /> Learn
          </button>
          <button className={styles.navItem} onClick={() => router.push('/pregnant/log')}>
            <FileText size={20} /> Daily Log
          </button>
          <UserMenu />
        </div>
      </nav>

      <main className={styles.content}>
        
        {/* Header Card */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <BookOpen size={28} color="var(--primary)" /> Learn About Pregnancy
          </div>
          <div className={styles.heroDesc}>
            Knowledge empowers you. Understanding your pregnancy journey helps you make informed decisions and embrace this special time.
          </div>
        </div>

        {/* Quick Facts */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={`${styles.sectionTitle} ${styles.sectionTitlePink}`}>
            <Lightbulb size={24} color="var(--primary)" /> Pregnancy Quick Facts
          </div>
          <div className={styles.factsGrid}>
            {facts.map((fact, idx) => (
              <div key={idx} className={`${styles.factCard} ${fact.colorClass}`}>
                <div className={styles.factTitle}>{fact.title}</div>
                <div className={styles.factDesc}>{fact.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics to Explore */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={styles.sectionTitle}>
            Topics to Explore
          </div>
          <div className={styles.topicsGrid}>
            {topics.map((topic, idx) => (
              <div key={idx} className={styles.topicCard}>
                <div className={styles.topicIcon}>{topic.icon}</div>
                <div className={styles.topicTitle}>{topic.title}</div>
                <div className={styles.topicDesc}>{topic.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Videos */}
        <div className={`${styles.card} ${styles.cardPinkBorder}`}>
          <div className={styles.sectionTitle}>
            <Video size={24} color="var(--primary)" /> Educational Videos
          </div>
          <div className={styles.videosGrid}>
            {videos.map((vid, idx) => (
              <div key={idx} className={styles.videoCard}>
                <div className={`${styles.videoThumbnail} ${vid.thumbClass}`}>
                  <div className={styles.videoBadge}>{vid.time}</div>
                  <div className={styles.videoPlayBtn}>
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{vid.title}</div>
                  <div className={styles.videoSource}>{vid.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remember */}
        <div className={styles.rememberGradientCard}>
          <div className={styles.rememberTitle}>
            <Heart size={28} fill="currentColor" /> Remember
          </div>
          <div className={styles.rememberList}>
            {rememberTips.map((tip, idx) => (
              <div key={idx} className={styles.rememberItem}>
                {tip.icon} {tip.text}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
