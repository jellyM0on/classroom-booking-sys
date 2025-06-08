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
import { useAuthToken } from "./hooks/useAuthToken";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistrationContainer from "./pages/Registration";
import UserDetail from "./pages/UserDetail";
import UserManagementContainer from "./pages/UserManagement";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const token = useAuthToken(setLoading);
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
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
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      {token && <Navigation />}
      <Routes>
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <RegistrationContainer />
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
