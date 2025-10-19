const { pool } = require('../db_configs/init_db');
const { 
    personalInformationSchema,
    professionalSummarySchema,
    workExperienceSchema,
    projectSchema,
    skillSchema,
    educationSchema,
    certificationSchema,
    resumeSchema,
    updatePersonalInformationSchema,
    updateProfessionalSummarySchema,
    updateWorkExperienceSchema,
    updateProjectSchema,
    updateSkillSchema,
    updateEducationSchema,
    updateCertificationSchema,
    updateResumeSchema
} = require('../schemas/resume.schema');

// Helper function to check if user owns the resource
const checkResourceOwnership = async (tableName, resourceId, userId) => {
    const query = `SELECT id FROM ${tableName} WHERE id = $1 AND user_id = $2 AND is_active = true`;
    const result = await pool.query(query, [resourceId, userId]);
    return result.rows.length > 0;
};

// Helper function to validate array of IDs belong to user
const validateResourceIds = async (tableName, ids, userId) => {
    if (!ids || ids.length === 0) return true;
    
    const placeholders = ids.map((_, index) => `$${index + 2}`).join(',');
    const query = `
        SELECT id FROM ${tableName} 
        WHERE id IN (${placeholders}) AND user_id = $1 AND is_active = true
    `;
    const result = await pool.query(query, [userId, ...ids]);
    return result.rows.length === ids.length;
};

// ==================== PERSONAL INFORMATION ====================

// Create personal information
const createPersonalInformation = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Validate request body
        const { error, value } = personalInformationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { full_name, professional_title, email, phone_number, location, social_media_urls } = value;

        // Check if user already has personal information
        const existingQuery = `
            SELECT id FROM personal_information 
            WHERE user_id = $1 AND is_active = true
        `;
        const existing = await pool.query(existingQuery, [userId]);
        
        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Personal information already exists. Use update endpoint to modify it.'
            });
        }

        // Create personal information
        const createQuery = `
            INSERT INTO personal_information (user_id, full_name, professional_title, email, phone_number, location, social_media_urls)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            userId, full_name, professional_title, email, phone_number, location, JSON.stringify(social_media_urls)
        ]);

        res.status(201).json({
            success: true,
            message: 'Personal information created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create personal information error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get personal information
const getPersonalInformation = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM personal_information 
            WHERE user_id = $1 AND is_active = true
        `;
        
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personal information not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get personal information error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update personal information
const updatePersonalInformation = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Validate request body
        const { error, value } = updatePersonalInformationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check if personal information exists
        const existingQuery = `
            SELECT id FROM personal_information 
            WHERE user_id = $1 AND is_active = true
        `;
        const existing = await pool.query(existingQuery, [userId]);
        
        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personal information not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                if (key === 'social_media_urls') {
                    updateFields.push(`${key} = $${paramCount}`);
                    updateValues.push(JSON.stringify(value[key]));
                } else {
                    updateFields.push(`${key} = $${paramCount}`);
                    updateValues.push(value[key]);
                }
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(userId);
        const updateQuery = `
            UPDATE personal_information 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Personal information updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update personal information error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete personal information
const deletePersonalInformation = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            UPDATE personal_information 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Personal information not found'
            });
        }

        res.json({
            success: true,
            message: 'Personal information deleted successfully'
        });

    } catch (error) {
        console.error('Delete personal information error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== PROFESSIONAL SUMMARIES ====================

// Create professional summary
const createProfessionalSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = professionalSummarySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { summary } = value;

        const createQuery = `
            INSERT INTO professional_summaries (user_id, summary)
            VALUES ($1, $2)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [userId, summary]);

        res.status(201).json({
            success: true,
            message: 'Professional summary created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create professional summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all professional summaries
const getProfessionalSummaries = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM professional_summaries 
            WHERE user_id = $1 AND is_active = true
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get professional summaries error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update professional summary
const updateProfessionalSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateProfessionalSummarySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('professional_summaries', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Professional summary not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE professional_summaries 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Professional summary updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update professional summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete professional summary
const deleteProfessionalSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('professional_summaries', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Professional summary not found'
            });
        }

        const query = `
            UPDATE professional_summaries 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Professional summary deleted successfully'
        });

    } catch (error) {
        console.error('Delete professional summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== WORK EXPERIENCES ====================

// Create work experience
const createWorkExperience = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = workExperienceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { title, name, url, location, start_date, end_date, is_current, description } = value;

        const createQuery = `
            INSERT INTO work_experiences (user_id, title, name, url, location, start_date, end_date, is_current, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            userId, title, name, url, location, start_date, end_date, is_current, description
        ]);

        res.status(201).json({
            success: true,
            message: 'Work experience created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create work experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all work experiences
const getWorkExperiences = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM work_experiences 
            WHERE user_id = $1 AND is_active = true
            ORDER BY start_date DESC, created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get work experiences error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update work experience
const updateWorkExperience = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateWorkExperienceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('work_experiences', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Work experience not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE work_experiences 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Work experience updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update work experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete work experience
const deleteWorkExperience = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('work_experiences', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Work experience not found'
            });
        }

        const query = `
            UPDATE work_experiences 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Work experience deleted successfully'
        });

    } catch (error) {
        console.error('Delete work experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== PROJECTS ====================

// Create project
const createProject = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = projectSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { title, url, start_date, end_date, description } = value;

        const createQuery = `
            INSERT INTO projects (user_id, title, url, start_date, end_date, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            userId, title, url, start_date, end_date, description
        ]);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM projects 
            WHERE user_id = $1 AND is_active = true
            ORDER BY start_date DESC, created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update project
