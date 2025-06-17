import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaClock,
  FaDoorOpen,
  FaLayerGroup,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from "react-router-dom";

function FacilitiesAdd({
  facilityType,
  formData,
  fieldErrors,
  buildings,
  loading,
  submitError,
  submitSuccess,
  handleChange,
  handleSubmit,
  setFacilityType,
}) {
  const renderBuildingForm = () => (
    <>
      {["code", "name", "address", "total_floors"].map((field) => (
        <div
          key={field}
          className={`form-field ${fieldErrors[field] ? "error-field" : ""}`}
        >
          <label>
            <span className="th-icon-label">
              {field === "address" ? (
                <FaMapMarkerAlt />
              ) : field === "total_floors" ? (
                <FaLayerGroup />
              ) : (
                <FaBuilding />
              )}{" "}
              {field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </label>
          <input
            type={field === "total_floors" ? "number" : "text"}
            name={field}
            value={formData[field] || ""}
            onChange={handleChange}
            required
          />
          {fieldErrors[field] && (
            <p className="error-msg">{fieldErrors[field]}</p>
          )}
        </div>
      ))}
    </>
  );

  const renderRoomForm = () => (
    <>
      <div
        className={`form-field ${fieldErrors.buildingId ? "error-field" : ""}`}
      >
        <label>
          <span className="th-icon-label">
            <FaBuilding /> Building ID
          </span>
        </label>
        <select
          name="buildingId"
          value={formData.buildingId || ""}
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
        {fieldErrors.buildingId && (
          <p className="error-msg">{fieldErrors.buildingId}</p>
        )}

        <div className="readonly-subfield">
          {(() => {
            const selected =
              buildings.find((b) => b.id === parseInt(formData.buildingId)) ||
              {};
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

      <div className={`form-field ${fieldErrors.number ? "error-field" : ""}`}>
        <label>
          <FaDoorOpen /> Number
        </label>
        <input
          type="text"
          name="number"
          value={formData.number || ""}
          onChange={handleChange}
          required
        />
        {fieldErrors.number && (
          <p className="error-msg">{fieldErrors.number}</p>
        )}
      </div>

      <div className={`form-field ${fieldErrors.type ? "error-field" : ""}`}>
        <label>Type</label>
        <select
          name="type"
          value={formData.type || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="classroom">Classroom</option>
          <option value="science_lab">Science Lab</option>
          <option value="computer_lab">Computer Lab</option>
          <option value="specialty">Specialty</option>
        </select>
        {fieldErrors.type && <p className="error-msg">{fieldErrors.type}</p>}
      </div>

      <div
        className={`form-field ${fieldErrors.open_time ? "error-field" : ""}`}
      >
        <label>
          <FaClock /> Open Time
        </label>
        <input
          type="time"
          name="open_time"
          value={formData.open_time || ""}
          onChange={handleChange}
          required
        />
        {fieldErrors.open_time && (
          <p className="error-msg">{fieldErrors.open_time}</p>
        )}
      </div>

      <div
        className={`form-field ${fieldErrors.close_time ? "error-field" : ""}`}
      >
        <label>
          <FaClock /> Close Time
        </label>
        <input
          type="time"
          name="close_time"
          value={formData.close_time || ""}
          onChange={handleChange}
          required
        />
        {fieldErrors.close_time && (
          <p className="error-msg">{fieldErrors.close_time}</p>
        )}
      </div>

      <div className="form-field">
        <label>Instructions</label>
        <textarea
          name="instructions"
          value={formData.instructions || ""}
          onChange={handleChange}
        />
      </div>
    </>
  );

  return (
    <main className="page">
      <NavLink to="/facilities" className="transparent-btn back-btn">
        <IoIosArrowBack /> Back to Manage Facilities
      </NavLink>

      <div className="page-title">
        <h2>Add Facility</h2>
        <p>Add a building or a room.</p>
      </div>

      <div className="facility-type-selector">
        <label htmlFor="facilityType" className="facility-type-selector-lbl">
          Type
        </label>
        <label>
          <input
            type="radio"
            name="facilityType"
            value="building"
            checked={facilityType === "building"}
            onChange={() => setFacilityType("building")}
          />{" "}
          Building
        </label>
        <label>
          <input
            type="radio"
            name="facilityType"
            value="room"
            checked={facilityType === "room"}
            onChange={() => setFacilityType("room")}
          />{" "}
          Room
        </label>
      </div>

      <form onSubmit={handleSubmit} id="generic-form">
        <div className="form-fields">
          {facilityType === "building"
            ? renderBuildingForm()
            : renderRoomForm()}
        </div>

        {submitError && <p className="error-msg">{submitError}</p>}
        {submitSuccess && (
          <p className="success-msg">Facility added successfully!</p>
        )}

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : `Add ${facilityType === "building" ? "Building" : "Room"}`}
        </button>
      </form>
    </main>
  );
}

export default function FacilitiesAddContainer() {
  const [facilityType, setFacilityType] = useState("building");
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    if (facilityType === "room") {
      fetchBuildings();
    }
    setFormData({});
    setFieldErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
  }, [facilityType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);

    const token = sessionStorage.getItem("token");

    const endpoint =
      facilityType === "building"
        ? "http://localhost:3000/api/buildings/admin"
        : "http://localhost:3000/api/rooms/admin";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
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
          setSubmitError(data?.message || "Submission failed");
        }
        return;
      }

      setSubmitSuccess(true);
      setFormData({});
    } catch (err) {
      setSubmitError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacilitiesAdd
      facilityType={facilityType}
      formData={formData}
      fieldErrors={fieldErrors}
      buildings={buildings}
      loading={loading}
      submitError={submitError}
      submitSuccess={submitSuccess}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setFacilityType={setFacilityType}
    />
  );
}
