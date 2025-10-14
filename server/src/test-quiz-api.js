// server/test-quiz-api.js
const axios = require('axios');

async function testQuizAPI() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('🧪 Testing Quiz API...\n');

  try {
    // Test 1: Categories (no auth required)
    console.log('Test 1: GET /api/quiz/categories');
    const categoriesRes = await axios.get(`${BASE_URL}/api/quiz/categories`);
    console.log('✅ Categories:', categoriesRes.data);
    console.log('');

    // Test 2: Get all quizzes (needs auth)
    console.log('Test 2: GET /api/quiz (with mock student role)');
    
    // You need to replace this with a real token from your login
    const token = 'YOUR_TOKEN_HERE'; // <-- REPLACE THIS
    
    if (token === 'YOUR_TOKEN_HERE') {
      console.log('⚠️  No token provided. Trying without auth...');
      const quizzesRes = await axios.get(`${BASE_URL}/api/quiz`);
      console.log('Response:', quizzesRes.data);
    } else {
      const quizzesRes = await axios.get(`${BASE_URL}/api/quiz`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Quizzes:', quizzesRes.data);
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Is it running on port 5000?');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testQuizAPI();