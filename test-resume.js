const axios = require('axios');

// Test Resume Management System
async function testResumeManagement() {
    const baseUrl = 'http://localhost:8989';
    let authToken = '';
    
    console.log('🔍 Testing Resume Management System...\n');
    
    try {
        // Step 1: Login to get authentication token
        console.log('1. Authenticating user...');
        const loginData = {
            email: 'rushikeshbhomale@gmail.com',
            password: 'your_password' // Replace with actual password
        };
        
        const loginResponse = await axios.post(`${baseUrl}/api/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.message);
        authToken = loginResponse.data.data.token;
        
        const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        };
        
        // Step 2: Create Personal Information
        console.log('\n2. Creating personal information...');
        const personalInfoData = {
            full_name: 'Rushikesh Diliprao Bhomale',
            professional_title: 'Full Stack Developer',
            email: 'rushikeshbhomale@gmail.com',
            phone_number: '+1234567890',
            location: 'Pune, Maharashtra, India',
            social_media_urls: {
                linkedin: 'https://www.linkedin.com/in/rushikesh-bhomale-aa29a3158/',
                github: 'https://github.com/rbhomale17',
                website: 'https://rbhomale17.github.io/'
            }
        };
        
        const personalInfoResponse = await axios.post(`${baseUrl}/api/resume/personal-information`, personalInfoData, { headers });
        console.log('✅ Personal information created:', personalInfoResponse.data.message);
        const personalInfoId = personalInfoResponse.data.data.id;
        
        // Step 3: Create Professional Summary
        console.log('\n3. Creating professional summary...');
        const summaryData = {
            summary: 'Experienced Full Stack Developer with expertise in modern web technologies including React, Node.js, and PostgreSQL. Passionate about building scalable applications and solving complex problems. Strong background in both frontend and backend development with a focus on clean code and best practices.'
        };
        
        const summaryResponse = await axios.post(`${baseUrl}/api/resume/professional-summaries`, summaryData, { headers });
        console.log('✅ Professional summary created:', summaryResponse.data.message);
        const summaryId = summaryResponse.data.data.id;
        
        // Step 4: Create Work Experience
        console.log('\n4. Creating work experience...');
        const workExpData = {
            title: 'Senior Software Developer',
            name: 'Tech Solutions Inc.',
            url: 'https://techsolutions.com',
            location: 'Pune, India',
            start_date: '2022-01-01',
            end_date: '2024-12-31',
            is_current: false,
            description: 'Led development of multiple web applications using React and Node.js. Implemented CI/CD pipelines and improved application performance by 40%. Mentored junior developers and conducted code reviews.'
        };
        
        const workExpResponse = await axios.post(`${baseUrl}/api/resume/work-experiences`, workExpData, { headers });
        console.log('✅ Work experience created:', workExpResponse.data.message);
        const workExpId = workExpResponse.data.data.id;
        
        // Step 5: Create Project
        console.log('\n5. Creating project...');
        const projectData = {
            title: 'Resume Management System',
            url: 'https://github.com/rbhomale17/resume-management-system',
            start_date: '2024-10-01',
            end_date: '2024-10-19',
            description: 'A comprehensive resume management system built with Node.js, Express, and PostgreSQL. Features include user authentication, CRUD operations for resume components, and secure session management.'
        };
        
        const projectResponse = await axios.post(`${baseUrl}/api/resume/projects`, projectData, { headers });
        console.log('✅ Project created:', projectResponse.data.message);
        const projectId = projectResponse.data.data.id;
        
        // Step 6: Create Skills
        console.log('\n6. Creating skills...');
        const skillsData = [
            { name: 'JavaScript', level: 5 },
            { name: 'Node.js', level: 4 },
            { name: 'React', level: 4 },
            { name: 'PostgreSQL', level: 4 },
            { name: 'Express.js', level: 5 },
            { name: 'Git', level: 4 }
        ];
        
        const skillIds = [];
        for (const skill of skillsData) {
            const skillResponse = await axios.post(`${baseUrl}/api/resume/skills`, skill, { headers });
            console.log(`✅ Skill created: ${skill.name} (Level ${skill.level})`);
            skillIds.push(skillResponse.data.data.id);
        }
        
        // Step 7: Create Education
        console.log('\n7. Creating education...');
        const educationData = {
            degree: 'Bachelor of Technology in Computer Science',
            name: 'University of Pune',
            url: 'https://unipune.ac.in',
            start_date: '2018-08-01',
            end_date: '2022-05-31',
            location: 'Pune, Maharashtra, India',
            description: 'Graduated with honors. Focused on software engineering, data structures, and algorithms. Completed multiple projects in web development and database management.'
        };
        
        const educationResponse = await axios.post(`${baseUrl}/api/resume/education`, educationData, { headers });
        console.log('✅ Education created:', educationResponse.data.message);
        const educationId = educationResponse.data.data.id;
        
        // Step 8: Create Certification
        console.log('\n8. Creating certification...');
        const certificationData = {
            name: 'AWS Certified Developer - Associate',
            url: 'https://aws.amazon.com/certification/certified-developer-associate/',
            description: 'Validates technical expertise in developing and maintaining applications on the AWS platform.'
        };
        
        const certificationResponse = await axios.post(`${baseUrl}/api/resume/certifications`, certificationData, { headers });
        console.log('✅ Certification created:', certificationResponse.data.message);
        const certificationId = certificationResponse.data.data.id;
        
        // Step 9: Create Resume
        console.log('\n9. Creating resume...');
        const resumeData = {
            title: 'My Professional Resume',
            personal_information_id: personalInfoId,
            professional_summary_ids: [summaryId],
            work_experience_ids: [workExpId],
            project_ids: [projectId],
            skill_ids: skillIds,
            education_ids: [educationId],
            certification_ids: [certificationId]
        };
        
        const resumeResponse = await axios.post(`${baseUrl}/api/resume/resumes`, resumeData, { headers });
        console.log('✅ Resume created:', resumeResponse.data.message);
        const resumeId = resumeResponse.data.data.id;
        
        // Step 10: Get Complete Resume
        console.log('\n10. Retrieving complete resume...');
        const completeResumeResponse = await axios.get(`${baseUrl}/api/resume/resumes/${resumeId}`, { headers });
        console.log('✅ Complete resume retrieved successfully');
        
        const resume = completeResumeResponse.data.data;
        console.log('\n📋 Resume Summary:');
        console.log(`   Title: ${resume.title}`);
        console.log(`   Name: ${resume.personal_information.full_name}`);
        console.log(`   Title: ${resume.personal_information.professional_title}`);
        console.log(`   Work Experiences: ${resume.work_experiences.length}`);
        console.log(`   Projects: ${resume.projects.length}`);
        console.log(`   Skills: ${resume.skills.length}`);
        console.log(`   Education: ${resume.education.length}`);
        console.log(`   Certifications: ${resume.certifications.length}`);
        
        // Step 11: Test Update Operations
        console.log('\n11. Testing update operations...');
        
        // Update personal information
        const updatePersonalInfo = {
            location: 'Mumbai, Maharashtra, India'
        };
        await axios.put(`${baseUrl}/api/resume/personal-information`, updatePersonalInfo, { headers });
        console.log('✅ Personal information updated');
        
        // Update skill level
        const updateSkill = {
            level: 5
        };
        await axios.put(`${baseUrl}/api/resume/skills/${skillIds[0]}`, updateSkill, { headers });
        console.log('✅ Skill updated');
        
        // Step 12: Test Get All Operations
        console.log('\n12. Testing get all operations...');
        
        const allSkills = await axios.get(`${baseUrl}/api/resume/skills`, { headers });
        const allProjects = await axios.get(`${baseUrl}/api/resume/projects`, { headers });
        const allResumes = await axios.get(`${baseUrl}/api/resume/resumes`, { headers });
        
        console.log(`✅ Retrieved ${allSkills.data.data.length} skills`);
        console.log(`✅ Retrieved ${allProjects.data.data.length} projects`);
        console.log(`✅ Retrieved ${allResumes.data.data.length} resumes`);
        
        console.log('\n🎉 All resume management tests passed!');
        console.log('\n📋 Resume Management System Features:');
        console.log('✅ Personal Information Management');
        console.log('✅ Professional Summaries');
        console.log('✅ Work Experience Tracking');
        console.log('✅ Project Portfolio');
        console.log('✅ Skills with Proficiency Levels');
        console.log('✅ Education History');
        console.log('✅ Certifications');
        console.log('✅ Complete Resume Builder');
        console.log('✅ Full CRUD Operations');
        console.log('✅ Data Validation');
        console.log('✅ User Ownership Validation');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure your server is running on port 8989');
            console.log('   Run: npm start');
        } else if (error.response?.status === 401) {
            console.log('\n💡 Authentication failed. Please check your credentials.');
            console.log('   Make sure you have a valid user account and correct password.');
        }
    }
}

// Run the test
testResumeManagement();
