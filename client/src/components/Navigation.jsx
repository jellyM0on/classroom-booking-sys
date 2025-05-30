import { FaHome, FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  const role = sessionStorage.getItem("role");

  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <FaHome />
            Home
          </NavLink>
        </li>

        {role === "admin" && (
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUserPlus />
              Register Users
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
