import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { useAuthToken } from "./hooks/useAuthToken";
import Home from "./pages/Home";
import Login from "./pages/Login";

// TODO: Replace placeholder code

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

function App() {
  const [loading, setLoading] = useState(true);
  const token = useAuthToken(setLoading);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Login />} />

        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
