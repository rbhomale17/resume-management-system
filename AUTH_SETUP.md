# Authentication Setup Guide

This document explains how to set up both traditional password authentication and Google OAuth for the Resume Management System.

## Features

✅ **Traditional Authentication**
- User registration with email/password
- User login with email/password
- Password hashing with bcrypt
- JWT token-based sessions
- Session management in database

✅ **Google OAuth Authentication**
- Google OAuth 2.0 integration
- Automatic user creation on first login
- JSON API responses (no redirects)
- Profile information from Google

✅ **Security Features**
- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- HTTP-only cookies for secure token storage
- Session invalidation on logout
- Role-based access control (ADMIN/USER)
- SQL injection protection

## Required Dependencies

Install the following packages:

```bash
npm install bcrypt jsonwebtoken passport passport-google-oauth20 passport-jwt express-session cookie-parser
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
POSTGRES_USER=your_postgres_user
POSTGRES_SERVER=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_PORT=5432
POSTGRES_DB=resume_management_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8989/api/auth/google/callback

# Application Configuration
PROJECT_NAME=Resume Management System
PROJECT_VERSION=1.0.0
PORT=8989
NODE_ENV=development
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:8989/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy the Client ID and Client Secret to your `.env` file

## API Endpoints

### Traditional Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER" // optional, defaults to "USER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

### Google OAuth

#### Initiate Google Login
```http
GET /api/auth/google
```

#### Google Callback (returns JSON response)
```http
GET /api/auth/google/callback
```

**Response:**
```json
{
  "success": true,
  "message": "Google OAuth authentication successful",
  "data": {
    "user": {
      "id": 1,
      "username": "user_1234",
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "USER",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters long"
  ]
}
```

## Authentication Middleware

The system includes several middleware functions for protecting routes:

### `authenticateToken`
Validates JWT token and adds user info to `req.user`

```javascript
const { authenticateToken } = require('./src/middlewares/auth.middleware');

app.get('/protected', authenticateToken, (req, res) => {
  // req.user contains: { userId, email, role, sessionId }
  res.json({ user: req.user });
});
```

### `requireRole(roles)`
Checks if user has required role(s)

```javascript
const { requireRole } = require('./src/middlewares/auth.middleware');

app.get('/admin', requireRole('ADMIN'), (req, res) => {
  res.json({ message: 'Admin only' });
});
```

### `requireAdminOrOwner`
Allows admin or resource owner access

```javascript
const { requireAdminOrOwner } = require('./src/middlewares/auth.middleware');

app.get('/users/:userId', requireAdminOrOwner, (req, res) => {
  res.json({ message: 'Access granted' });
});
```

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Security**: Tokens are signed with a secret key and have expiration
3. **Session Management**: Sessions are stored in database and can be invalidated
4. **SQL Injection**: All queries use parameterized statements
5. **Input Validation**: All inputs are validated using Joi schemas
6. **CORS**: Configure CORS properly for production

## Frontend Integration

### Traditional Login
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
localStorage.setItem('token', data.token);
```

### Google OAuth
```javascript
// Method 1: Direct API call (for server-side or testing)
const response = await fetch('/api/auth/google');
// This will redirect to Google OAuth consent screen

// Method 2: Handle callback response
// After Google OAuth, the callback will return JSON with token
const callbackResponse = await fetch('/api/auth/google/callback');
const { data } = await callbackResponse.json();
localStorage.setItem('token', data.token);
```

### Making Authenticated Requests

#### Using Authorization Header
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Using Cookies (Automatic)
```javascript
// If using cookies, no need to set Authorization header
// The token will be automatically sent in cookies
const response = await fetch('/api/auth/profile', {
  credentials: 'include' // Important for cookies
});
```

## Testing

You can test the authentication endpoints using tools like Postman or curl:

```bash
# Register
curl -X POST http://localhost:8989/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8989/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:8989/api/auth/profile \
  -H "Authorization: Bearer TOKEN"

# Test authentication with cookies
curl -X GET http://localhost:8989/api/test-auth \
  -b "authToken=YOUR_TOKEN_HERE"
```

## Troubleshooting

1. **Google OAuth not working**: Check your Google Cloud Console settings and callback URL
2. **JWT errors**: Ensure JWT_SECRET is set and consistent
3. **Database errors**: Verify database connection and schema initialization
4. **CORS issues**: Configure CORS properly for your frontend domain

## Production Considerations

1. Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
2. Set NODE_ENV=production
3. Use HTTPS in production
4. Configure proper CORS origins
5. Set up proper logging and monitoring
6. Consider rate limiting for auth endpoints
7. Use environment-specific Google OAuth credentials
