'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar as CalendarIcon,
  TrendingUp,
  Save,
  Loader2,
  Trash2,
  Edit2,
  X,
  Check
} from 'lucide-react';
import styles from './CycleTracker.module.css';
import DashboardNavbar from '../shared/DashboardNavbar';
import { API_BASE_URL } from '@/utils/api';

interface HistoryItem {
  date: string;
  isoDate: string;
  duration: number;
  cycleLength: number;
}

export default function CycleTracker() {
  const router = useRouter();
  
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      if (!isoString) return '';
      if (isoString.includes(' to ')) {
        const parts = isoString.split(' to ');
        return `${formatDate(parts[0])} to ${formatDate(parts[1])}`;
      }
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  useEffect(() => {
    const loadTrackerData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/user-profile/${userId}`);
        const data = await res.json();
        
        let currentStartDate = '';
        let currentCycleLength = 28;
        let currentPeriodLength = 5;

        if (data.health) {
          if (data.health.last_period_date) {
            currentStartDate = data.health.last_period_date;
            setStartDate(data.health.last_period_date);
          } else {
            setStartDate('');
          }
          if (data.health.cycle_length) {
            currentCycleLength = data.health.cycle_length;
            setCycleLength(data.health.cycle_length);
          }
          if (data.health.bleeding_duration) {
            currentPeriodLength = data.health.bleeding_duration;
            setPeriodLength(data.health.bleeding_duration);
          }
        }

        const history: HistoryItem[] = [];

        // 1. Add the current configured last period start date as the first item if set
        if (currentStartDate) {
          history.push({
            date: formatDate(currentStartDate),
            isoDate: currentStartDate,
            duration: currentPeriodLength,
            cycleLength: currentCycleLength
          });
        }

        // 2. Add logs where period_started is true, ensuring no duplicates with configured last period start date
        if (data.logs) {
          const periodStartLogs = data.logs.filter((l: any) => l.period_started);
          periodStartLogs.forEach((l: any) => {
            const formattedLogDate = formatDate(l.log_date);
            const exists = history.some(item => item.isoDate === l.log_date);
            if (!exists) {
              history.push({
                date: formattedLogDate,
                isoDate: l.log_date,
                duration: currentPeriodLength,
                cycleLength: currentCycleLength
              });
            }
          });
        }

        setHistoryList(history);
      } catch (e) {
        console.error("Failed to load tracker profile:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTrackerData();
  }, [router]);

  // Dynamic calculations based on state (in real-time as user changes inputs)
  const getCalculatedCycleDay = () => {
    if (!startDate) return 0;
    const diffTime = new Date().getTime() - new Date(startDate).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays) || diffDays < 0) return 0;
    return (diffDays % cycleLength) + 1;
  };

  const getCalculatedPhase = (day: number) => {
    if (day === 0) return 'Not Configured';
    if (day <= periodLength) return 'Menstrual Phase';
    if (day <= 13) return 'Follicular Phase';
    if (day <= 16) return 'Ovulation Phase';
    return 'Luteal Phase';
  };

  const getCalculatedNextPeriod = () => {
    if (!startDate) return 'Not Configured';
    const lastPeriod = new Date(startDate);
    const nextPeriodDate = new Date(lastPeriod.getTime() + (cycleLength * 24 * 60 * 60 * 1000));
    return nextPeriodDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPhaseTip = (phase: string) => {
    if (phase === 'Not Configured') return 'Please enter and save your last period start date to see predictions.';
    if (phase === 'Menstrual Phase') return 'Focus on low-impact exercise and iron-rich foods.';
    if (phase === 'Follicular Phase') return 'Energy levels are rising. Great time for new activities!';
    if (phase === 'Ovulation Phase') return 'Peak strength and power. Excellent for intense workouts!';
    return 'Progesterone is peaking. Rest and focus on recovery.';
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/update-tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          last_period_date: startDate,
          cycle_length: cycleLength,
          period_length: periodLength
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Failed to save cycle configurations: " + data.error);
      } else {
        alert("Cycle settings saved successfully! 🌸");
        
        // Update history list in real-time to show the newly saved start date
        const savedDateFormatted = formatDate(startDate);
        const newHistoryItem: HistoryItem = {
          date: savedDateFormatted,
          isoDate: startDate,
          duration: periodLength,
          cycleLength: cycleLength
        };
        
        setHistoryList(prev => {
          const filtered = prev.filter(item => item.isoDate !== startDate);
          return [newHistoryItem, ...filtered];
        });
      }
    } catch (e) {
      alert("Failed to save. Is the backend server running?");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (isoDate: string) => {
    if (!confirm("Are you sure you want to delete this period record from your history?")) {
      return;
    }
    
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/delete-period-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          log_date: isoDate
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Failed to delete log: " + data.error);
      } else {
        alert("Period log deleted successfully! 🗑️");
        setHistoryList(prev => prev.filter(item => item.isoDate !== isoDate));
        if (startDate === isoDate) {
          setStartDate('');
        }
      }
    } catch (e) {
      alert("Failed to delete log. Is the backend server running?");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartEdit = (index: number, isoDate: string) => {
    setEditingIndex(index);
    setEditDate(isoDate);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditDate('');
  };

  const handleSaveEdit = async (oldIsoDate: string) => {
    if (!editDate) {
      alert("Please select a valid date.");
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/edit-period-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          old_date: oldIsoDate,
          new_date: editDate
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Failed to edit log: " + data.error);
      } else {
        alert("Period log updated successfully! ✏️");
        setHistoryList(prev => {
          return prev.map(item => {
            if (item.isoDate === oldIsoDate) {
              return {
                ...item,
                date: formatDate(editDate),
                isoDate: editDate
              };
            }
            return item;
          });
        });

        if (startDate === oldIsoDate) {
          setStartDate(editDate);
        }

        setEditingIndex(null);
        setEditDate('');
      }
    } catch (e) {
      alert("Failed to update log. Is the backend server running?");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background)' }}>
        <h2 style={{ color: 'var(--primary)' }}>Syncing tracker details...</h2>
      </div>
    );
  }

  const cycleDay = getCalculatedCycleDay();
  const calculatedPhase = getCalculatedPhase(cycleDay);
  const nextExpectedPeriod = getCalculatedNextPeriod();
  const phaseTip = getPhaseTip(calculatedPhase);

  return (
    <div className={styles.container}>
      <DashboardNavbar activeTab="tracker" />

      <main className={styles.content}>
        
        <div className={styles.gridContainer}>
          {/* Cycle Tracker Inputs */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CalendarIcon color="var(--primary)" size={24} />
              <h2 className={styles.cardTitle}>Configure Cycle Parameters</h2>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Last Period Start Date</label>
              <input 
                type="date" 
                className={styles.inputField} 
                value={startDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setStartDate(newDate);
                  if (newDate) {
                    const userId = localStorage.getItem('user_id');
                    if (userId) {
                      fetch(`${API_BASE_URL}/api/update-tracker`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          user_id: userId,
                          last_period_date: newDate,
                          cycle_length: cycleLength,
                          period_length: periodLength
                        })
                      })
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          const savedDateFormatted = formatDate(newDate);
                          const newHistoryItem: HistoryItem = {
                            date: savedDateFormatted,
                            isoDate: newDate,
                            duration: periodLength,
                            cycleLength: cycleLength
                          };
                          setHistoryList(prev => {
                            const filtered = prev.filter(item => item.isoDate !== newDate);
                            return [newHistoryItem, ...filtered];
                          });
                        }
                      })
                      .catch(err => console.error("Silent date correction failed:", err));
                    }
                  }
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Average Cycle Length (days)</label>
              <input 
                type="number" 
                className={styles.inputField} 
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Period Length (days)</label>
              <input 
                type="number" 
                className={styles.inputField} 
                value={periodLength}
                onChange={(e) => setPeriodLength(Number(e.target.value))}
              />
            </div>

            <button 
              className={styles.saveBtn} 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className={styles.spinner} size={18} style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Save size={18} style={{ marginRight: '0.5rem' }} />
                  Save Cycle Settings
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className={styles.infoCardsContainer}>
            <div className={`${styles.infoCard} ${styles.infoCardPrimary}`}>
              <div className={styles.infoLabel}>Next Expected Period</div>
              <div className={styles.infoValue}>{nextExpectedPeriod}</div>
            </div>

            <div className={`${styles.infoCard} ${styles.infoCardSuccess}`}>
              <div className={styles.infoLabel}>Current Phase</div>
              <div className={styles.infoValue}>{calculatedPhase}</div>
              {cycleDay > 0 && (
                <div className={styles.infoSubtitle}>Day {cycleDay} of your cycle</div>
              )}
              <div className={styles.infoSubtitle} style={{ fontWeight: 500, opacity: 0.9 }}>{phaseTip}</div>
            </div>
          </div>
        </div>

        {/* Cycle History */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TrendingUp color="var(--primary)" size={24} />
            <h2 className={styles.cardTitle}>Cycle History</h2>
          </div>

          <div className={styles.historyList}>
            {historyList.length > 0 ? (
              historyList.map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  {editingIndex === index ? (
                    <div className={styles.editRow}>
                      <input 
                        type="date" 
                        value={editDate}
                        className={styles.editInput}
                        onChange={(e) => setEditDate(e.target.value)}
                        disabled={actionLoading}
                      />
                      <div className={styles.editActions}>
                        <button 
                          className={styles.confirmBtn}
                          onClick={() => handleSaveEdit(item.isoDate)}
                          disabled={actionLoading}
                          title="Save Changes"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className={styles.cancelBtn}
                          onClick={handleCancelEdit}
                          disabled={actionLoading}
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className={styles.historyDate}>{item.date}</div>
                        <div className={styles.historyDuration}>Duration: {item.duration} days</div>
                      </div>
                      <div className={styles.historyLengthWrapper}>
                        <div className={styles.historyLengthLabel}>Cycle Length</div>
                        <div className={styles.historyLengthValue}>{item.cycleLength} days</div>
                      </div>
                      <div className={styles.historyActions}>
                        <button 
                          className={styles.actionIconBtn} 
                          onClick={() => handleStartEdit(index, item.isoDate)}
                          disabled={actionLoading}
                          title="Edit Date"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className={`${styles.actionIconBtn} ${styles.deleteBtn}`} 
                          onClick={() => handleDelete(item.isoDate)}
                          disabled={actionLoading}
                          title="Delete Entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className={styles.historyEmpty}>
                No past periods logged yet. When you mark a period start day on your daily logs, it will appear here as part of your cycle history!
              </p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
