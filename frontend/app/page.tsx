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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const email = session.user.email;

        // Check if user exists in your users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userData && userData.life_phase && userData.life_phase !== 'pending') {
          // Existing user → go to dashboard
          router.push(`/dashboard/${userData.life_phase}`);
        } else {
          // New user → go to onboarding
          router.push('/onboarding');
        }
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
