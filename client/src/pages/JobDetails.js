import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/');
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container">
        <div className="empty-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Job not found</h3>
          <p>The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="job-details-container">
        <div className="card">
          <div className="job-header">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h1 className="job-title">{job.title}</h1>
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
                <span>Posted on {formatDate(job.created_at)}</span>
              </div>
              {job.salary_range && (
                <div className="job-meta-item">
                  <i className="fas fa-dollar-sign"></i>
                  <span>{job.salary_range}</span>
                </div>
              )}
              <div className="job-meta-item">
                <i className="fas fa-user"></i>
                <span>Posted by JOBIFY</span>
              </div>
            </div>
          </div>

          <div className="job-content">
            <div className="job-section">
              <h3>Job Description</h3>
              <div className="job-description">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="job-section">
              <h3>Requirements</h3>
              <div className="job-requirements">
                {job.requirements.split('\n').map((requirement, index) => (
                  <p key={index}>{requirement}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="job-actions">
            <Link to={`/job/${id}/apply`} className="btn btn-primary">
              <i className="fas fa-paper-plane"></i>
              Apply for this Job
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-details-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 0;
        }
        
        .job-header {
          border-bottom: 2px solid #f8f9fa;
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        
        .job-content {
          margin-bottom: 32px;
        }
        
        .job-section {
          margin-bottom: 32px;
        }
        
        .job-section h3 {
          color: #333;
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 600;
        }
        
        .job-description,
        .job-requirements {
          line-height: 1.7;
          color: #555;
        }
        
        .job-description p,
        .job-requirements p {
          margin-bottom: 12px;
        }
        
        .job-actions {
          text-align: center;
          padding-top: 24px;
          border-top: 2px solid #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default JobDetails;


