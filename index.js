const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { pool, initializeDatabase, testConnection } = require('./src/db_configs/init_db');
const passport = require('./src/config/passport.config');
const authRoutes = require('./src/routes/auth.router');
const resumeRoutes = require('./src/routes/resume.router');
const { authenticateToken } = require('./src/middlewares/auth.middleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Session configuration for Passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Test endpoint to demonstrate cookie-based authentication
app.get('/api/test-auth', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication successful!',
        user: req.user
    });
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
        timestamp: new Date().toISOString(),
        api: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                logout: 'POST /api/auth/logout',
                profile: 'GET /api/auth/profile',
                google: 'GET /api/auth/google',
                googleCallback: 'GET /api/auth/google/callback'
            },
            resume: {
                personalInformation: {
                    create: 'POST /api/resume/personal-information',
                    get: 'GET /api/resume/personal-information',
                    update: 'PUT /api/resume/personal-information',
                    delete: 'DELETE /api/resume/personal-information'
                },
                professionalSummaries: {
                    create: 'POST /api/resume/professional-summaries',
                    getAll: 'GET /api/resume/professional-summaries',
                    update: 'PUT /api/resume/professional-summaries/:id',
                    delete: 'DELETE /api/resume/professional-summaries/:id'
                },
                workExperiences: {
                    create: 'POST /api/resume/work-experiences',
                    getAll: 'GET /api/resume/work-experiences',
                    update: 'PUT /api/resume/work-experiences/:id',
                    delete: 'DELETE /api/resume/work-experiences/:id'
                },
                projects: {
                    create: 'POST /api/resume/projects',
                    getAll: 'GET /api/resume/projects',
                    update: 'PUT /api/resume/projects/:id',
                    delete: 'DELETE /api/resume/projects/:id'
                },
                skills: {
                    create: 'POST /api/resume/skills',
                    getAll: 'GET /api/resume/skills',
                    update: 'PUT /api/resume/skills/:id',
                    delete: 'DELETE /api/resume/skills/:id'
                },
                education: {
                    create: 'POST /api/resume/education',
                    getAll: 'GET /api/resume/education',
                    update: 'PUT /api/resume/education/:id',
                    delete: 'DELETE /api/resume/education/:id'
                },
                certifications: {
                    create: 'POST /api/resume/certifications',
                    getAll: 'GET /api/resume/certifications',
                    update: 'PUT /api/resume/certifications/:id',
                    delete: 'DELETE /api/resume/certifications/:id'
                },
                resumes: {
                    create: 'POST /api/resume/resumes',
                    getAll: 'GET /api/resume/resumes',
                    getById: 'GET /api/resume/resumes/:id',
                    update: 'PUT /api/resume/resumes/:id',
                    delete: 'DELETE /api/resume/resumes/:id'
                }
            },
            test: {
                authTest: 'GET /api/test-auth (requires authentication)'
            }
        },
        features: {
            authentication: 'Both traditional (email/password) and Google OAuth',
            cookies: 'HTTP-only cookies for secure token storage',
            sessions: 'Database-backed session management',
            security: 'JWT tokens, bcrypt password hashing, SQL injection protection',
            resumeManagement: 'Complete CRUD operations for resume components',
            resumeComponents: 'Personal info, summaries, work experience, projects, skills, education, certifications',
            resumeBuilder: 'Create multiple resumes by combining different components'
        }
    });
});

const port = Number(process.env.PORT);

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