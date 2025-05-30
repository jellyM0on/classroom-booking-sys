import { FaHome, FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Navigation() {
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
        <li>
          <NavLink
            to="test/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <FaUserPlus />
            Register Users
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
