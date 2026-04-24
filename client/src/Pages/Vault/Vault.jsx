import React, { useEffect, useState } from "react";
import { Trash2, Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import "./Vault.css";

export default function KeyVault() {
    const defaultVault = [
        { id: 1, service: "GitHub_Personal", identity: "dev_surat_2026", key: "ghp_secure_token_99", type: "SECURE" },
        { id: 2, service: "Google_Main", identity: "admin@focusos.net", key: "P@ssw0rdFocus1", type: "SECURE" }
    ];

    const [vaultData, setVaultData] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("// Terminal_Ready //");
    const [visiblePass, setVisiblePass] = useState({});

    useEffect(() => {
        fetchVault();
    }, []);

    const fetchVault = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/vault");
            const data = await res.json();
            setVaultData(data);
        } catch (err) {
            console.error(err);
        }
    };


    const filtered = vaultData.filter(item =>
        item.service.toLowerCase().includes(search.toLowerCase()) ||
        item.identity.toLowerCase().includes(search.toLowerCase())
    );

    const notify = (msg) => {
        setStatus(`// ${msg} //`);
        setTimeout(() => setStatus("// Terminal_Ready //"), 2000);
    };

    const addNewKey = async () => {
        const service = prompt("Enter Service Name:");
        const identity = prompt("Enter Username/Email:");
        const key = prompt("Enter Password:");

        if (service && identity && key) {
            try {
                await fetch("http://localhost:5000/api/vault/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ service, identity, key }),
                });

                fetchVault(); // refresh
                notify("ENTRY_ADDED");

            } catch (err) {
                console.error(err);
            }
        }
    };

    const deleteKey = async (id) => {
        if (!window.confirm("Confirm Deletion?")) return;

        try {
            await fetch(`http://localhost:5000/api/vault/${id}`, {
                method: "DELETE",
            });

            fetchVault();
            notify("ENTRY_REMOVED");

        } catch (err) {
            console.error(err);
        }
    };

    const togglePass = (id) => {
        setVisiblePass(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copy = (text) => {
        navigator.clipboard.writeText(text);
        notify("DATA_COPIED_TO_CLIPBOARD");
    };

    return (
        <div
            className="min-h-screen bg-[#050505] text-white p-6 md:p-[3rem]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {/* Header - Stacks on mobile, Rows on Desktop */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-[#151515] pb-8 gap-6">
                <div className="w-full md:w-auto">
                    <Link to="/" className="text-[9px] text-[#b3a577] tracking-[0.4em] uppercase transition-all duration-500 block mb-3">
                        {'<< Return_to_Core'}
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-extrabold italic tracking-tighter uppercase leading-none">
                        Key<span className="text-[#b3a577]">Vault</span> <span className="text-[#151515]">//</span>
                    </h1>
                </div>

                {/* Controls - Full width on mobile */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="FILTER_IDENTITY..."
                        className="bg-[#0a0a0a] border border-[#151515] px-6 py-3 text-[10px] tracking-[0.2em] w-full sm:w-64 text-zinc-400 outline-none focus:border-[#b3a577]"
                    />

                    <button
                        onClick={addNewKey}
                        className="bg-[#b3a577] text-black px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all w-full sm:w-auto"
                    >
                        + New_Entry
                    </button>
                </div>
            </header>

            {/* Grid - Adjusted min-width for better mobile fitting */}
            <main className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[20px] mt-12">
                {filtered.map(item => (
                    <div key={item._id} className="vault-card bg-[#0d0d0d] border border-[#151515] p-6 transition-all duration-300 hover:border-[#b3a577] hover:bg-[#0f0f0f]">
                        <div className="flex justify-between mb-6">
                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Service_Provider</p>
                                <h2 className="text-lg font-bold italic tracking-tighter hover:text-[#b3a577] break-all pr-4">
                                    {item.service}
                                </h2>
                            </div>
                            <button onClick={() => deleteKey(item._id)} className="text-zinc-800 hover:text-red-500 flex-shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase mb-1">Identity</p>
                                <div className="flex justify-between items-center bg-[#050505] p-3 border border-white/5">
                                    <span className="text-xs text-zinc-400 truncate pr-2">{item.identity}</span>
                                    <button onClick={() => copy(item.identity)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577] flex-shrink-0">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase mb-1">Access_Key</p>
                                <div className="flex justify-between items-center bg-[#050505] p-3 border border-white/5">
                                    <span
                                        className="text-xs tracking-widest truncate pr-2"
                                        style={{ WebkitTextSecurity: visiblePass[item._id] ? 'none' : 'disc' }}
                                    >
                                        {item.key}
                                    </span>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <button onClick={() => togglePass(item._id)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]">
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => copy(item.key)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
                            <span className="text-[8px] text-zinc-700 uppercase">Status_Check</span>
                            <span className="text-[8px] px-2 py-0.5 bg-green-900/20 text-green-500 rounded-full font-bold uppercase">
                                {item.type}
                            </span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Footer - Vertical on small mobile */}
            <footer className="mt-24 pt-8 border-t border-[#151515] flex flex-col sm:flex-row justify-between gap-4">
                <p className="text-[9px] text-zinc-700 tracking-widest text-center sm:text-left">ENCRYPTION: AES-LOCAL-STORAGE</p>
                <p className="text-[9px] tracking-[0.4em] uppercase text-center sm:text-right text-[#b3a577]">{status}</p>
            </footer>
        </div>
    );
}