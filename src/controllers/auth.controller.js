const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db_configs/init_db');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS)

// Helper function to generate JWT token
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: `${JWT_EXPIRES_IN}m` }
    );
};

// Helper function to create session in database
const createSession = async (userId, token) => {
    // JWT_EXPIRES_IN is in minutes, so convert to ms and add to current time
    const expiresAt = new Date(Date.now() + Number(JWT_EXPIRES_IN) * 60 * 1000);

    const query = `
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id
    `;
    
    const result = await pool.query(query, [userId, token, expiresAt]);
    return result.rows[0].id;
};

// Helper function to invalidate session
const invalidateSession = async (token) => {
    const query = `
        UPDATE sessions 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE token = $1 AND is_active = true
    `;
    
    await pool.query(query, [token]);
};

// Traditional Registration
const register = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { username, name, email, password, role = 'USER' } = value;

        // Check if user already exists
        const existingUserQuery = `
            SELECT id FROM users 
            WHERE email = $1 OR username = $2
        `;
        const existingUser = await pool.query(existingUserQuery, [email, username]);
        
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        // Create user
        const createUserQuery = `
            INSERT INTO users (username, name, email, password, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, name, email, role, created_at
        `;
        
        const userResult = await pool.query(createUserQuery, [
            username, name, email, hashedPassword, role
        ]);

        const user = userResult.rows[0];

        // Generate token and create session
        const token = generateToken(user.id, user.email, user.role);
        await createSession(user.id, token);

        // Set token as HTTP-only cookie for security
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(JWT_EXPIRES_IN) * 60 * 1000 // JWT_EXPIRES_IN minutes
        });

        // Remove password from response
        delete user.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token,
                expiresIn: JWT_EXPIRES_IN
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

// Traditional Login
const login = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { email, password } = value;

        // Find user by email
        const userQuery = `
            SELECT id, username, name, email, password, role, created_at
            FROM users 
            WHERE email = $1
        `;
        
        const userResult = await pool.query(userQuery, [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = userResult.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token and create session
        const token = generateToken(user.id, user.email, user.role);
        await createSession(user.id, token);

        // Set token as HTTP-only cookie for security
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(JWT_EXPIRES_IN) * 60 * 1000 // JWT_EXPIRES_IN minutes
        });

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token,
                expiresIn: JWT_EXPIRES_IN
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

// Google OAuth Login/Register
const googleAuth = async (req, res) => {
    try {
        // This will be called after Google OAuth verification
        // req.user will contain Google profile information
        const { id: googleId, emails, displayName, photos } = req.user;
        const email = emails[0].value;
        const name = displayName;
        const profilePicture = photos[0]?.value;

        // Check if user exists
        const existingUserQuery = `
            SELECT id, username, name, email, role, created_at
            FROM users 
            WHERE email = $1
        `;
        
        const existingUser = await pool.query(existingUserQuery, [email]);
        
        let user;
        
        if (existingUser.rows.length > 0) {
            // User exists, log them in
            user = existingUser.rows[0];
        } else {
            // Create new user
            const username = email.split('@')[0] + '_' + googleId.slice(-4);
            
            const createUserQuery = `
                INSERT INTO users (username, name, email, password, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, username, name, email, role, created_at
            `;
            
            // For OAuth users, we don't need a password, but we'll set a random one
            const randomPassword = await bcrypt.hash(email, BCRYPT_SALT_ROUNDS);
            
            const userResult = await pool.query(createUserQuery, [
                username, name, email, randomPassword, 'USER'
            ]);
            
            user = userResult.rows[0];
        }

        // Generate token and create session
        const token = generateToken(user.id, user.email, user.role);
        await createSession(user.id, token);

        // Set token as HTTP-only cookie for security
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(JWT_EXPIRES_IN) * 60 * 1000 // JWT_EXPIRES_IN minutes
        });

        // For web interface, redirect with token in URL
        // Check if request is from a browser (has User-Agent and no API client indicators)
        const userAgent = req.headers['user-agent'] || '';
        const isBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox');
        
        if (isBrowser) {
            return res.redirect(`/?token=${token}`);
        }

        // Return JSON response with token for API clients
        res.json({
            success: true,
            message: 'Google OAuth authentication successful',
            data: {
                user,
                token,
                expiresIn: JWT_EXPIRES_IN
            }
        });

    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google OAuth authentication failed',
            error: 'oauth_failed'
        });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token || req.cookies?.authToken;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Invalidate session
        await invalidateSession(token);

        // Clear the auth cookie
        res.clearCookie('authToken');

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout'
        });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userQuery = `
            SELECT id, username, name, email, role, created_at
            FROM users 
            WHERE id = $1
        `;
        
        const userResult = await pool.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userResult.rows[0];

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    register,
    login,
    googleAuth,
    logout,
    getProfile
};
