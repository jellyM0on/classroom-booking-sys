import { Link } from "react-router-dom";
import { useAuthToken } from "../hooks/useAuthToken";

export default function PageNotFound() {
  const token = useAuthToken();

  return (
    <div className={`not-found-wrapper ${!token ? "center-viewport" : "page"}`}>
      <div className="not-found-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        {!token && (
          <p>
            <Link className="go-back-link" to="/login">← Go back to Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
