import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/job/:id/apply" element={<ApplyJob />} />
              <Route path="/my-jobs" element={<MyJobs />} />
              <Route path="/job/:id/applications" element={<JobApplications />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


