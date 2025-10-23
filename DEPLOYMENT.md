# IT Jobs Website - Production Deployment Guide

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd Jobswebsite
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Start the Application**
   ```bash
   npm start
   ```

3. **Access the Website**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 Features Implemented

### ✅ Core Functionality
- **User Registration & Login**: Secure JWT-based authentication
- **Job Posting**: Employers can post IT job opportunities
- **Job Search & Filtering**: Filter by type (remote/onsite/hybrid), location, keywords
- **Job Applications**: Candidates can apply with resume upload and cover letter
- **Application Management**: Employers can view and manage applications
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### ✅ Technical Features
- **Modern Tech Stack**: Node.js, Express, React, SQLite
- **File Upload**: Resume upload with validation
- **Real-time Updates**: Dynamic job listings and application status
- **Security**: Password hashing, JWT tokens, input validation
- **Database**: SQLite with proper schema and relationships

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React.js + React Router
- **Database**: SQLite
- **Authentication**: JWT tokens
- **File Handling**: Multer for resume uploads
- **Styling**: Modern CSS with responsive design

## 📁 Project Structure

```
Jobswebsite/
├── server.js              # Main server file
├── package.json           # Backend dependencies
├── jobs.db               # SQLite database (auto-created)
├── uploads/              # Resume uploads directory
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── package.json     # Frontend dependencies
├── deploy.sh            # Deployment script
├── test-api.sh          # API testing script
└── README.md            # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:id` - Get single job details
- `POST /api/jobs` - Post a new job (authenticated)
- `GET /api/my-jobs` - Get user's posted jobs (authenticated)

### Applications
- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/:id/applications` - Get applications for a job (authenticated)

## 🧪 Testing

Run the API test script to verify functionality:
```bash
./test-api.sh
```

This will:
1. Test job listing
2. Register a test user
3. Post a sample job
4. Apply for the job
5. Verify all endpoints work correctly

## 🌐 Deployment Options

### Local Development
```bash
npm start          # Start backend
cd client && npm start  # Start frontend
```

### Production Deployment

#### Option 1: Heroku
1. Create Heroku app
2. Set environment variables:
   - `JWT_SECRET`: Your secret key
   - `PORT`: 5000
3. Deploy with `git push heroku main`

#### Option 2: Vercel/Netlify
1. Build frontend: `npm run build`
2. Deploy backend to a Node.js hosting service
3. Deploy frontend to Vercel/Netlify

#### Option 3: VPS/Cloud Server
1. Install Node.js and npm
2. Clone repository
3. Run `./deploy.sh`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "it-jobs"
   ```

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator for data validation
- **File Upload Security**: Multer with file type restrictions
- **CORS Protection**: Configured for secure cross-origin requests

## 📱 Mobile Responsiveness

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Intuitive Navigation**: Easy-to-use navigation menu
- **Search & Filter**: Advanced job search capabilities
- **Real-time Feedback**: Toast notifications for user actions
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 📊 Database Schema

### Users Table
- id, email, password, name, role, created_at

### Jobs Table
- id, title, company, location, job_type, description, requirements, salary_range, posted_by, created_at

### Applications Table
- id, job_id, applicant_name, applicant_email, applicant_phone, cover_letter, resume_filename, status, applied_at

## 🚀 Performance Features

- **Efficient Database Queries**: Optimized SQL queries
- **File Upload Optimization**: Proper file handling
- **Responsive Images**: Optimized for different screen sizes
- **Caching**: Static file serving
- **Compression**: Gzip compression for API responses

## 🔧 Configuration

Create a `.env` file with:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## 📞 Support

For issues or questions:
1. Check the README.md file
2. Run the test script to verify functionality
3. Check server logs for errors
4. Ensure all dependencies are installed

## 🎉 Success!

Your IT Jobs website is now ready! Users can:
- Register and login
- Post job opportunities
- Search and filter jobs
- Apply for positions
- Manage applications
- Upload resumes
- View job details

The application is production-ready and can be deployed to any hosting platform that supports Node.js.


