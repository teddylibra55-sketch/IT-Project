# IT Jobs Website

A full-featured IT jobs platform built with Node.js, Express, React, and SQLite.

## Features

- **Job Posting**: Employers can post IT job opportunities
- **Job Search**: Users can search and filter jobs by type (remote/onsite/hybrid), location, and keywords
- **Job Applications**: Candidates can apply for jobs with resume upload and cover letter
- **User Authentication**: Secure registration and login system
- **Application Management**: Employers can view and manage applications for their posted jobs
- **Responsive Design**: Modern, mobile-friendly interface

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, React Router
- **Database**: SQLite
- **Authentication**: JWT tokens
- **File Upload**: Multer for resume handling
- **Styling**: CSS3 with modern design patterns

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the root directory:
   ```
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

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

## Database Schema

The application uses SQLite with the following tables:
- `users` - User accounts and authentication
- `jobs` - Job postings
- `applications` - Job applications

## Deployment

The application is ready for deployment on platforms like Heroku, Vercel, or any Node.js hosting service. Make sure to:

1. Set environment variables
2. Build the React frontend: `npm run build`
3. Configure the server to serve static files from the `client/build` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

