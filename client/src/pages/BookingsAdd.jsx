import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDescription, MdOutlinePriorityHigh } from "react-icons/md";
import { NavLink } from "react-router-dom";
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import FloatingSuccessMessage from "../components/FloatingSuccessMessage";
import LoadingSpinner from "../components/LoadingSpinner";

const isAdmin = sessionStorage.getItem("role") === "admin";

function BookingsAdd({
  buildings,
  availableRooms,
  getRoomsError,
  formData,
  fieldErrors,
  loading,
  submitSuccess,
  handleChange,
  handleSubmit,
  roomsLoading,
  requiredFieldsFilled,
  users,
}) {
  const [scheduleType, setScheduleType] = useState(
    formData.schedule_type || "once"
  );
  const today = new Date().toISOString().slice(0, 10);

  const formatRoomType = (type) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <main className="page">
      {loading && <LoadingSpinner />}
      <NavLink to="/bookings" className="transparent-btn back-btn">
        <IoIosArrowBack /> Go to Requests
      </NavLink>

      <div className="page-title">
        <h2>New Request</h2>
        <p>Submit a request for space usage.</p>
      </div>

      <form onSubmit={handleSubmit} id="generic-form">
        <div className="generic-form-section">
          <h3 className="generic-form-section-title">Details</h3>
          <div className="form-fields">
            <div
              className={`form-field ${
                fieldErrors.purpose ? "error-field" : ""
              }`}
            >
              <label>
                <FaInfoCircle /> Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose || ""}
                onChange={handleChange}
                required
              />
              {fieldErrors.purpose && (
                <p className="error-msg">{fieldErrors.purpose}</p>
              )}
            </div>

            <div className="generic-form-section-subrow">
              {isAdmin && (
                <div className="form-field">
                  <label>Facilitated By</label>
                  <select
                    name="facilitated_by"
                    value={formData.facilitated_by || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.facilitated_by && (
                    <p className="error-msg">{fieldErrors.facilitated_by}</p>
                  )}
                </div>
              )}

              <div
                className={`form-small-field form-field ${
                  fieldErrors.number_of_occupants ? "error-field" : ""
                }`}
              >
                <label>
                  <FaUsers /> Number of Occupants
                </label>
                <input
                  type="number"
                  name="number_of_occupants"
                  value={formData.number_of_occupants || ""}
                  onChange={handleChange}
                  required
                  min={1}
                />
                {fieldErrors.number_of_occupants && (
                  <p className="error-msg">{fieldErrors.number_of_occupants}</p>
                )}
              </div>

              <div
                className={`form-small-field form-field ${
                  fieldErrors.urgency ? "error-field" : ""
                }`}
              >
                <label>
                  <MdOutlinePriorityHigh /> Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {fieldErrors.urgency && (
                  <p className="error-msg">{fieldErrors.urgency}</p>
                )}
              </div>
            </div>

            <div className="form-field">
              <label>
                <MdDescription /> Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
              />
              {fieldErrors.notes && (
                <p className="error-msg">{fieldErrors.notes}</p>
              )}
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
              <div className="flex-gap-1">
                <label>
                  <input
                    type="radio"
                    name="schedule_type"
                    value="once"
                    checked={scheduleType === "once"}
                    onChange={() => {
                      setScheduleType("once");
                      handleChange({
                        target: { name: "schedule_type", value: "once" },
                      });
                    }}
                  />{" "}
                  Once
                </label>
                <label>
                  <input
                    type="radio"
                    name="schedule_type"
                    value="repeating"
                    checked={scheduleType === "repeating"}
                    onChange={() => {
                      setScheduleType("repeating");
                      handleChange({
                        target: { name: "schedule_type", value: "repeating" },
                      });
                    }}
                  />{" "}
                  Repeating
                </label>
              </div>
            </div>

            {scheduleType === "once" ? (
              <div className="generic-form-section-subrow">
                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    min={today}
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
                      min={today}
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
                      min={formData.start_date || today}
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
              <label>Room Types (select all that apply)</label>
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
              {getRoomsError && <p className="error-msg">{getRoomsError}</p>}
              <select
                name="room_id"
                value={formData.room_id || ""}
                onChange={handleChange}
                disabled={!requiredFieldsFilled() || roomsLoading}
              >
                {roomsLoading ? (
                  <option>Loading rooms...</option>
                ) : (
                  <>
                    <option value="">Select available room</option>
                    {availableRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} ({formatRoomType(room.type)})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
          {formData.room_id &&
            availableRooms.length > 0 &&
            (() => {
              const selectedRoom = availableRooms.find(
                (room) => room.id == formData.room_id
              );
              return (
                selectedRoom?.instructions && (
                  <div className="form-field">
                    <label>Room Instructions</label>
                    <p className="room-instructions">
                      {selectedRoom.instructions}
                    </p>
                  </div>
                )
              );
            })()}
        </div>

        {submitSuccess && (
          <FloatingSuccessMessage message="Submitted successfully!" />
        )}

        <button
          type="submit"
          className={
            loading || !formData.room_id ? "submit-btn-disabled" : "submit-btn"
          }
          disabled={loading || !formData.room_id}
        >
          Submit Booking
        </button>
      </form>
    </main>
  );
}

export default function BookingsAddContainer() {
  const [formData, setFormData] = useState({
    schedule_type: "once",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [getRoomsError, setGetRoomsError] = useState(null);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({ message: "", timestamp: null });

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, []);

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
      setError({ message: "Failed to fetch users", timestamp: Date.now() });
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (requiredFieldsFilled()) {
      getAvailableRooms();
    } else {
      setAvailableRooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const fetchBuildings = async () => {
    setError({ message: "", timestamp: null });
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
      setError({ message: "Failed to fetch buildings", timestamp: Date.now() });
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "room_types") {
      const prev = formData.room_types || [];
      const updated = checked
        ? [...prev, value]
        : prev.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, room_types: updated }));
    } else if (name === "repeating_days") {
      const prev = formData.repeating_days || [];
      const updated = checked
        ? [...prev, value]
        : prev.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, repeating_days: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setError({ message: "", timestamp: null });
    setSubmitSuccess(false);

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
      status: "draft",
      bookingSchedules,
      room_id,
      ...(schedule_type === "repeating"
        ? { start_date, end_date, interval_type }
        : { start_date: null, end_date: null, interval_type: null }),
    };

    try {
      const res = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const formatted = {};
          for (const err of data.errors) {
            formatted[err.path] = err.message;
          }
          setFieldErrors(formatted);
          setError({
            message: data?.message || "Submission failed",
            timestamp: Date.now(),
          });
        } else {
          setError({
            message: data?.message || "Submission failed",
            timestamp: Date.now(),
          });
        }
        return;
      }

      setSubmitSuccess(true);
      setFormData({ schedule_type: "once" });
    } catch (err) {
      setError({
        message: err?.message || "Submission failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
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

  const getAvailableRooms = async () => {
    setRoomsLoading(true);
    setError({ message: "", timestamp: null });
    setGetRoomsError(null);
    setAvailableRooms([]);

    const { building_id, room_types, schedule_type } = formData;
    const token = sessionStorage.getItem("token");

    let scheduleSlots = [];

    if (schedule_type === "once") {
      scheduleSlots.push({
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });
    } else {
      scheduleSlots = generateRepeatingScheduleSlots();
      if (!scheduleSlots.length) {
        setGetRoomsError("Could not generate schedule slots.");
        setRoomsLoading(false);
        return;
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

      if (!res.ok) throw new Error("Failed to fetch available rooms");
      const data = await res.json();
      setAvailableRooms(data.data || []);
    } catch (err) {
      console.error(err);
      setGetRoomsError("Error fetching rooms. Please try again.");
      setError({
        message: "Failed to fetch available rooms",
        timestamp: Date.now(),
      });
    } finally {
      setRoomsLoading(false);
    }
  };

  const requiredFieldsFilled = () => {
    const {
      building_id,
      room_types,
      schedule_type,
      date,
      start_time,
      end_time,
      start_date,
      end_date,
      interval_type,
      repeating_days,
    } = formData;

    if (
      !building_id ||
      !room_types ||
      room_types.length === 0 ||
      !schedule_type
    )
      return false;

    if (schedule_type === "once") {
      return !!(date && start_time && end_time);
    }

    if (schedule_type === "repeating") {
      const basicFilled =
        start_date && end_date && start_time && end_time && interval_type;
      if (!basicFilled) return false;
      if (
        (interval_type === "weekly" || interval_type === "biweekly") &&
        (!repeating_days || repeating_days.length === 0)
      ) {
        return false;
      }
      return true;
    }

    return false;
  };

  return (
    <>
      {error.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}
      <BookingsAdd
        formData={formData}
        fieldErrors={fieldErrors}
        loading={loading}
        submitSuccess={submitSuccess}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buildings={buildings}
        availableRooms={availableRooms}
        getRoomsError={getRoomsError}
        roomsLoading={roomsLoading}
        requiredFieldsFilled={requiredFieldsFilled}
        users={users}
      />
    </>
  );
}
