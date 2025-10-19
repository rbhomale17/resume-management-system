const router = require('express').Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const {
    // Personal Information
    createPersonalInformation,
    getPersonalInformation,
    updatePersonalInformation,
    deletePersonalInformation,
    
    // Professional Summaries
    createProfessionalSummary,
    getProfessionalSummaries,
    updateProfessionalSummary,
    deleteProfessionalSummary,
    
    // Work Experiences
    createWorkExperience,
    getWorkExperiences,
    updateWorkExperience,
    deleteWorkExperience,
    
    // Projects
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    
    // Skills
    createSkill,
    getSkills,
    updateSkill,
    deleteSkill,
    
    // Education
    createEducation,
    getEducation,
    updateEducation,
    deleteEducation,
    
    // Certifications
    createCertification,
    getCertifications,
    updateCertification,
    deleteCertification,
    
    // Resumes
    createResume,
    getResumes,
    getResumeById,
    updateResume,
    deleteResume
} = require('../controllers/resume.controller');

// ==================== PERSONAL INFORMATION ROUTES ====================

// Create personal information
router.post('/personal-information', authenticateToken, createPersonalInformation);

// Get personal information
router.get('/personal-information', authenticateToken, getPersonalInformation);

// Update personal information
router.put('/personal-information', authenticateToken, updatePersonalInformation);

// Delete personal information
router.delete('/personal-information', authenticateToken, deletePersonalInformation);

// ==================== PROFESSIONAL SUMMARIES ROUTES ====================

// Create professional summary
router.post('/professional-summaries', authenticateToken, createProfessionalSummary);

// Get all professional summaries
router.get('/professional-summaries', authenticateToken, getProfessionalSummaries);

// Update professional summary by ID
router.put('/professional-summaries/:id', authenticateToken, updateProfessionalSummary);

// Delete professional summary by ID
router.delete('/professional-summaries/:id', authenticateToken, deleteProfessionalSummary);

// ==================== WORK EXPERIENCES ROUTES ====================

// Create work experience
router.post('/work-experiences', authenticateToken, createWorkExperience);

// Get all work experiences
router.get('/work-experiences', authenticateToken, getWorkExperiences);

// Update work experience by ID
router.put('/work-experiences/:id', authenticateToken, updateWorkExperience);

// Delete work experience by ID
router.delete('/work-experiences/:id', authenticateToken, deleteWorkExperience);

// ==================== PROJECTS ROUTES ====================

// Create project
router.post('/projects', authenticateToken, createProject);

// Get all projects
router.get('/projects', authenticateToken, getProjects);

// Update project by ID
router.put('/projects/:id', authenticateToken, updateProject);

// Delete project by ID
router.delete('/projects/:id', authenticateToken, deleteProject);

// ==================== SKILLS ROUTES ====================

// Create skill
router.post('/skills', authenticateToken, createSkill);

// Get all skills
router.get('/skills', authenticateToken, getSkills);

// Update skill by ID
router.put('/skills/:id', authenticateToken, updateSkill);

// Delete skill by ID
router.delete('/skills/:id', authenticateToken, deleteSkill);

// ==================== EDUCATION ROUTES ====================

// Create education
router.post('/education', authenticateToken, createEducation);

// Get all education
router.get('/education', authenticateToken, getEducation);

// Update education by ID
router.put('/education/:id', authenticateToken, updateEducation);

// Delete education by ID
router.delete('/education/:id', authenticateToken, deleteEducation);

// ==================== CERTIFICATIONS ROUTES ====================

// Create certification
router.post('/certifications', authenticateToken, createCertification);

// Get all certifications
router.get('/certifications', authenticateToken, getCertifications);

// Update certification by ID
router.put('/certifications/:id', authenticateToken, updateCertification);

// Delete certification by ID
router.delete('/certifications/:id', authenticateToken, deleteCertification);

// ==================== RESUMES ROUTES ====================

// Create resume
router.post('/resumes', authenticateToken, createResume);

// Get all resumes
router.get('/resumes', authenticateToken, getResumes);

// Get resume by ID with full details
router.get('/resumes/:id', authenticateToken, getResumeById);

// Update resume by ID
router.put('/resumes/:id', authenticateToken, updateResume);

// Delete resume by ID
router.delete('/resumes/:id', authenticateToken, deleteResume);

module.exports = router;
