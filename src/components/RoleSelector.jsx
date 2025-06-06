import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../src/styles/StartUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/systemUser/getAll");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load roles. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedRole && selectedRoleId) {
      navigate(`/login/${selectedRole}/${selectedRoleId}`);
    } else {
      toast.error("Please select a role.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="background-wrapper">
      <ToastContainer />
      <div className="role-selector-container">
        <div className="card-header">
          <h1 className="form-title">
            Security Officers Attendance Management System
          </h1>
          <p className="form-subtitle">Select your role to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="role-selector-form">
          <div className="form-group">
            <div className="select-wrapper">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => {
                    const role = e.target.value;
                    setSelectedRole(role);
                    const selectedUser = users.find((user) => user.userRole === role);
                    setSelectedRoleId(selectedUser?.empId || "");
                  }}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option value="">Select your role</option>
                  {users.map((user) => (
                    <option key={user.empId} value={user.userRole}>
                      {user.userRole}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="form-button"
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelector;