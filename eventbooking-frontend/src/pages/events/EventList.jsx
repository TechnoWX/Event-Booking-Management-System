import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";
import { EventCardSkeleton } from "../../components/Skeleton";

const categoryConfig = {
    Music: { badge: "bg-violet-100 text-violet-600", gradFrom: "#7c3aed", gradTo: "#a78bfa", barColor: "bg-violet-400", spotColor: "text-violet-600", edit: "text-violet-600 border border-violet-300 hover:bg-violet-50", activeFilter: "bg-violet-500 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" },
    Sports: { badge: "bg-cyan-100 text-cyan-700", gradFrom: "#0891b2", gradTo: "#67e8f9", barColor: "bg-cyan-400", spotColor: "text-cyan-700", edit: "text-cyan-700 border border-cyan-300 hover:bg-cyan-50", activeFilter: "bg-cyan-600 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" },
    Tech: { badge: "bg-blue-100 text-blue-600", gradFrom: "#1d4ed8", gradTo: "#60a5fa", barColor: "bg-blue-400", spotColor: "text-blue-600", edit: "text-blue-600 border border-blue-300 hover:bg-blue-50", activeFilter: "bg-blue-500 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" },
    Food: { badge: "bg-amber-100 text-amber-600", gradFrom: "#d97706", gradTo: "#fcd34d", barColor: "bg-amber-400", spotColor: "text-amber-600", edit: "text-amber-600 border border-amber-300 hover:bg-amber-50", activeFilter: "bg-amber-500 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" },
    Art: { badge: "bg-pink-100 text-pink-600", gradFrom: "#be185d", gradTo: "#f9a8d4", barColor: "bg-pink-400", spotColor: "text-pink-600", edit: "text-pink-600 border border-pink-300 hover:bg-pink-50", activeFilter: "bg-pink-500 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" },
};
const defaultConfig = { badge: "bg-gray-100 text-gray-600", gradFrom: "#6b7280", gradTo: "#d1d5db", barColor: "bg-gray-400", spotColor: "text-gray-600", edit: "text-gray-600 border border-gray-300 hover:bg-gray-50", activeFilter: "bg-gray-500 text-white", inactiveFilter: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50" };

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
}
function getSpotsStatus(booked, max) {
    const remaining = max - booked;
    const pct = (booked / max) * 100;
    if (remaining === 0) return { label: "Full", overrideColor: "text-rose-500", overrideBar: "bg-rose-400" };
    if (pct >= 80) return { label: `${remaining} left`, overrideColor: "text-orange-500", overrideBar: "bg-orange-400" };
    return { label: `${remaining} left`, overrideColor: null, overrideBar: null };
}

