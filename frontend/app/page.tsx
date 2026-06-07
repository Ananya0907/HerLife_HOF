'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const lifePhase = localStorage.getItem('life_phase');
    if (userId) {
      if (lifePhase && lifePhase !== 'pending') {
        router.push(`/dashboard/${lifePhase}`);
      } else {
        router.push('/onboarding');
      }
    }
  }, [router]);

  const handleLogin = () => {
    const lifePhase = localStorage.getItem('life_phase');
    if (lifePhase && lifePhase !== 'pending') {
      router.push(`/dashboard/${lifePhase}`);
    } else {
      router.push('/onboarding');
    }
  };

  const handleSignUp = () => {
    router.push('/onboarding');
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm 
              onSwitchToSignUp={() => setIsLogin(false)} 
              onLogin={handleLogin}
            />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SignUpForm 
              onSwitchToLogin={() => setIsLogin(true)} 
              onSignUp={handleSignUp}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
