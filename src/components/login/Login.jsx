import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';

        try {
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);

            if (!isSignup) {
                // Save the VIP Token to localStorage
                localStorage.setItem('focusToken', data.token);
                localStorage.setItem('username', data.username);
                onLoginSuccess(); // Tell App.js to show the dashboard
            } else {
                setIsSignup(false); // Move to login after successful register
                alert("Account created! Please login.");
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Authentication Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080808] font-['Inter']">
            <div className="w-full max-w-md p-8 bg-[#111] border border-white/5 rounded-3xl backdrop-blur-xl shadow-2xl">
                <h2 className="text-2xl font-black text-white tracking-tighter mb-2">
                    {isSignup ? "CREATE_PROTOCOL" : "SYSTEM_ACCESS"}
                </h2>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-8">
                    FocusOS // Identity Verification
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Identifier</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Access Key</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-mono">{error}</p>}

                    <button type="submit" className="w-full bg-[#b3a577] text-black font-bold p-4 rounded-xl hover:bg-white transition-colors duration-500 uppercase text-xs tracking-widest">
                        {isSignup ? "Initialize Account" : "Authorize Access"}
                    </button>
                </form>

                <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="w-full mt-6 text-zinc-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                    {isSignup ? "Already registered? Login" : "New User? Create Protocol"}
                </button>
            </div>
        </div>
    );
};

export default Login;