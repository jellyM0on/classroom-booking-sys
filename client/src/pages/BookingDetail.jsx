import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit, MdOutlinePriorityHigh } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import GenericChip from "../components/GenericChip";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusChip from "../components/StatusChip";
import formatDate from "../utils/formatDate";
import { getBookingStatusColor } from "../utils/getBookingStatusColor";
import { getScheduleStatusColor } from "../utils/getScheduleStatusColor";

const isAdmin = sessionStorage.getItem("role") === "admin";
const currentUid = sessionStorage.getItem("uid");

function BookingDetail({
  booking,
  loading,
  error,
  editMode,
  formData,
  handleChange,
  handleSubmit,
  handleToggleEdit,
  users = [],
  buildings = [],
  availableRooms = [],
  onSubmitDraft,
  setEditStatus,
  setEditingIndex,
  editStatus,
  editingIndex,
  handleScheduleUpdate,
}) {
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!booking) return <p>No booking found.</p>;

  const isSubmitter = currentUid === booking.submittedBy?.uid;

  const formatRoomType = (type) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <main className="page">
      <NavLink to="/bookings" className="transparent-btn back-btn">
        <IoIosArrowBack /> Go to Requests
      </NavLink>

      <div className="page-title booking-detail-page-title">
        <div>
          <div className="flex-gap-1">
            <h2>Booking Detail</h2>
            <GenericChip label={`ID: ${booking.id}`} />
            <StatusChip
              label={booking.status}
              type={getBookingStatusColor(booking.status)}
            />
          </div>

          <p>Review and manage the booking request details.</p>
        </div>
        <div>
          <div>
            {booking.status === "draft" && isSubmitter && (
              <button
                type="button"
                onClick={onSubmitDraft}
                className="submit-btn"
              >
                Submit
              </button>
            )}

            {booking.status === "pending" &&
              (sessionStorage.getItem("role") === "admin" ? (
                <div className="flex-gap-1">
                  <button
                    type="button"
                    onClick={() => onSubmitDraft("approved")}
                    className="submit-btn"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onSubmitDraft("rejected")}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSubmitDraft("cancelled")}
                  className="submit-btn"
                >
                  Cancel
                </button>
              ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} id="generic-form">
        <div className="generic-form-section">
          <h3 className="generic-form-section-title">Details</h3>
          <div className="form-fields">
            <div className="form-field">
              <label>
                <FaInfoCircle /> Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose || ""}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </div>

            <div className="generic-form-section-subrow">
              {isAdmin && (
                <div className="form-field">
                  <label>Facilitated By</label>
                  <select
                    name="facilitated_by"
                    value={formData.facilitated_by || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-small-field form-field">
                <label>
                  <FaUsers /> Number of Occupants
                </label>
                <input
                  type="number"
                  name="number_of_occupants"
                  value={formData.number_of_occupants || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                  min={1}
                />
              </div>

              <div className="form-small-field form-field">
                <label>
                  <MdOutlinePriorityHigh /> Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="generic-form-section">
          <h3 className="generic-form-section-title">Schedule</h3>
          <div className="form-fields">
            <div className="form-field">
              <label>
                <FaCalendarAlt /> Schedule Type
              </label>
              <label>
                <input
                  type="radio"
                  name="schedule_type"
                  value="once"
                  checked={formData.schedule_type === "once"}
                  onChange={handleChange}
                  disabled={!editMode}
                />{" "}
                Once
              </label>
              <label>
                <input
                  type="radio"
                  name="schedule_type"
                  value="repeating"
                  checked={formData.schedule_type === "repeating"}
                  onChange={handleChange}
                  disabled={!editMode}
                />{" "}
                Repeating
              </label>
            </div>

            {formData.schedule_type === "once" ? (
              <div className="generic-form-section-subrow">
                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="generic-form-section-subrow">
                  <div className="form-field">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </div>
                <div className="generic-form-section-subrow">
                  <div className="form-field">
                    <label>Interval Type</label>
                    <select
                      name="interval_type"
                      value={formData.interval_type || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <option value="">Select Interval</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Every Week</option>
                      <option value="biweekly">Every Other Week</option>
                    </select>
                  </div>

                  {(formData.interval_type === "weekly" ||
                    formData.interval_type === "biweekly") && (
                    <div className="form-field">
                      <label>Repeating Days</label>
                      <div className="repeating-days">
                        {["M", "T", "W", "TH", "F", "S"].map((day) => (
                          <label key={day}>
                            <input
                              type="checkbox"
                              name="repeating_days"
                              value={day}
                              checked={(formData.repeating_days || []).includes(
                                day
                              )}
                              onChange={handleChange}
                              disabled={!editMode}
                            />{" "}
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="generic-form-section">
          <h3 className="generic-form-section-title">Location</h3>
          <div className="form-fields">
            <div className="form-field">
              <label>
                <FaBuilding /> Building
              </label>
              <select
                name="building_id"
                value={formData.building_id || ""}
                onChange={handleChange}
                disabled={!editMode}
                required
              >
                <option value="">Select building</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="generic-form-section-subrow">
            <div className="form-field">
              <label>
                {!editMode
                  ? "Room Types"
                  : "Room Types (Select all that apply)"}
              </label>
              <div className="checkbox-group">
                {["classroom", "science_lab", "computer_lab", "specialty"].map(
                  (type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        name="room_types"
                        value={type}
                        checked={(formData.room_types || []).includes(type)}
                        onChange={handleChange}
                        disabled={!editMode}
                      />{" "}
                      {type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="form-field">
              <label>Room</label>
              {!editMode && formData.room_id ? (
                <div className="readonly-field">
                  Room {booking.schedules[0].room.number}
                </div>
              ) : (
                <select
                  name="room_id"
                  value={formData.room_id || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                >
                  <option value="">Select room</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} ({formatRoomType(room.type)})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="generic-form-section">
          <h3 className="generic-form-section-title">Submission</h3>
          <div className="form-fields">
            <div className="form-field">
              <div className="generic-form-section-subrow">
                <div className="form-field">
                  <label>Submitted By</label>
                  <input
                    type="text"
                    value={booking.submittedBy?.name ?? "N/A"}
                    disabled
                  />
                </div>
                <div className="form-field">
                  <label>Reviewed By</label>
                  <input
                    type="text"
                    value={booking.reviewedBy?.name ?? "N/A"}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="generic-form-section-subrow">
              <div className="form-field">
                <label>Created At</label>
                <input
                  type="text"
                  value={formatDate(booking.createdAt)}
                  disabled
                />
              </div>

              <div className="form-field">
                <label>Updated At</label>
                <input
                  type="text"
                  value={formatDate(booking.updatedAt)}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {editMode ? (
          <>
            <button className="submit-btn" type="submit">
              Save Changes
            </button>
            <button
              className="transparent-btn"
              type="button"
              onClick={handleToggleEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          !editMode &&
          booking.status === "draft" &&
          isSubmitter && (
            <button
              className="submit-btn"
              type="button"
              onClick={handleToggleEdit}
            >
              Edit Booking
            </button>
          )
        )}
      </form>

      {booking?.schedules?.length > 0 && (
        <div id="user-management-tbl-wrapper" className="departments-table">
          <h3 style={{ marginBottom: "1rem" }}>Schedules</h3>
          <table cellPadding="8" cellSpacing="0" id="user-management-tbl">
            <thead>
              <tr>
                <th>
                  <span className="th-icon-label">
                    <FaCalendarAlt /> Date
                  </span>
                </th>
                <th>Day of Week</th>
                <th>Status</th>
                {booking.status === "approved" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {booking.schedules.map((sched, index) => {
                const dateObj = new Date(sched.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = dateObj < today;
                const isEditing = editingIndex === index;

                return (
                  <tr key={sched.id}>
                    <td>{formatDate(sched.date)}</td>
                    <td>
                      {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="tbl-form-field"
                        >
                          <option value="active">Active</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      ) : (
                        <StatusChip
                          label={sched.status}
                          type={getScheduleStatusColor(sched.status)}
                        />
                      )}
                    </td>
                    {booking.status === "approved" && (
                      <td>
                        {isEditing ? (
                          <>
                            <button
                              className="submit-btn tbl-btn"
                              type="button"
                              onClick={() =>
                                handleScheduleUpdate(
                                  sched.id,
                                  editStatus,
                                  index
                                )
                              }
                            >
                              Save
                            </button>
                            <button
                              className="transparent-btn tbl-btn"
                              type="button"
                              onClick={() => setEditingIndex(null)}
                              style={{ marginLeft: "0.5rem" }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          !isPast &&
                          sched.status !== "cancelled" && (
                            <button
                              className="table-btn table-edit-btn"
                              type="button"
                              onClick={() => {
                                setEditingIndex(index);
                                setEditStatus(sched.status);
                              }}
                            >
                              <MdEdit />
                            </button>
                          )
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default function BookingDetailContainer() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetchBooking();
    fetchBuildings();
    if (isAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBooking = async () => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const endpoint =
      role === "admin" ? `/api/bookings/admin/${id}` : `/api/bookings/${id}`;

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Booking not found");

      const { data } = await res.json();
      setBooking(data);

      const schedules = data.schedules || [];
      const firstSchedule = schedules[0] || {};
      const roomType = firstSchedule.room?.type || "";
      const buildingId = firstSchedule.room?.buildingId || "";
      const repeatingDaysSet = new Set(
        data.schedules?.map((s) => new Date(s.date).getDay())
      );
      const dayMap = {
        0: "S",
        1: "M",
        2: "T",
        3: "W",
        4: "TH",
        5: "F",
        6: "S",
      };
      const repeatingDays = [...repeatingDaysSet].map((d) => dayMap[d]);

      const initialForm = {
        number_of_occupants: data.number_of_occupants,
        purpose: data.purpose,
        urgency: data.urgency,
        facilitated_by: data.facilitated_by,
        building_id: buildingId,
        room_types: roomType ? [roomType] : [],
        schedule_type: data.schedule_type,
        date: data.date || firstSchedule?.date || "",
        start_date: data.start_date?.slice(0, 10) || "",
        end_date: data.end_date?.slice(0, 10) || "",
        start_time: firstSchedule?.start_time || "",
        end_time: firstSchedule?.end_time || "",
        interval_type: data.interval_type || "",
        room_id: firstSchedule?.room?.id || "",
        repeating_days: repeatingDays || [],
      };

      setFormData(initialForm);
      setInitialFormData(initialForm);

      await fetchAvailableRooms({
        building_id: buildingId,
        room_types: roomType ? [roomType] : [],
        schedule_type: data.schedule_type,
        date: data.date || firstSchedule?.date || "",
        start_date: data.start_date?.slice(0, 10) || "",
        end_date: data.end_date?.slice(0, 10) || "",
        start_time: firstSchedule?.start_time || "",
        end_time: firstSchedule?.end_time || "",
      });
    } catch (err) {
      setError(err.message || "Error fetching booking");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async ({
    building_id,
    room_types,
    schedule_type,
    date,
    start_date,
    end_date,
    start_time,
    end_time,
  }) => {
    const token = sessionStorage.getItem("token");

    let scheduleSlots = [];

    if (schedule_type === "once") {
      scheduleSlots.push({ date, start_time, end_time });
    } else {
      const current = new Date(start_date);
      const end = new Date(end_date);

      while (current <= end) {
        scheduleSlots.push({
          date: current.toISOString().slice(0, 10),
          start_time,
          end_time,
        });
        current.setDate(current.getDate() + 1);
      }
    }

    try {
      const res = await fetch("http://localhost:3000/api/rooms/available", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildingId: building_id,
          roomTypes: room_types,
          scheduleSlots,
        }),
      });

      if (!res.ok) throw new Error("Could not fetch available rooms");

      const { data } = await res.json();
      setAvailableRooms(data || []);
    } catch (err) {
      console.error("Room fetch failed:", err.message);
    }
  };

  const fetchUsers = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/users/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchBuildings = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/buildings/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch buildings");
      const payload = await res.json();
      setBuildings(payload.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    let newValue;

    if (name === "room_types") {
      const prev = formData.room_types || [];
      newValue = checked ? [...prev, value] : prev.filter((v) => v !== value);
    } else if (name === "repeating_days") {
      const prev = formData.repeating_days || [];
      newValue = checked ? [...prev, value] : prev.filter((v) => v !== value);
    } else {
      newValue = value;
    }

    const updatedForm = {
      ...formData,
      [name]: newValue,
    };

    const fieldsToWatch = [
      "building_id",
      "room_types",
      "schedule_type",
      "start_date",
      "end_date",
      "date",
      "start_time",
      "end_time",
      "interval_type",
      "repeating_days",
    ];

    const fieldChanged = fieldsToWatch.includes(name);

    if (editMode && fieldChanged) {
      updatedForm.room_id = "";
    }

    setFormData(updatedForm);

    if (editMode && fieldChanged) {
      const {
        building_id,
        room_types,
        schedule_type,
        date,
        start_date,
        end_date,
        start_time,
        end_time,
      } = updatedForm;

      const valid =
        building_id &&
        room_types?.length &&
        schedule_type &&
        start_time &&
        end_time &&
        (schedule_type === "once" ? date : start_date && end_date);

      if (valid) {
        fetchAvailableRooms({
          building_id,
          room_types,
          schedule_type,
          date,
          start_date,
          end_date,
          start_time,
          end_time,
        });
      } else {
        setAvailableRooms([]);
      }
    }
  };

  const handleToggleEdit = () => {
    if (editMode) {
      setFormData(initialFormData);
      fetchAvailableRooms({
        building_id: initialFormData.building_id,
        room_types: initialFormData.room_types,
        schedule_type: initialFormData.schedule_type,
        date: initialFormData.date,
        start_date: initialFormData.start_date,
        end_date: initialFormData.end_date,
        start_time: initialFormData.start_time,
        end_time: initialFormData.end_time,
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    const {
      schedule_type,
      date,
      start_time,
      end_time,
      room_id,
      start_date,
      end_date,
      interval_type,
      ...rest
    } = formData;

    let scheduleSlots = [];
    if (schedule_type === "once") {
      scheduleSlots.push({ date, start_time, end_time });
    } else {
      scheduleSlots = generateRepeatingScheduleSlots();
    }

    const bookingSchedules = scheduleSlots.map((slot) => ({
      ...slot,
      room_id,
      status: "inactive",
    }));

    const payload = {
      ...rest,
      schedule_type,
      bookingSchedules,
      room_id,
      ...(schedule_type === "repeating"
        ? { start_date, end_date, interval_type }
        : { start_date: null, end_date: null, interval_type: null }),
    };

    try {
      const res = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update booking");
      setBooking(data.data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const generateRepeatingScheduleSlots = () => {
    const {
      start_date,
      end_date,
      interval_type,
      repeating_days,
      start_time,
      end_time,
    } = formData;

    if (!start_date || !end_date || !start_time || !end_time || !interval_type)
      return [];

    const slots = [];
    const selectedDays = (repeating_days || []).map((day) => {
      const map = { S: 0, M: 1, T: 2, W: 3, TH: 4, F: 5 };
      return map[day] ?? -1;
    });

    let current = new Date(start_date);
    const end = new Date(end_date);

    while (current <= end) {
      const day = current.getDay();

      const shouldInclude =
        interval_type === "daily" ||
        ((interval_type === "weekly" || interval_type === "biweekly") &&
          selectedDays.includes(day));

      if (shouldInclude) {
        slots.push({
          date: current.toISOString().slice(0, 10),
          start_time,
          end_time,
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return slots;
  };

  const onSubmitDraft = async (action) => {
    const token = sessionStorage.getItem("token");

    let endpoint = `http://localhost:3000/api/bookings/${id}/submit`;
    let payload = null;

    if (action === "approved" || action === "rejected") {
      endpoint = `http://localhost:3000/api/bookings/admin/${id}/status`;
      payload = JSON.stringify({ status: action });
    }

    if (action === "cancelled") {
      endpoint = `http://localhost:3000/api/bookings/${id}/cancel`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        ...(payload && { body: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update booking");

      setBooking((prev) => ({
        ...prev,
        status: data.data.status,
        updatedAt: data.data.updatedAt,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const handleScheduleUpdate = async (scheduleId, newStatus, index) => {
    if (newStatus !== "cancelled") return;

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const endpoint =
      role === "admin"
        ? `http://localhost:3000/api/schedules/admin/${scheduleId}/cancel`
        : `http://localhost:3000/api/schedules/${scheduleId}/cancel`;

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update schedule");

      const updatedSchedules = [...booking.schedules];
      updatedSchedules[index] = {
        ...updatedSchedules[index],
        status: data.data.status,
      };

      setBooking({ ...booking, schedules: updatedSchedules });
      setEditingIndex(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <BookingDetail
      onSubmitDraft={onSubmitDraft}
      booking={booking}
      loading={loading}
      error={error}
      editMode={editMode}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleToggleEdit={handleToggleEdit}
      users={users}
      buildings={buildings}
      availableRooms={availableRooms}
      editingIndex={editingIndex}
      setEditingIndex={setEditingIndex}
      editStatus={editStatus}
      setEditStatus={setEditStatus}
      handleScheduleUpdate={handleScheduleUpdate}
    />
  );
}
