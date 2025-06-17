import { useEffect, useState } from "react";
import { FaBuilding, FaClock, FaDoorOpen } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function RoomDetail({
  room,
  loading,
  error,
  editMode,
  formData,
  fieldErrors,
  handleChange,
  handleSubmit,
  handleToggleEdit,
  buildings,
}) {
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!room) return <p>No room found.</p>;

  return (
    <main className="page">
      <NavLink
        to={`/facilities/${room.buildingId}`}
        className="transparent-btn back-btn"
      >
        <IoIosArrowBack />
        Back to Facility Detail
      </NavLink>

      <div className="page-title">
        <h2>
          Room Detail <span>ID: {room.id}</span>
        </h2>
        <p>Manage room details here.</p>
      </div>

      {loading && <LoadingSpinner />}

      <form onSubmit={editMode ? handleSubmit : undefined} id="generic-form">
        <div className="form-fields">
          <div
            className={`form-field ${
              fieldErrors.buildingId ? "error-field" : ""
            }`}
          >
            <label>
              <span className="th-icon-label">
                <FaBuilding /> Building ID
              </span>
            </label>
            {editMode ? (
              <>
                <select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select building</option>
                  {buildings.map((bldg) => (
                    <option key={bldg.id} value={bldg.id}>
                      {bldg.code} - {bldg.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.buildingId && (
                  <p className="error-msg">{fieldErrors.buildingId}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">{room.buildingId}</div>
            )}

            <div className="readonly-subfield">
              {(() => {
                const selected =
                  buildings.find(
                    (b) =>
                      b.id ===
                      parseInt(editMode ? formData.buildingId : room.buildingId)
                  ) || {};
                return (
                  <div className="room-detail-bldg-info">
                    <p>
                      <strong>Code:</strong> {selected.code || "—"}
                    </p>
                    <p>
                      <strong>Name:</strong> {selected.name || "—"}
                    </p>
                    <p>
                      <strong>Address:</strong> {selected.address || "—"}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          <div
            className={`form-field ${fieldErrors.number ? "error-field" : ""}`}
          >
            <label>
              <span className="th-icon-label">
                <FaDoorOpen /> Number
              </span>
            </label>
            {editMode ? (
              <>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.number && (
                  <p className="error-msg">{fieldErrors.number}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">{room.number}</div>
            )}
          </div>

          <div
            className={`form-field ${fieldErrors.type ? "error-field" : ""}`}
          >
            <label>Type</label>
            {editMode ? (
              <>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="classroom">Classroom</option>
                  <option value="science_lab">Science Lab</option>
                  <option value="computer_lab">Computer Lab</option>
                  <option value="specialty">Specialty</option>
                </select>
                {fieldErrors.type && (
                  <p className="error-msg">{fieldErrors.type}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">{room.type}</div>
            )}
          </div>

          <div
            className={`form-field ${
              fieldErrors.open_time ? "error-field" : ""
            }`}
          >
            <label>
              <FaClock /> Open Time
            </label>
            {editMode ? (
              <>
                <input
                  type="time"
                  name="open_time"
                  value={formData.open_time}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.open_time && (
                  <p className="error-msg">{fieldErrors.open_time}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">{room.open_time}</div>
            )}
          </div>

          <div
            className={`form-field ${
              fieldErrors.close_time ? "error-field" : ""
            }`}
          >
            <label>
              <FaClock /> Close Time
            </label>
            {editMode ? (
              <>
                <input
                  type="time"
                  name="close_time"
                  value={formData.close_time}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.close_time && (
                  <p className="error-msg">{fieldErrors.close_time}</p>
                )}
              </>
            ) : (
              <div className="readonly-field">{room.close_time}</div>
            )}
          </div>

          <div className="form-field">
            <label>Instructions</label>
            {editMode ? (
              <textarea
                name="instructions"
                value={formData.instructions || ""}
                onChange={handleChange}
              />
            ) : (
              <div className="readonly-field">{room.instructions || "—"}</div>
            )}
          </div>

          <div className="form-field">
            <label>Created At</label>
            <div className="readonly-field">{room.createdAt}</div>
          </div>

          <div className="form-field">
            <label>Updated At</label>
            <div className="readonly-field">{room.updatedAt}</div>
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
          <button
            className="submit-btn"
            type="button"
            onClick={handleToggleEdit}
          >
            Edit Room
          </button>
        )}
      </form>
    </main>
  );
}

export default function RoomDetailContainer() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    buildingId: "",
    number: "",
    type: "",
    open_time: "",
    close_time: "",
    instructions: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [buildings, setBuildings] = useState([]);

  const fetchRoom = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/rooms/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Room not found");

      const { data } = await res.json();
      setRoom(data);

      const initial = {
        buildingId: data.buildingId,
        number: data.number,
        type: data.type,
        open_time: data.open_time,
        close_time: data.close_time,
        instructions: data.instructions || "",
      };

      setFormData(initial);
      setInitialData(initial);
    } catch (err) {
      setError(err.message || "Error fetching room");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchRoom();
    fetchBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleEdit = () => {
    if (editMode && initialData) {
      setFormData(initialData);
    }
    setFieldErrors({});
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/rooms/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const formatted = {};
          for (const err of data.errors) {
            formatted[err.path] = err.message;
          }
          setFieldErrors(formatted);
        } else {
          setError(data?.message || "Update failed");
        }
        return;
      }

      setRoom(data);
      setEditMode(false);
      setFieldErrors({});
      setInitialData({ ...formData });
    } catch (err) {
      setError(err.message || "Update error");
    }
  };

  return (
    <RoomDetail
      room={room}
      loading={loading}
      error={error}
      editMode={editMode}
      formData={formData}
      fieldErrors={fieldErrors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleToggleEdit={handleToggleEdit}
      buildings={buildings}
    />
  );
}
