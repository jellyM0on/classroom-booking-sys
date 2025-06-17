import { useEffect, useState } from "react";
import { FaFileMedical, FaSearch } from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

function BookingManagement({
  loading,
  error,
  bookings,
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
        <h2>
          Manage Requests <span>{total}</span>
        </h2>
        <p>Manage booking requests here</p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="table-opts">
        <div className="search-field">
          <FaSearch color="rgb(107, 106, 106)" />
          <input type="text" placeholder="Search" />
        </div>
        <div className="flex-gap-1">
          <NavLink to="/new-booking" className="add-btn">
            <FaFileMedical />
            New Request
          </NavLink>
        </div>
      </div>

      <div className="filter-opts">
        <p>FILTER</p>
        <div></div>
      </div>

      {!loading && !error && bookings && bookings.length > 0 && (
        <div id="generic-table-wrapper">
          <table cellPadding="8" cellSpacing="0" id="generic-table">
            <thead>
              <tr>
                <th>
                  <span className="th-icon-label">
                    <MdNumbers /> ID
                  </span>
                </th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Purpose</th>
                <th>Created At</th>
                <th>Submitted by</th>
                <th>Facilitated by</th>
                <th>Reviewed by</th>
                <th>Schedules</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => handleRowClick(booking.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{booking.id}</td>
                  <td>{booking.status}</td>
                  <td>{booking.urgency}</td>
                  <td>{booking.purpose}</td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  <td>{booking.submittedBy?.name || "N/A"}</td>
                  <td>{booking.facilitatedBy?.name || "N/A"}</td>
                  <td>{booking.reviewedBy?.name || "N/A"}</td>
                  <td>
                    {booking.schedules.length > 0 ? (
                      <ul>
                        {booking.schedules.map((schedule) => (
                          <li key={schedule.id}>
                            {schedule.date} {schedule.start_time} -{" "}
                            {schedule.end_time} (Room {schedule.room.number})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No schedules"
                    )}
                  </td>
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

      {!loading && !error && bookings && bookings.length === 0 && (
        <p>No booking requests found.</p>
      )}
    </main>
  );
}

export default function BookingManagementContainer() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

  const navigate = useNavigate(); // <-- add this

  const fetchBookings = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const endpoint =
      role === "admin"
        ? `/api/bookings/admin/all?page=${pageNumber}&limit=${pageSize}`
        : `/api/bookings?page=${pageNumber}&limit=${pageSize}`;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      setBookings(payload.data);
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
    fetchBookings(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchBookings(newPage);
  };

  const handleRowClick = (id) => {
    navigate(`/bookings/${id}`); // <-- navigate on row click
  };

  return (
    <BookingManagement
      bookings={bookings}
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
