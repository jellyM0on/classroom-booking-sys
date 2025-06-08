import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserDetail({ user, loading, error }) {
  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <main id="user-detail-page">
      <h2>User Detail</h2>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Department:</strong> {user.department?.name || "—"}
      </p>
      <p>
        <strong>Created At:</strong> {user.createdAt}
      </p>
      <p>
        <strong>Updated At:</strong> {user.updatedAt}
      </p>
    </main>
  );
}

export default function UserDetailContainer() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      } catch (err) {
        setError(err.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return <UserDetail user={user} loading={loading} error={error} />;
}
