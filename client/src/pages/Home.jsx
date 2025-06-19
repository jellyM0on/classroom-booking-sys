import { format, getDay, parse, startOfWeek } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaBuilding, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";

function EventComponent({ event }) {
  const isCancelled = event.status === "cancelled";
  const timeRange = `${format(event.start, "HH:mm")} - ${format(
    event.end,
    "HH:mm"
  )}`;

  // TODO: Refactor styles

  return (
    <div
      style={{
        fontSize: "0.5rem",
        padding: "4px",
        color: isCancelled ? "#888" : "#222",
        textDecoration: isCancelled ? "line-through" : "none",
        backgroundColor: isCancelled ? "#f2f2f2" : "#e0f7fa",
        borderRadius: "4px",
        marginBottom: "2px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{timeRange}</div>
      <div>Room {event.room}</div>
      <div>{event.title}</div>
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
  buildings,
  rooms,
  selectedEvent,
  setSelectedEvent,
}) {
  return (
    <main className="page">
      <div className="page-title">
        <h2>My Bookings</h2>
        <p>View your approved bookings in calendar view.</p>
      </div>

      <div className="flex-gap-1">
        <div style={{ height: "80vh", width: "70%" }}>
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
            components={{ event: EventComponent }}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        </div>

        <div>
          <form id="generic-form" onSubmit={onFilterSubmit}>
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
                  <option value="">-- Select Building --</option>
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
                  <option value="">-- Select Room --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <button type="submit" className="primary-btn">
                  Filter
                </button>
              </div>
            </div>
          </form>

          <div id="sched-info-container" className="form-fields">
            {selectedEvent && (
              <>
                <h3>Schedule Details</h3>
                <div className="form-field">
                  <strong>Status:</strong> {selectedEvent.fullData.status}
                </div>
                <div className="form-field">
                  <strong>Date:</strong> {selectedEvent.fullData.date}
                </div>
                <div className="form-field">
                  <strong>Time:</strong> {selectedEvent.fullData.start_time} -{" "}
                  {selectedEvent.fullData.end_time}
                </div>
                <div className="form-field">
                  <strong>Room:</strong> {selectedEvent.fullData.room.number} (
                  {selectedEvent.fullData.room.type})
                </div>

                <h3>Booking Details</h3>
                <div className="form-field">
                  <strong>Status:</strong>{" "}
                  {selectedEvent.fullData.booking.status}
                </div>
                <div className="form-field">
                  <strong>Purpose:</strong>{" "}
                  {selectedEvent.fullData.booking.purpose}
                </div>
                <div className="form-field">
                  <strong>Urgency:</strong>{" "}
                  {selectedEvent.fullData.booking.urgency}
                </div>
                <div className="form-field">
                  <a
                    href={`/bookings/${selectedEvent.fullData.booking.id}`}
                    className="primary-btn"
                  >
                    View Booking Details
                  </a>
                </div>
              </>
            )}
          </div>
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
  });
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const token = sessionStorage.getItem("token");

  const fetchBuildings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/buildings/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setBuildings(data.data);
    } catch (err) {
      console.error("Error fetching buildings:", err);
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
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRooms(data.data.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms by building:", err);
      setRooms([]);
    }
  };

  const fetchBookings = async (date, filters = {}) => {
    const yearMonth = format(date, "yyyy-MM");
    const params = new URLSearchParams({ month: yearMonth });
    if (filters.building) params.append("building_id", filters.building);
    if (filters.room) params.append("room_id", filters.room);

    const endpoint = `/api/schedules/facilitated?${params.toString()}`;

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
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
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchBookings(currentDate);
  }, [currentDate]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
    setFormValues((prev) => ({ ...prev, month: format(newDate, "yyyy-MM") }));
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
    fetchBookings(newDate, formValues);
  };

  return (
    <Home
      events={events}
      localizer={localizer}
      onNavigate={handleNavigate}
      date={currentDate}
      formValues={formValues}
      handleFormChange={handleFormChange}
      onFilterSubmit={handleFilterSubmit}
      buildings={buildings}
      rooms={rooms}
      selectedEvent={selectedEvent}
      setSelectedEvent={setSelectedEvent}
    />
  );
}
