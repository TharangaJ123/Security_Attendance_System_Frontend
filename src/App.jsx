import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import RoleSelector from "./components/RoleSelector";
import SuperAdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  return (

    <UserProvider>
      <Router>
        <Routes>
            {/* Routes without Sidebar & Navbar */}
            {/*<Route path="/" element={<RoleSelector/>} />*/}
            <Route path="/" element={<SuperAdminLogin/>} />
            <Route path="/admin/:roleName" element={<AdminDashboard/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
          </Routes>
        </Router>
    </UserProvider>
    
  );
};

export default App;
