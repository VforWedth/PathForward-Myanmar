// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - replace with actual API calls
const featuredUniversities = [
  {
    id: 1,
    name: 'Stanford University',
    logo: '/university-logos/stanford.svg',
    description: 'Leading research institution in Silicon Valley',
    students: '17,000+',
    programs: '200+',
    location: 'Stanford, CA'
  },
  {
    id: 2,
    name: 'MIT',
    logo: '/university-logos/mit.svg',
    description: 'World-renowned for technology and innovation',
    students: '11,000+',
    programs: '150+',
    location: 'Cambridge, MA'
  },
  {
    id: 3,
    name: 'Harvard University',
    logo: '/university-logos/harvard.svg',
    description: 'Ivy League institution with global impact',
    students: '21,000+',
    programs: '300+',
    location: 'Cambridge, MA'
  },
  {
    id: 4,
    name: 'UC Berkeley',
    logo: '/university-logos/berkeley.svg',
    description: 'Public Ivy with strong industry connections',
    students: '45,000+',
    programs: '350+',
    location: 'Berkeley, CA'
  }
];

const featuredCompanies = [
  {
    id: 1,
    name: 'Google',
    logo: '/company-logos/google.svg',
    description: 'Technology company specializing in Internet-related services',
    industry: 'Technology',
    employees: '150,000+',
    location: 'Mountain View, CA'
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: '/company-logos/microsoft.svg',
    description: 'Leading technology corporation in software development',
    industry: 'Technology',
    employees: '220,000+',
    location: 'Redmond, WA'
  },
  {
    id: 3,
    name: 'Tesla',
    logo: '/company-logos/tesla.svg',
    description: 'Sustainable energy and electric vehicle manufacturer',
    industry: 'Automotive',
    employees: '100,000+',
    location: 'Austin, TX'
  },
  {
    id: 4,
    name: 'Goldman Sachs',
    logo: '/company-logos/goldman-sachs.svg',
    description: 'Global investment banking and financial services',
    industry: 'Finance',
    employees: '40,000+',
    location: 'New York, NY'
  }
];

const featuredJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Google',
    type: 'Full-time',
    location: 'Mountain View, CA',
    salary: '$120,000 - $150,000',
    posted: '2 days ago',
    description: 'Develop cutting-edge web applications using modern frameworks',
    requirements: ['React', 'TypeScript', '3+ years experience']
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'Microsoft',
    type: 'Full-time',
    location: 'Remote',
    salary: '$110,000 - $140,000',
    posted: '1 week ago',
    description: 'Analyze complex datasets and build machine learning models',
    requirements: ['Python', 'ML', 'SQL', '5+ years experience']
  },
  {
    id: 3,
    title: 'Software Engineer',
    company: 'Tesla',
    type: 'Full-time',
    location: 'Austin, TX',
    salary: '$130,000 - $160,000',
    posted: '3 days ago',
    description: 'Build software for electric vehicles and energy products',
    requirements: ['C++', 'Python', 'Embedded Systems']
  },
  {
    id: 4,
    title: 'Financial Analyst',
    company: 'Goldman Sachs',
    type: 'Internship',
    location: 'New York, NY',
    salary: '$80,000 - $100,000',
    posted: '5 days ago',
    description: 'Support financial modeling and investment analysis',
    requirements: ['Finance Degree', 'Excel', 'Analytical Skills']
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('universities');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">CareerConnect</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#universities" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Universities
                  </a>
                  <a href="#companies" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Companies
                  </a>
                  <a href="#jobs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Jobs
                  </a>
                  <a href="#about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </a>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Your Future
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridging the gap between top universities, leading companies, and talented students worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-200"
              >
                Get Started
              </Link>
              <a
                href="#universities"
                className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition duration-200"
              >
                Explore Partners
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">Partner Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-200">Job Opportunities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-indigo-200">Students Hired</div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section id="universities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partner Universities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with top educational institutions from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredUniversities.map((university) => (
              <div
                key={university.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    {university.name.split(' ').map(word => word[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {university.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {university.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{university.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-medium">{university.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Programs:</span>
                    <span className="font-medium">{university.programs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
            >
              View All 50+ Universities
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partner Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join leading organizations that trust our talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {company.name.split(' ').map(word => word[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {company.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {company.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <span className="font-medium">{company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span className="font-medium">{company.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{company.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
            >
              Explore 500+ Companies
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Job Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your next career move with our curated job listings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-lg text-indigo-600 font-medium">
                      {job.company}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {job.type}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {job.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {job.salary}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Posted {job.posted}
                  </span>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
            >
              Browse All 10,000+ Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have found their dream opportunities through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition duration-200"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CareerConnect</h3>
              <p className="text-gray-400">
                Bridging the gap between education and employment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Find Jobs</a></li>
                <li><a href="#" className="hover:text-white">University Partners</a></li>
                <li><a href="#" className="hover:text-white">Career Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white">Find Talent</a></li>
                <li><a href="#" className="hover:text-white">Partnership</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@careerconnect.com</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}