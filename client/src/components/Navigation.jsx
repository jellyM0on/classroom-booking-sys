import { FaFileMedical, FaHome, FaUsersCog } from "react-icons/fa";
import { IoFileTrayFullSharp } from "react-icons/io5";
import { MdRoomPreferences } from "react-icons/md";
import { PiSignOutBold, PiUserCircleFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        {Icon && <Icon size="1rem" />}
        {label}
      </NavLink>
    </li>
  );
};

export default function Navigation() {
  const role = sessionStorage.getItem("role");
  const rawEmail = sessionStorage.getItem("email") || "";
  const email = rawEmail.length > 10 ? rawEmail.slice(0, 10) + "..." : rawEmail;

  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      sessionStorage.clear();
      await signOut(auth);
      console.log("User signed out");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav>
      <ul className="nav-container">
        <div className="nav-main-items">
          <NavItem to="/" icon={FaHome} label="Home" />
          <li className="list-sub-heading">BOOKINGS</li>
          <ul className="sub-list">
            <NavItem to="/register" icon={FaFileMedical} label="New Request" />
            <NavItem
              to="/register"
              icon={IoFileTrayFullSharp}
              label="Requests"
            />
          </ul>
          {role === "admin" && (
            <>
              <li className="list-sub-heading">MANAGE</li>
              <ul className="sub-list">
                <NavItem
                  to="/users"
                  icon={FaUsersCog}
                  label="Users"
                />
                <NavItem
                  to="/register"
                  icon={MdRoomPreferences}
                  label="Rooms"
                />
              </ul>
            </>
          )}
        </div>
        <div>
          <li className="nav-profile-item">
            <NavLink to="/">
              <PiUserCircleFill size="2rem" />
              {email}
            </NavLink>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <PiSignOutBold size="1rem" />
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}
