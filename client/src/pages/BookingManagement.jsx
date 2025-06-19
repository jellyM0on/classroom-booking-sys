import { useEffect, useState } from "react";
import { BiSolidTimeFive } from "react-icons/bi";
import {
  FaCheckCircle,
  FaFileMedical,
  FaSearch,
  FaUserCheck,
  FaUserTie,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdNumbers } from "react-icons/md";
import { PiDoorOpenFill } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import GenericChip from "../components/GenericChip";
import NoDataFound from "../components/NoDataFound";
import Pagination from "../components/Pagination";
import StatusChip from "../components/StatusChip";
import formatDate from "../utils/formatDate";
import formatTime from "../utils/formatTime";
import { getBookingStatusColor } from "../utils/getBookingStatusColor";
import { getUrgencyColor } from "../utils/getUrgencyColor";

function ScheduleDisplay({ booking, firstSchedule }) {
  if (!booking) return null;

  const startTime = formatTime(firstSchedule?.start_time);
  const endTime = formatTime(firstSchedule?.end_time);

  if (booking.schedule_type === "once") {
    return (
      <div className="schedule-tbl-info">
        On <GenericChip label={formatDate(firstSchedule?.date)} />
        At <GenericChip label={startTime} /> -
        <GenericChip label={endTime} />
      </div>
    );
  }

  return (
    <div className="schedule-tbl-info">
      <GenericChip label={booking.interval_type} /> On
      {booking.repeating_days?.map((day, idx) => (
        <GenericChip key={idx} label={day} />
      ))}{" "}
      From
      <GenericChip label={formatDate(booking.start_date)} /> To
      <GenericChip label={formatDate(booking.end_date)} />
      At <GenericChip label={startTime} /> -
      <GenericChip label={endTime} />
    </div>
  );
}

function BookingManagement({
  loading,
  bookings,
  handleRowClick,
  page,
  totalPages,
  pageSize,
  total,
  handlePageChange,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <main className="page">
      <div className="page-title">
        <div className="flex-gap-1">
          <h2>Manage Requests</h2>
          <GenericChip label={total} />
        </div>

        <p>Manage booking requests here.</p>
      </div>

      {loading && <p>Loading...</p>}

      <div className="table-opts">
        <div className="search-field">
          <FaSearch color="rgb(107, 106, 106)" />
          <input
            type="text"
            placeholder="Search"
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

      {!loading && bookings && bookings.length > 0 && (
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
                    <FaCheckCircle /> Status
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <IoWarningOutline /> Urgency
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <TbTargetArrow /> Purpose
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <BiSolidTimeFive /> Schedule
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <PiDoorOpenFill /> Room
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaUserTie /> Facilitator
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">
                    <FaUserCheck /> Reviewed by
                  </span>
                </th>
                <th>Submitted By</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const uniqueRooms = [
                  ...new Map(
                    booking.schedules.map((s) => [s.room.id, s.room])
                  ).values(),
                ];

                return (
                  <tr
                    key={booking.id}
                    onClick={() => handleRowClick(booking.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{booking.id}</td>
                    <td>
                      {
                        <StatusChip
                          label={booking.status}
                          type={getBookingStatusColor(booking.status)}
                        />
                      }
                    </td>
                    <td>
                      {" "}
                      {
                        <StatusChip
                          label={booking.urgency}
                          type={getUrgencyColor(booking.urgency)}
                        />
                      }
                    </td>
                    <td>{booking.purpose}</td>
                    <td>
                      <ScheduleDisplay
                        booking={booking}
                        firstSchedule={booking.schedules?.[0]}
                      />
                    </td>
                    <td>
                      {uniqueRooms.length > 0
                        ? uniqueRooms
                            .map((room) => `Room ${room.number}`)
                            .join(", ")
                        : "N/A"}
                    </td>
                    <td>{booking.facilitatedBy?.name || "N/A"}</td>
                    <td>{booking.reviewedBy?.name || "N/A"}</td>
                    <td>{booking.submittedBy?.name || "N/A"}</td>
                    <td>{formatDate(new Date(booking.createdAt))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && bookings && bookings.length === 0 && <NoDataFound />}

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

export default function BookingManagementContainer() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ message: "", timestamp: null });
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const navigate = useNavigate();
  const fetchBookings = async (pageNumber = 1) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const basePath =
      role === "admin" ? "/api/bookings/admin/all" : "/api/bookings";
    const endpoint = `${basePath}?page=${pageNumber}&limit=${pageSize}&search=${encodeURIComponent(
      searchTerm
    )}`;

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
      setError({
        message: err.message,
        timestamp: Date.now(),
      });
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
    navigate(`/bookings/${id}`);
  };

  return (
    <>
      {error.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}

      <BookingManagement
        bookings={bookings}
        loading={loading}
        handleRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        handlePageChange={handlePageChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
}
