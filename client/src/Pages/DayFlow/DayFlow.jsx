import { RotateCcw } from "lucide-react";
import React, { useEffect } from "react";
import "./DayFlow.css";

const DayFlow = () => {
    const BASE_URL = "http://localhost:5000/dayflow";

    let flowState = JSON.parse(localStorage.getItem("dayflow_v3")) || {
        reminders: ["Initial Boot Processed"],
        savings: [],
        events: {},
        selectedDate: new Date().toISOString().split("T")[0],
    };

    const save = () => {
        localStorage.setItem("dayflow_v3", JSON.stringify(flowState));
        render();
    };

    async function loadFromBackend() {
        try {
            const today = new Date().toISOString().split("T")[0];

            // 🔹 get today events
            const res = await fetch(`${BASE_URL}/${today}`);
            const data = await res.json();

            flowState.events[today] = data.events || [];

            // 🔹 get global (savings + reminders)
            const globalRes = await fetch(`${BASE_URL}/global`);
            const globalData = await globalRes.json();

            flowState.savings = globalData.savings || [];
            flowState.reminders = globalData.reminders || [];

            // loadFromBackend();
            selectDate(new Date().toISOString().split("T")[0]);

        } catch (err) {
            console.error("Load error:", err);
        }
    }

    function deleteSingleTask(index) {
        flowState.events[flowState.selectedDate].splice(index, 1);
        save();
        selectDate(flowState.selectedDate);
    }

    async function deleteTaskFromPopup(index) {
        const date = flowState.selectedDate;

        try {
            const res = await fetch(`${BASE_URL}/event/delete/${date}/${index}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Backend error:", data);
                throw new Error(data.message || "Delete failed");
            }

            document.querySelector(".fixed.inset-0")?.remove();

            await loadFromBackend();

        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    function initCalendar() {
        const cal = document.getElementById("calendar-body");

        // keep headers
        const headers = Array.from(cal.children).slice(0, 7);
        cal.innerHTML = "";
        headers.forEach((h) => cal.appendChild(h));

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        // 0 = Sunday, 1 = Monday...

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 🔥 Convert Sunday (0) → 6 (so week starts Monday)
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        // ✅ Add empty slots before 1st day
        for (let i = 0; i < startDay; i++) {
            const empty = document.createElement("div");
            empty.className = "cal-date opacity-20";
            cal.appendChild(empty);
        }

        // ✅ Actual dates
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

            const div = document.createElement("div");

            div.className = `cal-date 
        ${dateKey === new Date().toISOString().split("T")[0] ? "today" : ""}
        ${flowState.events[dateKey] ? "has-event" : ""}
        ${dateKey === flowState.selectedDate ? "selected-date" : ""}
        `;

            div.innerText = String(i).padStart(2, "0");

            div.onclick = () => selectDate(dateKey);

            cal.appendChild(div);
        }
    }
    function selectDate(dateKey, showPopup = true) {
        flowState.selectedDate = dateKey;

        let event = flowState.events[dateKey] || [];

        if (typeof event === "string") {
            event = [event];
        }

        document.getElementById("active-date-label").innerText = dateKey;

        // ✅ Only show popup when allowed
        if (showPopup && event.length > 0) {
            showTaskPopup(event);
        }

        initCalendar();
    }

    function showTaskPopup(tasks) {
        const overlay = document.createElement("div");

        overlay.className = `
        fixed inset-0 bg-black/70 flex items-center justify-center z-50
    `;

        overlay.innerHTML = `
        <div id="popup-box" class="bg-[#0d0d0d] border border-[#b3a577] w-[320px] p-5">
            <h2 class="text-[#b3a577] text-xs mb-4 capitalize tracking-widest">
                Today-Tasks 
            </h2>

            <div class="space-y-2 max-h-[200px] capitalize overflow-y-auto">
                ${tasks.map((t, index) => `
                    <div class="flex justify-between items-center bg-[#050505] border border-[#151515] px-3 py-2 text-[12px] text-[#b3a577]">
                        <span>${t}</span>
                        <span 
                            onclick="deleteTaskFromPopup(${index})"
                            class="text-red-500 cursor-pointer hover:text-red-300 font-bold"
                        >
                            ×
                        </span>
                    </div>
                `).join("")}
            </div>

            <button 
                id="close-popup-btn"
                class="mt-4 w-full bg-[#b3a577] text-black py-2 text-[10px] font-bold"
            >
                CLOSE
            </button>
        </div>
    `;

        document.body.appendChild(overlay);

        // CLOSE BUTTON
        overlay.querySelector("#close-popup-btn").onclick = (e) => {
            e.stopPropagation();
            overlay.remove();
        };

        // PREVENT CLICK INSIDE POPUP
        overlay.querySelector("#popup-box").addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // CLICK OUTSIDE → CLOSE
        overlay.addEventListener("click", () => {
            overlay.remove();
        });
    }

    async function saveEvent() {
        const input = document.getElementById("event-input");
        if (!input.value) return;

        const date = flowState.selectedDate;

        await fetch(`${BASE_URL}/event/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date,
                event: input.value
            }),
        });

        input.value = "";

        await loadFromBackend(); // 🔥 refresh from DB
    }

    function editEvent() {
        document.getElementById("event-input").value =
            flowState.events[flowState.selectedDate];
        document.getElementById("event-input").focus();
    }

    function deleteEvent() {
        if (window.confirm("Confirm Removal?")) {
            delete flowState.events[flowState.selectedDate];
            save();
            selectDate(flowState.selectedDate);
        }
    }

    async function addSavings() {
        const input = document.getElementById("save-amount");
        if (!input.value) return;

        await fetch(`${BASE_URL}/savings/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: parseFloat(input.value)
            }),
        });

        input.value = "";

        await loadFromBackend();
    }

    async function withdrawSavings() {
        const input = document.getElementById("save-amount");
        if (!input.value) return;

        await fetch(`${BASE_URL}/savings/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: -parseFloat(input.value)
            }),
        });

        input.value = "";

        await loadFromBackend();
    }

    async function addReminder() {
        const input = document.getElementById("rem-input");
        if (!input.value) return;

        await fetch(`${BASE_URL}/reminder/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: input.value
            }),
        });

        input.value = "";

        await loadFromBackend();
    }

    function deleteReminder(index) {
        flowState.reminders.splice(index, 1);
        save(); // auto re-render
    }

    function render() {
        document.getElementById("reminder-list").innerHTML = flowState.reminders
            .map(
                (r, i) => `
        <div class="flex justify-between items-center bg-[#050505] text-zinc-400 capitalize p-3 border border-white/5 text-[12px]">
            <span>${r}</span>

            <span 
                onclick="deleteReminder(${i})"
                class="text-red-500 cursor-pointer hover:text-red-300 font-bold"
            >
                ×
            </span>
        </div>
        `
            )
            .join("");

        let total = flowState.savings.reduce((acc, curr) => acc + curr.amount, 0);

        document.getElementById("total-savings").innerText =
            `₹${total.toLocaleString("en-IN")}`;

        document.getElementById("ledger-list").innerHTML = flowState.savings
            .map(
                (s, i) => `
    <div class="flex justify-between items-center py-3 text-[11px] font-bold text-zinc-600 border-b border-[#111] pr-2">
        
        <span class="${s.amount < 0 ? "text-red-500" : "text-green-500"}">
            ${s.amount > 0 ? "+" : ""}${s.amount}
        </span>

        <span>${s.date}</span>

        <span 
            onclick="deleteSaving(${i})"
            class="text-red-500 cursor-pointer hover:text-red-300 ml-2 font-bold"
        >
            ×
        </span>

    </div>
`
            )
            .join("");
    }

    function deleteSaving(index) {
        flowState.savings.splice(index, 1);
        save(); // 🔥 this will auto re-render + recalc total
    }

    function resetGita() {
        localStorage.setItem(
            "gita_progress",
            JSON.stringify({
                chapter: 1,
                verse: 1,
                lastDate: null,
            })
        );

        loadDailyShloka(); // reload immediately
    }

    async function loadDailyShloka() {
        try {
            let progress = JSON.parse(localStorage.getItem("gita_progress")) || {
                chapter: 1,
                verse: 1,
                lastDate: null,
            };

            const today = new Date().toISOString().split("T")[0];

            const { chapter, verse } = progress; // ✅ use current first

            // 🔥 FETCH CURRENT VERSE (before increment)
            const res = await fetch(
                `https://vedicscriptures.github.io/slok/${chapter}/${verse}/`
            );

            const data = await res.json();

            const translation =
                data.prabhu?.et ||
                data.siva?.et ||
                data.gambir?.et ||
                data.adi?.et ||
                data.raman?.et ||
                data.sankar?.et ||
                "Translation not available.";

            document.getElementById("quote-display").innerText =
                `Chapter ${data.chapter}, Verse ${data.verse}

${data.slok}

Meaning:
${translation}`;

            // ✅ AFTER DISPLAY → update for next day
            if (progress.lastDate !== today) {
                progress.verse++;

                if (progress.verse > 20) {
                    progress.chapter++;
                    progress.verse = 1;
                }

                if (progress.chapter > 18) {
                    progress.chapter = 1;
                    progress.verse = 1;
                }

                progress.lastDate = today;

                localStorage.setItem("gita_progress", JSON.stringify(progress));
            }

        } catch (err) {
            console.error(err);

            document.getElementById("quote-display").innerText =
                "Unable to load Daily Gita verse.";
        }
    }

    useEffect(() => {
        window.saveEvent = saveEvent;
        window.editEvent = editEvent;
        window.deleteEvent = deleteEvent;
        window.addSavings = addSavings;
        window.deleteSaving = deleteSaving;
        window.addReminder = addReminder;
        window.deleteReminder = deleteReminder;
        window.deleteTaskFromPopup = deleteTaskFromPopup;
        window.resetGita = resetGita;

        const clock = setInterval(() => {
            const el = document.getElementById("live-clock");
            if (el) el.innerText = new Date().toLocaleTimeString("en-US");
        }, 1000);

        initCalendar();
        render();

        // 🔥 ADD THIS LINE
        loadFromBackend();

        loadDailyShloka();

        return () => clearInterval(clock);
    }, []);

    return (
        <>
            <header className="flex justify-between items-end max-w-[1200px] p-10 mx-auto mb-8">
                <div>
                    <a
                        href="/index.html"
                        className="text-[9px] text-[#b3a577] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition"
                    >
                        &lt;&lt; Return
                    </a>
                    <h1 className="text-xl font-black uppercase tracking-tighter mt-2">
                        DailyFlow / Protocol
                    </h1>
                </div>
                <div id="live-clock" className="text-lg font-light opacity-50">
                    00:00:00
                </div>
            </header>

            <main className="dashboard-grid">
                <section className="panel">
                    <div className="panel-header">
                        <span>Calendar_Protocol</span>
                        <span
                            id="active-date-label"
                            className="text-[#b3a577] animate-pulse"
                        >
                            Select_Date
                        </span>
                    </div>

                    <div className="calendar-grid mb-6" id="calendar-body">
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">Mo</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">Tu</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">We</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">Th</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">Fr</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">St</div>
                        <div className="text-[11px] text-[#888] text-center p-2 bg-[#0d0d0d] border-b border-[#151515] font-bold">Su</div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#151515]">
                        <div className="flex justify-between items-center mb-3">
                            <span
                                id="event-status"
                                className="text-[10px] text-zinc-600 uppercase pr-4 block max-h-[120px] overflow-y-auto"
                            >   System_Idle...</span>


                            <div
                                id="event-actions"
                                className="hidden flex gap-3 text-[9px] font-bold"
                            >
                                <span
                                    className="cursor-pointer text-[#b3a577]"
                                    onClick={editEvent}
                                >
                                    [EDIT]
                                </span>
                                <span
                                    className="cursor-pointer text-red-900"
                                    onClick={deleteEvent}
                                >
                                    [DELETE]
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="event-input"
                                className="flex-1 p-2 text-xs capitalize"
                                placeholder="Type_Task_Details..."
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") saveEvent();
                                }}
                            />

                            <button onClick={saveEvent} className="btn-assign">
                                Assign
                            </button>
                        </div>
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-header">Active_Reminders</div>
                    <div
                        id="reminder-list"
                        className="overflow-y-auto h-full space-y-1 pr-2"
                    ></div>

                    <input
                        type="text"
                        id="rem-input"
                        className="mt-4 p-2 capitalize text-xs"
                        placeholder="Deploy_Reminder..."
                        onKeyPress={(e) => {
                            if (e.key === "Enter") addReminder();
                        }}
                    />
                </section>

                <section className="panel">
                    <div className="panel-header">Savings_Registry</div>

                    <div className="flex h-full overflow-hidden">
                        <div className="flex-1 flex flex-col justify-center">
                            <div
                                className="text-[32px] font-black text-[#b3a577] leading-none"
                                id="total-savings"
                            >
                                ₹0.00
                            </div>

                            <div className="text-[8px] text-zinc-700 mt-2 tracking-[0.3em]">
                                MONTHLY_LIQUID_ASSETS
                            </div>

                            <input
                                type="number"
                                id="save-amount"
                                className="mt-8 w-32 p-2 text-xs"
                                placeholder="Amt"

                            />

                            <button
                                onClick={addSavings}
                                className="mt-2 w-32 bg-[#b3a577] text-black py-2 font-black text-[9px] uppercase hover:bg-white transition-all"
                            >
                                Deposit
                            </button>

                            <button
                                onClick={withdrawSavings}
                                className="mt-2 w-32 bg-red-500 text-black py-2 font-black text-[9px] uppercase hover:bg-red-300 transition-all"
                            >
                                Withdraw
                            </button>
                        </div>

                        <div
                            className="flex-none w-[140px] border-l border-[#151515] ml-4 pl-4 overflow-y-auto"
                            id="ledger-list"
                        ></div>
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-header">
                        <span>Daily_Gita_Directive!</span>

                        <button
                            onClick={resetGita}
                            className="p-1  text-red-600 rounded "
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    <div className="flex items-center h-full">
                        <p
                            className="text-sm italic text-zinc-600 leading-relaxed"
                            id="quote-display"
                        ></p>
                    </div>
                </section>
            </main >
        </>
    );
};

export default DayFlow;


