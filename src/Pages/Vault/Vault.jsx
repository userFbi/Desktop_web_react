import React, { useEffect, useState } from "react";
import { Trash2, Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function KeyVault() {
    const defaultVault = [
        { id: 1, service: "GitHub_Personal", identity: "dev_surat_2026", key: "ghp_secure_token_99", type: "SECURE" },
        { id: 2, service: "Google_Main", identity: "admin@focusos.net", key: "P@ssw0rdFocus1", type: "SECURE" }
    ];

    const [vaultData, setVaultData] = useState(() => {
        return JSON.parse(localStorage.getItem("tp_vault_keys")) || defaultVault;
    });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("// Terminal_Ready //");
    const [visiblePass, setVisiblePass] = useState({});

    useEffect(() => {
        localStorage.setItem("tp_vault_keys", JSON.stringify(vaultData));
    }, [vaultData]);

    const filtered = vaultData.filter(item =>
        item.service.toLowerCase().includes(search.toLowerCase()) ||
        item.identity.toLowerCase().includes(search.toLowerCase())
    );

    const notify = (msg) => {
        setStatus(`// ${msg} //`);
        setTimeout(() => setStatus("// Terminal_Ready //"), 2000);
    };

    const addNewKey = () => {
        const service = prompt("Enter Service Name:");
        const identity = prompt("Enter Username/Email:");
        const key = prompt("Enter Password:");

        if (service && identity && key) {
            setVaultData(prev => [
                ...prev,
                { id: Date.now(), service, identity, key, type: "SECURE" }
            ]);
            notify("ENTRY_ADDED");
        }
    };

    const deleteKey = (id) => {
        if (!window.confirm("Confirm Deletion?")) return;
        setVaultData(prev => prev.filter(item => item.id !== id));
        notify("ENTRY_REMOVED");
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
            className="min-h-screen bg-[#050505] text-white p-[3rem]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
            {/* Header */}
            <header className="flex justify-between items-end border-b border-[#151515] pb-8">
                <div>
                    <Link to="/" className="text-[9px] text-[#b3a577] tracking-[0.4em] uppercase transition-all duration-500 block mb-3">
                        {'<< Return_to_Core'}
                    </Link>

                    <h1 className="text-4xl font-extrabold italic tracking-tighter uppercase leading-none">
                        Key<span className="text-[#b3a577]">Vault</span> <span className="text-[#151515]">//</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="FILTER_IDENTITY..."
                        className="bg-[#0a0a0a] border border-[#151515] px-6 py-3 text-[10px] tracking-[0.2em] w-64 text-zinc-400 outline-none focus:border-[#b3a577]"
                    />

                    <button
                        onClick={addNewKey}
                        className="bg-[#b3a577] text-black px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all"
                    >
                        + New_Entry
                    </button>
                </div>
            </header>

            {/* Grid */}
            <main className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-[20px] mt-12">
                {filtered.map(item => (
                    <div key={item.id} className="bg-[#0d0d0d] border border-[#151515] p-6 transition-all duration-300 hover:border-[#b3a577] hover:bg-[#0f0f0f]">

                        <div className="flex justify-between mb-6">
                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Service_Provider</p>
                                <h2 className="text-lg font-bold italic tracking-tighter hover:text-[#b3a577]">
                                    {item.service}
                                </h2>
                            </div>

                            <button onClick={() => deleteKey(item.id)} className="text-zinc-800 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase mb-1">Identity</p>
                                <div className="flex justify-between items-center bg-[#050505] p-3 border border-white/5">
                                    <span className="text-xs text-zinc-400">{item.identity}</span>
                                    <button onClick={() => copy(item.identity)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]"><Copy className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase mb-1">Access_Key</p>
                                <div className="flex justify-between items-center bg-[#050505] p-3 border border-white/5">
                                    <span
                                        className="text-xs tracking-widest"
                                        style={{ WebkitTextSecurity: visiblePass[item.id] ? 'none' : 'disc' }}
                                    >
                                        {item.key}
                                    </span>

                                    <div className="flex gap-3">
                                        <button onClick={() => togglePass(item.id)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]"><Eye className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => copy(item.key)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]"><Copy className="w-3.5 h-3.5" /></button>
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

            {/* Footer */}
            <footer className="mt-24 pt-8 border-t border-[#151515] flex justify-between">
                <p className="text-[9px] text-zinc-700 tracking-widest">ENCRYPTION: AES-LOCAL-STORAGE</p>
                <p className="text-[9px] tracking-[0.4em] uppercase">{status}</p>
            </footer>
        </div>
    );
}