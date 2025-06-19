import { useEffect, useState } from "react";
import { BsBuildingFillAdd } from "react-icons/bs";
import {
  FaBuilding,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import GenericChip from "../components/GenericChip";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import formatDate from "../utils/formatDate";

function FacilityManagement({
  loading,
  error,
  facilities,
  handleRowClick,
  page,
  totalPages,
  pageSize,
  total,
  handlePageChange,
}) {
  return (
    <main className="page">
      <div className="page-title">
        <div className="flex-gap-1">
          <h2> Manage Facilities</h2>
          <GenericChip label={total} />
        </div>

        <p>Manage facilities here.</p>
      </div>

      <div className="table-opts">
        <div className="search-field">
          <FaSearch color="rgb(107, 106, 106)" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="flex-gap-1">
          <NavLink to="/facilities/add" className="add-btn">
            <BsBuildingFillAdd />
            Add Facility
          </NavLink>
        </div>
      </div>

      <div className="filter-opts">
        <p>SORT</p>
        <div></div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && !error && facilities && facilities.length > 0 && (
        <div id="generic-table-wrapper">
          <table cellPadding="8" cellSpacing="0" id="generic-table">
            <thead>
              <tr>
                <th>
                  <span className="th-icon-label">
                    <MdNumbers /> ID
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaBuilding /> Code
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaBuilding /> Name
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaMapMarkerAlt /> Address
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaLayerGroup /> Total Floors
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
              {facilities.map((building) => (
                <tr
                  key={building.id}
                  onClick={() => handleRowClick(building.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{building.id}</td>
                  <td>
                    <GenericChip label={building.code} />
                  </td>
                  <td>{building.name}</td>
                  <td>{building.address}</td>
                  <td>{building.total_floors}</td>
                  <td>{formatDate(building.createdAt)}</td>
                  <td>{formatDate(building.updatedAt)}</td>
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

      {!loading && !error && facilities && facilities.length === 0 && (
        <p>No facilities found.</p>
      )}
    </main>
  );
}

export default function FacilityManagementContainer() {
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchFacilities = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/buildings/admin?page=${pageNumber}&limit=${pageSize}`,
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
      setFacilities(payload.data);
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
    fetchFacilities(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchFacilities(newPage);
  };

  const handleRowClick = (id) => {
    navigate(`/facilities/${id}`);
  };

  return (
    <FacilityManagement
      facilities={facilities}
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
