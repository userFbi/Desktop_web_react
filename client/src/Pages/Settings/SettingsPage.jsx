import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Lock, Wallet, FileText, Repeat } from "lucide-react";

// Single source of truth for what CAN appear in the dock.
// NavDock.jsx reads the same STORAGE_KEY to decide what to actually render.
export const SECTIONS = [
    { key: "dayflow", label: "Dayflow", path: "/dayflow", description: "Daily planning & time blocks", icon: Calendar },
    { key: "vault", label: "Vault", path: "/keyVault", description: "Encrypted credential storage", icon: Lock },
    { key: "expenses", label: "Expenses", path: "/expenses", description: "Spending & budget tracking", icon: Wallet },
    { key: "notes", label: "Notes", path: "/notes", description: "Freeform entries & logs", icon: FileText },
    { key: "habits", label: "Habits", path: "/habits", description: "Streaks & recurring routines", icon: Repeat },
];

export const STORAGE_KEY = "dockSettings";
const DEFAULTS = Object.fromEntries(SECTIONS.map((s) => [s.key, true]));

export default function SettingsPage() {
    const [enabled, setEnabled] = useState(DEFAULTS);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setEnabled({ ...DEFAULTS, ...JSON.parse(saved) });
        } catch {
            // no saved settings yet — defaults stand
        }
    }, []);

    const toggle = (key) => {
        setEnabled((prev) => {
            const activeCount = Object.values(prev).filter(Boolean).length;
            // Keep at least one section visible so the dock is never empty.
            if (prev[key] && activeCount <= 1) return prev;
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const resetDefaults = () => {
        setEnabled(DEFAULTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    };

    const activeCount = Object.values(enabled).filter(Boolean).length;

    return (
        <div
            className="min-h-screen bg-[#080808] text-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            <div className="max-w-2xl mx-auto px-6 pt-10 md:pt-16 pb-24">
                <Link
                    to="/"
                    className="text-zinc-600 hover:text-[#b3a577] transition-colors text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2 mb-10 w-fit"
                >
                    <ArrowLeft size={14} /> Back
                </Link>

                <h1 className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase mb-2">Settings</h1>
                <p className="text-2xl md:text-3xl font-black tracking-tight mb-10">System_Configuration</p>

                <section className="border border-white/5 bg-[#050505]">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#b3a577]">
                                Network_Dock
                            </h2>
                            <p className="text-[10px] text-zinc-600 mt-1">
                                Choose which sections show in your navigation.
                            </p>
                        </div>
                        <span className="text-[9px] uppercase tracking-[1px] text-zinc-700 whitespace-nowrap">
                            {activeCount}/{SECTIONS.length} Active
                        </span>
                    </div>

                    <div>
                        {SECTIONS.map((s) => {
                            const Icon = s.icon;
                            const isOn = enabled[s.key];
                            return (
                                <div
                                    key={s.key}
                                    className="flex items-center justify-between px-6 py-5 border-b border-white/5 last:border-b-0"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <Icon size={16} className={`shrink-0 ${isOn ? "text-[#b3a577]" : "text-zinc-700"}`} />
                                        <div className="min-w-0">
                                            <div
                                                className={`text-[11px] font-extrabold uppercase tracking-[1px] ${isOn ? "text-white" : "text-zinc-600"
                                                    }`}
                                            >
                                                {s.label}
                                            </div>
                                            <div className="text-[9px] text-zinc-700 mt-0.5 truncate">{s.description}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggle(s.key)}
                                        role="switch"
                                        aria-checked={isOn}
                                        aria-label={`Toggle ${s.label}`}
                                        className={`relative w-[38px] h-[20px] rounded-full transition-colors shrink-0 ${isOn ? "bg-[#b3a577]" : "bg-white/10"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full bg-[#080808] transition-transform ${isOn ? "translate-x-[18px]" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <button
                    onClick={resetDefaults}
                    className="mt-6 text-[9px] uppercase tracking-[2px] text-zinc-700 hover:text-[#b3a577] transition-colors"
                >
                    Reset_To_Default
                </button>
            </div>
        </div>
    );
}