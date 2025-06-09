import { useEffect, useState } from "react";
import { FaBuilding, FaCode } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit, MdNumbers } from "react-icons/md";
import { NavLink } from "react-router-dom";

function Departments({
  formData,
  departments,
  fieldErrors,
  loading,
  handleChange,
  handleSubmit,
}) {
  return (
    <main className="page">
      <NavLink to="/users" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Back to Manage Users
      </NavLink>

      <div className="page-title">
        <h2>
          Departments <span>{departments.length}</span>
        </h2>
        <p>Manage departments here.</p>
      </div>

      <form onSubmit={handleSubmit} id="user-detail-form">
        <div className="form-fields">
          <div
            className={`form-field ${fieldErrors.code ? "error-field" : ""}`}
          >
            <label>
              <span className="th-icon-label">
                <FaCode /> Code
              </span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
            {fieldErrors.code && (
              <p className="error-msg">{fieldErrors.code}</p>
            )}
          </div>

          <div
            className={`form-field ${fieldErrors.name ? "error-field" : ""}`}
          >
            <label>
              <span className="th-icon-label">
                <FaBuilding /> Name
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
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Department"}
        </button>
      </form>

      <div id="user-management-tbl-wrapper" className="departments-table">
        <table cellPadding="8" cellSpacing="0" id="user-management-tbl">
          <thead>
            <tr>
              <th>
                <span className="th-icon-label">
                  <MdNumbers /> ID
                </span>
              </th>
              <th>
                <span className="th-icon-label">
                  <FaCode /> Code
                </span>
              </th>
              <th>
                <span className="th-icon-label">
                  <FaBuilding /> Name
                </span>
              </th>
              <th>
                <span className="th-icon-label">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="3">No departments found.</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.code}</td>
                  <td>{dept.name}</td>
                  <td>
                    <button className="table-btn table-edit-btn">
                      <MdEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default function DepartmentsContainer() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });

  const [departments, setDepartments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
  };

  return (
    <Departments
      formData={formData}
      departments={departments}
      fieldErrors={fieldErrors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
