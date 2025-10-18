require('dotenv').config();
const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_SERVER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    max: 10,
    ssl: {
        rejectUnauthorized: false
    }
};


// Function to create database if it doesn't exist
async function createDatabaseIfNotExists() {
    const client = new Client({
        user: dbConfig.user,
        host: dbConfig.host,
        password: dbConfig.password,
        port: dbConfig.port,
        database: 'defaultdb', // Connect to default postgres database
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL server');

        // Check if database exists
        const dbName = process.env.POSTGRES_DB;
        if (!dbName) {
            throw new Error('POSTGRES_DB environment variable is not set');
        }

        const result = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [dbName]
        );

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created successfully`);
        } else {
            console.log(`Database '${dbName}' already exists`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    } finally {
        await client.end();
    }
}

// Function to initialize database schema
async function initializeSchema() {
    const pool = new Pool({
        ...dbConfig,
        database: process.env.POSTGRES_DB,
    });

    try {
        // Read and execute the schema file
        const schemaPath = path.join(__dirname, '../database/init.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schemaSQL);
        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Error initializing schema:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Main initialization function
async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');
        
        // Step 1: Create database if not exists
        await createDatabaseIfNotExists();
        
        // Step 2: Initialize schema
        await initializeSchema();
        
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

// Create the main pool for application use
const pool = new Pool({
    ...dbConfig,
    database: process.env.POSTGRES_DB,
});

// Test connection function
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0].now);
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}

module.exports = {
    pool,
    initializeDatabase,
    testConnection
};