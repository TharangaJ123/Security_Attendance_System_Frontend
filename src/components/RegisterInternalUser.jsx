import React, { useState, useEffect } from "react"; // Import useEffect
import axios from "axios"; // Import axios for making HTTP requests
import "../styles/InternalUserLogin.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterInternalUser = () => {
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [systemUser, setSystemUser] = useState(""); // Changed to string instead of array

  const sendData = async (e) => {
    e.preventDefault();
    
    try {
      const newInternalUser = {
        userId,
        name,
        contact,
        email,
        password,
        systemUser: { 
          empId: parseInt(systemUser),
          userRole: roles.find(r => r.empId === parseInt(systemUser))?.userRole || ""
        }
      };
  
      console.log("Sending data:", JSON.stringify(newInternalUser, null, 2));
  
      const response = await axios.post(
        "http://localhost:8080/api/internalUser/save", 
        newInternalUser,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Success:", response.data);
      toast.success("Internal user registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      console.log(`Error: ${error.response?.data?.message || error.message}`);
      toast.error("Internal user registration failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  function fetchRoles() {
    axios
      .get("http://localhost:8080/api/systemUser/getAll")
      .then((response) => {
        console.log("Fetched Roles:", response.data);
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="internal-login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h2 className="internal-form-header">Internal User Registration</h2>
      <form method="post" onSubmit={sendData} className="internal-login-form">
        <div className="internal-form-group">
          <label htmlFor="name" className="internal-label">
            Make a employee ID:
          </label>
          <input
            type="text"
            className="internal-input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="internal-form-group">
          <label htmlFor="contact" className="internal-label">
            Name:
          </label>
          <input
            type="tel"
            className="internal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="internal-form-group">
          <label htmlFor="contact" className="internal-label">
            Contact No:
          </label>
          <input
            type="tel"
            className="internal-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="internal-form-group">
          <label htmlFor="role" className="internal-label">
            Select Role:
          </label>
          <select
            className="form-select"
            value={systemUser}
            onChange={(e) => setSystemUser(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.empId} value={role.empId}>
                {role.userRole}
              </option>
            ))}
          </select>
        </div>

        <div className="internal-form-group">
          <label htmlFor="email" className="internal-label">
            Email:
          </label>
          <input
            type="email"
            className="internal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="internal-form-group">
          <label htmlFor="tempPassword" className="internal-label">
            Temporary Password:
          </label>
          <input
            type="password"
            className="internal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="internal-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterInternalUser;
