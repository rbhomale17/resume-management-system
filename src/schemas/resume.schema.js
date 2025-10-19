const Joi = require('joi');

// Personal Information Schema
const personalInformationSchema = Joi.object({
    full_name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Full name must be at least 2 characters long',
            'string.max': 'Full name cannot exceed 255 characters',
            'any.required': 'Full name is required'
        }),
    
    professional_title: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Professional title must be at least 2 characters long',
            'string.max': 'Professional title cannot exceed 255 characters',
            'any.required': 'Professional title is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    
    phone_number: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Phone number is required'
        }),
    
    location: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Location must be at least 2 characters long',
            'string.max': 'Location cannot exceed 255 characters',
            'any.required': 'Location is required'
        }),
    
    social_media_urls: Joi.object({
        linkedin: Joi.string().uri().optional(),
        github: Joi.string().uri().optional(),
        portfolio: Joi.string().uri().optional(),
        leetcode: Joi.string().uri().optional(),
        hackerrank: Joi.string().uri().optional()
    }).default({})
});

// Professional Summary Schema
const professionalSummarySchema = Joi.object({
    summary: Joi.string()
        .min(50)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Professional summary must be at least 50 characters long',
            'string.max': 'Professional summary cannot exceed 1000 characters',
            'any.required': 'Professional summary is required'
        })
});

// Work Experience Schema
const workExperienceSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Job title must be at least 2 characters long',
            'string.max': 'Job title cannot exceed 255 characters',
            'any.required': 'Job title is required'
        }),
    
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Company name must be at least 2 characters long',
            'string.max': 'Company name cannot exceed 255 characters',
            'any.required': 'Company name is required'
        }),
    
    url: Joi.string().uri().optional(),
    
    location: Joi.string()
        .min(2)
        .max(255)
        .optional(),
    
    start_date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Start date cannot be in the future',
            'any.required': 'Start date is required'
        }),
    
    end_date: Joi.date()
        .min(Joi.ref('start_date'))
        .max('now')
        .optional()
        .messages({
            'date.min': 'End date must be after start date',
            'date.max': 'End date cannot be in the future'
        }),
    
    is_current: Joi.boolean().default(false),
    
    description: Joi.string()
        .min(20)
        .max(2000)
        .optional()
        .messages({
            'string.min': 'Job description must be at least 20 characters long',
            'string.max': 'Job description cannot exceed 2000 characters'
        })
}).custom((value, helpers) => {
    // Custom validation: if is_current is true, end_date should be null
    if (value.is_current && value.end_date) {
        return helpers.error('custom.currentJobWithEndDate');
    }
    // If is_current is false, end_date should be provided
    if (!value.is_current && !value.end_date) {
        return helpers.error('custom.currentJobWithoutEndDate');
    }
    return value;
}).messages({
    'custom.currentJobWithEndDate': 'Current job cannot have an end date',
    'custom.currentJobWithoutEndDate': 'Non-current job must have an end date'
});

// Project Schema
const projectSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Project title must be at least 2 characters long',
            'string.max': 'Project title cannot exceed 255 characters',
            'any.required': 'Project title is required'
        }),
    
    url: Joi.string().uri().optional(),
    
    start_date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Start date cannot be in the future',
            'any.required': 'Start date is required'
        }),
    
    end_date: Joi.date()
        .min(Joi.ref('start_date'))
        .max('now')
        .optional()
        .messages({
            'date.min': 'End date must be after start date',
            'date.max': 'End date cannot be in the future'
        }),
    
    description: Joi.string()
        .min(20)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Project description must be at least 20 characters long',
            'string.max': 'Project description cannot exceed 2000 characters',
            'any.required': 'Project description is required'
        })
});

// Skill Schema
const skillSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Skill name must be at least 2 characters long',
            'string.max': 'Skill name cannot exceed 255 characters',
            'any.required': 'Skill name is required'
        }),
    
    level: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .optional()
        .messages({
            'number.min': 'Skill level must be between 1 and 5',
            'number.max': 'Skill level must be between 1 and 5',
            'number.integer': 'Skill level must be an integer'
        })
});

