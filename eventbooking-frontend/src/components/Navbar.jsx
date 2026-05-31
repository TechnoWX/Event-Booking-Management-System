import { NavLink } from "react-router-dom";

export default function Navbar() {
    const navItems = [
        { to: "/", label: "Dashboard", end: true },
        { to: "/events", label: "Events", end: false },
        { to: "/categories", label: "Categories", end: false },
        { to: "/bookings", label: "Bookings", end: false },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo + Tagline */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-800 tracking-tight">EventBook</span>

                </div>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `relative px-3 py-1.5 text-sm transition-all duration-150 rounded-lg
                ${isActive
                                    ? "font-semibold text-orange-600"
                                    : "font-medium text-gray-500 hover:text-gray-800"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {item.label}
                                    {/* Sliding underline */}
                                    <span
                                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                                        style={{
                                            background: "linear-gradient(to right, #f97316, #ef4444)",
                                            transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                            transformOrigin: "left",
                                        }}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}