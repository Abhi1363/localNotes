import { useState, useEffect } from "react";
import axios from "axios";
import LandingPage from "./pages/LandingPage";
import NotesApp from "./components/NotesApp";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
       
        <Route
          path="/"
          element={!user ? <LandingPage /> : <Navigate to="/notes" />}
        />
      
        <Route
          path="/notes"
          element={user ? <NotesApp user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
