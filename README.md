# Resume Management System

A comprehensive Node.js-based resume management system that allows users to create, manage, and organize their professional profiles with multiple resume versions. Features a beautiful web interface and robust REST API.

## 🌐 Live Demo

**Deployed Application**: [https://resume-management-system-vkb2.onrender.com](https://resume-management-system-vkb2.onrender.com)

## 🚀 Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure user authentication with email/password
- **Google OAuth Integration**: One-click login with Google accounts
- **JWT Token Authentication**: Secure session management with JSON Web Tokens
- **Role-based Access Control**: ADMIN/USER roles with appropriate permissions
- **Session Management**: Automatic session handling with secure token storage
- **Password Security**: Bcrypt hashing for secure password storage

### 📄 Resume Management
- **Personal Information**: Store and manage personal details, contact information, and social media links
- **Professional Summaries**: Create and manage multiple professional summaries
- **Work Experience**: Track employment history with detailed job descriptions, dates, and current position tracking
- **Projects**: Showcase personal and professional projects with descriptions, URLs, and technology stacks
- **Skills**: Manage technical and soft skills with proficiency levels (1-5 scale)
- **Education**: Record educational background, institutions, and achievements
- **Certifications**: Track professional certifications and credentials with URLs
- **Resume Builder**: Create multiple resume versions by combining different sections with smart defaults

### 🌐 Web Interface
- **Modern UI/UX**: Beautiful, responsive web interface with gradient backgrounds and smooth animations
- **Tabbed Navigation**: Intuitive navigation between different resume sections
- **Real-time Feedback**: Success/error messages and loading states for all operations
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Auto-population**: Forms automatically populate with existing data for easy editing
- **Smart Defaults**: All available sections are pre-selected when creating resumes

### 🔧 Technical Features
- **RESTful API**: Complete REST API with comprehensive CRUD operations
- **Database Optimization**: Strategic indexes and efficient queries for optimal performance
- **Input Validation**: Joi schema validation for all API endpoints
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Health Monitoring**: Built-in health check endpoints for system monitoring
- **SQL Injection Protection**: Parameterized queries and safe SQL construction

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with pgcrypto extension for UUID generation
- **Authentication**: Passport.js with JWT and Google OAuth strategies
- **Security**: Helmet.js for security headers, CORS support, bcrypt for password hashing
- **Validation**: Joi for request validation and schema definition
- **Environment**: dotenv for configuration management
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

- Node.js (v22.17.0 or higher)
- PostgreSQL (v17.5 or higher)
- npm package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rbhomale17/resume-management-system.git
   cd resume-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   POSTGRES_USER=your_postgres_username
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_SERVER=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=resume_management_db
   
   # Application Configuration
   PORT=8989
   PROJECT_NAME=Resume Management System
   PROJECT_VERSION=1.0.0
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   
   # Google OAuth Configuration (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the application**
   ```bash
   # Development mode with hot reloading
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Web Interface: `http://localhost:8989/`
   - API Documentation: `http://localhost:8989/api`

## 🗄️ Database Schema

The system uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User accounts with authentication and role management
- **personal_information**: Personal details and contact information with social media links
- **professional_summaries**: Professional summary statements
- **work_experiences**: Employment history with job details and current position tracking
- **projects**: Personal and professional projects with URLs and descriptions
- **skills**: Technical and soft skills with proficiency levels (1-5 scale)
- **education**: Educational background and achievements
- **certifications**: Professional certifications and credentials
- **resumes**: Resume compositions linking various sections with smart defaults
- **sessions**: User session management and authentication tokens

### Key Database Features:
- **UUID Support**: Uses pgcrypto extension for secure UUID generation
- **Automatic Timestamps**: Triggers automatically update `updated_at` columns
- **Data Integrity**: Foreign key constraints and check constraints ensure data consistency
- **Performance Optimization**: Strategic indexes for optimal query performance
- **Soft Deletes**: `is_active` flags for soft deletion of records
- **Array Support**: PostgreSQL arrays for storing multiple IDs in resume compositions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Resume Management
- `POST /api/resume/personal-information` - Create/update personal information
- `GET /api/resume/personal-information` - Get personal information
- `PUT /api/resume/personal-information` - Update personal information

- `POST /api/resume/professional-summaries` - Create professional summary
- `GET /api/resume/professional-summaries` - Get all professional summaries
- `PUT /api/resume/professional-summaries/:id` - Update professional summary
- `DELETE /api/resume/professional-summaries/:id` - Delete professional summary

- `POST /api/resume/work-experiences` - Create work experience
- `GET /api/resume/work-experiences` - Get all work experiences
- `PUT /api/resume/work-experiences/:id` - Update work experience
- `DELETE /api/resume/work-experiences/:id` - Delete work experience

- `POST /api/resume/projects` - Create project
- `GET /api/resume/projects` - Get all projects
- `PUT /api/resume/projects/:id` - Update project
- `DELETE /api/resume/projects/:id` - Delete project

- `POST /api/resume/skills` - Create skill
- `GET /api/resume/skills` - Get all skills
- `PUT /api/resume/skills/:id` - Update skill
- `DELETE /api/resume/skills/:id` - Delete skill

- `POST /api/resume/education` - Create education record
- `GET /api/resume/education` - Get all education records
- `PUT /api/resume/education/:id` - Update education record
- `DELETE /api/resume/education/:id` - Delete education record

- `POST /api/resume/certifications` - Create certification
- `GET /api/resume/certifications` - Get all certifications
- `PUT /api/resume/certifications/:id` - Update certification
- `DELETE /api/resume/certifications/:id` - Delete certification

- `POST /api/resume/resumes` - Create resume
- `GET /api/resume/resumes` - Get all resumes
- `GET /api/resume/resumes/:id` - Get specific resume
- `PUT /api/resume/resumes/:id` - Update resume
- `DELETE /api/resume/resumes/:id` - Delete resume

### System
- `GET /health` - System health status and database connectivity
- `GET /` - Web interface
- `GET /api` - API documentation and project information

## 🔒 Security Features

- **Helmet.js**: Security headers including CSP, X-Frame-Options, X-Content-Type-Options
- **CORS**: Configurable Cross-Origin Resource Sharing
- **SQL Injection Protection**: Parameterized queries and safe SQL construction with `quote_ident()` utility
- **JWT Authentication**: Secure token-based authentication system
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Joi schema validation for all endpoints
- **Session Management**: Secure session handling with token expiration
- **Google OAuth**: Secure third-party authentication

## 🚀 Development

### Project Structure
```
resume-management-system/
├── src/
│   ├── config/
│   │   └── passport.config.js        # Passport.js configuration
│   ├── controllers/
│   │   ├── auth.controller.js        # Authentication logic
│   │   └── resume.controller.js      # Resume management logic
│   ├── database/
│   │   ├── init.sql                  # Database schema and initialization
│   │   ├── db_diagram_schema.dbml    # Database diagram schema
│   │   └── db_diagram.png            # Database diagram
│   ├── db_configs/
│   │   └── init_db.js                # Database connection and initialization
│   ├── middlewares/
│   │   └── auth.middleware.js        # Authentication middleware
│   ├── routes/
│   │   ├── auth.router.js            # Authentication routes
│   │   └── resume.router.js          # Resume management routes
│   ├── schemas/
│   │   ├── auth.schema.js            # Authentication validation schemas
│   │   └── resume.schema.js          # Resume validation schemas
│   └── utils/
│       └── sql_utils.js              # SQL utility functions
├── public/
│   └── index.html                    # Web interface
├── index.js                          # Main application entry point
├── package.json                      # Project dependencies and scripts
├── AUTH_SETUP.md                     # Authentication setup guide
├── WEB_INTERFACE.md                  # Web interface documentation
└── README.md                         # Project documentation
```

### Available Scripts
- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with hot reloading
- `npm test` - Run tests (to be implemented)

## 📊 Database Initialization

The system automatically:
1. Creates the database if it doesn't exist
2. Initializes all tables, indexes, and constraints
3. Sets up triggers for automatic timestamp updates
4. Tests database connectivity
5. Creates necessary extensions (pgcrypto for UUID generation)

## 🔍 Monitoring

The application includes built-in health monitoring:
- Health check endpoint at `/health`
- Database connectivity testing
- System status reporting with timestamps
- Error logging and stack trace reporting
- API endpoint documentation at `/api`

## 🎯 Usage

### Web Interface
1. Visit `http://localhost:8989/`
2. Register a new account or login with existing credentials
3. Use Google OAuth for quick login (if configured)
4. Navigate through tabs to manage different resume sections
5. Create multiple resumes by combining different sections
6. All available sections are pre-selected by default for convenience

### API Integration
- Use the REST API endpoints for programmatic access
- Include JWT token in Authorization header for authenticated requests
- Refer to `/api` endpoint for complete API documentation

## 👨‍💻 Author

**Rushikesh Diliprao Bhomale**
- Email: rushikeshbhomale@gmail.com
- LinkedIn: [rushikesh-bhomale-aa29a3158](https://www.linkedin.com/in/rushikesh-bhomale-aa29a3158/)
- GitHub: [rbhomale17](https://github.com/rbhomale17)
- Website: [rbhomale17.github.io](https://rbhomale17.github.io/)
- LeetCode: [rbhomale17](https://leetcode.com/u/rbhomale17/)

## 📄 License

This project is licensed under the ISC License.

## 🎉 Recent Updates

- ✅ Complete web interface implementation
- ✅ Google OAuth integration
- ✅ JWT authentication system
- ✅ Comprehensive CRUD operations for all resume sections
- ✅ Smart resume builder with default section selection
- ✅ Mobile-responsive design
- ✅ Input validation and error handling
- ✅ SQL injection protection
- ✅ Session management
- ✅ Health monitoring endpoints
