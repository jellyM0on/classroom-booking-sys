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
import GenericChip from "../components/GenericChip";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import formatDate from "../utils/formatDate";

// added filter/sort to accept props
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
  departments,
  selectedRole,
  setSelectedRole,
  selectedDept,
  setSelectedDept,
  sortOrder,
  setSortOrder,
  searchText,
  setSearchText
}) {

  return (
    <main className="page">
      <div className="page-title">
        <div className="flex-gap-1">
          <h2> Manage Users</h2>
          <GenericChip label={total} />
        </div>

        <p>Manage admin and staff users here.</p>
      </div>

      <div className="table-opts">
        <div className="search-field">
          <FaSearch color="rgb(107, 106, 106)" />
          <input 
            type="text" 
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} 
          />
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
        <div className="flex-gap-1">
          <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <select onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
              {d.code}
            </option>
            ))}
          </select>

          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="ASC">Sort ASC</option>
            <option value="DESC">Sort DESC</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}

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
                  <td>
                    <GenericChip label={user.role} />
                  </td>
                  <td>
                    {" "}
                    <GenericChip label={user.department.code} />{" "}
                    <GenericChip label={user.department.name} />
                  </td>
                  <td> {formatDate(new Date(user.createdAt))}</td>
                  <td> {formatDate(new Date(user.updatedAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && (
        <p style={{ textAlign: "center", fontWeight: "bold", marginTop: "1rem" }}>
          No users found.
        </p>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        handlePageChange={handlePageChange}
      />
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
  const pageSize = 10;
  const navigate = useNavigate();

  // Add filter and sort + search
  const [departments, setDepartments] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");

    // Include query params
    const queryParams = new URLSearchParams({
      page: pageNumber,
      limit: pageSize,
      sortBy: "name",
      order: sortOrder,
    });

    // Only add filters if they are not empty
    if (selectedRole) queryParams.append("role", selectedRole);
    if (selectedDept) queryParams.append("departmentId", selectedDept);
    if (searchText) queryParams.append("name", searchText);

    try {
      setUsers([]); // clear the table before loading new data
      setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/users/admin?${queryParams.toString()}`, // to make table updated w filter/sort search
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

  const fetchDepartments = async () => {
  const token = sessionStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/departments/admin", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setDepartments(data.data || []);
};

  // Fetch depts on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 💡 Run fetchUsers when filters/search/sort change
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(1); // force reload from page 1
    }, 300);
    return () => clearTimeout(delay);
  }, [selectedRole, selectedDept, sortOrder, searchText]);

  // When user manually changes pages (pagination)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    } else {
      fetchUsers(page);
    }
  }, [page, totalPages]);


  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchUsers(newPage);
  };

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    // ensure props are passed correctly - filter/sort and search additions
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
      departments={departments}
      selectedRole={selectedRole}
      setSelectedRole={setSelectedRole}
      selectedDept={selectedDept}
      setSelectedDept={setSelectedDept}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      searchText={searchText}
      setSearchText={setSearchText}
    />
  );
}
