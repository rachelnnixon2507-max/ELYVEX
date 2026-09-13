import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5001/api';

async function testNeuralChat() {
  console.log('==================================================');
  console.log('⚡ TESTING DR. ELYVEX NEURAL CORE ENGINE');
  console.log('==================================================\n');

  console.log('Checking environment configuration...');
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here';
  console.log('GEMINI_API_KEY in backend/.env:', hasKey ? '✅ Configured' : '⚠️ Not configured in backend/.env (using fallback or testing endpoint)');

  console.log('\nSending test prompt to /api/chat endpoint...');
  const prompt = "Hi Elyvex, can you give me 2 quick project ideas for building AI for social good?";

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        history: []
      })
    });

    const data = await res.json();
    console.log('HTTP Status:', res.status);
    console.log('Provider / Source:', data.provider || data.source);
    console.log('\n--- Bot Reply ---');
    console.log(data.reply || data.text || JSON.stringify(data, null, 2));
    console.log('-----------------');

    if (data.ok) {
      console.log('\n✅ Chatbot endpoint is working properly!');
    }
  } catch (err) {
    console.error('\n❌ Could not connect to backend server at', API_BASE);
    console.error('Make sure the backend is running with: cd backend && npm start');
  }
}

testNeuralChat();
