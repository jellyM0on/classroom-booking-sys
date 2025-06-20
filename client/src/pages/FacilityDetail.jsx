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
import FloatingErrorMessage from "../components/FloatingErrorMessage";
import FloatingSuccessMessage from "../components/FloatingSuccessMessage";
import GenericChip from "../components/GenericChip";
import LoadingSpinner from "../components/LoadingSpinner";
import NoDataFound from "../components/NoDataFound";
import formatDate from "../utils/formatDate";
import formatTime from "../utils/formatTime";

function FacilityDetail({
  building,
  loading,
  editMode,
  formData,
  fieldErrors,
  handleChange,
  handleSubmit,
  handleToggleEdit,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sortOrder,
  setSortOrder,
}) {
  const navigate = useNavigate();

  const formatRoomType = (type) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <main className="page">
      <NavLink to="/facilities" className="transparent-btn back-btn">
        <IoIosArrowBack />
        Go to Manage Facilities
      </NavLink>

      <div className="page-title">
        <div className="flex-gap-1">
          <h2>Facility Detail</h2>
          <GenericChip label={`ID: ${building?.id}`} />
        </div>

        <p>Manage facility details here.</p>
      </div>

      {!building && !loading && <NoDataFound />}

      {loading && <LoadingSpinner />}

      {building && !loading && (
        <>
          <form
            onSubmit={editMode ? handleSubmit : undefined}
            id="generic-form"
          >
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
                <div className="readonly-field">
                  {formatDate(building.createdAt)}
                </div>
              </div>

              <div className="form-field">
                <label>Updated At</label>
                <div className="readonly-field">
                  {formatDate(building.updatedAt)}
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
              <input
                type="text"
                placeholder="Search Code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="flex-gap-1 flex-align">
              <p>FILTER</p>
              <div className="filter-controls">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="classroom">Classroom</option>
                  <option value="comp_lab">Computer Lab</option>
                  <option value="science_lab">Science Lab</option>
                  <option value="specialty">Specialty</option>
                </select>
              </div>
            </div>
            <div className="flex-gap-1 flex-align">
              <p>SORT</p>
              <div className="filter-controls">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && building?.rooms?.length > 0 && (
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
              {building.rooms
                ?.filter((room) => {
                  const matchesSearch = room.number
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                  const matchesType =
                    !typeFilter ||
                    room.type.toLowerCase() === typeFilter.toLowerCase();
                  return matchesSearch && matchesType;
                })
                .sort((a, b) => {
                  if (sortOrder === "asc") return a.number - b.number;
                  else return b.number - a.number;
                })
                .map((room) => (
                  <tr
                    key={room.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <td>{room.id}</td>
                    <td>
                      <GenericChip label={room.number} />
                    </td>
                    <td>{formatRoomType(room.type)}</td>
                    <td>{formatTime(room.open_time)}</td>
                    <td>{formatTime(room.close_time)}</td>
                    <td>{formatDate(room.createdAt)}</td>
                    <td>{formatDate(room.updatedAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (!building.rooms || building.rooms.length === 0) && (
        <NoDataFound />
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
  const [error, setError] = useState({ message: "", timestamp: null });
  const [success, setSuccess] = useState({ message: "", timestamp: null });
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
      setError({
        message: err.message || "Error fetching building",
        timestamp: Date.now(),
      });
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
          setError({
            message: "Update failed",
            timestamp: Date.now(),
          });
        } else {
          setError({ message: "Error submitting", timestamp: Date.now() });
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
      setSuccess({
        message: "Facility updated successfully!",
        timestamp: Date.now(),
      });
    } catch (err) {
      setError({
        message: err.message || "Error submitting",
        timestamp: Date.now(),
      });
    }
  };

  return (
    <>
      {error?.message && (
        <FloatingErrorMessage key={error.timestamp} message={error.message} />
      )}

      {success?.message && (
        <FloatingSuccessMessage
          key={success.timestamp}
          message={success.message}
        />
      )}

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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </>
  );
}
