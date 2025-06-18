import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuthToken } from "./hooks/useAuthToken";
import DepartmentsContainer from "./pages/DepartmentManagement";
import FacilityDetailContainer from "./pages/FacilityDetail";
import FacilityManagementContainer from "./pages/FacilityManagement";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserRegistrationContainer from "./pages/Registration";
import RoomDetailContainer from "./pages/RoomDetail";
import UserDetail from "./pages/UserDetail";
import UserManagementContainer from "./pages/UserManagement";
import FacilitiesAddContainer from "./pages/FacilitiesAdd"

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const token = useAuthToken(setLoading);
  const location = useLocation();

  if (loading) {
  return (
    <div className="fullscreen-spinner">
      <LoadingSpinner />
    </div>
  );
}


  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const token = useAuthToken(setLoading);

  if (loading) {
  return (
    <div className="fullscreen-spinner">
      <LoadingSpinner />
    </div>
  );
}

  return (
    <>
      <Header />
      {token && <Navigation />}
      <Routes>
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route
          path="/users/register"
          element={
            <ProtectedRoute>
              <UserRegistrationContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagementContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/departments"
          element={
            <ProtectedRoute>
              <DepartmentsContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities"
          element={
            <ProtectedRoute>
              <FacilityManagementContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/:id"
          element={
            <ProtectedRoute>
              <FacilityDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute>
              <RoomDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/add"
          element={
            <ProtectedRoute>
              <FacilitiesAddContainer/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
