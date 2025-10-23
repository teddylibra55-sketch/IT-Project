import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <i className="fas fa-code"></i>
            IT Jobs
          </Link>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            
            {user ? (
              <>
                <Link to="/post-job" className="nav-link">Post Job</Link>
                <Link to="/my-jobs" className="nav-link">My Jobs</Link>
                <div className="nav-dropdown">
                  <span className="nav-link dropdown-toggle">
                    <i className="fas fa-user"></i>
                    {user.name}
                  </span>
                  <div className="dropdown-menu">
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
          
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 80px;
        }
        
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
        }
        
        .nav-brand {
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .nav-brand i {
          font-size: 28px;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        
        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .nav-dropdown {
          position: relative;
        }
        
        .dropdown-toggle {
          cursor: pointer;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 150px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }
        
        .nav-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
        
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          color: #333;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .nav-menu {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .nav-menu.active {
            transform: translateX(0);
          }
          
          .nav-toggle {
            display: block;
          }
          
          .nav-dropdown .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            background: rgba(102, 126, 234, 0.05);
            margin-top: 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;


