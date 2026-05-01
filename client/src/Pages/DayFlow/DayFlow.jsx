import React, { useEffect } from "react";
import "./DayFlow.css";

const DayFlow = () => {
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

    function initCalendar() {
        const cal = document.getElementById("calendar-body");
        const headers = Array.from(cal.children).slice(0, 7);
        cal.innerHTML = "";
        headers.forEach((h) => cal.appendChild(h));

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

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

    function selectDate(dateKey) {
        flowState.selectedDate = dateKey;

        const event = flowState.events[dateKey];

        document.getElementById("active-date-label").innerText = dateKey;

        document.getElementById("event-status").innerText = event
            ? `PROTOCOL: ${event}`
            : "NO_TASK_ASSIGNED";

        const actionZone = document.getElementById("event-actions");
        event
            ? actionZone.classList.remove("hidden")
            : actionZone.classList.add("hidden");

        initCalendar();
    }

    function saveEvent() {
        const input = document.getElementById("event-input");
        if (!input.value) return;

        flowState.events[flowState.selectedDate] = input.value;
        input.value = "";
        save();
        selectDate(flowState.selectedDate);
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

    function addSavings() {
        const input = document.getElementById("save-amount");
        if (!input.value) return;

        let amount = parseFloat(input.value);

        flowState.savings.unshift({
            amount: amount, // can be + or -
            date: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            }),
        });

        input.value = "";
        save();
    }

    function withdrawSavings() {
        const input = document.getElementById("save-amount");
        if (!input.value) return;

        const amount = parseFloat(input.value);

        flowState.savings.unshift({
            amount: -amount, // subtract
            date: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            }),
        });

        input.value = "";
        save();
    }

    function addReminder() {
        const input = document.getElementById("rem-input");
        if (!input.value) return;

        flowState.reminders.push(input.value);
        input.value = "";
        save();
    }

    function render() {
        document.getElementById("reminder-list").innerHTML = flowState.reminders
            .map(
                (r, i) => `
        <div class="flex justify-between items-center bg-[#050505] p-3 border border-white/5 text-[10px]">
            <span>${r}</span>
        </div>`,
            )
            .join("");

        let total = flowState.savings.reduce((acc, curr) => acc + curr.amount, 0);

        document.getElementById("total-savings").innerText =
            `₹${total.toLocaleString("en-IN")}`;

        document.getElementById("ledger-list").innerHTML = flowState.savings
            .map(
                (s, i) => `
    <div class="flex justify-between items-center py-2 text-[8px] text-zinc-600 border-b border-[#111] pr-2">
<span class="${s.amount < 0 ? "text-red-500" : "text-green-500"}">
  ${s.amount > 0 ? "+" : ""}${s.amount}
</span>
        <span>${s.date}</span>
       
    </div>
  `,
            )
            .join("");
    }

    async function loadDailyShloka() {
        try {
            const today = new Date();

            const seed =
                today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();

            const chapter = (seed % 18) + 1;
            const verse = (seed % 20) + 1;

            const res = await fetch(
                `https://vedicscriptures.github.io/slok/${chapter}/${verse}/`,
            );

            const data = await res.json();
            console.log(data);

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
        window.addReminder = addReminder;

        const clock = setInterval(() => {
            const el = document.getElementById("live-clock");
            if (el) el.innerText = new Date().toLocaleTimeString("en-GB");
        }, 1000);

        initCalendar();
        render();
        selectDate(new Date().toISOString().split("T")[0]);
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
                <div id="live-clock" className="text-lg font-light opacity-40">
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
                        <div className="text-[9px] text-[#333] text-center p-2">M</div>
                        <div className="text-[9px] text-[#333] text-center p-2">T</div>
                        <div className="text-[9px] text-[#333] text-center p-2">W</div>
                        <div className="text-[9px] text-[#333] text-center p-2">T</div>
                        <div className="text-[9px] text-[#333] text-center p-2">F</div>
                        <div className="text-[9px] text-[#333] text-center p-2">S</div>
                        <div className="text-[9px] text-[#333] text-center p-2">S</div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#151515]">
                        <div className="flex justify-between items-center mb-3">
                            <span
                                id="event-status"
                                className="text-[10px] text-zinc-600 uppercase truncate pr-4"
                            >
                                System_Idle...
                            </span>

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
                                className="flex-1 p-2"
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
                        className="mt-4 p-2"
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
                                className="mt-8 w-32 p-2"
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
                    <div className="panel-header">Daily_Gita_Directive!</div>

                    <div className="flex items-center h-full">
                        <p
                            className="text-sm italic text-zinc-600 leading-relaxed"
                            id="quote-display"
                        ></p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DayFlow;


