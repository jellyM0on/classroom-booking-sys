import { useEffect, useState } from "react";
import { BsBuildingFillAdd } from "react-icons/bs";
import {
  FaBuilding,
  FaDoorOpen,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdNumbers } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function FacilityDetail({
  building,
  loading,
  error,
  editMode,
  formData,
  fieldErrors,
  handleChange,
  handleSubmit,
  handleToggleEdit,
}) {
  const navigate = useNavigate();

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!building) return <p>No facility found.</p>;

  return (
    <main className="page">
      <NavLink to="/facilities" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Back to Manage Facilities
      </NavLink>

      <div className="page-title">
        <h2>
          Facility Detail <span>ID: {building.id}</span>
        </h2>
        <p>Manage facility details here.</p>
      </div>

      {loading && <LoadingSpinner />}

      <form onSubmit={editMode ? handleSubmit : undefined} id="generic-form">
        <div className="form-fields">
          {["code", "name", "address", "total_floors"].map((field) => (
            <div
              key={field}
              className={`form-field ${
                fieldErrors[field] ? "error-field" : ""
              }`}
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
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </label>
              {editMode ? (
                <>
                  <input
                    type={field === "total_floors" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors[field] && (
                    <p className="error-msg">{fieldErrors[field]}</p>
                  )}
                </>
              ) : (
                <div className="readonly-field">{building[field]}</div>
              )}
            </div>
          ))}

          <div className="form-field">
            <label>Created At</label>
            <div className="readonly-field">{building.createdAt}</div>
          </div>

          <div className="form-field">
            <label>Updated At</label>
            <div className="readonly-field">{building.updatedAt}</div>
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
            Edit Facility
          </button>
        )}
      </form>

      {/* ROOMS SECTION */}
      <div className="page-title" style={{ marginTop: "3rem" }}>
        <h2>Facility Rooms</h2>
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
        <p>FILTER</p>
        <div></div>
      </div>

      {!loading && !error && building?.rooms?.length > 0 && (
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
                    <FaDoorOpen /> Number
                  </span>
                </th>
                <th>
                  <span className="th-icon-label">Type</span>
                </th>
                <th>
                  <span className="th-icon-label">Open Time</span>
                </th>
                <th>
                  <span className="th-icon-label">Close Time</span>
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
              {building.rooms.map((room) => (
                <tr
                  key={room.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <td>{room.id}</td>
                  <td>{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.open_time}</td>
                  <td>{room.close_time}</td>
                  <td>{new Date(room.createdAt).toLocaleString()}</td>
                  <td>{new Date(room.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading &&
        !error &&
        (!building.rooms || building.rooms.length === 0) && (
          <p>No rooms found.</p>
        )}
    </main>
  );
}

export default function FacilityDetailContainer() {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    total_floors: "",
  });
  const [initialData, setInitialData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchBuilding = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:3000/api/buildings/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Facility not found");

      const { data } = await res.json();
      setBuilding(data);

      const initial = {
        code: data.code || "",
        name: data.name || "",
        address: data.address || "",
        total_floors: data.total_floors || "",
      };

      setFormData(initial);
      setInitialData(initial);
    } catch (err) {
      setError(err.message || "Error fetching facility");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilding();
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

    const payload = {
      code: formData.code,
      name: formData.name,
      address: formData.address,
      total_floors: parseInt(formData.total_floors, 10),
    };

    try {
      const res = await fetch(
        `http://localhost:3000/api/buildings/admin/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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

      setBuilding(data);
      setInitialData({
        code: data.code,
        name: data.name,
        address: data.address,
        total_floors: data.total_floors,
      });
      setEditMode(false);
      setFieldErrors({});
    } catch (err) {
      setError(err.message || "Update error");
    }
  };

  return (
    <FacilityDetail
      building={building}
      loading={loading}
      error={error}
      editMode={editMode}
      formData={formData}
      fieldErrors={fieldErrors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleToggleEdit={handleToggleEdit}
    />
  );
}
