import { useState, useEffect } from "react";

export default function Home() {
  // State
  const [noteText, setNoteText] = useState("");      // For new note input
  const [notes, setNotes] = useState([]);           // For list of notes
  const [summary, setSummary] = useState("");        // For the AI summary
  const [loading, setLoading] = useState(false);     // For loading indicators
  const [error, setError] = useState("");            // For errors

  // Fetch all notes when page loads
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8000/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new note
  const handleSave = async () => {
    if (!noteText.trim()) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteText }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      const newNote = await res.json();
      setNotes([newNote, ...notes]);  // Show new note at top
      setNoteText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      // Remove from UI
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get summary
  const handleGetSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8000/summary");
      if (!res.ok) throw new Error("Failed to get summary");
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 600, margin: "40px auto", background: "#f9f9f9",
      borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 24
    }}>
      <h1 >Simple Notes App</h1>
      <div style={{ marginBottom: 18 }}>
        <textarea
          rows={3}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Write a note..."
          style={{
            width: "100%", fontSize: 16, padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 10,color:"#111"
          }}
        />
        <br />
        <button
          onClick={handleSave}
          disabled={loading || !noteText.trim()}
          style={{
            padding: "8px 16px", background: "#2563eb",
            color: "white", fontWeight: "bold", border: "none", borderRadius: 4,
            cursor: "pointer"
          }}>
          Save
        </button>
      </div>

      <div>
        <h2 style={{ color: "#111" }}>Notes</h2>
        {loading && <p>Loading...</p>}
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map(note => (
          <div key={note.id}
            style={{
              display: "flex", alignItems: "center", marginBottom: 10,
              background: "#fff", borderRadius: 4, padding: "8px 12px", boxShadow: "0 1px 3px #0001"
            }}>
            <div style={{ flex: 1 ,color: "#111"}}>{note.content}</div>
            <button
              onClick={() => handleDelete(note.id)}
              style={{
                marginLeft: 12, background: "#e11d48", color: "white", border: "none", borderRadius: 3,
                padding: "4px 10px", cursor: "pointer"
              }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleGetSummary}
          disabled={loading || notes.length === 0}
          style={{
            padding: "8px 16px", background: "#059669",
            color: "white", fontWeight: "bold", border: "none", borderRadius: 4,
            cursor: "pointer"
          }}>
          Get Summary
        </button>
        {summary && (
          <div style={{
            marginTop: 12, background: "#e0f7fa", borderRadius: 4, padding: 10,
            fontStyle: "italic",color:"#111"
          }}>
            <b>Summary:</b> {summary}
          </div>
        )}
      </div>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}
