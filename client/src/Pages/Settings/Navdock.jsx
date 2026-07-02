// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Settings } from "lucide-react";
// import { SECTIONS, STORAGE_KEY } from "./SettingsPage";

// const DEFAULTS = Object.fromEntries(SECTIONS.map((s) => [s.key, true]));

// export default function NavDock() {
//     const location = useLocation();
//     const [enabled, setEnabled] = useState(DEFAULTS);

//     // Re-read on every route change, so flipping a toggle on the Settings
//     // page and navigating back updates the dock immediately.
//     useEffect(() => {
//         try {
//             const saved = localStorage.getItem(STORAGE_KEY);
//             setEnabled(saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS);
//         } catch {
//             setEnabled(DEFAULTS);
//         }
//     }, [location]);

//     return (
//         <div className="flex items-center gap-6">
//             {SECTIONS.filter((s) => enabled[s.key] !== false).map((s) => (
//                 <Link key={s.key} to={s.path} className="nav-link text-white">
//                     {s.label}
//                 </Link>
//             ))}

//             <Link
//                 to="/settings"
//                 className="nav-link text-[#b3a577] flex items-center gap-1.5"
//             >
//                 <Settings size={14} />
//                 Settings
//             </Link>
//         </div>
//     );
// }