const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const { pool, initializeDatabase, testConnection } = require('./src/db_configs/init_db');

const app = express();

// Middleware
app.use(express.json());
// CORS
app.use(cors(
    {
        // origin: process.env.CORS_ORIGIN,
        origin: '*',
        credentials: true,
    }
));

// Helmet for security headers eg: CSP, X-Frame-Options, X-Content-Type-Options, etc.
app.use(helmet());

// Health check endpoint
function healthResponse({ isConnected, error = null }) {
    const status = isConnected ? 'healthy' : 'unhealthy';
    const httpStatus = isConnected ? 200 : 503;
    const message = error
        ? 'Health check failed'
        : isConnected
        ? 'Server and database are running properly'
        : 'Database connection failed';
    const response = {
        status,
        message,
        timestamp: new Date().toISOString(),
    };
    if (error) response.error = error.message;
    return { httpStatus, response };
}

app.get('/health', async (req, res) => {
    try {
        const isConnected = await testConnection();
        const { httpStatus, response } = healthResponse({ isConnected });
        res.status(httpStatus).json(response);
    } catch (error) {
        const { httpStatus, response } = healthResponse({ isConnected: false, error });
        res.status(httpStatus).json(response);
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: process.env.PROJECT_NAME,
        version: process.env.PROJECT_VERSION,
        repository: 'https://github.com/rbhomale17/resume-management-system',
        author: 'Rushikesh Diliprao Bhomale',
        email: 'rushikeshbhomale@gmail.com',
        linkedin: 'https://www.linkedin.com/in/rushikesh-bhomale-aa29a3158/',
        github: 'https://github.com/rbhomale17',
        website: 'https://rbhomale17.github.io/',
        leetcode: 'https://leetcode.com/u/rbhomale17/',
        timestamp: new Date().toISOString()
    });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, '0.0.0.0', async () => {
    try {
        console.log('🚀 Starting Resume Management System...');
        
        // Initialize database and create tables
        console.log('📊 Initializing database...');
        await initializeDatabase();
        
        // Test database connection
        console.log('🔍 Testing database connection...');
        const isConnected = await testConnection();
        
        if (!isConnected) {
            throw new Error('Failed to establish database connection');
        }
        
        console.log(`✅ Server is running on port ${port}`);
        console.log(`🌐 Health check available at: http://localhost:${port}/health`);
        console.log(`📋 API documentation: http://localhost:${port}/`);
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
});