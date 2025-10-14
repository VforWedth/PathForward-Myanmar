const { sequelize } = require('./src/config/database');
const { User, Student, Company, University, UniversityCompanyConnection, Job, Application } = require('./src/models');
const bcrypt = require('bcryptjs');

// Myanmar Universities Data
const myanmarUniversities = [
  {
    name: "University of Yangon",
    location: "Yangon",
    description: "The oldest and most prestigious university in Myanmar, established in 1920.",
    website: "https://www.uy.edu.mm",
    supportedMajors: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Law", "Economics"]
  },
  {
    name: "Yangon University of Economics",
    location: "Yangon", 
    description: "Leading economics and business university in Myanmar.",
    website: "https://www.yuecon.edu.mm",
    supportedMajors: ["Economics", "Business Administration", "Finance", "Accounting", "Marketing"]
  },
  {
    name: "University of Computer Studies, Yangon",
    location: "Yangon",
    description: "Premier institution for computer science and technology education.",
    website: "https://www.ucsy.edu.mm", 
    supportedMajors: ["Computer Science", "Information Technology", "Software Engineering", "Computer Engineering"]
  },
  {
    name: "Mandalay University",
    location: "Mandalay",
    description: "Major university in Upper Myanmar, established in 1925.",
    website: "https://www.mu.edu.mm",
    supportedMajors: ["Computer Science", "Business Administration", "Engineering", "Medicine", "Arts"]
  },
  {
    name: "Mandalay University of Technology",
    location: "Mandalay",
    description: "Leading technical university in Upper Myanmar.",
    website: "https://www.mut.edu.mm",
    supportedMajors: ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]
  },
  {
    name: "Dagon University",
    location: "Yangon",
    description: "Comprehensive university offering various programs.",
    website: "https://www.du.edu.mm",
    supportedMajors: ["Computer Science", "Business Administration", "Economics", "International Relations"]
  },
  {
    name: "University of Information Technology",
    location: "Yangon",
    description: "Specialized university focusing on IT and computer science.",
    website: "https://www.uit.edu.mm",
    supportedMajors: ["Information Technology", "Computer Science", "Software Engineering", "Data Science"]
  },
  {
    name: "Yangon Institute of Economics",
    location: "Yangon",
    description: "Premier economics institute in Myanmar.",
    website: "https://www.yie.edu.mm",
    supportedMajors: ["Economics", "Business Administration", "Finance", "Statistics"]
  },
  {
    name: "East Yangon University",
    location: "Yangon",
    description: "Modern university serving the eastern Yangon region.",
    website: "https://www.eyu.edu.mm",
    supportedMajors: ["Computer Science", "Business Administration", "Engineering", "Education"]
  },
  {
    name: "West Yangon University",
    location: "Yangon",
    description: "Comprehensive university in western Yangon.",
    website: "https://www.wyu.edu.mm",
    supportedMajors: ["Computer Science", "Business Administration", "Economics", "Social Sciences"]
  }
];

// Myanmar Companies Data
const myanmarCompanies = [
  {
    name: "Myanmar Tech Solutions",
    industry: "Technology",
    location: "Yangon",
    description: "Leading software development company specializing in web and mobile applications.",
    website: "https://www.myantectech.mm",
    size: "51-200",
    foundedYear: 2015
  },
  {
    name: "Yangon Digital Innovations",
    industry: "E-commerce",
    location: "Yangon", 
    description: "Innovative e-commerce platform connecting local businesses with customers.",
    website: "https://www.yangondigital.mm",
    size: "11-50",
    foundedYear: 2018
  },
  {
    name: "Mandalay FinTech",
    industry: "Financial Services",
    location: "Mandalay",
    description: "Financial technology solutions provider for digital banking and payments.",
    website: "https://www.mandalayfintech.mm",
    size: "11-50", 
    foundedYear: 2017
  },
  {
    name: "Myanmar Software House",
    industry: "Technology",
    location: "Yangon",
    description: "Custom software development and IT consulting services.",
    website: "https://www.myanmarsoftware.mm",
    size: "51-200",
    foundedYear: 2012
  },
  {
    name: "Golden Myanmar Enterprises",
    industry: "Manufacturing",
    location: "Yangon",
    description: "Manufacturing company with focus on digital transformation and automation.",
    website: "https://www.goldenmyanmar.mm",
    size: "51-200",
    foundedYear: 2010
  }
];

