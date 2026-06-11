'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../components/auth/supabaseClient';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing localStorage session (regular login)
    const userId = localStorage.getItem('user_id');
    const lifePhase = localStorage.getItem('life_phase');
    if (userId) {
      if (lifePhase && lifePhase !== 'pending') {
        router.push(`/dashboard/${lifePhase}`);
      } else {
        router.push('/onboarding');
      }
      return;
    }

    // Check for Supabase Google OAuth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/onboarding'); // Google users go to onboarding first
      }
    });

    // Listen for OAuth redirect coming back
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/onboarding');
      }
    });

    return () => subscription.unsubscribe();
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
