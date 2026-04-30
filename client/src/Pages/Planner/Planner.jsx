import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TacticalPlanner() {
  // Focus on productive hours by default (08:00 to 22:00)
  const [isFullView, setIsFullView] = useState(false);

  const allHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00");
  const filteredHours = isFullView ? allHours : allHours.slice(7, 23); // 7 AM to 10 PM

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const [data, setData] = useState({});
  const currentHour = new Date().getHours();

  useEffect(() => {
    fetch("http://localhost:5000/planner")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data); // 🔍 debug

        const formatted = {};

        // ✅ handle both cases (array OR object)
        const plannerArray = Array.isArray(data) ? data : data.data;

        if (plannerArray) {
          plannerArray.forEach(item => {
            const id = `tp-${item.day}-${item.hour}`;
            formatted[id] = item.value;
          });
        }

        setData(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const updateCell = (id, value) => {
    const [_, day, hour] = id.split("-");

    if (!value || value.trim() === "") {
      return;
    }

    fetch("http://localhost:5000/planner/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // userID: "test-user",
        day,
        hour: parseInt(hour),
        value
      }),
    });

    setData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-4 md:p-6 lg:p-10 font-mono">
      {/* Precision Header */}
      <nav className="flex justify-between items-center mb-10 pb-6 border-b border-white/10 px-2">
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className="group text-[12px] font-bold text-zinc-500 hover:text-[#b3a577] flex items-center gap-3 uppercase tracking-[0.2em] transition-all"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>System_Core / Dashboard</span>
          </Link>
          <p className="text-[10px] text-zinc-800 ml-7 font-mono uppercase tracking-widest hidden sm:block">
            Terminal ID: SRT-2026-X
          </p>
        </div>

        <div className="flex gap-8 items-center">
          <button
            onClick={() => setIsFullView(!isFullView)}
            className="text-[12px] font-bold text-zinc-400 hover:text-white uppercase flex items-center gap-3 tracking-widest transition-colors bg-white/5 px-4 py-2 rounded-md border border-white/5"
          >
            {isFullView ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden sm:inline">{isFullView ? "Standard_View" : "Extended_View"}</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm("Confirm System Wipe?")) {
                try {
                  await fetch("http://localhost:5000/planner/delete", {
                    method: "DELETE"
                  });

                  localStorage.clear(); // optional
                  window.location.reload();

                } catch (err) {
                  console.log("Wipe failed:", err);
                }
              }
            }}
            className="text-[12px] font-black text-red-900 hover:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-md transition-all uppercase tracking-tighter"
          >
            Wipe_Database
          </button>
        </div>
      </nav>

      {/* Grid Container */}
      <div className="planner-wrapper border border-white/5 rounded-lg overflow-hidden bg-[#0d0d0d]">
        <div className="grid grid-cols-[50px_repeat(7,1fr)] md:grid-cols-[70px_repeat(7,1fr)] min-w-[700px] md:min-w-full">

          {/* Header Row */}
          <div className="bg-[#050505] p-3 border-b border-r border-white/5 text-[9px] text-center text-zinc-700">T_SEC</div>
          {days.map(d => (
            <div key={d} className="bg-[#050505] p-3 border-b border-r border-white/5 text-[10px] text-center font-bold text-[#b3a577] uppercase tracking-widest">
              {d}
            </div>
          ))}

          {/* Data Engine */}
          {filteredHours.map((h) => {
            const hInt = parseInt(h);
            const isCurrent = hInt === currentHour;

            return (
              <React.Fragment key={h}>
                <div className={`flex items-center justify-center text-[9px] border-b border-r border-white/5 bg-[#050505] ${isCurrent ? 'text-[#b3a577] font-black' : 'text-zinc-600'}`}>
                  {h}
                </div>
                {days.map(d => {
                  const id = `tp-${d}-${hInt}`;
                  return (
                    <div key={id} className={`h-12 md:h-14 border-b border-r border-white/5 relative group ${isCurrent ? 'bg-[#b3a577]/5' : ''}`}>
                      <textarea
                        value={data[id] || ""}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          [id]: e.target.value
                        }))}
                        onBlur={(e) => updateCell(id, e.target.value)}
                        placeholder="--"
                        className="w-full h-full bg-transparent p-2 text-[10px] text-zinc-400 focus:text-white focus:bg-white/[0.02] outline-none resize-none transition-all leading-tight scrollbar-hide"
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-[8px] text-zinc-800 uppercase tracking-[0.5em] text-center">Tactical
        Grid_v4.2 // Surat_Node</p>
    </div>
  );
}