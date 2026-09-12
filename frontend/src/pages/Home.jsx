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
      <header className="app-header">
        <div className="brand"><div className="brand-mark" aria-hidden="true">W</div><div><p className="brand-name">WickMagic</p><span>Your personal workspace</span></div></div>
        <button 
          onClick={() => navigate("/logout")}
          className="logout-button"
        >
          Logout
        </button>
      </header>

      <section className="page-intro"><div><p className="eyebrow">Your notes</p><h1>Everything on your mind.</h1><p>Keep ideas, reminders, and plans collected in a private space.</p></div><button className="primary-button" onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}>{showForm ? "Cancel" : "+ New note"}</button></section>

      {showForm && (
        <div className="form-card">
          <div className="form-card-heading"><h2>{editingNoteId ? "Edit note" : "Create a note"}</h2><p>{editingNoteId ? "Make your changes, then save when you’re ready." : "A clear title makes it easier to find later."}</p></div>
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

            <button className="primary-button" type="submit">{editingNoteId ? "Save changes" : "Create note"}</button>
          </form>
        </div>
      )}
      
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



    </div>
  );
}

export default Home;
