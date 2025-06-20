import { useEffect, useState } from "react";
import { FaBuilding, FaCode } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit, MdNumbers } from "react-icons/md";
import { NavLink } from "react-router-dom";
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import FloatingSuccessMessage from "../components/FloatingSuccessMessage";
import GenericChip from "../components/GenericChip";
import NoDataFound from "../components/NoDataFound";

function Departments({
  formData,
  departments,
  fieldErrors,
  loading,
  handleChange,
  handleSubmit,
  editingId,
  editFormData,
  handleEditClick,
  handleEditChange,
  handleEditSubmit,
  handleCancelEdit,
  editFieldErrors,
}) {
  return (
    <main className="page">
      <NavLink to="/users" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Go to Manage Users
      </NavLink>

      <div className="page-title">
        <div className="flex-gap-1">
          <h2> Manage Departments</h2>
          <GenericChip label={departments.length} />
        </div>

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

      <div className="page-title" style={{ marginTop: "3rem" }}>
        <h2>Departments List</h2>
      </div>

      {departments.length === 0 ? (
        <NoDataFound />
      ) : (
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
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>

                  <td>
                    {editingId === dept.id ? (
                      <>
                        <input
                          type="text"
                          name="code"
                          value={editFormData.code}
                          onChange={handleEditChange}
                          required
                          className={`tbl-form-field ${
                            editFieldErrors.code ? "tbl-form-error" : ""
                          }`}
                        />
                        {editFieldErrors.code && (
                          <p className="error-msg">{editFieldErrors.code}</p>
                        )}
                      </>
                    ) : (
                      <GenericChip label={dept.code} />
                    )}
                  </td>

                  <td>
                    {editingId === dept.id ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          required
                          className={`tbl-form-field ${
                            editFieldErrors.name ? "tbl-form-error" : ""
                          }`}
                        />
                        {editFieldErrors.name && (
                          <p className="error-msg">{editFieldErrors.name}</p>
                        )}
                      </>
                    ) : (
                      dept.name
                    )}
                  </td>

                  <td>
                    {editingId === dept.id ? (
                      <>
                        <button
                          className="submit-btn tbl-btn"
                          onClick={() => handleEditSubmit(dept.id)}
                          disabled={loading}
                        >
                          Save Changes
                        </button>
                        <button
                          className="transparent-btn tbl-btn"
                          onClick={handleCancelEdit}
                          type="button"
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="table-btn table-edit-btn"
                        onClick={() => handleEditClick(dept)}
                      >
                        <MdEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default function DepartmentsContainer() {
  const [formData, setFormData] = useState({ code: "", name: "" });
  const [departments, setDepartments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editFieldErrors, setEditFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ code: "", name: "" });

  const [error, setError] = useState({ message: "", timestamp: null });
  const [success, setSuccess] = useState({ message: "", timestamp: null });

  const fetchDepartments = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/departments/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }

      const payload = await res.json();
      setDepartments(payload.data || []);
    } catch (err) {
      setError({
        message: err.message || "Error loading departments",
        timestamp: Date.now(),
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (dept) => {
    setEditingId(dept.id);
    setEditFormData({ code: dept.code, name: dept.name });
    setEditFieldErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ code: "", name: "" });
    setEditFieldErrors({});
  };

  const handleEditSubmit = async (id) => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setEditFieldErrors({});
    setError({ message: "", timestamp: null });
    setSuccess({ message: "", timestamp: null });

    try {
      const res = await fetch(
        `http://localhost:3000/api/departments/admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const formatted = {};
          for (const err of data.errors) {
            formatted[err.path] = err.message;
          }
          setEditFieldErrors(formatted);
        }
        setError({
          message: data?.message || "Failed to update department",
          timestamp: Date.now(),
        });
        return;
      }

      setSuccess({
        message: "Department updated successfully",
        timestamp: Date.now(),
      });
      setEditingId(null);
      await fetchDepartments();
    } catch (err) {
      setError({
        message: err.message || "Update failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setError({ message: "", timestamp: null });
    setSuccess({ message: "", timestamp: null });

    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/departments/admin", {
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
        }
        setError({
          message: data?.message || "Failed to add department",
          timestamp: Date.now(),
        });
        return;
      }

      setSuccess({
        message: "Department added successfully",
        timestamp: Date.now(),
      });
      setFormData({ code: "", name: "" });
      await fetchDepartments();
    } catch (err) {
      setError({
        message: err.message || "Submission failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}
      {success.message && (
        <FloatingSuccessMessage
          key={success.timestamp}
          message={success.message}
        />
      )}

      <Departments
        formData={formData}
        departments={departments}
        fieldErrors={fieldErrors}
        loading={loading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
        editFormData={editFormData}
        handleEditClick={handleEditClick}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        handleCancelEdit={handleCancelEdit}
        editFieldErrors={editFieldErrors}
      />
    </>
  );
}
