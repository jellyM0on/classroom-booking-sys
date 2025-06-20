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
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import GenericChip from "../components/GenericChip";
import LoadingSpinner from "../components/LoadingSpinner";
import NoDataFound from "../components/NoDataFound";
import Pagination from "../components/Pagination";
import formatDate from "../utils/formatDate";

function FacilityManagement({
  loading,
  facilities,
  handleRowClick,
  page,
  totalPages,
  pageSize,
  total,
  handlePageChange,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
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
          <input
            type="text"
            placeholder="Search Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageChange(1);
              }
            }}
          />
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
        <div className="filter-controls">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && facilities && facilities.length > 0 && (
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

      {!loading && facilities.length === 0 && <NoDataFound />}

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

export default function FacilityManagementContainer() {
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ message: "", timestamp: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchFacilities = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");

    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: pageNumber,
        limit: pageSize,
        search: searchTerm,
        sort: sortOrder, // include sort order
      });

      const response = await fetch(
        `http://localhost:3000/api/buildings/admin?${queryParams.toString()}`,
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
      setError({
        message: err.message || "Something went wrong",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchFacilities(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortOrder]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchFacilities(newPage);
  };

  const handleRowClick = (id) => {
    navigate(`/facilities/${id}`);
  };

  return (
    <>
      {error.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}

      <FacilityManagement
        facilities={facilities}
        loading={loading}
        error={error.message}
        handleRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        handlePageChange={handlePageChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </>
  );
}
