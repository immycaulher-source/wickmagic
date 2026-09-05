import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added useNavigate
import api from "../api";
import Note from '../components/Note';
import '../styles/Home.css';
import { toast } from "react-hot-toast";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Track which note is currently being edited (null when creating)
  const [editingNoteId, setEditingNoteId] = useState(null);

  const navigate = useNavigate(); // Navigation hook for logout

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => setNotes(data))
      .catch((err) => toast.error(err.message || "Failed to load notes"));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) toast.success("Note Deleted!");
        else toast.error("Failed to delete note.");
        getNotes();
      })
      .catch((error) => toast.error("Error deleting note: " + error.message));
  };

  // Populate form with existing note data
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  };

  // Reset form state
  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNoteId(null);
    setShowForm(false);
  };

  // Handle both Create and Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingNoteId) {
      // UPDATE existing note
      api
        .patch(`/api/notes/update/${editingNoteId}/`, { title, content })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Note Updated!");
            resetForm();
            getNotes();
          } else {
            toast.error("Failed to update note.");
          }
        })
        .catch((error) => toast.error("Error updating note: " + error.message));
    } else {
      // CREATE new note
      api
        .post("/api/notes/", { content, title })
        .then((res) => {
          if (res.status === 201) {
            toast.success("Note Created!");
            resetForm();
            getNotes();
          } else {
            toast.error("Failed to create note.");
          }
        })
        .catch((error) => toast.error("Error creating note: " + error.message));
    }
  };

  return (
    <div className="home-container">
      {/* Top Header with Title and Logout Button */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 0",
        marginBottom: "1.5rem",
        borderBottom: "1px solid #eee"
      }}>
        <h1 style={{ margin: 0 }}>WickMagic Notes</h1>
        <button 
          onClick={() => navigate("/logout")}
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </header>

      <h2>Notes</h2>

      <div className="notes-section">
        {notes.length === 0 ? (
          <p className="no-notes">No notes available. Create one below!</p>
        ) : (
          notes.map((note) => (
            <Note 
              note={note} 
              onDelete={deleteNote} 
              onEdit={startEditing} 
              key={note.id} 
            />
          ))
        )}
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingNoteId ? "Edit Note" : "Create a Note"}</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <input 
              type="submit" 
              value={editingNoteId ? "Update Note" : "Submit"} 
            />
          </form>
        </div>
      )}

      <div className="bottom-btn-container">
        <button 
          className="submit-btn-style" 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Create New Note"}
        </button>
      </div>
    </div>
  );
}

export default Home;