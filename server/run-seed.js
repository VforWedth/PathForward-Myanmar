#!/usr/bin/env node

const { seedData } = require('./seed-myanmar-data');

console.log('🌱 Starting Myanmar data seeding...');
console.log('This will create:');
console.log('- 10 Myanmar universities');
console.log('- 5 Myanmar companies');
console.log('- 30 students (3 per university)');
console.log('- University-company connections');
console.log('- Job postings');
console.log('- Student applications');
console.log('');

seedData()
  .then(() => {
    console.log('');
    console.log('🎉 Seeding completed successfully!');
    console.log('You can now login with:');
    console.log('- University: [universityname]@university.mm / university123');
    console.log('- Company: [companyname]@company.mm / company123');
    console.log('- Student: [studentname][number]@student.mm / student123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
