'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Activity, 
  BookOpen, 
  Gamepad2, 
  HelpCircle,
  MonitorPlay,
  Lightbulb,
  Play
} from 'lucide-react';
import styles from './PreteenLearn.module.css';
import UserMenu from '../shared/UserMenu';

export default function PreteenLearnPage() {
  const router = useRouter();

  const facts = [
    {
      title: "It's Normal!",
      desc: "Everyone grows at their own pace, and that's perfectly okay!",
      colorClass: styles.factCardGreen
    },
    {
      title: "Growing Taller!",
      desc: "You might experience growth spurts. Keep eating healthy to support your body!",
      colorClass: styles.factCardYellow
    },
    {
      title: "Emotions Can Change",
      desc: "It's normal to feel happy, sad, or frustrated as you grow. Talking helps!",
      colorClass: styles.factCardPink
    },
    {
      title: "You Are Capable!",
      desc: "You can play sports, learn new things, and do all your favorite activities!",
      colorClass: styles.factCardBlue
    }
  ];

  const topics = [
    { icon: "🧬", title: "What are Hormones?", desc: "Learn the basics about your body's messengers" },
    { icon: "🍎", title: "Healthy Habits", desc: "Nutrition and sleep for a growing body" },
    { icon: "🎢", title: "Handling Emotions", desc: "Tips to feel better when you're stressed" },
    { icon: "🌟", title: "Discovering You", desc: "How to know what you're good at" },
    { icon: "🏃‍♀️", title: "Staying Active", desc: "Fun ways to exercise and play" },
    { icon: "💬", title: "Talking About It", desc: "How to ask questions" }
  ];

  const videos = [
    {
      title: "Understanding Your Body",
      channel: "Teen Health",
      time: "6:20",
      thumbClass: styles.videoThumbBlue
    },
    {
      title: "Talking to Your Parents",
      channel: "Family First",
      time: "4:15",
      thumbClass: styles.videoThumbGreen
    },
    {
      title: "What are Hormones?",
      channel: "Kids Health",
      time: "5:30",
      thumbClass: styles.videoThumbPink
    }
  ];

  const tips = [
    { icon: "✨", text: "Changes are totally normal and natural!" },
    { icon: "💪", text: "Your body is amazing and strong!" },
    { icon: "🫂", text: "It's okay to ask questions - lots of people can help!" },
    { icon: "🌟", text: "Everyone's experience is different and that's okay!" },
    { icon: "💖", text: "You're not alone - millions of kids go through this!" }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Heart fill="currentColor" color="#4797B1" size={28} />
          HerLife
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push('/dashboard/preteen')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/preteen/wellness')}>
            <Activity size={20} /> Wellness
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => {}}>
            <BookOpen size={20} /> Learn
          </button>
          <button className={styles.navItem} onClick={() => router.push('/preteen/play')}>
            <Gamepad2 size={20} /> Play & Learn
          </button>
          <button className={styles.navItem} onClick={() => router.push('/preteen/test')}>
            <HelpCircle size={20} /> Test It Out
          </button>
          <UserMenu />
        </div>
      </nav>

      <main className={styles.content}>
        
        {/* Header Card */}
        <div className={`${styles.card} ${styles.cardBlueBorder}`}>
          <div className={styles.sectionTitle}>
            <BookOpen size={28} color="#4797B1" /> Learn About Growing Up! 📚
          </div>
          <div className={styles.heroDesc}>
            Knowledge is power! Learn everything you need to know about growing up in a fun and easy way.
          </div>
        </div>

        {/* Quick Facts */}
        <div className={`${styles.card} ${styles.cardGreenBorder}`}>
          <div className={styles.sectionTitle}>
            <Lightbulb size={24} color="#4797B1" /> Quick Growing Up Facts! ✨
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
        <div className={`${styles.card} ${styles.cardBlueBorder}`}>
          <div className={styles.sectionTitle}>
            <BookOpen size={24} color="#4797B1" /> Topics to Explore 🔍
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
        <div className={`${styles.card} ${styles.cardBlueBorder}`}>
          <div className={styles.sectionTitle}>
            <MonitorPlay size={24} color="#4797B1" /> Educational Videos 📺
          </div>
          <div className={styles.videoGrid}>
            {videos.map((video, idx) => (
              <div key={idx} className={styles.videoCard}>
                <div className={`${styles.videoThumbnail} ${video.thumbClass}`}>
                  <div className={styles.timeBadge}>{video.time}</div>
                  <button className={styles.playBtn}>
                    <Play fill="currentColor" size={24} />
                  </button>
                </div>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{video.title}</div>
                  <div className={styles.videoChannel}>{video.channel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remember Footer */}
        <div className={styles.rememberFooter}>
          <div className={styles.rememberTitle}>
            <Heart fill="currentColor" size={28} /> Remember! 💕
          </div>
          <div className={styles.rememberList}>
            {tips.map((tip, idx) => (
              <div key={idx} className={styles.rememberItem}>
                <span style={{ fontSize: '1.25rem' }}>{tip.icon}</span> {tip.text}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
