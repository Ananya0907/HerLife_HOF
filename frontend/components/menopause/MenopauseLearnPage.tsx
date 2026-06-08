'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Apple, 
  Dumbbell, 
  Brain, 
  BookOpen, 
  Clock,
  AlertCircle,
  Pill,
  Video,
  Play
} from 'lucide-react';
import styles from './MenopauseLearnPage.module.css';

export default function MenopauseLearnPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      {/* MenoWell Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Heart fill="#D14D72" color="#D14D72" size={28} />
          HerLife
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push('/dashboard')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/nutrition')}>
            <Apple size={20} /> Nutrition
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/exercise')}>
            <Dumbbell size={20} /> Exercise
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/mental-health')}>
            <Brain size={20} /> Mental Health
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <BookOpen size={20} /> Learn
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
        >
          {/* Hero Card */}
          <motion.section className={styles.heroCard} variants={itemVariants}>
            <div className={styles.heroTitle}>
              <BookOpen size={36} color="white" /> Learn About Menopause
            </div>
            <p className={styles.heroSubtitle}>Knowledge is power - understand what's happening in your body</p>
          </motion.section>

          {/* Understanding Menopause Stages */}
          <motion.section className={styles.card} variants={itemVariants}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}><Clock size={28} /></div>
                <h2>Understanding Menopause Stages</h2>
            </div>
            <div className={styles.stageList}>
               <div className={styles.stageCard}>
                  <span className={styles.stageEmoji}>🌸</span>
                  <div className={styles.stageInfo}>
                     <h3>Perimenopause (Transition Phase)</h3>
                     <p><strong>Timing:</strong> Usually begins in your 40s, but can start as early as mid-30s. Lasts 4-8 years on average.</p>
                     <p><strong>What happens:</strong> Ovaries gradually produce less estrogen. Periods become irregular - may be heavier, lighter, closer together, or farther apart.</p>
                     <p><strong>Common symptoms:</strong> Hot flashes, night sweats, mood changes, sleep problems, irregular periods, vaginal dryness, decreased libido, brain fog.</p>
                  </div>
               </div>
               <div className={styles.stageCard} style={{borderColor: '#FFD8A8'}}>
                  <span className={styles.stageEmoji}>🦋</span>
                  <div className={styles.stageInfo}>
                     <h3>Menopause (The Milestone)</h3>
                     <p><strong>Timing:</strong> Average age is 51, but can occur anywhere from 40-58. Earlier than 40 is considered premature menopause.</p>
                     <p><strong>What happens:</strong> Officially reached when you've gone 12 consecutive months without a period. Ovaries have stopped releasing eggs.</p>
                     <p><strong>Important:</strong> This is a single point in time, not a phase. Once you've reached this milestone, you're in postmenopause.</p>
                  </div>
               </div>
               <div className={styles.stageCard}>
                  <span className={styles.stageEmoji}>🌺</span>
                  <div className={styles.stageInfo}>
                     <h3>Postmenopause (Life After)</h3>
                     <p><strong>Timing:</strong> All the years after your final period. This is the rest of your life.</p>
                     <p><strong>What happens:</strong> Hormone levels stabilize at lower levels. Some symptoms may ease, but low estrogen continues to affect the body.</p>
                     <p><strong>Health focus:</strong> Increased risk of osteoporosis and heart disease. Focus on bone health, cardiovascular fitness, and preventive care.</p>
                  </div>
               </div>
            </div>
          </motion.section>

          {/* Common Symptoms Explained */}
          <motion.section className={styles.card} variants={itemVariants}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}><BookOpen size={28} /></div>
                <h2>Common Symptoms Explained</h2>
            </div>
            <div className={styles.symptomGrid}>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>🔥</span>
                  <h3>Hot Flashes & Night Sweats</h3>
                  <p>Sudden feeling of heat, often with sweating and red skin. Caused by changing estrogen levels affecting your body's thermostat. Can last seconds to minutes.</p>
               </div>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>😴</span>
                  <h3>Sleep Disturbances</h3>
                  <p>Difficulty falling asleep or staying asleep. Often linked to night sweats, anxiety, or hormonal changes affecting sleep cycles.</p>
               </div>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>😌</span>
                  <h3>Mood Changes</h3>
                  <p>Irritability, anxiety, sadness, or mood swings. Estrogen affects neurotransmitters like serotonin that regulate mood.</p>
               </div>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>🧠</span>
                  <h3>Brain Fog</h3>
                  <p>Difficulty concentrating, memory lapses, or feeling mentally fuzzy. Linked to hormonal changes and often sleep disruption.</p>
               </div>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>⚖️</span>
                  <h3>Weight Gain</h3>
                  <p>Metabolism slows and body composition changes, with fat redistributing to the abdomen. Muscle mass also decreases.</p>
               </div>
               <div className={styles.symptomCard}>
                  <span className={styles.symptomEmoji}>💧</span>
                  <h3>Vaginal Dryness</h3>
                  <p>Lower estrogen thins vaginal tissues and reduces moisture, which can cause discomfort or pain during intimacy.</p>
               </div>
            </div>
          </motion.section>

          {/* When to See a Doctor */}
          <motion.section className={styles.card} variants={itemVariants}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}><AlertCircle size={28} color="#D14D72" /></div>
                <h2>When to See a Doctor</h2>
            </div>
            <p className={styles.sectionIntro}>While menopause is natural, you don't have to suffer through it. See your healthcare provider if:</p>
            <div className={styles.doctorList}>
               <div className={`${styles.doctorItem} ${styles.color1}`}>
                  <div className={styles.doctorDot}></div>
                  <p>Symptoms significantly impact your quality of life, work, or relationships</p>
               </div>
               <div className={`${styles.doctorItem} ${styles.color2}`}>
                  <div className={styles.doctorDot}></div>
                  <p>You experience bleeding after 12 months without a period (postmenopausal bleeding requires evaluation)</p>
               </div>
               <div className={`${styles.doctorItem} ${styles.color1}`}>
                  <div className={styles.doctorDot}></div>
                  <p>You're experiencing severe depression, anxiety, or mood changes</p>
               </div>
               <div className={`${styles.doctorItem} ${styles.color2}`}>
                  <div className={styles.doctorDot}></div>
                  <p>You want to discuss treatment options like hormone replacement therapy</p>
               </div>
               <div className={`${styles.doctorItem} ${styles.color1}`}>
                  <div className={styles.doctorDot}></div>
                  <p>Menopause symptoms begin before age 40 (premature menopause)</p>
               </div>
            </div>
          </motion.section>

          {/* HRT Section */}
          <motion.section className={styles.card} variants={itemVariants}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}><Pill size={28} /></div>
                <h2>Hormone Replacement Therapy (HRT)</h2>
            </div>
            
            <div className={styles.hrtBox}>
               <h3>What is HRT?</h3>
               <p>Medication containing female hormones (estrogen, progesterone, or both) to replace those your body no longer makes after menopause. Available as pills, patches, gels, creams, or vaginal rings.</p>
            </div>

            <div className={styles.hrtGrid}>
               <div className={styles.benefitBox}>
                  <h3>Benefits</h3>
                  <ul className={styles.hrtList}>
                     <li>Relieves hot flashes and night sweats</li>
                     <li>Prevents bone loss and reduces fracture risk</li>
                     <li>Relieves vaginal dryness and discomfort</li>
                     <li>May improve mood and sleep</li>
                     <li>Can reduce risk of colon cancer</li>
                  </ul>
               </div>
               <div className={styles.riskBox}>
                  <h3>Risks</h3>
                  <ul className={styles.hrtList}>
                     <li>Slightly increased risk of blood clots</li>
                     <li>May increase breast cancer risk with long-term use</li>
                     <li>May increase stroke risk in older women</li>
                     <li>Not suitable for everyone (history of certain cancers, heart disease)</li>
                     <li>Side effects possible (bloating, headaches, mood changes)</li>
                  </ul>
               </div>
            </div>

            <div className={styles.hrtBox} style={{marginTop: '1.5rem'}}>
               <h3>Is HRT right for you?</h3>
               <p>This is a personal decision to discuss with your healthcare provider. HRT is most effective when started within 10 years of menopause or before age 60. Your doctor will consider your symptoms, health history, and risk factors. The lowest effective dose for the shortest time is generally recommended.</p>
            </div>
          </motion.section>

          {/* Video Resources */}
          <motion.section className={styles.card} variants={itemVariants}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}><Video size={28} /></div>
                <h2>Educational Videos About Menopause</h2>
            </div>
            <p className={styles.sectionIntro}>Recommended topics to explore:</p>
            <div className={styles.videoGrid}>
               <div className={styles.videoCard}>
                  <Play className={styles.videoIcon} size={24} />
                  <h3>What Happens During Menopause</h3>
                  <p>Understanding the biological changes in your body</p>
               </div>
               <div className={styles.videoCard}>
                  <Play className={styles.videoIcon} size={24} />
                  <h3>Managing Hot Flashes</h3>
                  <p>Practical tips and strategies for symptom relief</p>
               </div>
               <div className={styles.videoCard}>
                  <Play className={styles.videoIcon} size={24} />
                  <h3>HRT Explained</h3>
                  <p>Understanding hormone replacement therapy options</p>
               </div>
            </div>
            <p style={{fontSize: '0.8rem', color: '#6B7280', textAlign: 'center', marginTop: '1.5rem'}}>Search for these topics on trusted sources like Mayo Clinic, Cleveland Clinic, Johns Hopkins Medicine, or the North American Menopause Society (NAMS).</p>
          </motion.section>

          {/* Final Empowerment Card */}
          <motion.section className={styles.footerCard} variants={itemVariants}>
             <div className={styles.footerIcon}>💪</div>
             <h2>Knowledge is Power</h2>
             <p>Understanding what's happening in your body helps you make informed decisions about your health. You're not going through this alone - millions of women experience menopause, and there are many effective treatments and strategies available. Don't hesitate to advocate for yourself and seek the support you deserve.</p>
          </motion.section>

        </motion.div>
      </main>
    </div>
  );
}
