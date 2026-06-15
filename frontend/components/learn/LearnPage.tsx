'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart,
  Book,
  Video,
  Play,
  ExternalLink,
  Download
} from 'lucide-react';
import styles from './Learn.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';

export default function LearnPage() {
  const router = useRouter();

  const facts = [
    "The average menstrual cycle is 28 days, but anywhere from 21-35 days is normal",
    "Menstrual blood is not just blood - it contains tissue from the uterine lining",
    "Exercise can help reduce period cramps by releasing endorphins",
    "Your basal body temperature rises slightly after ovulation",
    "The luteal phase is relatively consistent at 12-14 days for most women",
    "Stress can delay or skip your period by affecting hormone production"
  ];

  const videos = [
    { 
      title: "Menstrual Cycle Walkthrough: Phases & Hormonal Regulation", 
      author: "Amoeba Sisters", 
      duration: "16:32", 
      url: "https://www.youtube.com/watch?v=h36poEtEbi4",
      thumbnail: "https://img.youtube.com/vi/h36poEtEbi4/hqdefault.jpg"
    },
    { 
      title: "The Menstrual Cycle Explained: A Guide to the 4 Phases & Hormones", 
      author: "Sprouts", 
      duration: "3:46", 
      url: "https://www.youtube.com/watch?v=wtxQRuEmgyM",
      thumbnail: "https://img.youtube.com/vi/wtxQRuEmgyM/hqdefault.jpg"
    },
    { 
      title: "PCOS & Menstrual Cycle Explained - Symptoms, Infertility, Causes, & Treatment", 
      author: "MedShadow Foundation", 
      duration: "7:25", 
      url: "https://www.youtube.com/watch?v=RMWy9_CQZxc",
      thumbnail: "https://img.youtube.com/vi/RMWy9_CQZxc/hqdefault.jpg"
    }
  ];

  const reading = [
    { 
      title: "How does the menstrual cycle work?", 
      desc: "A biological overview of the hormonal changes that trigger ovulation and menstruation.", 
      source: "NCBI Bookshelf", 
      url: "https://www.ncbi.nlm.nih.gov/books/NBK279054/" 
    },
    { 
      title: "How to Relieve PMS Symptoms Naturally", 
      desc: "Natural lifestyle changes, dietary tips, and remedies to ease premenstrual syndrome discomfort.", 
      source: "Healthfab", 
      url: "https://www.healthfab.in/blogs/lifestyle/relieve-premenstrual-syndrome-naturally" 
    },
    { 
      title: "Why Are My Periods Irregular?", 
      desc: "Understanding common causes for irregular menstrual cycles in teens and young women.", 
      source: "TeenBook", 
      url: "https://teenbook.in/my-periods-are-not-regular/" 
    },
    { 
      title: "11 Period Myths and Facts", 
      desc: "Separating misconceptions from scientific facts about periods and cycle symptoms.", 
      source: "Nationwide Children's Hospital", 
      url: "https://www.nationwidechildrens.org/family-resources-education/700childrens/2025/02/11-period-myths-and-facts" 
    }
  ];

  const resources = [
    { title: "Cycle Tracking Journal", desc: "Printable monthly tracker", type: "cycle" },
    { title: "Hormone Guide", desc: "Visual hormone timeline", type: "hormone" },
    { title: "Nutrition Planner", desc: "Meal ideas by cycle phase", type: "nutrition" },
    { title: "Exercise Calendar", desc: "Phase-based workout plan", type: "exercise" }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <DashboardNavbar activeTab="learn" />

      <main className={styles.content}>
        
        {/* Main Header */}
        <div className={styles.sectionHeader} style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          <Book color="var(--primary)" size={32} /> Educational Resources
        </div>
        <div className={styles.sectionSubtitle}>
          Empower yourself with knowledge about menstruation, hormones, and reproductive health.
        </div>

        {/* Quick Facts */}
        <div className={styles.factsBox}>
          <div className={styles.factsTitle}>Quick Facts About Menstruation</div>
          <div className={styles.factsGrid}>
            {facts.map((fact, idx) => (
              <div key={idx} className={styles.factItem}>
                <div className={styles.factNumber}>{idx + 1}</div>
                <div className={styles.factText}>{fact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className={styles.sectionHeader}>
          <Video color="var(--primary)" size={24} /> Educational Videos
        </div>
        <div className={styles.videosGrid}>
          {videos.map((vid, idx) => (
            <a 
              key={idx} 
              href={vid.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.videoCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div 
                className={styles.videoThumbnail} 
                style={{ 
                  backgroundImage: `url(${vid.thumbnail})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              >
                <div className={styles.playIcon}>
                  <Play fill="currentColor" size={24} />
                </div>
                <div className={styles.videoDuration}>{vid.duration}</div>
              </div>
              <div className={styles.videoInfo}>
                <div className={styles.videoTitle}>{vid.title}</div>
                <div className={styles.videoAuthor}>{vid.author}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Recommended Reading */}
        <div className={styles.sectionHeader}>
          <Book color="var(--primary)" size={24} /> Recommended Reading
        </div>
        <div className={styles.readingList} style={{ marginBottom: '3rem' }}>
          {reading.map((item, idx) => (
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.readingCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={styles.readingContent}>
                <div className={styles.readingTitle}>{item.title}</div>
                <div className={styles.readingDesc}>{item.desc}</div>
                <div className={styles.readingSource}>Source: {item.source}</div>
              </div>
              <div className={styles.readButton}>
                Take me to this page <ExternalLink size={16} style={{ marginLeft: '4px' }} />
              </div>
            </a>
          ))}
        </div>

        {/* Downloadable Resources */}
        <div className={styles.resourcesCard}>
          <div className={styles.resourcesHeader}>
            <Download size={28} /> Downloadable Resources
          </div>
          <div className={styles.resourcesSubtitle}>
            Get free guides and printables to help you track and understand your cycle better.
          </div>
          <div className={styles.resourcesGrid}>
            {resources.map((res, idx) => (
              <Link 
                key={idx} 
                href={`/learn/report?type=${res.type}`}
                className={styles.resourceBox}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flex: 1 }}>
                  <div className={styles.resourceTitle}>{res.title}</div>
                  <div className={styles.resourceDesc}>{res.desc}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Download size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
