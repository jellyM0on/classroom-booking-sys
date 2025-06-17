import { useEffect, useState } from "react";
import { FaBuilding, FaUser, FaUserTag } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";

function UserDetail({
  user,
  loading,
  error,
  editMode,
  formData,
  departments,
  fieldErrors,
  handleChange,
  handleSubmit,
  handleToggleEdit,
}) {
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <main class="page">
      <NavLink to="/users" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Back to Manage Users
      </NavLink>

      <div className="page-title">
        <h2>
          User Detail <span>ID: {user.id}</span>
        </h2>
        <p>Manage user details here.</p>
      </div>

      {loading && <p>Loading...</p>}

      <form
        onSubmit={editMode ? handleSubmit : undefined}
        id="user-detail-form"
      >
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
            {editMode ? (
              <>
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
              </>
            ) : (
              <div className="readonly-field">{user.name}</div>
            )}
          </div>

          <div className="form-field user-form-field">
            <label>
              <span className="th-icon-label">
                <MdOutlineAlternateEmail /> Email
              </span>
            </label>
            <div className="readonly-field">{user.email}</div>
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
            {editMode ? (
              <>
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
              </>
            ) : (
              <div className="readonly-field">{user.role}</div>
            )}
          </div>

          <div
            className={`form-field user-form-field ${
              fieldErrors.department ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <FaBuilding /> Department
              </span>
            </label>
            {editMode ? (
              <>
                <select
                  name="department"
                  value={formData.department}
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
                {fieldErrors.department && (
                  <p className="error-msg">{fieldErrors.department}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">
                {user.department?.name || "—"}
              </div>
            )}
          </div>

          <div className="form-field user-form-field">
            <label>Created At</label>
            <div className="readonly-field">{user.createdAt}</div>
          </div>

          <div className="form-field user-form-field">
            <label>Updated At</label>
            <div className="readonly-field">{user.updatedAt}</div>
          </div>
        </div>

        {editMode ? (
          <>
            <button className="submit-btn" type="submit">
              Save Changes
            </button>
            <button
              className="transparent-btn"
              type="button"
              onClick={handleToggleEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="submit-btn"
            type="button"
            onClick={handleToggleEdit}
          >
            Edit User
          </button>
        )}
      </form>
    </main>
  );
}

export default function UserDetailContainer() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/users/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("User not found");

      const payload = await res.json();
      setUser(payload);

      const initial = {
        name: payload.name,
        role: payload.role,
        department: payload.department?.id || "",
      };

      setFormData(initial);
      setInitialData(initial);
    } catch (err) {
      setError(err.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/departments/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch departments");

      const payload = await res.json();
      setDepartments(payload.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleEdit = () => {
    if (editMode && initialData) {
      setFormData(initialData);
    }
    setFieldErrors({});
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    const payload = {
      name: formData.name,
      role: formData.role,
      department: formData.department,
    };

    try {
      const res = await fetch(`http://localhost:3000/api/users/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
          setError(data?.message || "Update failed");
        }
        return;
      }

      setUser(data);
      setEditMode(false);
      setFieldErrors({});
      setInitialData({
        name: data.name,
        role: data.role,
        department: data.department?.id || "",
      });
    } catch (err) {
      setError(err.message || "Update error");
    }
  };

  return (
    <UserDetail
      user={user}
      loading={loading}
      error={error}
      editMode={editMode}
      formData={formData}
      departments={departments}
      fieldErrors={fieldErrors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleToggleEdit={handleToggleEdit}
    />
  );
}
