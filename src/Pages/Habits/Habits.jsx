import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HabitEngine() {
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const [state, setState] = useState(() => {
    return JSON.parse(localStorage.getItem("focus_habit_v5")) || {
      lastWeek: getWeekNumber(new Date()),
      habits: [],
      history: {}
    };
  });

  const [input, setInput] = useState("");

  // Sync storage
  useEffect(() => {
    localStorage.setItem("focus_habit_v5", JSON.stringify(state));
  }, [state]);

  // Weekly reset check
  useEffect(() => {
    const currentWeek = getWeekNumber(new Date());

    if (currentWeek !== state.lastWeek) {
      const updated = { ...state };

      updated.habits = updated.habits.map(h => {
        const score = (h.checks.filter(c => c).length / 7) * 100;

        if (!updated.history[h.name]) updated.history[h.name] = [];
        updated.history[h.name].push(score);

        if (updated.history[h.name].length > 4)
          updated.history[h.name].shift();

        return {
          ...h,
          checks: [false, false, false, false, false, false, false]
        };
      });

      updated.lastWeek = currentWeek;
      setState(updated);
    }
  }, []);

  const addHabit = () => {
    if (!input) return;

    setState(prev => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          id: Date.now(),
          name: input.replace(/\s+/g, "_").toUpperCase(),
          checks: [false, false, false, false, false, false, false]
        }
      ]
    }));

    setInput("");
  };

  const toggleDay = (id, index) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === id
          ? {
            ...h,
            checks: h.checks.map((c, i) => (i === index ? !c : c))
          }
          : h
      )
    }));
  };

  const deleteHabit = (id) => {
    if (!window.confirm("Purge Protocol?")) return;

    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  };

  const clearAll = () => {
    if (!window.confirm("Total Wipe?")) return;

    setState({
      lastWeek: getWeekNumber(new Date()),
      habits: [],
      history: {}
    });
  };

  return (
    <div
      className="min-h-screen p-8 text-white"
      style={{
        background: "#080808",
        fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      {/* Header */}
      <header className="mb-10">
        <Link
          to="/"
          className="text-[9px] text-[#b3a577] tracking-[0.4em] uppercase mb-10 block opacity-40 hover:opacity-100"
        >
          {"<< Return_to_Core"}
        </Link>

        <h1 className="text-lg font-black tracking-tighter uppercase opacity-30">
          Habit_Engine // Cycle_v5
        </h1>
      </header>

      {/* Input */}
      <div className="flex border border-[#151515] w-fit mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          placeholder="Initiate_New_Protocol..."
          className="bg-transparent px-4 py-2 text-[#b3a577] text-[10px] outline-none w-[180px] uppercase"
        />

        <button
          onClick={addHabit}
          className="bg-[#b3a577] text-black text-[9px] font-extrabold px-4 uppercase"
        >
          Add
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[180px_repeat(7,1fr)] border-t border-l border-[#151515]">
        {/* Headers */}
        {["Protocol", "M", "T", "W", "T", "F", "S", "S"].map((h, i) => (
          <div
            key={i}
            className="border-r border-b border-[#151515] flex items-center justify-center text-[10px] font-bold bg-[#050505] text-[#333] h-[40px]"
          >
            {h}
          </div>
        ))}

        {/* Data */}
        {state.habits.map(habit => (
          <React.Fragment key={habit.id}>
            <div className="border-r border-b border-[#151515] flex justify-between items-center px-4 text-[9px] text-[#666] bg-[#0a0a0a]">
              <span>{habit.name}</span>
              <span
                onClick={() => deleteHabit(habit.id)}
                className="cursor-pointer opacity-30 hover:text-red-900"
              >
                ×
              </span>
            </div>

            {habit.checks.map((checked, i) => (
              <div
                key={i}
                onClick={() => toggleDay(habit.id, i)}
                className="border-r border-b border-[#151515] flex items-center justify-center h-[65px] cursor-pointer active:bg-[#111]"
              >
                <span
                  className={`text-sm ${checked ? "text-[#b3a577]" : "text-[#222] opacity-30"
                    }`}
                >
                  {checked ? "✔" : "✖"}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Monthly Insight */}
      <section className="mt-12 pt-8 border-t border-dashed border-[#222]">
        <h2 className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] mb-6">
          Monthly_Consistency_Matrix
        </h2>

        {state.habits.map(habit => {
          const past = state.history[habit.name] || [];
          const current =
            (habit.checks.filter(c => c).length / 7) * 100;

          const avg =
            past.length > 0
              ? (past.reduce((a, b) => a + b, 0) + current) /
              (past.length + 1)
              : current;

          return (
            <div key={habit.id} className="mb-6">
              <div className="flex justify-between text-[10px] text-zinc-500 uppercase mb-1">
                <span>{habit.name}</span>
                <span>Avg_Consistency: {Math.round(avg)}%</span>
              </div>

              <div className="w-full h-[4px] bg-[#111]">
                <div
                  className="h-full bg-[#b3a577] transition-all duration-700"
                  style={{ width: `${avg}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Reset */}
      <div className="mt-12">
        <button
          onClick={clearAll}
          className="text-[8px] text-zinc-900 hover:text-red-900 uppercase tracking-widest"
        >
          [ Hard_Reset_Database ]
        </button>
      </div>
    </div>
  );
}