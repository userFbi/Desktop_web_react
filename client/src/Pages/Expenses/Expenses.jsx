import React, { useState, useEffect } from "react";

export default function FiscalTracker() {
  const [currentType, setCurrentType] = useState("expense");
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [search, setSearch] = useState("");

  // Load data
  useEffect(() => {
    fetch("http://localhost:5000/expense")
      .then(res => res.json())
      .then(res => {
        setTransactions(res.data); // because your backend sends {status, data}
      })
      .catch(err => console.log(err));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("tp_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addEntry = async () => {
    if (!desc || !amt) return;

    try {
      await fetch("http://localhost:5000/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: desc,
          amount: amt,
          type: currentType
        })
      });

      // reload data
      fetch("http://localhost:5000/expense")
        .then(res => res.json())
        .then(res => setTransactions(res.data));

      setDesc("");
      setAmt("");

    } catch (err) {
      console.log(err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await fetch(`http://localhost:5000/expense/delete/${id}`, {
        method: "DELETE"
      });

      setTransactions(prev => prev.filter(t => t._id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  const clearLogs = () => {
    if (window.confirm("Wipe all data?")) {
      setTransactions([]);
      localStorage.removeItem("tp_transactions");
    }
  };

  // Filter
  const filtered = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.monthYear.toLowerCase().includes(search.toLowerCase())
  );

  // Totals
  let income = 0,
    burn = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else burn += t.amount;
  });

  const net = income - burn;

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col p-10 bg-[#080808] text-white font-mono">

      {/* BACK BUTTON */}
      <a href="/" className="text-[10px] text-[#b3a577] tracking-[0.4em] uppercase mb-8 opacity-60 hover:opacity-100">
        {"<< Return_to_Core"}
      </a>

      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tighter opacity-80 uppercase italic leading-none">
            financial_Tracker
          </h1>
          <p className="text-[9px] text-zinc-600 tracking-[0.3em] mt-2">
            CHRONOLOGICAL_LEDGER_SYSTEM
          </p>
        </div>

        <div className="flex gap-10 text-right">
          <div>
            <p className="text-[8px] text-zinc-600 uppercase mb-1">Income</p>
            <p className="text-lg font-light text-green-400">${income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[8px] text-zinc-600 uppercase mb-1">Burn</p>
            <p className="text-lg font-light text-red-400">${burn.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[8px] text-zinc-600 uppercase mb-1">Net</p>
            <p className="text-2xl font-bold text-[#b3a577]">
              ${net.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-[#111] p-6 border border-white/5 flex flex-wrap gap-4 items-center">

          {/* TYPE TOGGLE */}
          <div className="flex border border-white/10 p-1 gap-1">
            <div
              onClick={() => setCurrentType("expense")}
              className={`px-4 py-2 text-[9px] cursor-pointer tracking-widest ${currentType === "expense"
                ? "bg-white/10 text-[#b3a577] font-bold"
                : "opacity-40"
                }`}
            >
              EXPENSE
            </div>

            <div
              onClick={() => setCurrentType("income")}
              className={`px-4 py-2 text-[9px] cursor-pointer tracking-widest ${currentType === "income"
                ? "bg-white/10 text-[#b3a577] font-bold"
                : "opacity-40"
                }`}
            >
              INCOME
            </div>
          </div>

          {/* INPUTS */}
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="bg-white/5 border border-white/10 p-3 text-xs flex-grow"
          />

          <input
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            type="number"
            placeholder="0.00"
            className="bg-white/5 border border-white/10 p-3 text-xs w-28"
          />

          <button
            onClick={addEntry}
            className="bg-[#b3a577] text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white"
          >
            Execute
          </button>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search description or month..."
          className="bg-white/5 border border-white/10 p-3 text-xs w-full"
        />
      </div>

      {/* LIST HEADER */}
      <div className="flex justify-between items-center text-[9px] text-zinc-600 uppercase tracking-[0.2em] border-b border-white/10 pb-3 mb-2">
        <span>Monthly_Logs</span>
        <button onClick={clearLogs} className="hover:text-red-500 transition">
          Purge_Database
        </button>
      </div>

      {/* LIST */}
      <div className="overflow-y-auto pr-3 h-[400px]">
        {filtered.map((t) => (
          <div key={t.id} className="border-b border-white/5 py-4 text-[11px] flex justify-between">

            <div className="flex items-center gap-6">
              <span className="text-zinc-600 text-[9px]">{t.date}</span>
              <span className="text-zinc-300  uppercase">{t.description}</span>

              <span className={`text-[8px] px-1.5 border uppercase ${t.type === "income"
                ? "border-green-900 text-green-500"
                : "border-red-900 text-red-500"
                }`}>
                {t.type}
              </span>
            </div>

            <span className={`font-bold ${t.type === "income"
              ? "text-green-400"
              : "text-[#b3a577]"
              }`}>
              {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}