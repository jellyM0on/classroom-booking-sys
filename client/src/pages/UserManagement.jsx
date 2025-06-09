import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  FaBuilding,
  FaBuildingCircleExclamation,
  FaUser,
  FaUserTag,
} from "react-icons/fa6";
import { MdNumbers, MdOutlineAlternateEmail } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

function UserManagement({
  loading,
  error,
  users,
  handleRowClick,
  page,
  totalPages,
  pageSize,
  total,
  handlePageChange,
}) {
  return (
    <main id="user-management-page">
      <div className="page-title">
        <h2>
          Manage Users <span>{total}</span>
        </h2>
        <p>Manage admin and staff users here.</p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="table-opts">
        <div className="search-field">
          <FaSearch color="rgb(107, 106, 106)" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="flex-gap-1">
          <NavLink to="/users/departments" className="add-btn">
            <FaBuildingCircleExclamation />
            Edit Departments
          </NavLink>

          <NavLink to="/users/register" className="add-btn">
            <RiUserAddFill />
            Add user
          </NavLink>
        </div>
      </div>

      <div className="filter-opts">
        <p>FILTER</p>
        <div></div>
      </div>

      {!loading && !error && users && users.length > 0 && (
        <div id="user-management-tbl-wrapper">
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
                    <FaUser /> Name
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <MdOutlineAlternateEmail /> Email
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaUserTag /> Role
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaBuilding /> Department
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">Created At</span>
                </th>
                <th>
                  <span className="th-icon-label">Updated At</span>
                </th>
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
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        handlePageChange={handlePageChange}
      />

      {!loading && !error && users && users.length === 0 && (
        <p>No users found.</p>
      )}
    </main>
  );
}

export default function UserManagementContainer() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 2;
  const navigate = useNavigate();

  const fetchUsers = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/users/admin/?page=${pageNumber}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      setUsers(payload.data);
      setPage(payload.page);
      setTotalPages(payload.totalPages);
      setTotal(payload.total);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchUsers(newPage);
  };

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <UserManagement
      users={users}
      loading={loading}
      error={error}
      handleRowClick={handleRowClick}
      page={page}
      totalPages={totalPages}
      pageSize={pageSize}
      total={total}
      handlePageChange={handlePageChange}
    />
  );
}
