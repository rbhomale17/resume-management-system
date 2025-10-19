const axios = require('axios');

// Test Google OAuth flow
async function testGoogleOAuth() {
    const baseUrl = 'http://localhost:8989';
    
    console.log('🔍 Testing Google OAuth Flow...\n');
    
    try {
        // Step 1: Test server health
        console.log('1. Testing server health...');
        const healthResponse = await axios.get(`${baseUrl}/health`);
        console.log('✅ Server is healthy:', healthResponse.data.status);
        
        // Step 2: Test Google OAuth initiation
        console.log('\n2. Testing Google OAuth initiation...');
        console.log('📝 To test Google OAuth:');
        console.log(`   - Open browser and go to: ${baseUrl}/api/auth/google`);
        console.log('   - Complete Google OAuth flow');
        console.log('   - You should be redirected to callback with JSON response');
        
        // Step 3: Test traditional auth
        console.log('\n3. Testing traditional authentication...');
        
        // Register a test user
        console.log('   Registering test user...');
        const registerData = {
            username: 'testuser' + Date.now(),
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };
        
        const registerResponse = await axios.post(`${baseUrl}/api/auth/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data.message);
        
        // Login with the test user
        console.log('   Logging in...');
        const loginData = {
            email: registerData.email,
            password: registerData.password
        };
        
        const loginResponse = await axios.post(`${baseUrl}/api/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.message);
        
        const token = loginResponse.data.data.token;
        
        // Test authenticated endpoint
        console.log('   Testing authenticated endpoint...');
        const profileResponse = await axios.get(`${baseUrl}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile access successful:', profileResponse.data.data.user.name);
        
        // Test logout
        console.log('   Testing logout...');
        const logoutResponse = await axios.post(`${baseUrl}/api/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Logout successful:', logoutResponse.data.message);
        
        console.log('\n🎉 All tests passed!');
        console.log('\n📋 Next steps:');
        console.log('1. Set up your .env file with Google OAuth credentials');
        console.log('2. Test Google OAuth by visiting: http://localhost:8989/api/auth/google');
        console.log('3. The callback should return JSON with user data and token');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure your server is running on port 8989');
            console.log('   Run: npm start');
        }
    }
}

// Run the test
testGoogleOAuth();
