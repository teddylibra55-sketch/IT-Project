import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      const response = await axios.get('/api/my-jobs');
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeClass = (type) => {
    switch (type) {
      case 'remote': return 'job-type-remote';
      case 'onsite': return 'job-type-onsite';
      case 'hybrid': return 'job-type-hybrid';
      default: return 'job-type-remote';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>Please log in to view your jobs</h2>
          <p>You need to be logged in to manage your job postings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="my-jobs-container">
        <div className="page-header">
          <h1>My Job Postings</h1>
          <Link to="/post-job" className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-briefcase"></i>
            <h3>No jobs posted yet</h3>
            <p>Start by posting your first job opportunity</p>
            <Link to="/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="card job-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="job-title">{job.title}</h2>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <span className={`job-type-badge ${getJobTypeClass(job.job_type)}`}>
                    {job.job_type}
                  </span>
                </div>

                <div className="job-meta">
                  <div className="job-meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{job.location}</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                  <div className="job-meta-item">
                    <i className="fas fa-users"></i>
                    <span>{job.application_count} applications</span>
                  </div>
                  {job.salary_range && (
                    <div className="job-meta-item">
                      <i className="fas fa-dollar-sign"></i>
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>

                <p className="job-description">
                  {job.description.length > 200 
                    ? `${job.description.substring(0, 200)}...` 
                    : job.description
                  }
                </p>

                <div className="job-actions">
                  <Link to={`/job/${job.id}`} className="btn btn-secondary">
                    <i className="fas fa-eye"></i>
                    View Details
                  </Link>
                  <Link to={`/job/${job.id}/applications`} className="btn btn-primary">
                    <i className="fas fa-users"></i>
                    View Applications ({job.application_count})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .my-jobs-container {
          padding: 40px 0;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        
        .page-header h1 {
          color: white;
          font-size: 36px;
          font-weight: 700;
          margin: 0;
        }
        
        .jobs-grid {
          display: grid;
          gap: 24px;
        }
        
        .job-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        
        .job-actions .btn {
          flex: 1;
          text-align: center;
        }
        
        @media (min-width: 768px) {
          .jobs-grid {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default MyJobs;


