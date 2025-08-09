# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import re
from collections import Counter

app = FastAPI(title="Notes API")

# Allow requests from the frontend (Next.js default port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change to ["*"] for easier dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteIn(BaseModel):
    content: str

class NoteOut(BaseModel):
    id: int
    content: str
    created_at: str

# In-memory store (simple). For persistence use SQLite (instructions later).
notes = []
_next_id = 1

@app.post("/notes", response_model=NoteOut, status_code=201)
def create_note(note: NoteIn):
    global _next_id
    record = {"id": _next_id, "content": note.content.strip(), "created_at": datetime.utcnow().isoformat()}
    notes.insert(0, record)  # newest first
    _next_id += 1
    return record

@app.get("/notes", response_model=List[NoteOut])
def list_notes():
    return notes

@app.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int):
    global notes
    before = len(notes)
    notes = [n for n in notes if n["id"] != note_id]
    if len(notes) == before:
        raise HTTPException(status_code=404, detail="Note not found")
    return

# Simple frequency-based summarizer (no external APIs)
def simple_summary(text: str, max_sentences: int = 3) -> str:
    if not text.strip():
        return ""
    # split into sentences (naive)
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    if len(sentences) <= max_sentences:
        return " ".join(sentences)
    # build frequency of words (basic)
    words = re.findall(r"\w+", text.lower())
    stopwords = {
        "the","and","is","in","it","to","a","of","for","on","that","this","with","as","are","was","be","I","you"
    }
    freq = Counter(w for w in words if w not in stopwords)
    # score sentences
    def score(s):
        s_words = re.findall(r"\w+", s.lower())
        return sum(freq.get(w, 0) for w in s_words)
    ranked = sorted(sentences, key=score, reverse=True)
    best = ranked[:max_sentences]
    # preserve original order of chosen sentences
    chosen = [s for s in sentences if s in best]
    return " ".join(chosen[:max_sentences])

@app.get("/summary")
def get_summary():
    combined = " ".join([n["content"] for n in notes])
    summary = simple_summary(combined, max_sentences=3)
    return {"summary": summary}
