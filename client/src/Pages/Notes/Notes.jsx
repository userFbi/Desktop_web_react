import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import "./Notes.css";

const API = "http://localhost:5000/notes";

export default function NotesPage() {
  const [state, setState] = useState({
    folders: ["Work", "Logs", "Vault"],
    notes: [],
    activeFolder: "Work",
    activeNoteId: null,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(res => {
        setState(prev => ({
          ...prev,
          notes: res.data
        }));
      });
  }, []);

  const activeNote = state.notes.find((n) => n._id === state.activeNoteId);

  const filteredNotes = state.notes.filter(
    (n) =>
      n.folder === state.activeFolder &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase()))
  );

  const createNewNote = async () => {
    const newNote = {
      title: "",
      body: "",
      folder: state.activeFolder
    };

    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote)
    });

    const data = await res.json();

    setState(prev => ({
      ...prev,
      notes: [data.data, ...prev.notes],
      activeNoteId: data.data._id
    }));
  };

  const updateNote = async (field, value) => {
    const note = state.notes.find(n => n._id === state.activeNoteId);

    const updatedNote = { ...note, [field]: value };

    // UI update instantly
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n =>
        n._id === note._id ? updatedNote : n
      )
    }));

    // backend update
    await fetch(`${API}/update/${note._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote)
    });
  };

  const deleteNote = async () => {
    if (!window.confirm("Execute Wipe Protocol?")) return;

    await fetch(`${API}/delete/${state.activeNoteId}`, {
      method: "DELETE"
    });

    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n._id !== prev.activeNoteId),
      activeNoteId: null
    }));
  };

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden flex-col md:flex-row" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Sidebar - Desktop: Left Rail | Mobile: Bottom Tab Bar */}
      <aside className="fixed bottom-0 left-0 w-full h-[65px] md:relative md:h-full md:w-[120px] bg-[#050505] border-t md:border-t-0 md:border-r border-white/5 flex flex-row md:flex-col z-30">

        {/* Minimal Top Logo Area */}
        <div className="hidden md:flex flex-col items-center pt-8 pb-6 mb-4">
          <Link to="/" className="text-white-500 hover:text-[#b3a577] transition-colors">
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* Folders List - Aligned to the right edge */}
        <div className="flex-1 flex flex-row md:flex-col w-full justify-around md:justify-start">
          {state.folders.map((f) => (
            <div
              key={f}
              onClick={() => setState((prev) => ({ ...prev, activeFolder: f }))}
              className={`relative flex items-center justify-center md:justify-end px-4 md:px-6 py-4 md:py-3 cursor-pointer transition-all group ${state.activeFolder === f ? "text-[#b3a577]" : "text-zinc-700 hover:text-zinc-400"
                }`}
            >
              {/* Selection Indicator - Now on the Right side to hug the content area */}
              {state.activeFolder === f && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] md:bottom-auto md:top-0 md:right-0 md:left-auto md:h-full md:w-[2px] bg-[#b3a577] shadow-[0_0_8px_#b3a577]" />
              )}

              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[1px] md:tracking-[2px] transition-all group-hover:translate-x-[-2px]">
                {f}
              </span>
            </div>
          ))}
        </div>


      </aside>

      {/* Main List Area */}
      <div className="flex-1 relative flex flex-col bg-[#080808] w-full">
        <header className="pt-8 md:pt-12">
          <h1 className="px-6 md:px-7 text-[10px] text-white-400 tracking-[0.5em] uppercase mb-4 md:mb-5">
            {state.activeFolder}
          </h1>

          <input
            type="text"
            placeholder="Filter_Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 px-4 py-3 mx-6 md:mx-[25px] mb-[20px] text-[10px] text-[#b3a577] uppercase tracking-[1px] outline-none w-[calc(100%-48px)] md:w-[calc(100%-50px)]"
          />
        </header>

        {/* Notes Scroll List */}
        <div className="flex-1 overflow-y-auto pb-32 md:pb-24 custom-scroll">
          {filteredNotes.length ? (
            filteredNotes.map((n) => (
              <div
                key={n._id}
                onClick={() => setState((prev) => ({ ...prev, activeNoteId: n._id }))}
                className="px-6 md:px-[25px] py-6 md:py-[25px] border-b border-white/5 cursor-pointer hover:bg-white/[0.02]"
              >
                <span className="block text-[11px] md:text-[12px] font-extrabold uppercase mb-[6px]">
                  {n.title || "Untitled_Entry"}
                </span>
                <span className="block text-[9px] md:text-[10px] text-zinc-600 uppercase truncate">
                  {n.body || "// Empty_Stream"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-20 text-[9px] text-zinc-900 text-center uppercase tracking-[0.4em]">No_Records</div>
          )}
        </div>

        {/* Floating Action Button (FAB) */}
        <button
          onClick={createNewNote}
          className="fixed bottom-[90px] md:bottom-[35px] right-[25px] w-[55px] h-[55px] bg-[#b3a577] text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 active:scale-90 transition-transform"
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        {/* Full-Screen Editor Slide-in */}
        <div
          className={`absolute inset-0 bg-[#080808] flex flex-col z-40 transition-transform duration-300 ease-in-out ${activeNote ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]">
            <button
              onClick={() => setState((prev) => ({ ...prev, activeNoteId: null }))}
              className="text-[#b3a577] text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={deleteNote} className="text-red-900 text-[10px] uppercase font-bold flex items-center gap-2">
              <Trash2 size={14} /> Purge
            </button>
          </div>

          {activeNote && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <input
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="ENTRY_TITLE"
                className="bg-transparent border-none outline-none w-full text-white text-xl md:text-2xl font-black uppercase tracking-tight px-6 md:px-[30px] pt-8 md:pt-[40px] pb-4"
              />
              <div className="h-[1px] mx-6 md:mx-[30px] mb-6 opacity-20 bg-[#b3a577]" />
              <textarea
                value={activeNote.body}
                onChange={(e) => updateNote("body", e.target.value)}
                placeholder="// Thought_Stream_Active..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-zinc-400 text-sm md:text-[15px] leading-relaxed px-6 md:px-[30px] pb-32 custom-scroll"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}