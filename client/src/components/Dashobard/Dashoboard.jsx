import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  // --- STATE ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [weather, setWeather] = useState({ temp: '--', desc: 'Initializing...' });
  const [clock, setClock] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [scratch, setScratch] = useState(localStorage.getItem('tp_scratch') || '');
  const [isZenMode, setIsZenMode] = useState(false);

  const timerRef = useRef(null);

  // --- ENGINES ---

  // 1. Clock Engine
  useEffect(() => {
    const updateClock = () => {
      setClock(new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      }));
    };
    const clockInterval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(clockInterval);
  }, []);

  // 2. Weather Engine (Surat)
  useEffect(() => {
    const fetchWeather = async () => {
      const lat = 21.1702, lon = 72.8311;
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        const weatherMap = {
          0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
          45: "Foggy", 48: "Rime Fog", 51: "Drizzle", 61: "Rain", 95: "Thunderstorm"
        };
        setWeather({ temp, desc: weatherMap[code] || "Stable_Conditions" });
      } catch (error) {
        setWeather(prev => ({ ...prev, desc: "Network_Offline" }));
      }
    };
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherInterval);
  }, []);

  // 3. Session & Task Logic
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem("tp_session_data") || '{"date": "", "count": 0}');
    if (savedData.date === today) setSessionCount(savedData.count);
    syncTasks();
  }, []);

  const syncTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/planner");
      const result = await res.json();

      const arr = result.data || result;

      const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const today = days[new Date().getDay()];

      const filtered = arr
        .filter(item => item.day === today && item.value && item.value.trim() !== "")
        .map(item => ({
          key: `tp-${item.day}-${item.hour}`,
          time: `${item.hour}:00`,
          text: item.value,
          type: "synced"
        }));

      setTasks(filtered);

    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  // 4. Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsZenMode(false);

    const today = new Date().toDateString();
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    localStorage.setItem("tp_session_data", JSON.stringify({ date: today, count: newCount }));

    alert("Session Complete.");
    resetTimer();
  };

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    setIsZenMode(nextState);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsZenMode(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const removeTask = (key, index) => {
    if (key) {
      const deleted = JSON.parse(localStorage.getItem("tp_deleted_today") || "[]");
      if (!deleted.includes(key)) {
        deleted.push(key);
        localStorage.setItem("tp_deleted_today", JSON.stringify(deleted));
      }
    }
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleManualTask = (e) => {
    if (e.key === 'Enter' && taskInput) {
      setTasks(prev => [...prev, { text: taskInput, type: 'manual' }]);
      setTaskInput('');
    }
  };

  return (
    <div className={`flex h-screen w-full bg-[#080808] transition-all duration-500 ${isZenMode ? 'zen-mode' : ''}`}>
      <main className="flex-grow flex flex-col p-12 relative transition-all duration-500 bg-[#080808]">
        {/* Header */}
        <div className="branding-header flex items-center gap-6 opacity-80 relative z-[100] w-fit cursor-pointer">
          <div id="logo" className="text-xl font-black italic tracking-tighter uppercase select-none transition-transform duration-700 text-white">
            tp
          </div>
          <div className="reveal-content flex items-center gap-6">
            <div className="h-6 w-[2px] bg-white/50"></div>
            <div className="flex items-center gap-6">
              <Link to="/dayflow" className="nav-link text-white">Dayflow</Link>
              <Link to="/keyVault" className="nav-link text-white">Vault</Link>
              <Link to="/expenses" className="nav-link text-white">Expenses</Link>
              <Link to="/notes" className="nav-link text-white">Notes</Link>
              <Link to="/habits" className="nav-link text-white">Habits</Link>
              <span className="text-[8px] text-zinc-800 font-mono tracking-widest">// SECURE_SESSION</span>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-[10px] tracking-[0.8em] text-[#b3a577] mb-4 uppercase font-mono">Deep Work Session</p>
          <h1 id="timer-display" className="text-[14rem] font-black tracking-tighter timer-glow leading-none text-white">
            {formatTime(timeLeft)}
          </h1>

          <div className="mt-4 mb-8 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-white/10"></span>
            <p className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase">
              Sessions: <span className="text-[#b3a577] font-bold">{sessionCount}</span> / 3
            </p>
            <span className="h-[1px] w-8 bg-white/10"></span>
          </div>

          <div className="flex gap-12 relative z-50">
            <button onClick={toggleTimer} className=" text-sm tracking-[0.4em] uppercase hover:text-[#b3a577] transition duration-500 font-bold text-white">
              {isActive ? "Pause_Flow" : timeLeft < 1500 ? "Resume_Session" : "Start_Session"}
            </button>
            <button onClick={resetTimer} className="text-sm tracking-[0.4em] uppercase text-zinc-700 hover:text-white transition duration-500 font-bold">
              Reset
            </button>
          </div>
        </div>

        {/* Dock */}
        <div className="dock-links flex items-center gap-8 overflow-hidden py-4">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#b3a577] animate-pulse"></div>
            <span className="text-[10px] font-black tracking-[0.3em] text-[#b3a577] uppercase">NETWORK_DOCK
              <span className="ml-2 font-bold tracking-widest">{">>>"}</span>
            </span>
          </div>
          <div className="flex items-center gap-10">
            <Link to="https://github.com" target="_blank" rel="noreferrer" className="dock-item">GitHub</Link>
            <Link to="https://gemini.google.com" target="_blank" rel="noreferrer" className="dock-item">Gemini</Link>
            <Link to="https://chat.openai.com" target="_blank" rel="noreferrer" className="dock-item">ChatGPT</Link>
            <Link to="https://youtube.com" target="_blank" rel="noreferrer" className="dock-item">YouTube</Link>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="w-[400px] bg-[#111] border-l border-white/5 flex flex-col p-10 h-full">
        <div className="flex justify-between items-start mb-16">
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">environment </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-light text-white">{weather.temp}°C</p>
              <p className="text-[10px] text-[#b3a577] font-mono uppercase tracking-tighter">{weather.desc}</p>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">SURAT // IN</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Clock</p>
            <p className="text-lg font-light font-mono uppercase text-white">{clock}</p>
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-12 overflow-y-auto custom-scroll pr-4">
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">today-task</p>
              <button onClick={() => syncTasks(true)} className="text-[8px] text-[#b3a577] hover:text-white uppercase font-bold tracking-widest">
                Sync
              </button>
            </div>
            <div className="h-[108px] overflow-y-auto custom-scroll pr-2">
              <div className="space-y-0">
                {tasks.map((task, i) => (
                  <div key={i} onClick={() => removeTask(task.key, i)} className="text-xs font-mono py-2 border-b border-white/5 flex gap-4 items-center cursor-pointer group">
                    {task.time ? (
                      <span className="text-[#b3a577] opacity-40 group-hover:opacity-100 transition-opacity">{task.time}</span>
                    ) : (
                      <span className="text-[#b3a577]">{">>"}</span>
                    )}
                    <span className="text-zinc-300">{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="+"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={handleManualTask}
              className="w-full mt-4 py-2 input-clean text-sm font-mono text-[#b3a577]"
            />
          </div>

          <div className="flex-grow">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-4">Scratchpad</p>
            <textarea
              value={scratch}
              onChange={(e) => {
                setScratch(e.target.value);
                localStorage.setItem("tp_scratch", e.target.value);
              }}
              className="w-full h-48 bg-transparent border-none text-zinc-400 text-xs font-mono leading-relaxed outline-none resize-none"
              placeholder="// Thoughts..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end items-center">
          <Link to="/planner" className="text-[9px] font-bold text-[#b3a577]  transition-all uppercase">Open_Planner</Link>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;