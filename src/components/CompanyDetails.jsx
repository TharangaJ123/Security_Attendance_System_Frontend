import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/CompanyDetails.css";

const CompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyName: "",
    contactNumber: "",
    companyAddress: ""
  });
  const navigate = useNavigate();

  // Fetch all companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    fetch("https://frdattendancemanagementsystemtestdiployment-production.up.railway.app/api/securityCompany/all")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched companies:", data);
        setCompanies(data);
      })
      .catch(error => {
        console.error("Error fetching companies:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://frdattendancemanagementsystemtestdiployment-production.up.railway.app/api/securityCompany/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: formData.companyName.trim(),
        contactNumber: formData.contactNumber.trim(),
        companyAddress: formData.companyAddress.trim()
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
      toast.success("Company added successfully!");
      fetchCompanies(); // Refresh the list
      setFormData({ companyName: "", contactNumber: "", companyAddress: "" }); // Reset form
    })
    .catch(error => {
      toast.error("Failed to add company");
      console.error("Error:", error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="company-details-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Companies Table */}
      <table className="companies-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Number</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.companyId}>
              <td>{company.companyName}</td>
              <td>{company.contactNumber}</td>
              <td>{company.companyAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Company Form */}
      <div className="add-company-section">
        <h2>Register New Company</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
          <textarea
            name="companyAddress"
            placeholder="Company Address"
            value={formData.companyAddress}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Company</button>
        </form>
      </div>
    </div>
  );
};

export default CompanyDetails;