function DeleteModal({ event, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Event</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-700">"{event.title}"</span>? You will have 3 seconds to undo.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

function EventCard({ event, onDelete }) {
    const navigate = useNavigate();
    const toast = useToast();
    const spots = getSpotsStatus(event.bookedCount, event.maxParticipants);
    const config = categoryConfig[event.categoryName] || defaultConfig;
    const isFull = event.bookedCount >= event.maxParticipants;
    const spotColor = spots.overrideColor || config.spotColor;
    const barColor = spots.overrideBar || config.barColor;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col relative">
            <div
                className="absolute rounded-full -top-15 -right-10 pointer-events-none"
                style={{
                    width: 250,
                    height: 250,
                    background: `radial-gradient(circle at 80% 10%, ${config.gradFrom}44 0%, ${config.gradTo}2e 20%, ${config.gradTo}18 42%, ${config.gradTo}0a 65%, transparent 85%)`,
                }}
            />
            <div className="p-5 flex flex-col gap-4 flex-1 relative z-10">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.badge}`}>{event.categoryName}</span>
                        <h3 className="mt-2 text-base font-semibold text-gray-800 leading-snug">{event.title}</h3>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{event.description}</p>
                    </div>
                    {isFull && (
                        <span className="shrink-0 text-xs font-semibold bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full">Full</span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.eventDate)} - {formatTime(event.eventDate)}
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>
                </div>

                <div className={isFull ? "rounded-xl p-2 -mx-2 bg-rose-50" : ""}>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{event.bookedCount} / {event.maxParticipants} booked</span>
                        <span className={`font-medium ${spotColor}`}>{spots.label}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full ${barColor} transition-all`}
                            style={{ width: `${Math.min((event.bookedCount / event.maxParticipants) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => navigate(`/events/edit/${event.eventId}`)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl transition-colors bg-transparent ${config.edit}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(event)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EventList() {
    const navigate = useNavigate();
    const toast = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletedEvent, setDeletedEvent] = useState(null);
    const [undoTimer, setUndoTimer] = useState(null);

    const categories = ["All", ...new Set(events.map((e) => e.categoryName))];

    useEffect(() => { fetchEvents(); }, []);

    async function fetchEvents() {
        try {
            setLoading(true);
            const res = await api.get("/Event");
            setEvents(res.data);
        } catch (err) {
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirm() {
        const target = deleteTarget;
        setDeleteTarget(null);
        setEvents((prev) => prev.filter((e) => e.eventId !== target.eventId));
        setDeletedEvent(target);

        const timer = setTimeout(async () => {
            try {
                await api.delete(`/Event/${target.eventId}`);
                toast("Event deleted.", "success");
            } catch (err) {
                setEvents((prev) => [...prev, target]);
                const msg = err.response?.data?.message || "Failed to delete event.";
                toast(msg, "error");
            }
            setDeletedEvent(null);
        }, 3500);
        setUndoTimer(timer);
    }

    function handleUndo() {
        if (undoTimer) clearTimeout(undoTimer);
        setEvents((prev) => [...prev, deletedEvent]);
        setDeletedEvent(null);
        setUndoTimer(null);
        toast("Delete cancelled.", "info");
    }

    const filtered = search.trim() === ""
        ? events.filter((e) => filterCategory === "All" || e.categoryName === filterCategory)
        : events
            .map((e) => {
                const q = search.toLowerCase();
                const title = e.title.toLowerCase();
                const location = e.location.toLowerCase();
                const category = e.categoryName.toLowerCase();
                let score = 0;
                if (title === q) score += 10;
                else if (title.startsWith(q)) score += 6;
                else if (title.includes(q)) score += 4;
                if (location.includes(q)) score += 2;
                if (category.includes(q)) score += 1;
                return { ...e, score };
            })
            .filter((e) => e.score > 0 && (filterCategory === "All" || e.categoryName === filterCategory))
            .sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative overflow-hidden py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-orange-900">Events</h1>
                        <p className="text-sm text-orange-700 mt-0.5">
                            {search || filterCategory !== "All"
                                ? `Showing ${filtered.length} of ${events.length} events`
                                : `${events.length} events available`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/events/create")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Event
                    </button>
                </div>
            </div>

            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search events or location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => {
                                const config = categoryConfig[cat] || defaultConfig;
                                const isActive = filterCategory === cat;
                                const isAll = cat === "All";
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-3 py-2 text-sm rounded-xl font-medium transition-colors ${isAll
                                                ? isActive ? "text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                                                : isActive ? config.activeFilter : config.inactiveFilter
                                            }`}
                                        style={isAll && isActive ? { background: "linear-gradient(135deg, #f97316, #ef4444)" } : {}}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400 text-sm">Loading events...</div>
                    ) : error ? (
                        <div className="text-center py-20 text-rose-400 text-sm">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-base font-medium text-gray-500">No events found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                            {(search || filterCategory !== "All") && (
                                <button
                                    onClick={() => { setSearch(""); setFilterCategory("All"); }}
                                    className="mt-4 text-sm text-orange-500 hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map((event) => (
                                <EventCard key={event.eventId} event={event} onDelete={setDeleteTarget} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {deleteTarget && (
                <DeleteModal
                    event={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Undo banner */}
            {deletedEvent && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-800 text-white text-sm px-5 py-3 rounded-2xl shadow-xl z-50">
                    <span className="text-gray-300">Deleted <span className="text-white font-medium">"{deletedEvent.title}"</span></span>
                    <button onClick={handleUndo} className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Undo</button>
                </div>
            )}
        </div>
    );
}