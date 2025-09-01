import { useState, useEffect } from "react";
import axios from "axios";
import "./NoteApp.css";
import logo from "../assets/logo.png";

export default function NotesApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  // Get API URL from env
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch user
  useEffect(() => {
    axios
      .get(`${API_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => window.location.replace("/"))
      .finally(() => setLoading(false));
  }, [API_URL]);

  // Fetch notes
useEffect(() => {
  if (!user) return; // <-- prevents unnecessary fetch
  axios
    .get(`${API_URL}/notes`, { withCredentials: true })
    .then(res => setNotes(res.data))
    .catch(err => console.error(err));
}, [user, API_URL]);


  // Add note
  const addNote = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/notes`, { text: input }, { withCredentials: true });
      setNotes([res.data, ...notes]);
      setInput("");
    } catch (err) {
      console.error("Error adding note:", err.message);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`, { withCredentials: true });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err.message);
    }
  };


const handleLogout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return; 

  try {
   await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });;
    setUser(null);
    window.location.href = "/"; // redirect manually
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed. Please try again.");
  }
};




  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <nav className="navbar">
        <div className="logo" style={{ display: "flex", alignItems: "center" }}>
          <img className="logoname" src={logo} alt="App Logo" />
          noteIT
        </div>

        {user && (
          <div className="user-info">
            <span>Welcome {user.displayName}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="container">
        <div className="header">
          <h1>Lets noteIT..!</h1>
        </div>

        <div className="input-section">
          <textarea
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your note..."
          />
          <button onClick={addNote}>Add</button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="notes-list">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div className="note-card" key={note._id}>
                <p className="note-text">{highlightText(note.text, search)}</p>
                <small className="note-date">
                  {new Date(note.date).toLocaleString()}
                </small>
                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note._id)}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="empty">No notes found...</p>
          )}
        </div>
      </div>
    </>
  );
}
