import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({
  email,
  password,
  name,
  role,
  departmentId,
  error,
  setEmail,
  setPassword,
  setName,
  setRole,
  setDepartmentId,
  handleSubmit,
}) {
  return (
    <main id="registration-page">
      <div className="login-container">
        <div className="login-form">
          <div className="login-form-header">
            <h2>Register a User</h2>
            <p className="subtext">
              Fill in the details to create a new account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className={`form-field ${error ? "error-field" : ""}`}>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className={`form-field ${error ? "error-field" : ""}`}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email"
                />
              </div>
              <div className={`form-field ${error ? "error-field" : ""}`}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>
              <div className={`form-field`}>
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={`form-field`}>
                <label>Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(parseInt(e.target.value))}
                  required
                >
                  <option value={7}>ADMIN</option>
                  <option value={8}>CCIS</option>
                </select>
              </div>
            </div>
            <button className="submit-btn" type="submit">
              Register
            </button>
            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>
      </div>
      <div className="login-image" />
    </main>
  );
}

export default function RegisterContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("staff");
  const [departmentId, setDepartmentId] = useState(8);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          role,
          departmentId,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      const data = await response.json();
      console.log("User registered:", data);
      navigate("/");
    } catch (err) {
      console.error("Error registering:", err);
      setError(err.message);
    }
  };

  return (
    <Register
      email={email}
      password={password}
      name={name}
      role={role}
      departmentId={departmentId}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      setName={setName}
      setRole={setRole}
      setDepartmentId={setDepartmentId}
      handleSubmit={handleSubmit}
    />
  );
}
