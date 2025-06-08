import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserManagement({ loading, error, users, handleRowClick }) {
  return (
    <main id="user-management-page">
      <h2>Manage Users</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && users && users.length > 0 && (
        <table cellPadding="8" cellSpacing="0" id="user-management-tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department?.code || "—"}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && users && users.length === 0 && (
        <p>No users found.</p>
      )}
    </main>
  );
}

export default function UserManagementContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/users/admin/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload = await response.json();
        setUsers(payload.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserManagement
      users={users}
      loading={loading}
      error={error}
      handleRowClick={handleRowClick}
    />
  );
}
