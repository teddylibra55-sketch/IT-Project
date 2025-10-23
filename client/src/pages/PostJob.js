import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'remote',
    description: '',
    requirements: '',
    salary_range: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/jobs', formData);
      toast.success('Job posted successfully!');
      navigate('/my-jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="text-center">
          <h2>Please log in to post a job</h2>
          <p>You need to be logged in to post job listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="post-job-container">
        <div className="card">
          <div className="text-center mb-4">
            <h1>Post a New Job</h1>
            <p className="text-muted">Share your job opportunity with talented IT professionals</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g., Senior React Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="e.g., Tech Corp Inc."
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select
                  name="job_type"
                  className="form-control"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range (Optional)</label>
              <input
                type="text"
                name="salary_range"
                className="form-control"
                placeholder="e.g., $80,000 - $120,000"
                value={formData.salary_range}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows="6"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements *</label>
              <textarea
                name="requirements"
                className="form-control"
                rows="6"
                placeholder="List the required skills, experience, and qualifications..."
                value={formData.requirements}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Posting Job...
                  </>
                ) : (
                  'Post Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .post-job-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 0;
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

export default PostJob;


