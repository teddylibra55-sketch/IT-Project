import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: ''
  });

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

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);

    try {
      const formData = new FormData();
      formData.append('applicant_name', applicationData.applicant_name);
      formData.append('applicant_email', applicationData.applicant_email);
      formData.append('applicant_phone', applicationData.applicant_phone);
      formData.append('cover_letter', applicationData.cover_letter);

      const resumeFile = e.target.resume.files[0];
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await axios.post(`/api/jobs/${id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplicationLoading(false);
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
                <span>Posted by {job.posted_by_name || 'Anonymous'}</span>
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
            <button
              className="btn btn-primary"
              onClick={() => setShowApplicationForm(!showApplicationForm)}
            >
              <i className="fas fa-paper-plane"></i>
              Apply for this Job
            </button>
          </div>
        </div>

        {showApplicationForm && (
          <div className="card application-form">
            <h3>Apply for this Position</h3>
            <form onSubmit={handleApplicationSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="applicant_name"
                    className="form-control"
                    placeholder="Your full name"
                    value={applicationData.applicant_name}
                    onChange={handleApplicationChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="applicant_email"
                    className="form-control"
                    placeholder="your.email@example.com"
                    value={applicationData.applicant_email}
                    onChange={handleApplicationChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="applicant_phone"
                  className="form-control"
                  placeholder="Your phone number"
                  value={applicationData.applicant_phone}
                  onChange={handleApplicationChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  name="resume"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter *</label>
                <textarea
                  name="cover_letter"
                  className="form-control"
                  rows="6"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  value={applicationData.cover_letter}
                  onChange={handleApplicationChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={applicationLoading}
                >
                  {applicationLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
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
        
        .application-form {
          margin-top: 24px;
          background: #f8f9fa;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 30px;
        }
        
        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default JobDetails;