const updateProject = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateProjectSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('projects', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE projects 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('projects', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const query = `
            UPDATE projects 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== SKILLS ====================

// Create skill
const createSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = skillSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { name, level } = value;

        const createQuery = `
            INSERT INTO skills (user_id, name, level)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [userId, name, level]);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all skills
const getSkills = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM skills 
            WHERE user_id = $1 AND is_active = true
            ORDER BY name ASC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update skill
const updateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateSkillSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('skills', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE skills 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Skill updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete skill
const deleteSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('skills', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        const query = `
            UPDATE skills 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });

    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== EDUCATION ====================

// Create education
const createEducation = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = educationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { degree, name, url, start_date, end_date, location, description } = value;

        const createQuery = `
            INSERT INTO education (user_id, degree, name, url, start_date, end_date, location, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            userId, degree, name, url, start_date, end_date, location, description
        ]);

        res.status(201).json({
            success: true,
            message: 'Education created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create education error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all education
const getEducation = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM education 
            WHERE user_id = $1 AND is_active = true
            ORDER BY start_date DESC, created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get education error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update education
const updateEducation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateEducationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('education', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Education not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE education 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Education updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update education error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete education
const deleteEducation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('education', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Education not found'
            });
        }

        const query = `
            UPDATE education 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Education deleted successfully'
        });

    } catch (error) {
        console.error('Delete education error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== CERTIFICATIONS ====================

// Create certification
const createCertification = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = certificationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { name, url, description } = value;

        const createQuery = `
            INSERT INTO certifications (user_id, name, url, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            userId, name, url, description
        ]);

        res.status(201).json({
            success: true,
            message: 'Certification created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create certification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all certifications
const getCertifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM certifications 
            WHERE user_id = $1 AND is_active = true
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get certifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update certification
const updateCertification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateCertificationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check ownership
        const ownsResource = await checkResourceOwnership('certifications', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE certifications 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Certification updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update certification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete certification
const deleteCertification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Check ownership
        const ownsResource = await checkResourceOwnership('certifications', id, userId);
        if (!ownsResource) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found'
            });
        }

        const query = `
            UPDATE certifications 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Certification deleted successfully'
        });

    } catch (error) {
        console.error('Delete certification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// ==================== RESUMES ====================

// Create resume
const createResume = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const { error, value } = resumeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        const { 
            title, 
            personal_information_id, 
            professional_summary_ids, 
            work_experience_ids, 
            project_ids, 
            skill_ids, 
            education_ids, 
            certification_ids 
        } = value;

        // Validate that personal information belongs to user
        const ownsPersonalInfo = await checkResourceOwnership('personal_information', personal_information_id, userId);
        if (!ownsPersonalInfo) {
            return res.status(400).json({
                success: false,
                message: 'Personal information not found or does not belong to you'
            });
        }

        // Validate all other resource IDs belong to user
        const validSummaries = await validateResourceIds('professional_summaries', professional_summary_ids, userId);
        const validWorkExp = await validateResourceIds('work_experiences', work_experience_ids, userId);
        const validProjects = await validateResourceIds('projects', project_ids, userId);
        const validSkills = await validateResourceIds('skills', skill_ids, userId);
        const validEducation = await validateResourceIds('education', education_ids, userId);
        const validCertifications = await validateResourceIds('certifications', certification_ids, userId);

        if (!validSummaries || !validWorkExp || !validProjects || !validSkills || !validEducation || !validCertifications) {
            return res.status(400).json({
                success: false,
                message: 'One or more referenced resources do not exist or do not belong to you'
            });
        }

        const createQuery = `
            INSERT INTO resumes (title, user_id, personal_information_id, professional_summary_ids, work_experience_ids, project_ids, skill_ids, education_ids, certification_ids)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        
        const result = await pool.query(createQuery, [
            title, userId, personal_information_id, professional_summary_ids, work_experience_ids, project_ids, skill_ids, education_ids, certification_ids
        ]);

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all resumes
const getResumes = async (req, res) => {
    try {
        const userId = req.user.userId;

        const query = `
            SELECT * FROM resumes 
            WHERE user_id = $1 AND is_active = true
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get resume by ID with full details
const getResumeById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // Get resume
        const resumeQuery = `
            SELECT * FROM resumes 
            WHERE id = $1 AND user_id = $2 AND is_active = true
        `;
        const resumeResult = await pool.query(resumeQuery, [id, userId]);
        
        if (resumeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        const resume = resumeResult.rows[0];

        // Get personal information
        const personalInfoQuery = `
            SELECT * FROM personal_information 
            WHERE id = $1 AND is_active = true
        `;
        const personalInfoResult = await pool.query(personalInfoQuery, [resume.personal_information_id]);

        // Get professional summaries
        let professionalSummaries = [];
        if (resume.professional_summary_ids && resume.professional_summary_ids.length > 0) {
            const summaryQuery = `
                SELECT * FROM professional_summaries 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY created_at DESC
            `;
            const summaryResult = await pool.query(summaryQuery, [resume.professional_summary_ids]);
            professionalSummaries = summaryResult.rows;
        }

        // Get work experiences
        let workExperiences = [];
        if (resume.work_experience_ids && resume.work_experience_ids.length > 0) {
            const workQuery = `
                SELECT * FROM work_experiences 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY start_date DESC
            `;
            const workResult = await pool.query(workQuery, [resume.work_experience_ids]);
            workExperiences = workResult.rows;
        }

        // Get projects
        let projects = [];
        if (resume.project_ids && resume.project_ids.length > 0) {
            const projectQuery = `
                SELECT * FROM projects 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY start_date DESC
            `;
            const projectResult = await pool.query(projectQuery, [resume.project_ids]);
            projects = projectResult.rows;
        }

        // Get skills
        let skills = [];
        if (resume.skill_ids && resume.skill_ids.length > 0) {
            const skillQuery = `
                SELECT * FROM skills 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY name ASC
            `;
            const skillResult = await pool.query(skillQuery, [resume.skill_ids]);
            skills = skillResult.rows;
        }

        // Get education
        let education = [];
        if (resume.education_ids && resume.education_ids.length > 0) {
            const educationQuery = `
                SELECT * FROM education 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY start_date DESC
            `;
            const educationResult = await pool.query(educationQuery, [resume.education_ids]);
            education = educationResult.rows;
        }

        // Get certifications
        let certifications = [];
        if (resume.certification_ids && resume.certification_ids.length > 0) {
            const certificationQuery = `
                SELECT * FROM certifications 
                WHERE id = ANY($1) AND is_active = true
                ORDER BY created_at DESC
            `;
            const certificationResult = await pool.query(certificationQuery, [resume.certification_ids]);
            certifications = certificationResult.rows;
        }

        // Combine all data
        const fullResume = {
            ...resume,
            personal_information: personalInfoResult.rows[0] || null,
            professional_summaries: professionalSummaries,
            work_experiences: workExperiences,
            projects: projects,
            skills: skills,
            education: education,
            certifications: certifications
        };

        res.json({
            success: true,
            data: fullResume
        });

    } catch (error) {
        console.error('Get resume by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update resume
const updateResume = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        
        const { error, value } = updateResumeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }

        // Check if resume exists and belongs to user
        const resumeQuery = `
            SELECT * FROM resumes 
            WHERE id = $1 AND user_id = $2 AND is_active = true
        `;
        const resumeResult = await pool.query(resumeQuery, [id, userId]);
        
        if (resumeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Validate referenced resources if provided
        if (value.personal_information_id) {
            const ownsPersonalInfo = await checkResourceOwnership('personal_information', value.personal_information_id, userId);
            if (!ownsPersonalInfo) {
                return res.status(400).json({
                    success: false,
                    message: 'Personal information not found or does not belong to you'
                });
            }
        }

        if (value.professional_summary_ids) {
            const validSummaries = await validateResourceIds('professional_summaries', value.professional_summary_ids, userId);
            if (!validSummaries) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more professional summaries do not exist or do not belong to you'
                });
            }
        }

        if (value.work_experience_ids) {
            const validWorkExp = await validateResourceIds('work_experiences', value.work_experience_ids, userId);
            if (!validWorkExp) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more work experiences do not exist or do not belong to you'
                });
            }
        }

        if (value.project_ids) {
            const validProjects = await validateResourceIds('projects', value.project_ids, userId);
            if (!validProjects) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more projects do not exist or do not belong to you'
                });
            }
        }

        if (value.skill_ids) {
            const validSkills = await validateResourceIds('skills', value.skill_ids, userId);
            if (!validSkills) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more skills do not exist or do not belong to you'
                });
            }
        }

        if (value.education_ids) {
            const validEducation = await validateResourceIds('education', value.education_ids, userId);
            if (!validEducation) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more education records do not exist or do not belong to you'
                });
            }
        }

        if (value.certification_ids) {
            const validCertifications = await validateResourceIds('certifications', value.certification_ids, userId);
            if (!validCertifications) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more certifications do not exist or do not belong to you'
                });
            }
        }

        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        Object.keys(value).forEach(key => {
            if (value[key] !== undefined) {
                updateFields.push(`${key} = $${paramCount}`);
                updateValues.push(value[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `
            UPDATE resumes 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, updateValues);

        res.json({
            success: true,
            message: 'Resume updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete resume
const deleteResume = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const query = `
            UPDATE resumes 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2 AND is_active = true
            RETURNING id
        `;
        
        const result = await pool.query(query, [id, userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
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
};
