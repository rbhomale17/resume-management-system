const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must be at most 30 characters long',
            'any.required': 'Username is required'
        }),
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must be at most 100 characters long',
            'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password must be at most 128 characters long',
            'any.required': 'Password is required'
        }),
    role: Joi.string()
        .valid('USER')
        .default('USER')
        .messages({
            'any.only': 'Role must be either USER'
        })
});

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Logout validation schema
const logoutSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'any.required': 'Token is required'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    logoutSchema
};