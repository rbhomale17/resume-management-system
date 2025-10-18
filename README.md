# Resume Management System

A comprehensive Node.js-based resume management system that allows users to create, manage, and organize their professional profiles with multiple resume versions.

## 🌐 Live Demo

**Deployed Application**: [https://resume-management-system-vkb2.onrender.com](https://resume-management-system-vkb2.onrender.com)

## 🚀 Features

- **User Management**: Secure user registration and authentication with role-based access (ADMIN/USER)
- **Personal Information**: Store and manage personal details, contact information, and social media links
- **Professional Summaries**: Create and manage multiple professional summaries
- **Work Experience**: Track employment history with detailed job descriptions and dates
- **Projects**: Showcase personal and professional projects with descriptions and links
- **Skills**: Manage technical and soft skills with proficiency levels (1-5 scale)
- **Education**: Record educational background and achievements
- **Certifications**: Track professional certifications and credentials
- **Resume Builder**: Create multiple resume versions by combining different sections
- **Session Management**: Secure session handling with token-based authentication
- **Health Monitoring**: Built-in health check endpoints for system monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with pgcrypto extension
- **Security**: Helmet.js for security headers, CORS support
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
   ```

4. **Start the application**
   ```bash
   # Development mode with hot reloading
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Schema
<img width="1003" height="629" alt="image" src="https://github.com/user-attachments/assets/5fb623c4-bb56-4bde-9f55-2b080069d541" />

The system uses a comprehensive PostgreSQL schema with the following main tables:

- **users**: User accounts with authentication and role management
- **personal_information**: Personal details and contact information
- **professional_summaries**: Professional summary statements
- **work_experiences**: Employment history and job details
- **projects**: Personal and professional projects
- **skills**: Technical and soft skills with proficiency levels
- **education**: Educational background and achievements
- **certifications**: Professional certifications and credentials
- **resumes**: Resume compositions linking various sections
- **sessions**: User session management and authentication tokens

### Key Features:
- **UUID Support**: Uses pgcrypto extension for secure UUID generation
- **Automatic Timestamps**: Triggers automatically update `updated_at` columns
- **Data Integrity**: Foreign key constraints and check constraints ensure data consistency
- **Performance Optimization**: Strategic indexes for optimal query performance
- **Soft Deletes**: `is_active` flags for soft deletion of records

## 🌐 API Endpoints

### Health Check
- `GET /health` - System health status and database connectivity

### Root Information
- `GET /` - Project information, author details, and system metadata

## 🔒 Security Features

- **Helmet.js**: Security headers including CSP, X-Frame-Options, X-Content-Type-Options
- **CORS**: Configurable Cross-Origin Resource Sharing
- **SQL Injection Protection**: Parameterized queries and safe SQL construction
- **Session Management**: Secure token-based authentication system
- **Input Validation**: Database-level constraints and application-level validation

## 🚀 Development

### Project Structure
```
resume-management-system/
├── src/
│   ├── database/
│   │   └── init.sql              # Database schema and initialization
│   ├── db_configs/
│   │   └── init_db.js           # Database connection and initialization
│   ├── routes/                  # API route handlers (to be implemented)
│   └── utils/
│       └── sql_utils.js         # SQL utility functions
├── index.js                     # Main application entry point
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
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

## 🔍 Monitoring

The application includes built-in health monitoring:
- Health check endpoint at `/health`
- Database connectivity testing
- System status reporting with timestamps
- Error logging and stack trace reporting

## 👨‍💻 Author

**Rushikesh Diliprao Bhomale**
- Email: rushikeshbhomale@gmail.com
- LinkedIn: [rushikesh-bhomale-aa29a3158](https://www.linkedin.com/in/rushikesh-bhomale-aa29a3158/)
- GitHub: [rbhomale17](https://github.com/rbhomale17)
- Website: [rbhomale17.github.io](https://rbhomale17.github.io/)
- LeetCode: [rbhomale17](https://leetcode.com/u/rbhomale17/)

## 📄 License

This project is licensed under the ISC License.

## 📝 TODO

- [ ] Implement user authentication endpoints
- [ ] Add CRUD operations for all resume sections
- [ ] Create resume generation and export functionality
- [ ] Add input validation middleware
- [ ] Implement rate limiting
- [ ] Add comprehensive test suite
- [ ] Create API documentation with Swagger
- [ ] Add file upload for profile pictures and documents
- [ ] Implement resume templates and themes

