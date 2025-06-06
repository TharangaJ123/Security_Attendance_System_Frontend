import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "../styles/Login.css";
import logo from "../assets/logo.png";

const SuperAdminLogin = () => {
  const { setUser } = useUser();
  const [credentials, setCredentials] = useState({
    userId: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { userId, password } = credentials;
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);
      
      const endpoint = isEmail 
        ? "http://localhost:8080/api/companyUser/login" 
        : "http://localhost:8080/api/internalUser/login";
      
      const response = await axios.post(endpoint, { userId, password });

      if (response.status === 200 && response.data === "login successful") {
        let role = isEmail ? "CompanyUser" : 
          (await axios.get(`http://localhost:8080/api/internalUser/getUser/${userId}`)).data.systemUser.userRole;
        
        toast.success(`Welcome ${role}`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          onClose: () => {
            setUser(userId, role);
            navigate(`/admin/${role}`);
          }
        });
      }
    } catch (error) {
      toast.error(
        error.response?.status === 401 
          ? "Invalid credentials" 
          : "Authentication error",
        { 
          position: "top-right",
          className: "error-toast",
          progressStyle: { background: "#ff4d4f" }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Animated background elements */}
      <div className="tech-grid"></div>
      <div className="particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`
          }}></div>
        ))}
      </div>
      
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-header">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={logo} alt="SITMOBITEL" className="logo" />
          </motion.div>
          <h2>Welcome !</h2>
          <p>Security staff attendance marking system</p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div 
            className="input-container"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(62, 152, 255, 0.5)" }}
          >
            <input
              type="text"
              name="userId"
              value={credentials.userId}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label>User ID / Email</label>
            <span className="input-icon">👤</span>
          </motion.div>

          <motion.div 
            className="input-container"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(62, 152, 255, 0.5)" }}
          >
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <label>Password</label>
            <span className="input-icon">🔒</span>
          </motion.div>

          <motion.button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <>
                <span>Login</span>
                <span className="arrow">→</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="footer">
          <Link to="/forgot-password" className="forgot-link">Forgot credentials?</Link>
          <div className="version">v2.4.1</div>
        </div>
      </motion.div>

      <ToastContainer 
        position="top-right"
        toastClassName="modern-toast"
        progressClassName="toast-progress"
      />
    </div>
  );
};

export default SuperAdminLogin;