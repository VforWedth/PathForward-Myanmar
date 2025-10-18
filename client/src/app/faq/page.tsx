'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Target,
  ArrowLeft,
  Search,
  MessageCircle,
  Mail
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { brandMessaging } from '@/config/brand';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'students' | 'companies' | 'universities' | 'freelancers';
}

const faqs: FAQ[] = [
  // General FAQs
  {
    question: 'What is PathForward Myanmar?',
    answer: 'PathForward Myanmar is a comprehensive platform that bridges the gap between education and employment. We connect students, universities, companies, and freelancers in one powerful ecosystem, facilitating job opportunities, skill development, and career growth.',
    category: 'general'
  },
  {
    question: 'How do I get started on PathForward?',
    answer: 'Simply click on "Get Started" or "Register" on the homepage, select your role (Student, Company, University, or Freelancer), and complete the registration form. Once registered, you can complete your profile and start exploring opportunities.',
    category: 'general'
  },
  {
    question: 'Is PathForward Myanmar free to use?',
    answer: 'Yes! PathForward Myanmar offers free registration and basic features for all users. We believe in making career opportunities accessible to everyone in Myanmar.',
    category: 'general'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.',
    category: 'general'
  },

  // Student FAQs
  {
    question: 'How can students find job opportunities?',
    answer: 'Students can browse available jobs in the "Find Jobs" section, use advanced filters to search by location, job type, and industry, and receive personalized job recommendations based on their profile and skills.',
    category: 'students'
  },
  {
    question: 'What is the skill assessment feature?',
    answer: 'Students can take skill assessments and quizzes to verify their competencies. Successful completion results in certificates that can be added to their profiles, making them more attractive to potential employers.',
    category: 'students'
  },
  {
    question: 'How do I apply for a job?',
    answer: 'Browse the available jobs, click on a job posting to view details, and click the "Apply" button. You can include a cover letter with your application. Track all your applications in the "My Applications" section.',
    category: 'students'
  },
  {
    question: 'Can I connect with other students?',
    answer: 'Yes! Use the "Find Peers" feature to connect with other students, form study groups, and collaborate on projects. Networking with peers can open up new opportunities and learning experiences.',
    category: 'students'
  },

  // Company FAQs
  {
    question: 'How do companies post job openings?',
    answer: 'Companies can post jobs by navigating to the "Post a Job" section in their dashboard. Fill in the job details, requirements, and preferences, then publish. Your job will be visible to all registered students and freelancers.',
    category: 'companies'
  },
  {
    question: 'How can I find qualified candidates?',
    answer: 'Browse through student and freelancer profiles, use advanced search filters, view verified skills and certificates, and connect with universities to access their talent pool. You can also review applications received for your posted jobs.',
    category: 'companies'
  },
  {
    question: 'What is the university connection feature?',
    answer: 'Companies can establish partnerships with universities to get direct access to their student talent pool. This creates a pipeline of qualified candidates and enables better recruitment strategies.',
    category: 'companies'
  },
  {
    question: 'Can we post project opportunities for freelancers?',
    answer: 'Yes! Companies can post both job openings and project opportunities. Freelancers can browse and apply for projects that match their skills and expertise.',
    category: 'companies'
  },

  // University FAQs
  {
    question: 'How do universities manage student profiles?',
    answer: 'Universities have access to a comprehensive dashboard where they can view student profiles, track employment outcomes, verify student information, and monitor student progress on the platform.',
    category: 'universities'
  },
  {
    question: 'How can universities connect with companies?',
    answer: 'Universities can initiate connections with companies through the "Companies" section. These connections enable companies to access your student talent pool and post opportunities directly to your students.',
    category: 'universities'
  },
  {
    question: 'What analytics are available for universities?',
    answer: 'Universities can access detailed analytics on student employment rates, popular industries, skill trends, and placement success rates. This data helps in curriculum planning and career services.',
    category: 'universities'
  },

  // Freelancer FAQs
  {
    question: 'How do freelancers showcase their work?',
    answer: 'Freelancers can create detailed profiles with portfolios, list their skills and certifications, add project experiences, and display client testimonials. A strong profile helps attract more opportunities.',
    category: 'freelancers'
  },
  {
    question: 'Can freelancers find teammates for projects?',
    answer: 'Yes! The "Find Teammates" feature allows freelancers to connect with other freelancers and students to form teams for larger projects. Collaborate and expand your capabilities.',
    category: 'freelancers'
  },
  {
    question: 'How does the job recommendation system work?',
    answer: 'Our AI-powered recommendation system analyzes your profile, skills, experience level, and preferences to suggest jobs that match your expertise. The system continuously learns and improves recommendations.',
    category: 'freelancers'
  },
  {
    question: 'Can I manage multiple projects?',
    answer: 'Absolutely! Freelancers can manage multiple ongoing projects, track deadlines, and organize their work through the project management dashboard.',
    category: 'freelancers'
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: Target },
  { id: 'students', label: 'For Students', icon: Target },
  { id: 'companies', label: 'For Companies', icon: Target },
  { id: 'universities', label: 'For Universities', icon: Target },
  { id: 'freelancers', label: 'For Freelancers', icon: Target }
];

export default function FAQPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <motion.nav
        className="bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>
          <Logo size="md" showText={true} linkTo="/" />
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="pt-20 pb-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about PathForward Myanmar
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 shadow-lg"
            />
          </div>
        </div>
      </motion.section>

      {/* Category Filters */}
      <motion.section
        className="pb-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ List */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600 text-lg">No questions found. Try a different search or category.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        className="pb-20 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                We're here to help! Reach out to our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Live Chat</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Support</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
