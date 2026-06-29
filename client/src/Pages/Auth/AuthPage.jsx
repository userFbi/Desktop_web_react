import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = ({ onLoginSuccess }) => {
    const [isSignup, setIsSignup] = useState(false);
    // ✅ 'identifier' is used for login (email OR username), 'email' is used for signup only
    const [formData, setFormData] = useState({ username: '', email: '', identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';

        // ✅ only send the fields the backend actually expects for each mode
        const payload = isSignup
            ? { username: formData.username, email: formData.email, password: formData.password }
            : { identifier: formData.identifier, password: formData.password };

        try {
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);

            if (!isSignup) {
                localStorage.setItem('focusToken', data.token);
                // ✅ backend now returns user.username, matching what we read here
                localStorage.setItem('username', data.user.username);
                onLoginSuccess();
            } else {
                setIsSignup(false);
                setFormData({ username: '', email: '', identifier: '', password: '' });
                alert("Account created! Please login.");
            }
        } catch (err) {
            // ✅ backend sends `message`, not `msg`
            setError(err.response?.data?.message || "Authentication Failed");
        } finally {
            setLoading(false);
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
                    {/* Username — signup only */}
                    {isSignup && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                required
                                minLength={3}
                                value={formData.username}
                                className="w-full bg-white/5 text-sm border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Email — signup only (dedicated email field) */}
                    {isSignup && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                className="w-full bg-white/5 text-sm border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Identifier — login only (accepts email OR username) */}
                    {!isSignup && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Email or Username</label>
                            <input
                                type="text"
                                name="identifier"
                                required
                                value={formData.identifier}
                                className="w-full bg-white/5 text-sm border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Password — both modes */}
                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Access Key</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            className="w-full bg-white/5 text-sm border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#b3a577] transition-all"
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-mono">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#b3a577] text-black font-bold p-4 rounded-xl hover:bg-white transition-colors duration-500 uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : (isSignup ? "Initialize Account" : "Authorize Access")}
                    </button>
                </form>

                <button
                    onClick={() => {
                        setIsSignup(!isSignup);
                        setError('');
                        setFormData({ username: '', email: '', identifier: '', password: '' });
                    }}
                    className="w-full mt-6 text-zinc-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                    {isSignup ? "Already registered? Login" : "New User? Create Protocol"}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;