// Sample student data
const studentMajors = [
  "Computer Science", "Information Technology", "Business Administration", 
  "Economics", "Engineering", "Finance", "Marketing", "Accounting"
];

const studentNames = [
  "Aung Min", "Thiri Win", "Kyaw Zin", "Su Myat", "Htet Aung",
  "May Thu", "Zaw Min", "Nyein Chan", "Wai Yan", "Khin Myo",
  "Soe Moe", "Hlaing Hlaing", "Myo Min", "Thandar", "Ye Htut",
  "Aye Aye", "Min Ko", "Saw Hla", "Mya Mya", "Kyaw Thu",
  "Thin Thin", "Zaw Oo", "Hnin Hnin", "Myint Aung", "Su Su",
  "Aung Ko", "May Zin", "Kyaw Myo", "Thiri Aung", "Min Min"
];

const locations = ["Yangon", "Mandalay", "Naypyidaw", "Taunggyi", "Mawlamyine", "Bago", "Pathein", "Monywa"];

// Generate sample data
async function seedData() {
  try {
    console.log('Starting Myanmar data seeding...');

    // Create Universities
    console.log('Creating universities...');
    const universities = [];
    for (const uniData of myanmarUniversities) {
      // Create user for university
      const email = `${uniData.name.toLowerCase().replace(/\s+/g, '').replace(/,/g, '')}@university.mm`;
      const user = await User.create({
        email: email,
        password: 'university123', // Let the User model hash this
        role: 'university',
        isVerified: true
      });

      const university = await University.create({
        userId: user.id,
        universityName: uniData.name,
        location: uniData.location,
        description: uniData.description,
        website: uniData.website,
        supportedMajors: uniData.supportedMajors,
        verificationStatus: 'approved'
      });

      universities.push(university);
      console.log(`Created university: ${uniData.name}`);
    }

    // Create Companies
    console.log('Creating companies...');
    const companies = [];
    for (const compData of myanmarCompanies) {
      // Create user for company
      const email = `${compData.name.toLowerCase().replace(/\s+/g, '').replace(/,/g, '')}@company.mm`;
      const user = await User.create({
        email: email,
        password: 'company123', // Let the User model hash this
        role: 'company',
        isVerified: true
      });

      const company = await Company.create({
        userId: user.id,
        companyName: compData.name,
        industry: compData.industry,
        location: compData.location,
        description: compData.description,
        website: compData.website,
        companySize: compData.size,
        foundedYear: compData.foundedYear,
        verificationStatus: 'approved'
      });

      companies.push(company);
      console.log(`Created company: ${compData.name}`);
    }

    // Create Students (3 per university)
    console.log('Creating students...');
    const students = [];
    let studentIndex = 0;
    
    for (const university of universities) {
      for (let i = 0; i < 3; i++) {
        if (studentIndex >= studentNames.length) break;
        
        const studentName = studentNames[studentIndex];
        const major = studentMajors[Math.floor(Math.random() * studentMajors.length)];
        const year = Math.floor(Math.random() * 4) + 1; // Years 1-4
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Create user for student
        const email = `${studentName.toLowerCase().replace(/\s+/g, '').replace(/,/g, '')}${studentIndex + 1}@student.mm`;
        const user = await User.create({
          email: email,
          password: 'student123', // Let the User model hash this
          role: 'student',
          isVerified: true
        });

        // Split full name into first and last name
        const nameParts = studentName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Student';

        const student = await Student.create({
          userId: user.id,
          universityId: university.id,
          firstName: firstName,
          lastName: lastName,
          major: major,
          year: year,
          location: location,
          skills: getRandomSkills(major),
          status: getRandomStatus(),
          jobPreference: ['onsite', 'remote', 'ojt', 'hybrid'][Math.floor(Math.random() * 4)],
          bio: `I am a ${year} year ${major} student at ${university.universityName}. I am passionate about learning and gaining practical experience in my field.`,
          verificationStatus: 'approved'
        });

        students.push(student);
        studentIndex++;
        console.log(`Created student: ${studentName} at ${university.universityName}`);
      }
    }

    // Create University-Company Connections
    console.log('Creating university-company connections...');
    for (let i = 0; i < universities.length; i++) {
      const university = universities[i];
      // Each university connects with 2-3 companies
      const numConnections = Math.floor(Math.random() * 2) + 2;
      const selectedCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, numConnections);
      
      for (const company of selectedCompanies) {
        await UniversityCompanyConnection.create({
          universityId: university.id,
          companyId: company.id,
          status: 'active',
          connectedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
        });
        console.log(`Connected ${university.universityName} with ${company.companyName}`);
      }
    }

    // Create Jobs
    console.log('Creating jobs...');
    const jobTitles = [
      "Software Developer Intern", "Frontend Developer", "Backend Developer", 
      "Data Analyst", "Business Analyst", "Marketing Intern", "Finance Intern",
      "UI/UX Designer", "Project Manager", "Sales Representative"
    ];

    const jobDescriptions = [
      "We are looking for a motivated intern to join our development team.",
      "Join our team and gain hands-on experience in software development.",
      "Great opportunity to work with cutting-edge technologies.",
      "We offer a dynamic work environment with learning opportunities.",
      "Be part of our innovative team and contribute to exciting projects."
    ];

    const jobs = [];
    for (const company of companies) {
      // Each company posts 2-4 jobs
      const numJobs = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numJobs; i++) {
        const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const description = jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)];
        const workMode = ['onsite', 'remote', 'hybrid'][Math.floor(Math.random() * 3)];
        const jobType = ['internship', 'full-time', 'part-time'][Math.floor(Math.random() * 3)];
        const salary = workMode === 'remote' ? '$500-$800' : '$300-$600';
        
        // Randomly select 1-3 universities to target
        const targetUniversities = universities
          .filter(uni => Math.random() > 0.5)
          .slice(0, Math.floor(Math.random() * 3) + 1)
          .map(uni => uni.id);

        const job = await Job.create({
          companyId: company.id,
          title: title,
          description: description,
          requirements: getJobRequirements(title),
          location: company.location,
          workMode: workMode,
          jobType: jobType,
          salaryRange: salary,
          skillsRequired: getJobSkills(title),
          majorsPreferred: getPreferredMajors(title),
          experienceLevel: 'entry',
          status: 'active',
          numberOfPositions: Math.floor(Math.random() * 3) + 1,
          deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within next 30 days
          targetUniversities: targetUniversities,
          isPublic: Math.random() > 0.3 // 70% public, 30% targeted
        });

        jobs.push(job);
        console.log(`Created job: ${title} at ${company.companyName}`);
      }
    }

    // Create Applications
    console.log('Creating applications...');
    for (const student of students) {
      // Each student applies to 1-3 jobs
      const numApplications = Math.floor(Math.random() * 3) + 1;
      const availableJobs = jobs.filter(job => 
        job.isPublic || 
        job.targetUniversities.includes(student.universityId)
      );
      
      const selectedJobs = availableJobs
        .sort(() => 0.5 - Math.random())
        .slice(0, numApplications);

      for (const job of selectedJobs) {
        const statuses = ['pending', 'accepted', 'rejected'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        await Application.create({
          applicantId: student.id,
          applicantType: 'student',
          jobId: job.id,
          status: status,
          appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
          coverLetter: `I am interested in this ${job.title} position at ${job.Company?.companyName || 'your company'}.`
        });
      }
    }

    console.log('✅ Myanmar data seeding completed successfully!');
    console.log(`Created:`);
    console.log(`- ${universities.length} universities`);
    console.log(`- ${companies.length} companies`);
    console.log(`- ${students.length} students`);
    console.log(`- ${jobs.length} jobs`);
    console.log(`- Multiple university-company connections`);
    console.log(`- Student applications`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Helper functions
function getRandomSkills(major) {
  const skillSets = {
    "Computer Science": ["JavaScript", "Python", "React", "Node.js", "SQL", "Git"],
    "Information Technology": ["Java", "Python", "Database", "Networking", "Linux", "Cloud Computing"],
    "Business Administration": ["Project Management", "Marketing", "Finance", "Leadership", "Communication"],
    "Economics": ["Data Analysis", "Statistics", "Excel", "Research", "Economic Modeling"],
    "Engineering": ["AutoCAD", "MATLAB", "Project Management", "Technical Writing", "Problem Solving"],
    "Finance": ["Financial Analysis", "Excel", "Accounting", "Risk Management", "Investment"],
    "Marketing": ["Digital Marketing", "Social Media", "Content Creation", "Analytics", "SEO"],
    "Accounting": ["Bookkeeping", "Tax Preparation", "Financial Reporting", "Excel", "Auditing"]
  };
  
  const skills = skillSets[major] || ["Communication", "Problem Solving", "Teamwork"];
  return skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
}

function getRandomStatus() {
  const statuses = ['available', 'on_job', 'internship_completed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getJobRequirements(title) {
  const requirements = {
    "Software Developer Intern": "Basic programming knowledge, willingness to learn, good problem-solving skills",
    "Frontend Developer": "HTML, CSS, JavaScript, React experience preferred",
    "Backend Developer": "Node.js, Python, or Java experience, database knowledge",
    "Data Analyst": "Excel, SQL, analytical thinking, attention to detail",
    "Business Analyst": "Strong communication skills, analytical mindset, business understanding",
    "Marketing Intern": "Creative thinking, social media knowledge, communication skills",
    "Finance Intern": "Basic accounting knowledge, Excel skills, attention to detail",
    "UI/UX Designer": "Design thinking, Figma/Sketch experience, creativity",
    "Project Manager": "Leadership skills, organizational ability, communication",
    "Sales Representative": "Communication skills, persistence, customer service"
  };
  
  return requirements[title] || "Good communication skills, willingness to learn, teamwork";
}

function getJobSkills(title) {
  const skillSets = {
    "Software Developer Intern": ["JavaScript", "Python", "Problem Solving"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
    "Backend Developer": ["Node.js", "Python", "SQL"],
    "Data Analyst": ["Excel", "SQL", "Analytics"],
    "Business Analyst": ["Communication", "Analysis", "Business"],
    "Marketing Intern": ["Social Media", "Communication", "Creativity"],
    "Finance Intern": ["Excel", "Accounting", "Attention to Detail"],
    "UI/UX Designer": ["Figma", "Design", "Creativity"],
    "Project Manager": ["Leadership", "Organization", "Communication"],
    "Sales Representative": ["Communication", "Sales", "Customer Service"]
  };
  
  return skillSets[title] || ["Communication", "Teamwork", "Problem Solving"];
}

function getPreferredMajors(title) {
  const majorSets = {
    "Software Developer Intern": ["Computer Science", "Information Technology"],
    "Frontend Developer": ["Computer Science", "Information Technology"],
    "Backend Developer": ["Computer Science", "Information Technology"],
    "Data Analyst": ["Computer Science", "Economics", "Statistics"],
    "Business Analyst": ["Business Administration", "Economics"],
    "Marketing Intern": ["Business Administration", "Marketing"],
    "Finance Intern": ["Finance", "Business Administration"],
    "UI/UX Designer": ["Computer Science", "Design"],
    "Project Manager": ["Business Administration", "Engineering"],
    "Sales Representative": ["Business Administration", "Marketing"]
  };
  
  return majorSets[title] || ["Business Administration", "Computer Science"];
}

// Run the seeding
if (require.main === module) {
  seedData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedData };
