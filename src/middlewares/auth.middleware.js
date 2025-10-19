const jwt = require('jsonwebtoken');
const { pool } = require('../db_configs/init_db');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Check for token in Authorization header first, then in cookies
        const authHeader = req.headers['authorization'];
        const tokenFromHeader = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        const tokenFromCookie = req.cookies?.authToken;
        
        const token = tokenFromHeader || tokenFromCookie;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if session is still active in database
        const sessionQuery = `
            SELECT s.id, s.user_id, s.expires_at, u.id as user_id, u.email, u.role
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = $1 AND s.is_active = true AND s.expires_at > NOW()
        `;
        
        const sessionResult = await pool.query(sessionQuery, [token]);
        
        if (sessionResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        const session = sessionResult.rows[0];

        // Add user info to request object
        req.user = {
            userId: session.user_id,
            email: session.email,
            role: session.role,
            sessionId: session.id
        };

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        } else {
            console.error('Authentication error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during authentication'
            });
        }
    }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Middleware to check if user is admin
const requireAdmin = requireRole('ADMIN');

// Middleware to check if user is admin or the resource owner
const requireAdminOrOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const userRole = req.user.role;
    const userId = req.user.userId;
    const resourceUserId = req.params.userId || req.body.userId;

    // Admin can access any resource
    if (userRole === 'ADMIN') {
        return next();
    }

    // User can only access their own resources
    if (userId.toString() === resourceUserId?.toString()) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
    });
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        // Check for token in Authorization header first, then in cookies
        const authHeader = req.headers['authorization'];
        const tokenFromHeader = authHeader && authHeader.split(' ')[1];
        const tokenFromCookie = req.cookies?.authToken;
        
        const token = tokenFromHeader || tokenFromCookie;

        if (!token) {
            req.user = null;
            return next();
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if session is still active in database
        const sessionQuery = `
            SELECT s.id, s.user_id, s.expires_at, u.id as user_id, u.email, u.role
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = $1 AND s.is_active = true AND s.expires_at > NOW()
        `;
        
        const sessionResult = await pool.query(sessionQuery, [token]);
        
        if (sessionResult.rows.length > 0) {
            const session = sessionResult.rows[0];
            req.user = {
                userId: session.user_id,
                email: session.email,
                role: session.role,
                sessionId: session.id
            };
        } else {
            req.user = null;
        }

        next();

    } catch (error) {
        // If token is invalid, just set user to null and continue
        req.user = null;
        next();
    }
};

module.exports = {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireAdminOrOwner,
    optionalAuth
};
