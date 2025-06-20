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
import LoadingSpinner from "./components/LoadingSpinner";
import Navigation from "./components/Navigation";
import { useAuthToken } from "./hooks/useAuthToken";
import BookingDetailContainer from "./pages/BookingDetail";
import BookingManagementContainer from "./pages/BookingManagement";
import BookingsAddContainer from "./pages/BookingsAdd";
import DepartmentsContainer from "./pages/DepartmentManagement";
import FacilitiesAddContainer from "./pages/FacilitiesAdd";
import FacilityDetailContainer from "./pages/FacilityDetail";
import FacilityManagementContainer from "./pages/FacilityManagement";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import UserRegistrationContainer from "./pages/Registration";
import RoomDetailContainer from "./pages/RoomDetail";
import UserDetail from "./pages/UserDetail";
import UserManagementContainer from "./pages/UserManagement";

function ProtectedRoute({ children, requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const token = useAuthToken(setLoading);
  const location = useLocation();
  const role = sessionStorage.getItem("role");

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

  if (requireAdmin && role !== "admin") {
    return <PageNotFound />;
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
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route
          path="/users/register"
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserRegistrationContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagementContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/departments"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DepartmentsContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities"
          element={
            <ProtectedRoute requireAdmin={true}>
              <FacilityManagementContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <FacilityDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <RoomDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities/add"
          element={
            <ProtectedRoute requireAdmin={true}>
              <FacilitiesAddContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingManagementContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-booking"
          element={
            <ProtectedRoute>
              <BookingsAddContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={token ? "/home" : "/login"} replace />}
        />
        <Route path="*" element={<PageNotFound />} />
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