// Education Schema
const educationSchema = Joi.object({
    degree: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Degree must be at least 2 characters long',
            'string.max': 'Degree cannot exceed 255 characters',
            'any.required': 'Degree is required'
        }),
    
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Institution name must be at least 2 characters long',
            'string.max': 'Institution name cannot exceed 255 characters',
            'any.required': 'Institution name is required'
        }),
    
    url: Joi.string().uri().optional(),
    
    start_date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Start date cannot be in the future',
            'any.required': 'Start date is required'
        }),
    
    end_date: Joi.date()
        .min(Joi.ref('start_date'))
        .max('now')
        .optional()
        .messages({
            'date.min': 'End date must be after start date',
            'date.max': 'End date cannot be in the future'
        }),
    
    location: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Location must be at least 2 characters long',
            'string.max': 'Location cannot exceed 255 characters',
            'any.required': 'Location is required'
        }),
    
    description: Joi.string()
        .min(20)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'Description must be at least 20 characters long',
            'string.max': 'Description cannot exceed 1000 characters'
        })
});

// Certification Schema
const certificationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Certification name must be at least 2 characters long',
            'string.max': 'Certification name cannot exceed 255 characters',
            'any.required': 'Certification name is required'
        }),
    
    url: Joi.string().uri().optional(),
    
    description: Joi.string()
        .min(20)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'Description must be at least 20 characters long',
            'string.max': 'Description cannot exceed 1000 characters'
        })
});

// Resume Schema
const resumeSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(255)
        .default('Default Resume')
        .messages({
            'string.min': 'Resume title must be at least 2 characters long',
            'string.max': 'Resume title cannot exceed 255 characters'
        }),
    
    personal_information_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Personal information ID must be a number',
            'number.integer': 'Personal information ID must be an integer',
            'number.positive': 'Personal information ID must be positive',
            'any.required': 'Personal information ID is required'
        }),
    
    professional_summary_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Professional summary IDs must be an array',
            'number.base': 'Each professional summary ID must be a number',
            'number.integer': 'Each professional summary ID must be an integer',
            'number.positive': 'Each professional summary ID must be positive'
        }),
    
    work_experience_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Work experience IDs must be an array',
            'number.base': 'Each work experience ID must be a number',
            'number.integer': 'Each work experience ID must be an integer',
            'number.positive': 'Each work experience ID must be positive'
        }),
    
    project_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Project IDs must be an array',
            'number.base': 'Each project ID must be a number',
            'number.integer': 'Each project ID must be an integer',
            'number.positive': 'Each project ID must be positive'
        }),
    
    skill_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Skill IDs must be an array',
            'number.base': 'Each skill ID must be a number',
            'number.integer': 'Each skill ID must be an integer',
            'number.positive': 'Each skill ID must be positive'
        }),
    
    education_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Education IDs must be an array',
            'number.base': 'Each education ID must be a number',
            'number.integer': 'Each education ID must be an integer',
            'number.positive': 'Each education ID must be positive'
        }),
    
    certification_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .default([])
        .messages({
            'array.base': 'Certification IDs must be an array',
            'number.base': 'Each certification ID must be a number',
            'number.integer': 'Each certification ID must be an integer',
            'number.positive': 'Each certification ID must be positive'
        })
});

// Update schemas (all fields optional)
const updatePersonalInformationSchema = personalInformationSchema.fork(Object.keys(personalInformationSchema.describe().keys), (schema) => schema.optional());
const updateProfessionalSummarySchema = professionalSummarySchema.fork(Object.keys(professionalSummarySchema.describe().keys), (schema) => schema.optional());
const updateWorkExperienceSchema = workExperienceSchema.fork(Object.keys(workExperienceSchema.describe().keys), (schema) => schema.optional());
const updateProjectSchema = projectSchema.fork(Object.keys(projectSchema.describe().keys), (schema) => schema.optional());
const updateSkillSchema = skillSchema.fork(Object.keys(skillSchema.describe().keys), (schema) => schema.optional());
const updateEducationSchema = educationSchema.fork(Object.keys(educationSchema.describe().keys), (schema) => schema.optional());
const updateCertificationSchema = certificationSchema.fork(Object.keys(certificationSchema.describe().keys), (schema) => schema.optional());
const updateResumeSchema = resumeSchema.fork(Object.keys(resumeSchema.describe().keys), (schema) => schema.optional());

module.exports = {
    // Create schemas
    personalInformationSchema,
    professionalSummarySchema,
    workExperienceSchema,
    projectSchema,
    skillSchema,
    educationSchema,
    certificationSchema,
    resumeSchema,
    
    // Update schemas
    updatePersonalInformationSchema,
    updateProfessionalSummarySchema,
    updateWorkExperienceSchema,
    updateProjectSchema,
    updateSkillSchema,
    updateEducationSchema,
    updateCertificationSchema,
    updateResumeSchema
};
