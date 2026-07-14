import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Briefcase,
  Terminal as TerminalIcon,
  Lock,
  Folder as FolderIcon,
} from "lucide-react";
import "./Notes.css";

const BASE_URL = process.env.REACT_APP_API_URL;

// Folder → icon mapping. Each folder gets an icon that matches what it
// actually holds, so the rail reads as a legend, not decoration.
const FOLDER_ICONS = {
  Work: Briefcase,
  Logs: TerminalIcon,
  Vault: Lock,
};

export default function NotesPage() {
  const [state, setState] = useState({
    folders: ["Work", "Logs", "Vault"],
    notes: [],
    activeFolder: "Work",
    activeNoteId: null,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("focusToken");
    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setState((prev) => ({
          ...prev,
          notes: Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [],
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  const activeNote = state.notes.find((n) => n._id === state.activeNoteId);

  const notesInFolder = state.notes.filter((n) => n.folder === state.activeFolder);

  const filteredNotes = notesInFolder.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  const createNewNote = async () => {
    const token = localStorage.getItem("focusToken");
    const newNote = { title: "", body: "", folder: state.activeFolder };

    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    });

    const data = await res.json();
    if (!data.data) return console.error("Failed to create note:", data);

    setState((prev) => ({
      ...prev,
      notes: [data.data, ...prev.notes],
      activeNoteId: data.data._id,
    }));
  };

  const updateNote = async (field, value) => {
    const token = localStorage.getItem("focusToken");
    const note = state.notes.find((n) => n._id === state.activeNoteId);
    const updatedNote = { ...note, [field]: value };

    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n._id === note._id ? updatedNote : n)),
    }));

    await fetch(`${API}/update/${note._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNote),
    });
  };

  const deleteNote = async () => {
    if (!window.confirm("Execute Wipe Protocol?")) return;
    const token = localStorage.getItem("focusToken");

    await fetch(`${API}/delete/${state.activeNoteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n._id !== prev.activeNoteId),
      activeNoteId: null,
    }));
  };

  const wordCount = activeNote ? activeNote.body.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      className="flex h-screen bg-[#080808] text-white overflow-hidden flex-col md:flex-row"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Rail — Desktop: left column of icon+label folders | Mobile: bottom tab bar */}
      <aside className="fixed bottom-0 left-0 w-full h-[65px] md:relative md:h-full md:w-[150px] md:shrink-0 bg-[#050505] border-t md:border-t-0 md:border-r border-white/5 flex flex-row md:flex-col z-30 overflow-hidden">
        <div className="hidden md:flex flex-col items-center pt-8 pb-6">
          <Link
            to="/"
            className="text-[9px] text-[#b3a577] tracking-[0.4em] uppercase block opacity-100 hover:opacity-100"
          >
            {"<<Return"}
          </Link>
        </div>

        <div className="flex-1 flex flex-row md:flex-col w-full justify-around md:justify-start">
          {state.folders.map((f) => {
            const Icon = FOLDER_ICONS[f] || FolderIcon;
            const isActive = state.activeFolder === f;
            return (
              <button
                key={f}
                onClick={() =>
                  setState((prev) => ({ ...prev, activeFolder: f, activeNoteId: null }))
                }
                className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-2.5 px-4 md:px-5 py-3 md:py-4 transition-colors group ${isActive ? "text-[#b3a577]" : "text-zinc-700 hover:text-zinc-400"
                  }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] md:bottom-auto md:top-0 md:left-0 md:h-full md:w-[2px] bg-[#b3a577] shadow-[0_0_8px_#b3a577]" />
                )}
                <Icon size={13} strokeWidth={2} className="shrink-0" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[1px] md:tracking-[1.5px] whitespace-nowrap">
                  {f}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* List pane — fixed width on desktop, full width on mobile */}
      <div className="flex flex-col w-full md:w-[340px] md:shrink-0 bg-[#080808] md:border-r md:border-white/5 h-full min-h-0">
        <header className="pt-8 md:pt-10 px-6 md:px-7">
          <h1 className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase mb-4 md:mb-5">
            {state.activeFolder}
          </h1>
          <input
            type="text"
            placeholder="Filter_Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 px-4 py-3 text-[10px] text-[#b3a577] uppercase tracking-[1px] outline-none w-full focus:border-[#b3a577]/40 transition-colors"
          />
        </header>

        <div className="flex-1 overflow-y-auto pb-32 md:pb-4 custom-scroll min-h-0">
          {filteredNotes.length ? (
            filteredNotes.map((n) => {
              const isOpen = n._id === state.activeNoteId;
              return (
                <div
                  key={n._id}
                  onClick={() => setState((prev) => ({ ...prev, activeNoteId: n._id }))}
                  className={`px-6 md:px-7 py-6 md:py-5 border-b border-white/5 cursor-pointer transition-colors ${isOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                >
                  <span className="block text-[11px] md:text-[12px] font-extrabold capitalize mb-[6px]">
                    {n.title || "Untitled_Entry"}
                  </span>
                  <span className="block text-[9px] md:text-[10px] text-zinc-600 truncate">
                    {n.body || "// Empty_Stream"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-[9px] text-zinc-800 text-center uppercase tracking-[0.4em]">
              No_Records
            </div>
          )}
        </div>

        {/* Terminal-style status readout — desktop only, real counts not decoration */}
        <div className="hidden md:flex items-center justify-between px-7 py-3 border-t border-white/5 text-[8px] uppercase tracking-[2px] text-zinc-700">
          <span>
            {notesInFolder.length} {notesInFolder.length === 1 ? "Entry" : "Entries"}
          </span>
          <span className="flex items-center gap-1.5 text-[#b3a577]/70">
            <span className="w-[5px] h-[5px] rounded-full bg-[#b3a577] shadow-[0_0_6px_#b3a577] animate-pulse" />
            Synced
          </span>
        </div>

        {/* Floating Action Button — mobile only, desktop gets an inline row button */}
        <button
          onClick={createNewNote}
          className="fixed bottom-[90px] right-[25px] md:hidden w-[55px] h-[55px] bg-[#b3a577] text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 active:scale-90 transition-transform"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
        <button
          onClick={createNewNote}
          className="hidden md:flex items-center justify-center gap-2 mx-7 mb-6 py-3 border border-[#b3a577]/30 text-[#b3a577] text-[9px] uppercase font-bold tracking-[2px] hover:bg-[#b3a577]/10 transition-colors"
        >
          <Plus size={13} strokeWidth={3} /> New_Entry
        </button>
      </div>

      {/* Editor pane — persistent column on desktop, full-screen slide-in on mobile */}
      <div
        className={`fixed inset-0 md:static md:flex-1 bg-[#080808] flex flex-col z-40 transition-transform duration-300 ease-in-out ${activeNote ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
      >
        {activeNote ? (
          <>
            <div className="p-4 md:px-8 md:py-5 border-b border-white/5 flex justify-between items-center bg-[#050505] md:bg-transparent">
              <button
                onClick={() => setState((prev) => ({ ...prev, activeNoteId: null }))}
                className="md:hidden text-[#b3a577] text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <span className="hidden md:flex items-center gap-2 text-[8px] uppercase tracking-[2px] text-zinc-700">
                <span className="w-[5px] h-[5px] rounded-full bg-[#b3a577] animate-pulse" />
                {wordCount} Words_Logged
              </span>
              <button
                onClick={deleteNote}
                className="text-red-900 text-[10px] uppercase font-bold flex items-center gap-2 hover:text-red-700 transition-colors"
              >
                <Trash2 size={14} /> Purge
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <input
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="ENTRY_TITLE"
                className="bg-transparent border-none outline-none w-full text-white text-xl md:text-2xl font-black capitalize tracking-tight px-6 md:px-10 pt-8 md:pt-10 pb-4"
              />
              <div className="h-[1px] mx-6 md:mx-10 mb-6 opacity-20 bg-[#b3a577]" />
              <textarea
                value={activeNote.body}
                onChange={(e) => updateNote("body", e.target.value)}
                placeholder="// Thought_Stream_Active..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-zinc-400 text-sm md:text-[15px] leading-relaxed px-6 md:px-10 pb-32 custom-scroll"
              />
            </div>
          </>
        ) : (
          // Desktop empty state — only ever visible here since mobile keeps this pane off-screen
          <div className="hidden md:flex flex-col items-center justify-center h-full text-zinc-800">
            <span className="text-[10px] uppercase tracking-[0.5em]">Awaiting_Selection</span>
            <span className="mt-3 text-[#b3a577]/40 text-lg animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
}