const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing login with admin@momez.com...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@momez.com',
        password: 'admin123'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    // Test with a registered user
    console.log('\n\nTesting login with adalomer60@gmail.com...');
    const response2 = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'adalomer60@gmail.com',
        password: 'password' // varsayılan şifre
      })
    });

    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
