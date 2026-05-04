import React, { useEffect, useState } from "react";
import { Trash2, Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import "./Vault.css";

export default function KeyVault() {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        serviceName: "",
        username: "",
        password: ""
    });

    const [deleteId, setDeleteId] = useState(null);



    const [vaultData, setVaultData] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("// Terminal_Ready //");
    const [visiblePass, setVisiblePass] = useState({});

    useEffect(() => {
        fetchVault();
    }, []);

    const fetchVault = async () => {
        try {
            const res = await fetch("http://localhost:5000/vault");
            const data = await res.json();
            setVaultData(data);
        } catch (err) {
            console.error(err);
        }
    };


    const filtered = vaultData.filter(item =>
        item.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase())
    );

    const notify = (msg) => {
        setStatus(`// ${msg} //`);
        setTimeout(() => setStatus("// Terminal_Ready //"), 2000);
    };

    const addNewKey = async () => {
        const { serviceName, username, password } = form;

        if (!serviceName || !username || !password) return;

        try {
            await fetch("http://localhost:5000/vault/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            setForm({ serviceName: "", username: "", password: "" });
            setShowModal(false);
            fetchVault();
            notify("ENTRY_ADDED");

        } catch (err) {
            console.error(err);
        }
    };

    const deleteKey = async (id) => {
        try {
            await fetch(`http://localhost:5000/vault/delete/${id}`, {
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
                        Key<span className="text-[#b3a577]">Vault</span><span className="text-[#151515]">//</span>
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
                        onClick={() => setShowModal(true)}
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
                                <h2 className="text-lg font-bold italic capitalize tracking-tighter hover:text-[#b3a577] break-all pr-4">
                                    {item.serviceName}
                                </h2>
                            </div>
                            <button onClick={() => setDeleteId(item._id)} className="text-zinc-800 hover:text-red-500 flex-shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[8px] text-zinc-600 uppercase mb-1">Identity</p>
                                <div className="flex justify-between items-center bg-[#050505] p-3 border border-white/5">
                                    <span className="text-xs text-zinc-400 truncate pr-2">{item.username}</span>
                                    <button onClick={() => copy(item.username)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577] flex-shrink-0">
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
                                        {item.password}
                                    </span>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <button onClick={() => togglePass(item._id)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]">
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => copy(item.password)} className="opacity-40 hover:opacity-100 hover:text-[#b3a577]">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
                            <span className="text-[8px] text-zinc-700 uppercase">Status_Check</span>
                            <span className="text-[8px] px-2 py-0.5 bg-green-900/20 text-green-500 rounded-full font-bold uppercase">
                                {item.type || "SECURE"}
                            </span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Footer - Vertical on small mobile */}
            <footer className="mt-24 pt-8 border-t border-[#151515] flex flex-col sm:flex-row justify-end gap-4">

                <p className="text-[9px] tracking-[0.4em] uppercase text-center sm:text-right text-[#b3a577]">{status}</p>
            </footer>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-[#0d0d0d] border border-[#151515] p-8 w-[90%] max-w-md">

                        <h2 className="text-lg font-bold mb-6 tracking-widest uppercase text-[#b3a577]">
                            New Entry
                        </h2>

                        {/* Service */}
                        <input
                            placeholder="Service Name"
                            value={form.serviceName}
                            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                            className="w-full mb-4 bg-[#050505] border border-white/10 p-3 text-xs outline-none focus:border-[#b3a577]"
                        />

                        {/* Username */}
                        <input
                            placeholder="Username / Email"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full mb-4 bg-[#050505] border border-white/10 p-3 text-xs outline-none focus:border-[#b3a577]"
                        />

                        {/* Password */}
                        <input
                            placeholder="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full mb-6 bg-[#050505] border border-white/10 p-3 text-xs outline-none focus:border-[#b3a577]"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-xs uppercase text-zinc-500 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={addNewKey}
                                className="bg-[#b3a577] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-[#0d0d0d] border border-[#151515] p-8 w-[90%] max-w-sm">

                        <h2 className="text-sm font-bold tracking-widest uppercase text-red-500 mb-4">
                            Confirm Deletion
                        </h2>

                        <p className="text-xs text-zinc-400 mb-6">
                           The selected record will be deleted permanently.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-xs uppercase text-zinc-500 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    deleteKey(deleteId);
                                    setDeleteId(null);
                                }}
                                className="bg-red-500 text-black px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-400"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}