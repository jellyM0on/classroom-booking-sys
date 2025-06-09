import { useEffect, useState } from "react";
import { FaBuilding, FaUser, FaUserTag } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

function UserRegistration({
  formData,
  fieldErrors,
  departments,
  loading,
  submitError,
  submitSuccess,
  handleChange,
  handleSubmit,
}) {
  return (
    <main class="page">
      <NavLink to="/users" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Back to Manage Users
      </NavLink>

      <div className="page-title">
        <h2>User Registration</h2>
        <p>Register a new user in the system.</p>
      </div>

      <form onSubmit={handleSubmit} id="user-detail-form">
        <div className="form-fields">
          <div
            className={`form-field user-form-field ${
              fieldErrors.name ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <FaUser /> Name
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && (
              <p className="error-msg">{fieldErrors.name}</p>
            )}
          </div>

          <div
            className={`form-field user-form-field ${
              fieldErrors.email ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <MdOutlineAlternateEmail /> Email
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <p className="error-msg">{fieldErrors.email}</p>
            )}
          </div>

          <div
            className={`form-field user-form-field ${
              fieldErrors.password ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <RiLockPasswordLine /> Temporary Password
              </span>
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <p className="error-msg">{fieldErrors.password}</p>
            )}
          </div>

          <div
            className={`form-field user-form-field ${
              fieldErrors.role ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <FaUserTag /> Role
              </span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            {fieldErrors.role && (
              <p className="error-msg">{fieldErrors.role}</p>
            )}
          </div>

          <div
            className={`form-field user-form-field ${
              fieldErrors.departmentId ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <FaBuilding /> Department
              </span>
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
            {fieldErrors.departmentId && (
              <p className="error-msg">{fieldErrors.departmentId}</p>
            )}
          </div>
        </div>

        {submitError && <p className="error-msg">{submitError}</p>}
        {submitSuccess && (
          <p className="success-msg">User registered successfully!</p>
        )}

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>
    </main>
  );
}

export default function UserRegistrationContainer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3000/api/departments/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch departments");

        const payload = await res.json();
        setDepartments(payload.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitSuccess(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const formatted = {};
          for (const err of data.errors) {
            formatted[err.path] = err.message;
          }
          setFieldErrors(formatted);
        } else {
          setSubmitError(data?.message || "Registration failed");
        }
        return;
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        departmentId: "",
      });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || "Submission error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserRegistration
      formData={formData}
      fieldErrors={fieldErrors}
      departments={departments}
      loading={loading}
      submitError={submitError}
      submitSuccess={submitSuccess}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
