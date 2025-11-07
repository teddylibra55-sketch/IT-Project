import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
    past_jobs: '',
    experience: '',
    goals: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate resume is uploaded
    if (!resumeFile) {
      toast.error('Please upload your resume. Resume is required.');
      return;
    }

    setApplicationLoading(true);

    try {
      const formData = new FormData();
      formData.append('applicant_name', applicationData.applicant_name);
      formData.append('applicant_email', applicationData.applicant_email);
      formData.append('applicant_phone', applicationData.applicant_phone);
      formData.append('cover_letter', applicationData.cover_letter);
      formData.append('past_jobs', applicationData.past_jobs);
      formData.append('experience', applicationData.experience);
      formData.append('goals', applicationData.goals);
      formData.append('resume', resumeFile);

      await axios.post(`/api/jobs/${id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Application submitted successfully!');
      navigate(`/job/${id}`);
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
      <div className="apply-job-container">
        {/* Job Summary Section */}
        <div className="card job-summary-card">
          <div className="job-summary-header">
            <Link to={`/job/${id}`} className="back-link">
              <i className="fas fa-arrow-left"></i> Back to Job Details
            </Link>
            <h1>Apply for Position</h1>
            <div className="job-summary-info">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-company">{job.company}</p>
              <div className="job-meta-summary">
                <span className={`job-type-badge ${getJobTypeClass(job.job_type)}`}>
                  {job.job_type}
                </span>
                <span className="job-location">
                  <i className="fas fa-map-marker-alt"></i> {job.location}
                </span>
                {job.salary_range && (
                  <span className="job-salary">
                    <i className="fas fa-dollar-sign"></i> {job.salary_range}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="job-details-section">
            <div className="detail-section">
              <h3><i className="fas fa-file-alt"></i> Job Description</h3>
              <div className="detail-content">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3><i className="fas fa-check-circle"></i> Requirements</h3>
              <div className="detail-content">
                {job.requirements.split('\n').map((requirement, index) => (
                  <p key={index}>{requirement}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Section */}
        <div className="card application-form-card">
          <h2 className="form-title">
            <i className="fas fa-paper-plane"></i> Application Form
          </h2>
          <p className="form-subtitle">Please fill out the form below to apply for this position</p>

          <form onSubmit={handleApplicationSubmit} className="application-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={applicationData.applicant_name}
                  onChange={handleApplicationChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
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
                placeholder="+1 (555) 123-4567"
                value={applicationData.applicant_phone}
                onChange={handleApplicationChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Resume <span className="required">*</span>
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  className="file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="resume" className="file-label">
                  <i className="fas fa-upload"></i>
                  {resumeFile ? resumeFile.name : 'Choose File (PDF, DOC, DOCX)'}
                </label>
                {resumeFile && (
                  <span className="file-name">
                    <i className="fas fa-check-circle"></i> {resumeFile.name}
                  </span>
                )}
              </div>
              <small className="form-help-text">Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX. Resume is required.</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Cover Letter <span className="required">*</span>
              </label>
              <textarea
                name="cover_letter"
                className="form-control"
                rows="8"
                placeholder="Tell us why you're interested in this position, what makes you a great fit, and how your skills and experience align with our requirements. Be specific and highlight relevant achievements..."
                value={applicationData.cover_letter}
                onChange={handleApplicationChange}
                required
                minLength="50"
              />
              <small className="form-help-text">Minimum 50 characters. This is your opportunity to stand out!</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Past Jobs / Work History <span className="required">*</span>
              </label>
              <textarea
                name="past_jobs"
                className="form-control"
                rows="6"
                placeholder="List your previous positions, companies, and roles. Include job titles, company names, employment dates, and key responsibilities..."
                value={applicationData.past_jobs}
                onChange={handleApplicationChange}
                required
              />
              <small className="form-help-text">Please provide details about your work history and previous positions.</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Professional Experience <span className="required">*</span>
              </label>
              <textarea
                name="experience"
                className="form-control"
                rows="6"
                placeholder="Describe your professional experience, skills, and expertise. Highlight relevant technical skills, certifications, projects, and achievements that make you suitable for this position..."
                value={applicationData.experience}
                onChange={handleApplicationChange}
                required
              />
              <small className="form-help-text">Share your professional background, skills, and relevant experience.</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Career Goals & Objectives <span className="required">*</span>
              </label>
              <textarea
                name="goals"
                className="form-control"
                rows="5"
                placeholder="What are your career goals? How does this position align with your professional objectives? What do you hope to achieve in this role?"
                value={applicationData.goals}
                onChange={handleApplicationChange}
                required
              />
              <small className="form-help-text">Tell us about your career aspirations and how this role fits into your professional journey.</small>
            </div>

            <div className="form-actions">
              <Link to={`/job/${id}`} className="btn btn-secondary">
                <i className="fas fa-times"></i> Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-success"
                disabled={applicationLoading}
              >
                {applicationLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .apply-job-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 0;
        }

        .job-summary-card {
          margin-bottom: 30px;
        }

        .job-summary-header {
          border-bottom: 2px solid #f8f9fa;
          padding-bottom: 24px;
          margin-bottom: 32px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 20px;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: #5568d3;
        }

        .job-summary-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
        }

        .job-summary-info {
          margin-top: 20px;
        }

        .job-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .job-company {
          font-size: 20px;
          color: #667eea;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .job-meta-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }

        .job-location,
        .job-salary {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6c757d;
          font-size: 14px;
        }

        .job-details-section {
          margin-top: 32px;
        }

        .detail-section {
          margin-bottom: 32px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-section h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 600;
        }

        .detail-section h3 i {
          color: #667eea;
        }

        .detail-content {
          line-height: 1.8;
          color: #555;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .detail-content p {
          margin-bottom: 12px;
        }

        .detail-content p:last-child {
          margin-bottom: 0;
        }

        .application-form-card {
          background: white;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-title i {
          color: #667eea;
        }

        .form-subtitle {
          color: #6c757d;
          margin-bottom: 32px;
          font-size: 16px;
        }

        .application-form {
          margin-top: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 15px;
        }

        .required {
          color: #dc3545;
        }

        .optional {
          color: #6c757d;
          font-weight: 400;
          font-size: 13px;
        }

        .form-help-text {
          display: block;
          margin-top: 6px;
          color: #6c757d;
          font-size: 13px;
        }

        .file-upload-wrapper {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .file-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: 2px dashed #e1e5e9;
          border-radius: 8px;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #667eea;
          font-weight: 500;
        }

        .file-label:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .file-name {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #28a745;
          font-size: 14px;
          font-weight: 500;
        }

        .file-name i {
          color: #28a745;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 180px;
          line-height: 1.6;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 2px solid #f8f9fa;
        }

        .btn {
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

        .btn-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
        }

        .btn-success:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .job-meta-summary {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplyJob;

