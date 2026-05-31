import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from "recharts";
import api from "../api";

function useCountUp(target, duration = 1000, startAnimation = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!startAnimation || target === 0) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(timer); }
            else setValue(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, startAnimation]);
    return value;
}

function StatCard({ label, target, textClass, borderColor, page, delay, startAnimation }) {
    const value = useCountUp(target, 1000, startAnimation);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!startAnimation) return;
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [startAnimation, delay]);

    return (
        <button
            onClick={() => navigate(page)}
            className={`bg-white rounded-2xl p-4 text-left border border-gray-100 hover:shadow-md transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ borderBottom: `3px solid ${borderColor}`, transitionDelay: `${delay}ms` }}
        >
            <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </button>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [eventsRes, bookingsRes, categoriesRes] = await Promise.all([
                    api.get("/Event"),
                    api.get("/Booking"),
                    api.get("/Category"),
                ]);
                setEvents(eventsRes.data);
                setBookings(bookingsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError(true);
            } finally {
                setLoading(false);
                setTimeout(() => setStartAnimation(true), 100);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400 text-sm">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">Failed to load dashboard</p>
                <button onClick={() => window.location.reload()} className="text-sm text-orange-500 hover:underline">Refresh</button>
            </div>
        );
    }

    const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;
    const fullEvents = events.filter((e) => e.bookedCount >= e.maxParticipants).length;

    const stats = [
        { label: "Total Events", value: events.length, textClass: "text-orange-500", borderColor: "#f97316", page: "/events" },
        { label: "Total Bookings", value: bookings.length, textClass: "text-pink-500", borderColor: "#ec4899", page: "/bookings" },
        { label: "Confirmed", value: confirmedCount, textClass: "text-emerald-500", borderColor: "#10b981", page: "/bookings" },
        { label: "Cancelled", value: cancelledCount, textClass: "text-rose-500", borderColor: "#f43f5e", page: "/bookings" },
        { label: "Categories", value: categories.length, textClass: "text-amber-500", borderColor: "#f59e0b", page: "/categories" },
        { label: "Full Events", value: fullEvents, textClass: "text-violet-500", borderColor: "#8b5cf6", page: "/events" },
    ];

    // Chart 1: Bookings per Event
    const bookingsPerEvent = events
        .map((e) => ({
            name: e.title,
            bookings: bookings.filter((b) => b.eventId === e.eventId).length,
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 6);

    // Chart 2: Bookings by Category
    const bookingsByCategory = categories.map((cat) => {
        const catEvents = events.filter((e) => e.categoryId === cat.categoryId);
        const total = catEvents.reduce((sum, e) =>
            sum + bookings.filter((b) => b.eventId === e.eventId).length, 0);
        return { name: cat.name, bookings: total };
    }).sort((a, b) => b.bookings - a.bookings);

    // Upcoming events (future dates, sorted soonest first)
    const upcoming = events
        .filter((e) => new Date(e.eventDate) > new Date())
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .slice(0, 5);

    const categoryDotColors = {
        Music: "#8b5cf6", Sports: "#ef4444", Tech: "#3b82f6",
        Food: "#f59e0b", Art: "#ec4899",
    };

    function formatUpcomingDate(dateStr) {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "1 day";
        return `${diff} days`;
    }

    function getDayUrgencyRelative(eventDate, allUpcoming) {
        const diffs = allUpcoming.map(e => Math.ceil((new Date(e.eventDate) - new Date()) / (1000 * 60 * 60 * 24)));
        const minDiff = Math.min(...diffs);
        const maxDiff = Math.max(...diffs);
        const diff = Math.ceil((new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (minDiff === maxDiff) return "text-orange-500";
        const position = (diff - minDiff) / (maxDiff - minDiff);
        if (position <= 0.2) return "text-rose-600";
        if (position <= 0.4) return "text-orange-500";
        if (position <= 0.6) return "text-amber-500";
        if (position <= 0.8) return "text-yellow-500";
        return "text-gray-400";
    }

    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-md text-xs">
                    <p className="font-medium text-gray-700">{label}</p>
                    <p className="text-orange-500">{payload[0].value} bookings</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Header */}
            <div className={`mb-8 transition-all duration-500 ${startAnimation ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-0.5">Overview of your event booking system</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {stats.map((stat, i) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        target={stat.value}
                        textClass={stat.textClass}
                        borderColor={stat.borderColor}
                        page={stat.page}
                        delay={i * 80}
                        startAnimation={startAnimation}
                    />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Horizontal Bar - Bookings per Event */}
                <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all duration-700 ${startAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: "400ms" }}
                >
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Bookings per Event</h2>
                    <div className="flex flex-col gap-3">
                        {bookingsPerEvent.map((item, i) => {
                            const maxVal = Math.max(...bookingsPerEvent.map(x => x.bookings), 1);
                            const pct = (item.bookings / maxVal) * 100;
                            return (
                                <div key={item.name} className={`flex items-center gap-3 transition-all duration-500 ${startAnimation ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${500 + i * 80}ms` }}>
                                    <span className="text-xs text-gray-500 w-32 shrink-0 leading-tight break-words text-center">{item.name}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                                        <div
                                            className="h-5 rounded-full"
                                            style={{
                                                width: startAnimation ? `${pct}%` : "0%",
                                                background: "#fbbf24",
                                                transition: `width 800ms cubic-bezier(0.4, 0, 0.2, 1) ${600 + i * 100}ms`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-orange-500 w-4 shrink-0 text-right">{item.bookings}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bar Chart - Bookings by Category */}
                <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all duration-700 ${startAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: "500ms" }}
                >
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Bookings by Category</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={bookingsByCategory} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={customTooltip} cursor={{ fill: "#fff7ed" }} />
                            <Bar dataKey="bookings" radius={[6, 6, 0, 0]} fill="#fb923c"
                                isAnimationActive={true} animationBegin={600} animationDuration={1000} animationEasing="ease-out" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* Recent Bookings */}
                <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all duration-700 self-start ${startAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: "600ms" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">Recent Bookings</h2>
                        <button onClick={() => navigate("/bookings")} className="text-xs text-orange-500 hover:underline font-medium">View all</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 text-xs text-gray-400 font-medium">Participant</th>
                                <th className="text-left py-2 text-xs text-gray-400 font-medium">Event</th>
                                <th className="text-left py-2 text-xs text-gray-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.slice(0, 5).map((b, i) => {
                                const isConfirmed = b.status === "Confirmed";
                                return (
                                    <tr
                                        key={b.bookingId}
                                        className={`border-b border-gray-50 hover:bg-gray-50 transition-all duration-500 ${startAnimation ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                                        style={{ transitionDelay: `${700 + i * 80}ms` }}
                                    >
                                        <td className="py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${isConfirmed ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                                                    {b.participantName.charAt(0)}
                                                </div>
                                                <span className="text-gray-800 font-medium text-xs">{b.participantName}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 text-gray-400 text-xs">{b.eventTitle}</td>
                                        <td className="py-2.5">
                                            <span className={`text-xs font-medium ${isConfirmed ? "text-emerald-600" : "text-rose-500"}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Upcoming Events */}
                <div
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all duration-700 self-start ${startAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: "700ms" }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">Upcoming Events</h2>
                        <button onClick={() => navigate("/events")} className="text-xs text-orange-500 hover:underline font-medium">View all</button>
                    </div>
                    {upcoming.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No upcoming events</p>
                    ) : (
                        <div className="flex flex-col">
                            {upcoming.map((e, i) => {
                                const dotColor = categoryDotColors[e.categoryName] || "#9ca3af";
                                const spotsLeft = e.maxParticipants - e.bookedCount;
                                const fillPct = Math.min((e.bookedCount / e.maxParticipants) * 100, 100);
                                const isFull = spotsLeft <= 0;
                                const urgencyClass = getDayUrgencyRelative(e.eventDate, upcoming);
                                const diff = Math.ceil((new Date(e.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
                                return (
                                    <div
                                        key={e.eventId}
                                        className={`flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 transition-all duration-500 ${startAnimation ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                                        style={{ transitionDelay: `${800 + i * 80}ms` }}
                                    >
                                        {/* Date */}
                                        <div className="w-9 shrink-0 text-center pt-0.5">
                                            <p className={`text-lg font-bold leading-none ${urgencyClass}`}>{diff}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5 font-semibold tracking-wide">days</p>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                {e.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{isFull ? "Full" : `${spotsLeft} spots left`}
                                            </p>
                                            {/* Thin progress bar */}
                                            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-1 rounded-full transition-all duration-700"
                                                    style={{
                                                        width: startAnimation ? `${fillPct}%` : "0%",
                                                        background: dotColor,
                                                        transition: `width 800ms cubic-bezier(0.4,0,0.2,1) ${900 + i * 100}ms`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}