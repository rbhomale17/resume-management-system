const router = require('express').Router();
const passport = require('../config/passport.config');
const { 
    register, 
    login, 
    googleAuth, 
    logout, 
    getProfile 
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Traditional authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth routes
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false,
        failureMessage: 'Google OAuth authentication failed'
    }), 
    googleAuth
);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;