import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaBars, FaFileMedical, FaHome, FaUsersCog } from "react-icons/fa";
import { IoFileTrayFullSharp } from "react-icons/io5";
import { MdRoomPreferences } from "react-icons/md";
import { PiSignOutBold, PiUserCircleFill } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";

const NavItem = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <li className="nav-item" title={collapsed ? label : ""}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `nav-link ${isActive ? "active-link" : ""}`
        }
      >
        {Icon && <Icon size="1.2rem" />}
        {!collapsed && <span className="label-text">{label}</span>}
      </NavLink>
    </li>
  );
};

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // Call on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);

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
    <>
      <nav className={collapsed ? "collapsed" : ""}>
        <ul className="nav-container">
          <div className="nav-main-items">
            <div
              className={`toggle-wrapper ${
                collapsed ? "collapsed" : "expanded"
              }`}
            >
              {!collapsed && <span className="menu-label">MENU</span>}
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
              </button>
            </div>

            <NavItem to="/" icon={FaHome} label="Home" collapsed={collapsed} />
            <li
              className={`list-sub-heading ${
                collapsed ? "centered-heading" : ""
              }`}
            >
              BOOKINGS
            </li>
            <ul className="sub-list">
              <NavItem
                to="/new-booking"
                icon={FaFileMedical}
                label="New Request"
                collapsed={collapsed}
              />
              <NavItem
                to="/bookings"
                icon={IoFileTrayFullSharp}
                label="Requests"
                collapsed={collapsed}
              />
            </ul>

            {role === "admin" && (
              <>
                <li
                  className={`list-sub-heading ${
                    collapsed ? "centered-heading" : ""
                  }`}
                >
                  MANAGE
                </li>
                <ul className="sub-list">
                  <NavItem
                    to="/users"
                    icon={FaUsersCog}
                    label="Users"
                    collapsed={collapsed}
                  />
                  <NavItem
                    to="/facilities"
                    icon={MdRoomPreferences}
                    label="Facilities"
                    collapsed={collapsed}
                  />
                </ul>
              </>
            )}
          </div>
          <div>
            <li className="nav-profile-item">
              <NavLink to="/">
                <PiUserCircleFill size="2rem" />
                {!collapsed && <span>{email}</span>}
              </NavLink>
              <button className="sign-out-btn" onClick={handleSignOut}>
                <PiSignOutBold size="1rem" />
              </button>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
}
