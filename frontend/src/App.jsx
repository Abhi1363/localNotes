import { useState, useEffect } from "react";
import axios from "axios";
import LandingPage from "./pages/LandingPage";
import NotesApp from "./components/NotesApp";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); 
  }, [API_URL]);

  if (loading) return <div>Loading...</div>; 

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/notes" replace /> : <LandingPage />}
        />
        <Route
          path="/notes"
          element={user ? <NotesApp user={user} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
