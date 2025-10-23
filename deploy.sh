#!/bin/bash

# IT Jobs Website Deployment Script

echo "🚀 Starting IT Jobs Website deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi

cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Set environment variables
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
export PORT=5000

echo "🎉 Deployment completed successfully!"
echo ""
echo "To start the application:"
echo "1. Run: npm start"
echo "2. Open your browser to: http://localhost:5000"
echo ""
echo "Features available:"
echo "✅ User registration and login"
echo "✅ Job posting and management"
echo "✅ Job search and filtering"
echo "✅ Job applications with resume upload"
echo "✅ Application management for employers"
echo "✅ Responsive design for mobile and desktop"
echo ""
echo "Default admin user (you can register):"
echo "Email: admin@example.com"
echo "Password: admin123"


