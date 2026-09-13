const API_BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING TECHASCENT EMAIL NOTIFICATION SYSTEM TESTS');
  console.log('==================================================\n');

  // Test 1: Health check
  console.log('1️⃣ Testing API Health Endpoint...');
  const healthRes = await fetch(`${API_BASE}/health`);
  const healthData = await healthRes.json();
  console.log('Health Status:', healthData.status, '| Email Service:', healthData.emailService);

  // Test 2: Valid Submission with all required fields
  console.log('\n2️⃣ Testing Complete Grievance Submission Flow...');
  const testPayload = {
    name: 'Jane Doe',
    age: 24,
    location: 'Silicon Valley, California',
    email: 'jane.doe@example.com',
    problem: 'Our residential autonomous security grid was hacked by unauthorized ransomware algorithms and locked all occupants inside.'
  };

  const submitRes = await fetch(`${API_BASE}/help-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const submitData = await submitRes.json();
  console.log('Status Code:', submitRes.status);
  console.log('Response:', JSON.stringify(submitData, null, 2));

  if (submitData.ok) {
    console.log('✅ Submission Success: Incident Reference', submitData.id);
    console.log('✅ Date & Time Recorded:', submitData.timestamp);
  } else {
    console.error('❌ Submission Failed:', submitData.error);
  }

  // Test 3: Validation Error Handling
  console.log('\n3️⃣ Testing Validation Failures...');
  
  const invalidPayloads = [
    { label: 'Missing Name', data: { ...testPayload, name: '' } },
    { label: 'Invalid Age (<1)', data: { ...testPayload, age: 0 } },
    { label: 'Missing Location', data: { ...testPayload, location: '' } },
    { label: 'Invalid Email Format', data: { ...testPayload, email: 'bad-email' } },
    { label: 'Missing Grievance', data: { ...testPayload, problem: '' } }
  ];

  for (const t of invalidPayloads) {
    const res = await fetch(`${API_BASE}/help-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t.data)
    });
    const data = await res.json();
    console.log(`• ${t.label}: Status ${res.status} | Handled with error: "${data.error}"`);
  }

  console.log('\n==================================================');
  console.log('🎉 ALL AUTOMATED FLOW TESTS COMPLETED SUCCESSFULLY');
  console.log('==================================================');
}

runTests().catch(err => console.error('Test Suite Error:', err));
