![IMG-20250809-WA0018](https://github.com/user-attachments/assets/689ac2f6-9ca5-48be-a937-c9d88854f661)# 📝 Simple Notes App

A **full-stack notes application** built with:
- **Frontend:** Next.js (React)
- **Backend:** FastAPI (Python)
- **Database:** In-memory (can be extended to DB later)

## 📌 Features
- ➕ Add notes
- 🗑️ Delete notes
- 📄 View all notes
- 🤖 Get AI-generated summary of notes
- ⚡ Fast, responsive UI

---

## 📂 Project Structure
---

## 🚀 Setup & Run Locally

### 1️⃣ Clone the Repo
git clone https://github.com/raghulraj-m/Simple-Notes.git
---

### 2️⃣ Run the Backend (FastAPI)
cd notes-backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
Backend will run at: [**http://localhost:8000**](http://localhost:8000)

---

### 3️⃣ Run the Frontend (Next.js)
Open a new terminal: back to root dictory
cd notes-frontend
npm install
npm run dev
Frontend will run at: [**http://localhost:3000**](http://localhost:3000)

---

## 🔗 API Endpoints
- `GET /notes` → Get all notes
- `POST /notes` → Add new note (`{ "content": "your note" }`)
- `DELETE /notes/{id}` → Delete a note
- `GET /summary` → Get AI summary of notes

---

## 🖥️ Technologies Used
- **Frontend:** Next.js, React
- **Backend:** FastAPI, Python
- **Styling:** CSS / Tailwind
- **API Testing:** Swagger UI (`http://localhost:8000/docs`)

---

## 📜 License
This project is open-source. Feel free to fork and improve it. 🚀



