import React from 'react';
import '../styles/Note.css';

function Note({ note, onDelete, onEdit }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <article className="note-container">
      <div className="note-heading">
        <p className="note-title">{note.title}</p>
        <span className="note-date">{formattedDate}</span>
      </div>
      <p className="note-content">{note.content}</p>
      <div className="note-actions">
        <button className="edit-button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default Note;
