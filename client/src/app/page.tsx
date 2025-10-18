// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { brandMessaging } from '@/config/brand';
import { Footer } from '@/components/brand/Footer';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized, checkAuth } = useAuthStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'company':
          router.push('/company/dashboard');
          break;
        case 'university':
          router.push('/university/dashboard');
          break;
        case 'freelancer':
          router.push('/freelancer/dashboard');
          break;
        default:
          router.push('/login');
      }
    }
  }, [isAuthenticated, user, isInitialized, router]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </motion.div>
      </main>
    );
  }

  if (isAuthenticated && user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Redirecting to your dashboard...</p>
        </motion.div>
      </main>
    );
  }

  const features = [
    {
      icon: GraduationCap,
      title: 'Students',
      description: 'Find opportunities, showcase skills, and connect with employers',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building2,
      title: 'Companies',
      description: 'Discover talented students and build your future workforce',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Universities',
      description: 'Track student progress and connect with industry partners',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Briefcase,
      title: 'Freelancers',
      description: 'Showcase projects and collaborate with teams',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    { text: 'AI-Powered Job Matching', icon: Sparkles },
    { text: 'Skill Assessment & Certificates', icon: Award },
    { text: 'Real-Time Collaboration', icon: Users },
    { text: 'Career Growth Tracking', icon: TrendingUp }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.2), transparent 50%)`
        }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" showText={true} linkTo="/" />
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-[var(--brand-primary)] font-medium hover:text-[var(--brand-primary-light)] transition"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover-glow"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-[var(--brand-secondary)] text-[var(--brand-primary)] rounded-full text-sm font-semibold">
                  {brandMessaging.tagline}
                </span>
              </motion.div>

              <motion.h1
                className="text-6xl lg:text-7xl font-bold mb-6 leading-tight text-[var(--brand-text-primary)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect Your
                <span className="block bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-lighter)] text-transparent bg-clip-text animate-gradient">
                  Career Journey
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-[var(--brand-text-secondary)] mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {brandMessaging.description}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-xl transition-all flex items-center space-x-2 group"
                >
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-8 py-4 bg-white text-[var(--brand-primary)] border-2 border-[var(--brand-primary)] rounded-xl font-semibold text-lg hover:bg-[var(--brand-secondary)] transition-all shadow-lg"
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Cards */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-2xl hover-lift cursor-pointer`}
                  >
                    <feature.icon className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '1000+', label: 'Students' },
                { number: '500+', label: 'Companies' },
                { number: '50+', label: 'Universities' },
                { number: '95%', label: 'Success Rate' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text-blue mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </main>
  );
}