import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Notes.css";

export default function NotesPage() {
  const [state, setState] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("focus_mobile_v4")) || {
        folders: ["General", "Work", "Logs", "Vault"],
        notes: [],
        activeFolder: "General",
        activeNoteId: null,
      }
    );
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("focus_mobile_v4", JSON.stringify(state));
  }, [state]);

  const activeNote = state.notes.find((n) => n.id === state.activeNoteId);

  const filteredNotes = state.notes.filter(
    (n) =>
      n.folder === state.activeFolder &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase()))
  );

  const createNewNote = () => {
    const id = Date.now();
    const newNote = { id, title: "", body: "", folder: state.activeFolder };

    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      activeNoteId: id,
    }));
  };

  const updateNote = (field, value) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === prev.activeNoteId ? { ...n, [field]: value } : n
      ),
    }));
  };

  const deleteNote = () => {
    if (!window.confirm("Execute Wipe Protocol for this entry?")) return;

    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== prev.activeNoteId),
      activeNoteId: null,
    }));
  };

  return (
    <div className="flex h-screen bg-[#080808] text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Sidebar */}
      {/* Sidebar */}
      {/* Sidebar */}
      <aside className="w-[110px] bg-[#050505] border-r border-white/5 flex flex-col pt-[40px] pb-[20px] z-20 sidebar-container">
        <Link to="/" className="home-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-home-svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </Link>

        <div className="flex-1 flex flex-col">
          {state.folders.map((f) => (
            <div
              key={f}
              onClick={() => setState((prev) => ({ ...prev, activeFolder: f }))}
              className={`folder-item ${state.activeFolder === f ? "active" : ""}`}
            >
              {state.activeFolder === f && <span className="active-indicator" />}
              <span className="folder-label">{f}</span>
            </div>
          ))}
        </div>

        {/* Optional: System status at bottom for detail */}
        <div className="px-5 opacity-10 text-[7px] uppercase tracking-[2px] mt-auto">
          v.4.0
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 relative flex flex-col bg-[#080808]">
        <header className="pt-12">
          <h1 className="px-7 text-[10px] text-zinc-700 tracking-[0.5em] uppercase mb-5">
            {state.activeFolder}
          </h1>

          <input
            type="text"
            placeholder="Filter_Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 px-[14px] py-[14px] mx-[25px] mb-[25px] text-[10px] text-[#b3a577] uppercase tracking-[1px] outline-none w-[calc(100%-50px)]"
          />
        </header>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto pb-24">
          {filteredNotes.length ? (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                onClick={() => setState((prev) => ({ ...prev, activeNoteId: n.id }))}
                className="px-[25px] py-[25px] border-b border-white/5 cursor-pointer"
              >
                <span className="block text-[12px] font-extrabold uppercase mb-[8px]">
                  {n.title || "Untitled_Entry"}
                </span>
                <span className="block text-[10px] text-[#444] uppercase">
                  {n.body.substring(0, 45) || "// Empty_Data_Stream"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-20 text-[9px] text-zinc-900 text-center uppercase tracking-[0.4em]">
              No_Records_Found
            </div>
          )}
        </div>

        {/* FAB */}
        <button
          onClick={createNewNote}
          className="fixed bottom-[35px] right-[25px] w-[55px] h-[55px] bg-[#b3a577] text-black rounded-full flex items-center justify-center text-[20px] font-extrabold shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-30"
        >
          +
        </button>

        {/* Editor */}
        <div
          className={`absolute inset-0 bg-[#080808] flex flex-col z-20 transition-transform duration-500 ${activeNote ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6 border-b border-white/5 flex justify-between bg-[#050505]">
            <button
              onClick={() => setState((prev) => ({ ...prev, activeNoteId: null }))}
              className="text-[#b3a577] text-[10px] uppercase font-bold tracking-[0.2em]"
            >
              {'<< Back'}
            </button>

            <button onClick={deleteNote} className="text-red-900 text-[10px] uppercase font-bold">
              Purge
            </button>
          </div>

          {activeNote && (
            <>
              <input
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="ENTRY_TITLE"
                className="bg-transparent border-none outline-none w-full text-white text-[24px] font-black uppercase tracking-[-1px] px-[30px] pt-[40px] pb-[15px]"
              />

              <div className="h-[1px] mx-[30px] mb-[25px] opacity-60 bg-gradient-to-r from-white/10 to-transparent" />

              <textarea
                value={activeNote.body}
                onChange={(e) => updateNote("body", e.target.value)}
                placeholder="// Thought_Stream_Active..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-[#888] text-[15px] leading-[2] px-[30px] pb-[40px]"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}