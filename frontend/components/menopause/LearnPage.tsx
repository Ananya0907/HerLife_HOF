'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Home, 
  Apple,
  Dumbbell,
  BrainCircuit,
  BookOpen,
  Clock,
  Info,
  AlertCircle,
  Pill,
  Video,
  Download
} from 'lucide-react';
import styles from './Learn.module.css';
import UserMenu from '../shared/UserMenu';

export default function MenopauseLearnPage() {
  const router = useRouter();

  const resources = [
    { title: "Cycle Tracking Journal", desc: "Printable monthly tracker", file: "/resources/Cycle_Tracking_Journal.doc" },
    { title: "Hormone Guide", desc: "Visual hormone timeline", file: "/resources/Hormone_Guide.doc" },
    { title: "Nutrition Planner", desc: "Meal ideas by cycle phase", file: "/resources/Nutrition_Planner.doc" },
    { title: "Exercise Calendar", desc: "Phase-based workout plan", file: "/resources/Exercise_Calendar.doc" }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Heart fill="currentColor" color="#D14D72" size={28} />
          HerLife
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push('/dashboard/menopause')}>
            <Home size={20} /> Home
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/nutrition')}>
            <Apple size={20} /> Nutrition
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/exercise')}>
            <Dumbbell size={20} /> Exercise
          </button>
          <button className={styles.navItem} onClick={() => router.push('/menopause/mental-health')}>
            <BrainCircuit size={20} /> Mental Health
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => {}}>
            <BookOpen size={20} /> Learn
          </button>
          <UserMenu />
        </div>
      </nav>

      <main className={styles.content}>
        
        {/* Hero Section */}
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>
            <BookOpen color="white" size={32} /> 
            Learn About Menopause
          </div>
          <div className={styles.heroSubtitle}>
            Knowledge is power - understand what's happening in your body
          </div>
        </div>

        {/* Understanding Menopause Stages */}
        <div className={styles.sectionBox} style={{borderColor: '#E5E7EB'}}>
          <div className={styles.sectionHeader} style={{color: '#8B3A82'}}>
            <Clock size={24} /> Understanding Menopause Stages
          </div>
          <div className={styles.mealList}>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`} style={{flexDirection: 'row', gap: '1.5rem'}}>
              <div style={{fontSize: '2.5rem', marginTop: '0.5rem'}}>🌸</div>
              <div>
                <div className={styles.cardTitle}>Perimenopause (Transition Phase)</div>
                <div className={styles.cardDesc}>
                  <p style={{marginBottom: '0.5rem'}}><strong>Timing:</strong> Usually begins in your 40s, but can start as early as mid-30s. Lasts 4-8 years on average.</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>What happens:</strong> Ovaries gradually produce less estrogen. Periods become irregular - may be heavier, lighter, closer together, or farther apart.</p>
                  <p><strong>Common symptoms:</strong> Hot flashes, night sweats, mood changes, sleep problems, irregular periods, vaginal dryness, decreased libido, brain fog.</p>
                </div>
              </div>
            </div>

            <div className={`${styles.cardBase} ${styles.bgOrange}`} style={{flexDirection: 'row', gap: '1.5rem'}}>
              <div style={{fontSize: '2.5rem', marginTop: '0.5rem'}}>🦋</div>
              <div>
                <div className={styles.cardTitle}>Menopause (The Milestone)</div>
                <div className={styles.cardDesc}>
                  <p style={{marginBottom: '0.5rem'}}><strong>Timing:</strong> Average age is 51, but can occur anywhere from 40-58. Earlier than 40 is considered premature menopause.</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>What happens:</strong> Officially reached when you've gone 12 consecutive months without a period. Ovaries have stopped releasing eggs.</p>
                  <p><strong>Important:</strong> This is a single point in time, not a phase. Once you've reached this milestone, you're in postmenopause.</p>
                </div>
              </div>
            </div>

            <div className={`${styles.cardBase} ${styles.bgLightOrange}`} style={{flexDirection: 'row', gap: '1.5rem'}}>
              <div style={{fontSize: '2.5rem', marginTop: '0.5rem'}}>🌺</div>
              <div>
                <div className={styles.cardTitle}>Postmenopause (Life After)</div>
                <div className={styles.cardDesc}>
                  <p style={{marginBottom: '0.5rem'}}><strong>Timing:</strong> All the years after your final period. This is the rest of your life.</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>What happens:</strong> Hormone levels stabilize at lower levels. Some symptoms may ease, but low estrogen continues to affect the body.</p>
                  <p><strong>Health focus:</strong> Increased risk of osteoporosis and heart disease. Focus on bone health, cardiovascular fitness, and preventive care.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Symptoms Explained */}
        <div className={styles.sectionBox} style={{borderColor: '#5B21B6'}}>
          <div className={styles.sectionHeader} style={{color: '#5B21B6'}}>
            <Info size={24} /> Common Symptoms Explained
          </div>
          <div className={styles.grid2}>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>🔥</div>
              <div className={styles.cardTitle}>Hot Flashes & Night Sweats</div>
              <div className={styles.cardDesc}>Sudden feeling of heat, often with sweating and red skin. Caused by changing estrogen levels affecting your body's thermostat. Can last seconds to minutes.</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>😴</div>
              <div className={styles.cardTitle}>Sleep Disturbances</div>
              <div className={styles.cardDesc}>Difficulty falling asleep or staying asleep. Often linked to night sweats, anxiety, or hormonal changes affecting sleep cycles.</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>😌</div>
              <div className={styles.cardTitle}>Mood Changes</div>
              <div className={styles.cardDesc}>Irritability, anxiety, sadness, or mood swings. Estrogen affects neurotransmitters like serotonin that regulate mood.</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>🧠</div>
              <div className={styles.cardTitle}>Brain Fog</div>
              <div className={styles.cardDesc}>Difficulty concentrating, memory lapses, or feeling mentally fuzzy. Linked to hormonal changes and often sleep disruption.</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>⚖️</div>
              <div className={styles.cardTitle}>Weight Gain</div>
              <div className={styles.cardDesc}>Metabolism slows and body composition changes, with fat redistributing to the abdomen. Muscle mass also decreases.</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '2rem'}}>💧</div>
              <div className={styles.cardTitle}>Vaginal Dryness</div>
              <div className={styles.cardDesc}>Lower estrogen thins vaginal tissues and reduces moisture, which can cause discomfort or pain during intimacy.</div>
            </div>
          </div>
        </div>

        {/* When to See a Doctor */}
        <div className={styles.sectionBox} style={{borderColor: '#FFB085'}}>
          <div className={styles.sectionHeader} style={{color: '#F97316'}}>
            <AlertCircle size={24} /> When to See a Doctor
          </div>
          <p style={{color: '#4B5563', marginBottom: '1rem'}}>While menopause is natural, you don't have to suffer through it. See your healthcare provider if:</p>
          <div className={styles.mealList}>
            <div className={`${styles.mealItem} ${styles.bgLightOrange}`}>
              <div className={styles.mealDot}></div>
              <div className={styles.cardTitle} style={{fontWeight: '500'}}>Symptoms significantly impact your quality of life, work, or relationships</div>
            </div>
            <div className={`${styles.mealItem} ${styles.bgOrange}`}>
              <div className={styles.mealDot}></div>
              <div className={styles.cardTitle} style={{fontWeight: '500'}}>You experience bleeding after 12 months without a period (postmenopausal bleeding requires evaluation)</div>
            </div>
            <div className={`${styles.mealItem} ${styles.bgLightOrange}`}>
              <div className={styles.mealDot}></div>
              <div className={styles.cardTitle} style={{fontWeight: '500'}}>You're experiencing severe depression, anxiety, or mood changes</div>
            </div>
            <div className={`${styles.mealItem} ${styles.bgOrange}`}>
              <div className={styles.mealDot}></div>
              <div className={styles.cardTitle} style={{fontWeight: '500'}}>You want to discuss treatment options like hormone replacement therapy</div>
            </div>
            <div className={`${styles.mealItem} ${styles.bgLightOrange}`}>
              <div className={styles.mealDot}></div>
              <div className={styles.cardTitle} style={{fontWeight: '500'}}>Menopause symptoms begin before age 40 (premature menopause)</div>
            </div>
          </div>
        </div>

        {/* HRT */}
        <div className={styles.sectionBox} style={{borderColor: '#D14D72'}}>
          <div className={styles.sectionHeader} style={{color: '#8B3A82'}}>
            <Pill size={24} /> Hormone Replacement Therapy (HRT)
          </div>
          
          <div style={{marginBottom: '2rem'}}>
            <div className={styles.cardTitle} style={{marginBottom: '0.5rem'}}>What is HRT?</div>
            <div className={styles.cardDesc}>Medication containing female hormones (estrogen, progesterone, or both) to replace those your body no longer makes after menopause. Available as pills, patches, gels, creams, or vaginal rings.</div>
          </div>

          <div className={styles.grid2} style={{marginBottom: '2rem'}}>
            <div className={`${styles.cardBase} ${styles.bgOrange}`}>
              <div className={styles.cardTitle} style={{marginBottom: '0.5rem'}}>Benefits</div>
              <ul style={{margin: 0, paddingLeft: '1.5rem', color: '#4B5563', lineHeight: 1.6}}>
                <li>Relieves hot flashes and night sweats</li>
                <li>Prevents bone loss and reduces fracture risk</li>
                <li>Relieves vaginal dryness and discomfort</li>
                <li>May improve mood and sleep</li>
                <li>Can reduce risk of colon cancer</li>
              </ul>
            </div>
            <div className={`${styles.cardBase} ${styles.bgOrange}`}>
              <div className={styles.cardTitle} style={{marginBottom: '0.5rem'}}>Risks</div>
              <ul style={{margin: 0, paddingLeft: '1.5rem', color: '#4B5563', lineHeight: 1.6}}>
                <li>Slightly increased risk of blood clots</li>
                <li>May increase breast cancer risk with long-term use</li>
                <li>May increase stroke risk in older women</li>
                <li>Not suitable for everyone (history of certain cancers, heart disease)</li>
                <li>Side effects possible (bloating, headaches, mood changes)</li>
              </ul>
            </div>
          </div>

          <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
            <div className={styles.cardTitle} style={{marginBottom: '0.5rem'}}>Is HRT right for you?</div>
            <div className={styles.cardDesc}>This is a personal decision to discuss with your healthcare provider. HRT is most effective when started within 10 years of menopause or before age 60. Your doctor will consider your symptoms, health history, and risk factors. The lowest effective dose for the shortest time is generally recommended.</div>
          </div>
        </div>

        {/* Educational Videos */}
        <div className={styles.sectionBox} style={{borderColor: '#5B21B6'}}>
          <div className={styles.sectionHeader} style={{color: '#5B21B6'}}>
            <Video size={24} /> Educational Videos About Menopause
          </div>
          <p style={{color: '#4B5563', marginBottom: '1.5rem'}}>Recommended topics to explore:</p>
          
          <div className={styles.videoGrid3} style={{marginBottom: '1.5rem'}}>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '1.5rem'}}>🎬</div>
              <div className={styles.cardTitle} style={{marginTop: '0.5rem'}}>What Happens During Menopause</div>
              <div className={styles.cardDesc}>Understanding the biological changes in your body</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '1.5rem'}}>🎬</div>
              <div className={styles.cardTitle} style={{marginTop: '0.5rem'}}>Managing Hot Flashes</div>
              <div className={styles.cardDesc}>Practical tips and strategies for symptom relief</div>
            </div>
            <div className={`${styles.cardBase} ${styles.bgLightOrange}`}>
              <div style={{fontSize: '1.5rem'}}>🎬</div>
              <div className={styles.cardTitle} style={{marginTop: '0.5rem'}}>HRT Explained</div>
              <div className={styles.cardDesc}>Understanding hormone replacement therapy options</div>
            </div>
          </div>
          
          <div style={{textAlign: 'center', color: '#4B5563', fontSize: '0.95rem'}}>
            Search for these topics on trusted sources like Mayo Clinic, Cleveland Clinic, Johns Hopkins Medicine, or the North American Menopause Society (NAMS).
          </div>
        </div>

        {/* Knowledge is Power */}
        <div className={styles.powerCard}>
          <div style={{fontSize: '2.5rem'}}>💪</div>
          <div className={styles.powerTitle}>Knowledge is Power</div>
          <div className={styles.powerText}>
            Understanding what's happening in your body helps you make informed decisions about your health. You're not going through this alone - millions of women experience menopause, and there are many effective treatments and strategies available. Don't hesitate to advocate for yourself and seek the support you deserve.
          </div>
        </div>

        {/* Downloadable Resources - Retained from instructions */}
        <div className={styles.resourcesCard}>
          <div className={styles.resourcesHeader}>
            <Download size={28} color="#D14D72" /> Downloadable Resources
          </div>
          <div className={styles.resourcesSubtitle}>
            Get free `.doc` guides and printables to help you track and understand your body better.
          </div>
          <div className={styles.resourcesGrid}>
            {resources.map((res, idx) => (
              <a 
                key={idx} 
                href={res.file} 
                download={res.file.split('/').pop()} 
                className={styles.resourceBox}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flex: 1 }}>
                  <div className={styles.resourceTitle}>{res.title}</div>
                  <div className={styles.resourceDesc}>{res.desc}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Download size={20} color="#6B7280" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
