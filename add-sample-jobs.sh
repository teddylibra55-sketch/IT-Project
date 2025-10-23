#!/bin/bash

# Script to add multiple sample jobs to your IT Jobs website

echo "🚀 Adding sample jobs to your IT Jobs website..."

BASE_URL="http://localhost:5000/api"

# First, register/login to get a token
echo "📝 Registering as job poster..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Job Poster",
    "email": "poster@example.com",
    "password": "password123"
  }')

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Successfully registered! Adding jobs..."
    
    # Array of sample jobs
    jobs=(
        '{
            "title": "Frontend Developer",
            "company": "TechStart Inc",
            "location": "New York, NY",
            "job_type": "remote",
            "description": "We are seeking a talented Frontend Developer to join our growing team. You will be responsible for building responsive web applications using React, Vue.js, and modern CSS frameworks. This is a great opportunity to work on cutting-edge projects and collaborate with a talented team of developers.",
            "requirements": "3+ years of frontend development experience, React.js, Vue.js, HTML5, CSS3, JavaScript ES6+, Git, Responsive design, UI/UX knowledge",
            "salary_range": "$70,000 - $100,000"
        }'
        '{
            "title": "Backend Developer",
            "company": "DataCorp Solutions",
            "location": "Austin, TX",
            "job_type": "onsite",
            "description": "Join our backend development team and work on scalable server-side applications. You will be responsible for designing and implementing RESTful APIs, database optimization, and cloud infrastructure. We offer competitive benefits and opportunities for career growth.",
            "requirements": "4+ years of backend development, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, RESTful APIs, Microservices architecture",
            "salary_range": "$80,000 - $120,000"
        }'
        '{
            "title": "DevOps Engineer",
            "company": "CloudTech Systems",
            "location": "Seattle, WA",
            "job_type": "hybrid",
            "description": "We are looking for a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You will work with cutting-edge cloud technologies and automation tools to ensure our systems are reliable, secure, and performant.",
            "requirements": "3+ years of DevOps experience, AWS/Azure, Docker, Kubernetes, CI/CD pipelines, Terraform, Monitoring tools (Prometheus, Grafana), Linux administration",
            "salary_range": "$90,000 - $130,000"
        }'
        '{
            "title": "Full Stack Developer",
            "company": "InnovateLab",
            "location": "San Francisco, CA",
            "job_type": "remote",
            "description": "Join our innovative team as a Full Stack Developer and work on exciting projects that impact millions of users. You will be involved in both frontend and backend development, working with modern technologies and agile methodologies.",
            "requirements": "5+ years of full-stack development, React.js, Node.js, TypeScript, PostgreSQL, AWS, GraphQL, Agile methodologies, Team leadership experience",
            "salary_range": "$100,000 - $150,000"
        }'
        '{
            "title": "Mobile App Developer",
            "company": "AppCraft Studios",
            "location": "Los Angeles, CA",
            "job_type": "onsite",
            "description": "We are seeking a Mobile App Developer to create amazing mobile experiences for iOS and Android platforms. You will work with React Native, Flutter, and native development to build high-performance mobile applications.",
            "requirements": "3+ years of mobile development, React Native, Flutter, iOS/Android native development, Swift, Kotlin, Firebase, App Store/Play Store deployment",
            "salary_range": "$75,000 - $110,000"
        }'
        '{
            "title": "Data Scientist",
            "company": "Analytics Pro",
            "location": "Boston, MA",
            "job_type": "hybrid",
            "description": "Join our data science team and work on machine learning projects that drive business decisions. You will analyze large datasets, build predictive models, and work with stakeholders to implement data-driven solutions.",
            "requirements": "4+ years of data science experience, Python, R, Machine Learning, TensorFlow, PyTorch, SQL, Statistics, Data visualization, Cloud platforms",
            "salary_range": "$95,000 - $140,000"
        }'
        '{
            "title": "UI/UX Designer",
            "company": "Design Studio Co",
            "location": "Chicago, IL",
            "job_type": "remote",
            "description": "We are looking for a creative UI/UX Designer to join our design team. You will be responsible for creating user-centered designs, conducting user research, and collaborating with developers to bring designs to life.",
            "requirements": "3+ years of UI/UX design experience, Figma, Adobe Creative Suite, User research, Prototyping, Design systems, HTML/CSS knowledge, Portfolio required",
            "salary_range": "$65,000 - $95,000"
        }'
        '{
            "title": "Cybersecurity Analyst",
            "company": "SecureNet Corp",
            "location": "Denver, CO",
            "job_type": "onsite",
            "description": "Join our cybersecurity team and help protect our organization from cyber threats. You will monitor security systems, investigate incidents, and implement security measures to ensure our data and systems remain secure.",
            "requirements": "3+ years of cybersecurity experience, SIEM tools, Network security, Incident response, Security certifications (CISSP, CISM), Penetration testing, Risk assessment",
            "salary_range": "$85,000 - $125,000"
        }'
    )
    
    # Post each job
    for i in "${!jobs[@]}"; do
        echo "📝 Posting job $((i+1))..."
        curl -s -X POST "$BASE_URL/jobs" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "${jobs[$i]}" > /dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Job $((i+1)) posted successfully!"
        else
            echo "❌ Failed to post job $((i+1))"
        fi
        
        sleep 1  # Small delay between requests
    done
    
    echo ""
    echo "🎉 All jobs have been posted successfully!"
    echo ""
    echo "You can now:"
    echo "1. Visit http://localhost:3000 to see all the jobs"
    echo "2. Login with poster@example.com / password123 to manage your jobs"
    echo "3. Test the search and filtering features"
    echo "4. Apply for jobs as different users"
    
else
    echo "❌ Failed to register. Make sure the server is running on port 5000"
fi


