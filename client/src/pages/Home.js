import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);

      const response = await axios.get(`/api/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
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

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Jobify: Where Your IT Career Dreams Come True</h1>
        <p>Transform your career aspirations into reality. Connect with top tech companies and discover opportunities that match your passion and expertise</p>
      </div>

      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label className="form-label">Search Jobs</label>
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Job title, company, or keywords..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label className="form-label">Job Type</label>
            <select
              name="type"
              className="form-control"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="City, state, or country..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria</p>
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

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Posted by JOBIFY
                </span>
                <Link to={`/job/${job.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .hero-section {
          text-align: center;
          padding: 60px 0;
          color: white;
        }
        
        .hero-section h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .hero-section p {
          font-size: 20px;
          opacity: 0.9;
        }
        
        .jobs-grid {
          display: grid;
          gap: 24px;
        }
        
        @media (min-width: 768px) {
          .jobs-grid {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Home;


