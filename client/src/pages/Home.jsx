import { format, getDay, isAfter, parse, startOfWeek } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaBuilding, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import GenericChip from "../components/GenericChip";
import StatusChip from "../components/StatusChip";
import formatDate from "../utils/formatDate";
import formatTime from "../utils/formatTime";
import { getScheduleStatusColor } from "../utils/getScheduleStatusColor";
import { getUrgencyColor } from "../utils/getUrgencyColor";

function EventComponent({ event }) {
  console.log(event);
  const isCancelled = event.status === "cancelled";
  const timeRange = `${formatTime(event.start)} - ${formatTime(event.end)}`;

  return (
    <div
      style={{
        fontSize: "0.5rem",
        padding: "4px",
        color: isCancelled ? "#888" : "#222",
        textDecoration: isCancelled ? "line-through" : "none",
        backgroundColor: isCancelled ? "#f2f2f2" : "#ebf4fc",
        borderRadius: "4px",
        marginBottom: "2px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <StatusChip
          label={event.fullData.booking.urgency}
          type={getUrgencyColor(event.fullData.booking.urgency)}
          size="small"
        />
      </div>

      <div style={{ fontWeight: "bold" }}>{timeRange}</div>
      <div>
        {event.fullData.room.building.code} Room {event.room}
      </div>
      <div>{event.title}</div>
    </div>
  );
}

function CustomToolbar({ label, onNavigate }) {
  return (
    <div className="rbc-toolbar custom-toolbar">
      <div className="rbc-btn-group">
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button onClick={() => onNavigate("PREV")}>Back</button>
        <button onClick={() => onNavigate("NEXT")}>Next</button>
      </div>
      <div className="custom-month-label">{label}</div>
    </div>
  );
}

function Home({
  events,
  localizer,
  onNavigate,
  date,
  formValues,
  handleFormChange,
  onFilterSubmit,
  handleClearFilters,
  buildings,
  rooms,
  selectedEvent,
  setSelectedEvent,
  handleCancelSchedule,
}) {
  const isPastEvent = (event) => {
    const eventDateTime = new Date(
      `${event.fullData.date}T${event.fullData.start_time}`
    );
    return isAfter(new Date(), eventDateTime);
  };

  return (
    <main className="page">
      <div className="page-title">
        <h2>My Bookings</h2>
        <p>View your approved bookings in calendar view.</p>
      </div>

      <div className="space-between">
        <div style={{ minHeight: "600px", height: "90vh", width: "80%" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month"]}
            style={{ height: "100%" }}
            date={date}
            onNavigate={onNavigate}
            components={{ event: EventComponent, toolbar: CustomToolbar }}
            onSelectEvent={(event) => setSelectedEvent(event)}
            dayPropGetter={(date) => {
              const isToday =
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return {
                style: {
                  backgroundColor: isToday ? "#cce6ff" : undefined,
                },
              };
            }}
            eventPropGetter={(event) => {
              const baseStyle = {
                fontSize: "0.75rem",
                padding: "1px",
                borderRadius: "4px",
                backgroundColor: "transparent",
              };

              if (event.status === "cancelled") {
                return {
                  style: {
                    ...baseStyle,
                    color: "#721c24",
                    textDecoration: "line-through",
                  },
                };
              }

              return {
                style: {
                  ...baseStyle,
                  color: "",
                  fontWeight: 500,
                },
              };
            }}
          />
        </div>

        <div className="calendar-info-container">
          <form className="calendar-filter-opts" onSubmit={onFilterSubmit}>
            <div className="form-fields">
              <div className="form-field">
                <label>
                  <span className="th-icon-label">
                    <FaCalendarAlt /> Month
                  </span>
                </label>
                <input
                  type="month"
                  name="month"
                  value={formValues.month}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  <span className="th-icon-label">
                    <FaBuilding /> Building
                  </span>
                </label>
                <select
                  name="building"
                  value={formValues.building}
                  onChange={handleFormChange}
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>
                  <span className="th-icon-label">
                    <FaLayerGroup /> Room
                  </span>
                </label>
                <select
                  name="room"
                  value={formValues.room}
                  onChange={handleFormChange}
                  disabled={!formValues.building}
                >
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>
                  <span className="th-icon-label">
                    <FaLayerGroup /> Urgency
                  </span>
                </label>
                <select
                  name="urgency"
                  value={formValues.urgency || ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-field-row form-field-btn-container">
                <button type="submit" className="submit-btn">
                  Filter
                </button>
                <button
                  type="button"
                  className="transparent-border-btn"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>

          {selectedEvent && (
            <div id="sched-info-container" className="form-fields">
              <div className="flex-gap-small">
                <StatusChip
                  label={selectedEvent.fullData.status}
                  type={getScheduleStatusColor(selectedEvent.fullData.status)}
                />
                <StatusChip
                  label={selectedEvent.fullData.booking.urgency}
                  type={getUrgencyColor(selectedEvent.fullData.booking.urgency)}
                />
              </div>
              <GenericChip
                label={selectedEvent.fullData.booking.schedule_type}
              />
              <h3>{selectedEvent.fullData.booking.purpose}</h3>

              <div className="flex-gap-1 flex-align">
                <span className="th-icon-label">
                  <FaCalendarAlt />
                </span>

                <div>
                  <GenericChip
                    label={formatDate(selectedEvent.fullData.date)}
                  />
                  <div className="schedule-tbl-info">
                    From
                    <GenericChip
                      label={formatTime(selectedEvent.fullData.start_time)}
                    />{" "}
                    To
                    <GenericChip
                      label={formatTime(selectedEvent.fullData.end_time)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-gap-1 flex-align">
                <span className="th-icon-label">
                  <FaBuilding />
                </span>
                <div>
                  <p>
                    {selectedEvent.fullData.room.building.code} -{" "}
                    {selectedEvent.fullData.room.building.name}
                  </p>
                  <p>Room {selectedEvent.fullData.room.number}</p>
                  <p className="small-text">
                    {selectedEvent.fullData.room.building.address}
                  </p>
                </div>
              </div>

              <div className="flex-gap-1 flex-align">
                <span className="th-icon-label">
                  <IoIosInformationCircle />
                </span>
                <div className="flex-gap-1">
                  Booking ID: {selectedEvent.fullData.booking.id}
                  <a
                    href={`/bookings/${selectedEvent.fullData.booking.id}`}
                    className="arrow-btn"
                  >
                    <FaArrowRight />
                  </a>
                </div>
              </div>

              {selectedEvent.fullData.status !== "cancelled" &&
                !isPastEvent(selectedEvent) && (
                  <>
                    <br />
                    <div className="form-field">
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleCancelSchedule(selectedEvent.fullData.id)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function HomeContainer() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formValues, setFormValues] = useState({
    month: format(new Date(), "yyyy-MM"),
    building: "",
    room: "",
    urgency: "",
  });
  const [activeFilters, setActiveFilters] = useState(formValues);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState({ message: "", timestamp: null });

  const token = sessionStorage.getItem("token");

  const fetchBuildings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/buildings/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch buildings`);
      const data = await res.json();
      setBuildings(data.data);
    } catch (err) {
      setError({
        message: err.message,
        timestamp: Date.now(),
      });
    }
  };

  const fetchRoomsByBuilding = async (buildingId) => {
    if (!buildingId) return setRooms([]);
    try {
      const res = await fetch(
        `http://localhost:3000/api/buildings/admin/${buildingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch rooms`);
      const data = await res.json();
      setRooms(data.data.rooms || []);
    } catch (err) {
      setError({
        message: err.message,
        timestamp: Date.now(),
      });
      setRooms([]);
    }
  };

  const fetchBookings = async (date, filters = {}) => {
    const yearMonth = format(date, "yyyy-MM");
    const params = new URLSearchParams({ month: yearMonth });
    if (filters.building) params.append("building_id", filters.building);
    if (filters.room) params.append("room_id", filters.room);
    if (filters.urgency) params.append("urgency", filters.urgency);

    const endpoint = `/api/schedules/facilitated?${params.toString()}`;
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message || "An error occurred. Please try again";
        throw new Error(errorMessage);
      }

      const bookings = data.data.map((item) => ({
        id: item.id,
        title: item.booking.purpose,
        start: new Date(`${item.date}T${item.start_time}`),
        end: new Date(`${item.date}T${item.end_time}`),
        allDay: false,
        room: item.room.number,
        status: item.status,
        fullData: item,
      }));

      setEvents(bookings);
    } catch (err) {
      setError({
        message: err.message,
        timestamp: Date.now(),
      });
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchBookings(currentDate, activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, activeFilters]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "building") {
      setFormValues((prev) => ({ ...prev, building: value, room: "" }));
      fetchRoomsByBuilding(value);
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newDate = new Date(`${formValues.month}-01`);
    setCurrentDate(newDate);
    setActiveFilters(formValues);
  };

  const handleClearFilters = () => {
    const resetDate = new Date();
    const resetValues = {
      month: format(resetDate, "yyyy-MM"),
      building: "",
      room: "",
      urgency: "",
    };
    setFormValues(resetValues);
    setActiveFilters(resetValues);
    setRooms([]);
    setSelectedEvent(null);
    setCurrentDate(resetDate);
  };

  const handleCancelSchedule = async (scheduleId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/schedules/${scheduleId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel booking");
      fetchBookings(currentDate, activeFilters);
      setSelectedEvent((prev) => ({
        ...prev,
        fullData: {
          ...prev.fullData,
          status: "cancelled",
        },
        status: "cancelled",
      }));
    } catch (err) {
      setError({
        message: err.message,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <>
      {error.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}

      <Home
        events={events}
        localizer={localizer}
        onNavigate={handleNavigate}
        date={currentDate}
        formValues={formValues}
        handleFormChange={handleFormChange}
        onFilterSubmit={handleFilterSubmit}
        handleClearFilters={handleClearFilters}
        buildings={buildings}
        rooms={rooms}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleCancelSchedule={handleCancelSchedule}
      />
    </>
  );
}
