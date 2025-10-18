export interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'students' | 'companies' | 'universities' | 'freelancers' | 'admin';
}

export const allFAQs: FAQ[] = [
  // General FAQs
  {
    question: 'What is PathForward Myanmar?',
    answer: 'PathForward Myanmar is a comprehensive platform that bridges the gap between education and employment. We connect students, universities, companies, and freelancers in one powerful ecosystem.',
    category: 'general'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we will send you a password reset link.',
    category: 'general'
  },
  {
    question: 'Is PathForward Myanmar free to use?',
    answer: 'Yes! PathForward Myanmar offers free registration and basic features for all users.',
    category: 'general'
  },

  // Student FAQs
  {
    question: 'How can I find job opportunities?',
    answer: 'Browse the "Find Jobs" section, use filters to search by location and job type, and receive personalized recommendations based on your profile.',
    category: 'students'
  },
  {
    question: 'What are skill assessments?',
    answer: 'Take skill assessments to verify your competencies. Successful completion (85%+ score) results in certificates that you can add to your profile.',
    category: 'students'
  },
  {
    question: 'How do I apply for a job?',
    answer: 'Click on a job posting to view details, then click "Apply". You can include a cover letter with your application.',
    category: 'students'
  },
  {
    question: 'How do I verify my university account?',
    answer: 'Go to "Verify University" in your dashboard, select your university, and enter your roll number. Your university will review and approve your verification.',
    category: 'students'
  },

  // Company FAQs
  {
    question: 'How do I post a job opening?',
    answer: 'Navigate to "Post a Job" in your dashboard, fill in the job details and requirements, then publish. Your job will be visible to all registered students and freelancers.',
    category: 'companies'
  },
  {
    question: 'How can I find qualified candidates?',
    answer: 'Browse student and freelancer profiles, use search filters, view verified skills and certificates, and connect with universities for direct access to their talent pool.',
    category: 'companies'
  },
  {
    question: 'What is the university connection feature?',
    answer: 'Establish partnerships with universities to get direct access to their student talent pool and create a pipeline of qualified candidates.',
    category: 'companies'
  },
  {
    question: 'Can I post project opportunities?',
    answer: 'Yes! You can post both job openings and project opportunities for freelancers to apply to.',
    category: 'companies'
  },

  // University FAQs
  {
    question: 'How do I manage student profiles?',
    answer: 'Access your dashboard to view student profiles, verify student information, track employment outcomes, and monitor student progress.',
    category: 'universities'
  },
  {
    question: 'How can I connect with companies?',
    answer: 'Go to the "Companies" section to initiate connections with companies. These connections enable companies to access your student talent pool.',
    category: 'universities'
  },
  {
    question: 'What analytics are available?',
    answer: 'View detailed analytics on student employment rates, popular industries, skill trends, and placement success rates to help with curriculum planning.',
    category: 'universities'
  },
  {
    question: 'How do I verify students?',
    answer: 'Students will submit verification requests with their roll numbers. Review and approve these requests in the "Students" section of your dashboard.',
    category: 'universities'
  },

  // Freelancer FAQs
  {
    question: 'How do I showcase my work?',
    answer: 'Create a detailed profile with your portfolio, list your skills and certifications, add project experiences, and display client testimonials.',
    category: 'freelancers'
  },
  {
    question: 'Can I find teammates for projects?',
    answer: 'Yes! Use the "Find Teammates" feature to connect with other freelancers and students to form teams for larger projects.',
    category: 'freelancers'
  },
  {
    question: 'How do job recommendations work?',
    answer: 'Our AI-powered system analyzes your profile, skills, and experience to suggest jobs that match your expertise. The recommendations improve over time.',
    category: 'freelancers'
  },
  {
    question: 'Can I manage multiple projects?',
    answer: 'Yes! You can manage multiple ongoing projects, track deadlines, and organize your work through the project management dashboard.',
    category: 'freelancers'
  },

  // Admin FAQs
  {
    question: 'How do I verify companies and universities?',
    answer: 'Review verification requests in the "Verification System" tab. Check the details provided and approve or reject the request.',
    category: 'admin'
  },
  {
    question: 'How do I manage user accounts?',
    answer: 'Use the "User Management" tab to view all users, edit user details, activate/deactivate accounts, and delete users if needed.',
    category: 'admin'
  },
  {
    question: 'What actions are tracked in the activity log?',
    answer: 'All admin actions including user edits, verifications, job deletions, and system changes are tracked with timestamps and IP addresses.',
    category: 'admin'
  }
];

export const getFAQsByCategory = (category: FAQ['category']): FAQ[] => {
  return allFAQs.filter(faq => faq.category === category);
};

export const getGeneralFAQs = (): FAQ[] => {
  return allFAQs.filter(faq => faq.category === 'general');
};
