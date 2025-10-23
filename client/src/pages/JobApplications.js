import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const JobApplications = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchJob();
  }, [id]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}/applications`);
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(`/api/applications/${applicationId}`, { status });
      toast.success('Application status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>Please log in to view applications</h2>
          <p>You need to be logged in to manage job applications.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="applications-container">
        <div className="page-header">
          <div>
            <h1>Job Applications</h1>
            {job && (
              <p className="job-title-text">
                <Link to={`/job/${job.id}`} className="job-link">
                  {job.title} at {job.company}
                </Link>
              </p>
            )}
          </div>
          <Link to="/my-jobs" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>
            Back to My Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No applications yet</h3>
            <p>Applications for this job will appear here when candidates apply.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map(application => (
              <div key={application.id} className="card application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h3>{application.applicant_name}</h3>
                    <p className="applicant-email">{application.applicant_email}</p>
                    {application.applicant_phone && (
                      <p className="applicant-phone">{application.applicant_phone}</p>
                    )}
                  </div>
                  <div className="application-meta">
                    <span className={`status-badge ${getStatusClass(application.status)}`}>
                      {application.status}
                    </span>
                    <span className="application-date">
                      Applied on {formatDate(application.applied_at)}
                    </span>
                  </div>
                </div>

                <div className="application-content">
                  <h4>Cover Letter</h4>
                  <div className="cover-letter">
                    {application.cover_letter.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {application.resume_filename && (
                    <div className="resume-section">
                      <h4>Resume</h4>
                      <a 
                        href={`/uploads/${application.resume_filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        <i className="fas fa-download"></i>
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>

                <div className="application-actions">
                  <div className="status-actions">
                    <button
                      className={`btn btn-sm ${application.status === 'reviewed' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      className={`btn btn-sm ${application.status === 'accepted' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => updateApplicationStatus(application.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className={`btn btn-sm ${application.status === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .applications-container {
          padding: 40px 0;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        
        .page-header h1 {
          color: white;
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        
        .job-title-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          margin: 0;
        }
        
        .job-link {
          color: white;
          text-decoration: none;
        }
        
        .job-link:hover {
          text-decoration: underline;
        }
        
        .applications-grid {
          display: grid;
          gap: 24px;
        }
        
        .application-card {
          border-left: 4px solid #667eea;
        }
        
        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .applicant-info h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 20px;
        }
        
        .applicant-email,
        .applicant-phone {
          margin: 4px 0;
          color: #6c757d;
          font-size: 14px;
        }
        
        .application-meta {
          text-align: right;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .status-reviewed {
          background: #cce5ff;
          color: #004085;
        }
        
        .status-accepted {
          background: #d4edda;
          color: #155724;
        }
        
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
        
        .application-date {
          display: block;
          color: #6c757d;
          font-size: 12px;
        }
        
        .application-content {
          margin-bottom: 20px;
        }
        
        .application-content h4 {
          color: #333;
          margin-bottom: 12px;
          font-size: 16px;
        }
        
        .cover-letter {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .cover-letter p {
          margin-bottom: 8px;
        }
        
        .resume-section {
          margin-top: 16px;
        }
        
        .application-actions {
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }
        
        .status-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }
        
        .btn-outline-primary {
          background: transparent;
          border: 1px solid #667eea;
          color: #667eea;
        }
        
        .btn-outline-primary:hover {
          background: #667eea;
          color: white;
        }
        
        .btn-outline-success {
          background: transparent;
          border: 1px solid #28a745;
          color: #28a745;
        }
        
        .btn-outline-success:hover {
          background: #28a745;
          color: white;
        }
        
        .btn-outline-danger {
          background: transparent;
          border: 1px solid #dc3545;
          color: #dc3545;
        }
        
        .btn-outline-danger:hover {
          background: #dc3545;
          color: white;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }
          
          .application-header {
            flex-direction: column;
            gap: 16px;
          }
          
          .application-meta {
            text-align: left;
          }
          
          .status-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JobApplications;


