import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TacticalPlanner() {
  const hours = Array.from({ length: 25 }, (_, i) =>
    i.toString().padStart(2, "0") + ":00"
  );

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const [data, setData] = useState({});

  const currentHour = new Date().getHours();

  useEffect(() => {
    const stored = {};

    hours.forEach((h) => {
      const hInt = parseInt(h);
      days.forEach((d) => {
        const id = `tp-${d}-${hInt}`;
        stored[id] = localStorage.getItem(id) || "";
      });
    });

    // Dummy preload if empty
    const hasData = Object.values(stored).some((v) => v);

    if (!hasData) {
      const dummy = {
        "tp-mon-9": "React Architecture Refactor",
        "tp-mon-11": "Node.js API Debugging",
        "tp-tue-10": "MUI Theme Polish",
        "tp-wed-14": "Interview Prep: Hooks",
        "tp-thu-9": "Database Optimization",
        "tp-fri-16": "FocusOS Deployment",
      };

      Object.keys(dummy).forEach((k) => {
        localStorage.setItem(k, dummy[k]);
        stored[k] = dummy[k];
      });
    }

    setData(stored);
  }, []);

  const updateCell = (id, value) => {
    localStorage.setItem(id, value);
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const clearPlanner = () => {
    if (!window.confirm("Wipe all data?")) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen bg-[#080808] text-white p-8"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12">
        <Link
          to="/"
          className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>

        <button
          onClick={clearPlanner}
          className="text-[10px] font-bold text-red-900 hover:text-red-500 uppercase tracking-widest"
        >
          Wipe_Schedule
        </button>
      </nav>

      {/* Grid */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border border-white/5 bg-[#111] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center text-[10px] font-black text-[#b3a577] border-b border-r border-white/5 bg-[#0d0d0d]">
          UTC
        </div>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
          <div key={d} className="p-6 text-center text-[10px] font-black text-[#b3a577] border-b border-r border-white/5">
            {d}
          </div>
        ))}

        {/* Rows */}
        {hours.map((h) => {
          const hInt = parseInt(h);

          return (
            <React.Fragment key={h}>
              {/* Time Label */}
              <div
                className={`text-[9px] flex items-center justify-center bg-[#0d0d0d] border-r border-b border-white/5 ${hInt === currentHour ? "text-[#b3a577]" : "text-[#444]"
                  }`}
              >
                {h}
              </div>

              {/* Slots */}
              {days.map((d) => {
                const id = `tp-${d}-${hInt}`;

                return (
                  <div
                    key={id}
                    className={`h-[50px] border-b border-r border-white/5 ${hInt === currentHour
                      ? "bg-[rgba(179,165,119,0.08)] border-l-2 border-[#b3a577]"
                      : ""
                      }`}
                  >
                    <textarea
                      value={data[id] || ""}
                      onChange={(e) => updateCell(id, e.target.value)}
                      placeholder="..."
                      spellCheck={false}
                      className="w-full h-full bg-transparent outline-none text-[#666] focus:text-white focus:bg-[rgba(179,165,119,0.03)] text-[10px] p-2 resize-none"
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}