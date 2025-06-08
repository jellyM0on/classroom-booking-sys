import { useEffect, useState } from "react";
import { FaBuilding, FaUser, FaUserTag } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useParams } from "react-router-dom";

import { NavLink } from "react-router-dom";

function UserDetail({
  user,
  loading,
  error,
  editMode,
  formData,
  handleChange,
  handleSubmit,
  handleToggleEdit,
}) {
  // TODO: update error UI
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <main id="user-detail-page">
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
        handleSubmit={editMode ? handleSubmit : undefined}
        id="user-detail-form"
      >
        <div className="form-fields">
          <div className="form-field user-form-field">
            <label>
              <span className="th-icon-label">
                <FaUser /> Name
              </span>
            </label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                handleChange={handleChange}
                required
              />
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

          <div className="form-field user-form-field">
            <label>
              <span className="th-icon-label">
                <FaUserTag /> Role
              </span>
            </label>
            {editMode ? (
              <select
                name="role"
                value={formData.role}
                handleChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            ) : (
              <div className="readonly-field">{user.role}</div>
            )}
          </div>

          <div className="form-field user-form-field">
            <label>
              <span className="th-icon-label">
                <FaBuilding /> Department
              </span>
            </label>
            {editMode ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                handleChange={handleChange}
                required
              />
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
      setFormData({
        name: payload.name,
        role: payload.role,
        department: payload.department?.name || "",
      });
    } catch (err) {
      setError(err.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleEdit = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/users/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
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
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleToggleEdit={handleToggleEdit}
    />
  );
}
