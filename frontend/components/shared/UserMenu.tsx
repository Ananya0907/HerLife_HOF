'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Settings, ShieldCheck, LogOut, ArrowRightLeft, X } from 'lucide-react';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('life_phase');
    localStorage.removeItem('herlife_onboarding');
    router.push('/');
  };

  const handleSwitchPhase = (newPhase: string) => {
    const data = localStorage.getItem('herlife_onboarding');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        parsed.phase = newPhase;
        localStorage.setItem('herlife_onboarding', JSON.stringify(parsed));
        setShowSwitchModal(false);
        setIsOpen(false);
        // Force reload to pick up new phase on dashboard
        window.location.href = '/dashboard/' + newPhase;
      } catch (e) {
        console.error("Failed to switch phase");
      }
    }
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button 
        className={styles.menuBtn} 
        onClick={() => setIsOpen(!isOpen)}
        title="Menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button 
            className={styles.menuItem} 
            onClick={() => { setIsOpen(false); router.push('/profile'); }}
          >
            <User size={18} /> View Profile
          </button>
          
          <button 
            className={styles.menuItem} 
            onClick={() => { setIsOpen(false); router.push('/settings'); }}
          >
            <Settings size={18} /> Settings
          </button>
          
          <button 
            className={styles.menuItem} 
            onClick={() => { setIsOpen(false); router.push('/privacy'); }}
          >
            <ShieldCheck size={18} /> Data Privacy
          </button>
          
          <button 
            className={styles.menuItem} 
            onClick={() => { setShowSwitchModal(true); setIsOpen(false); }}
          >
            <ArrowRightLeft size={18} /> Switch Phase
          </button>
          
          <button 
            className={`${styles.menuItem} ${styles.logoutItem}`} 
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}

      {showSwitchModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSwitchModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: 'var(--primary)' }}>Switch Phase</h3>
              <button className={styles.closeBtn} onClick={() => setShowSwitchModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#4B5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Switching your active phase will immediately redirect you to the corresponding dashboard. Your past tracked data will be preserved.
            </p>
            <div className={styles.phaseGrid}>
              <button className={styles.phaseBtn} onClick={() => handleSwitchPhase('preteen')}>Pre-Teens (8-12)</button>
              <button className={styles.phaseBtn} onClick={() => handleSwitchPhase('young_women')}>Young Women (13-24)</button>
              <button className={styles.phaseBtn} onClick={() => handleSwitchPhase('pregnant')}>Pregnant</button>
              <button className={styles.phaseBtn} onClick={() => handleSwitchPhase('postpartum')}>Postpartum</button>
              <button className={styles.phaseBtn} onClick={() => handleSwitchPhase('menopause')}>Menopause</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
