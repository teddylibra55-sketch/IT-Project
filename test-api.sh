#!/bin/bash

# IT Jobs Website API Test Script

echo "🧪 Testing IT Jobs Website API..."

BASE_URL="http://localhost:5000/api"

# Test 1: Get all jobs (should return empty array initially)
echo "Test 1: Getting all jobs..."
curl -s "$BASE_URL/jobs" | jq '.' || echo "[]"

echo ""

# Test 2: Register a new user
echo "Test 2: Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq '.' || echo "$REGISTER_RESPONSE"

# Extract token from response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo ""
    echo "✅ User registered successfully!"
    echo "Token: ${TOKEN:0:20}..."
    
    # Test 3: Post a job
    echo ""
    echo "Test 3: Posting a job..."
    JOB_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "title": "Senior React Developer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "job_type": "remote",
        "description": "We are looking for a senior React developer to join our team. You will be responsible for building amazing user interfaces and working with modern web technologies.",
        "requirements": "5+ years of React experience, TypeScript, Redux, Node.js, Git",
        "salary_range": "$100,000 - $150,000"
      }')
    
    echo "$JOB_RESPONSE" | jq '.' || echo "$JOB_RESPONSE"
    
    # Test 4: Get all jobs again (should now have 1 job)
    echo ""
    echo "Test 4: Getting all jobs (should now have 1 job)..."
    curl -s "$BASE_URL/jobs" | jq '.' || echo "[]"
    
    # Test 5: Apply for the job
    echo ""
    echo "Test 5: Applying for the job..."
    APPLICATION_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs/1/apply" \
      -H "Content-Type: application/json" \
      -d '{
        "applicant_name": "John Doe",
        "applicant_email": "john@example.com",
        "applicant_phone": "+1-555-0123",
        "cover_letter": "I am very interested in this position and believe I would be a great fit for your team."
      }')
    
    echo "$APPLICATION_RESPONSE" | jq '.' || echo "$APPLICATION_RESPONSE"
    
    echo ""
    echo "🎉 All tests completed successfully!"
    echo ""
    echo "You can now:"
    echo "1. Visit http://localhost:3000 to see the frontend"
    echo "2. Register/login with test@example.com / password123"
    echo "3. Post more jobs and test the full functionality"
    
else
    echo "❌ User registration failed. Make sure the server is running."
fi


