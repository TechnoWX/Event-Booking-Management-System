import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";
import { BookingRowSkeleton } from "../../components/Skeleton";

function DeleteModal({ booking, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Booking</h3>
                <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete the booking for <span className="font-medium text-gray-700">"{booking.participantName}"</span>?</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function BookingList() {
    const navigate = useNavigate();
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");
    const [events, setEvents] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [bookingsRes, eventsRes] = await Promise.all([
                api.get("/Booking"),
                api.get("/Event"),
            ]);
            setBookings(bookingsRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirm() {
        try {
            await api.delete(`/Booking/${deleteTarget.bookingId}`);
            setBookings((prev) => prev.filter((b) => b.bookingId !== deleteTarget.bookingId));
            toast("Booking deleted.", "success");
            setDeleteTarget(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete booking.";
            toast(msg, "error");
        }
    }

    // Get category name for a booking via its event
    function getCategoryName(booking) {
        const ev = events.find((e) => e.eventId === booking.eventId);
        return ev?.categoryName || "";
    }

    const categories = ["All", ...new Set(events.map((e) => e.categoryName))];

    const filtered = search.trim() === ""
        ? bookings.filter((b) =>
            (filterStatus === "All" || b.status === filterStatus) &&
            (filterCategory === "All" || getCategoryName(b) === filterCategory)
        )
        : bookings
            .map((b) => {
                const q = search.toLowerCase();
                const name = b.participantName.toLowerCase();
                const email = b.participantEmail.toLowerCase();
                const event = b.eventTitle.toLowerCase();
                let score = 0;
                if (name === q) score += 10;
                else if (name.startsWith(q)) score += 6;
                else if (name.includes(q)) score += 4;
                if (email.includes(q)) score += 3;
                if (event.startsWith(q)) score += 4;
                else if (event.includes(q)) score += 2;
                return { ...b, score };
            })
            .filter((b) =>
                b.score > 0 &&
                (filterStatus === "All" || b.status === filterStatus) &&
                (filterCategory === "All" || getCategoryName(b) === filterCategory)
            )
            .sort((a, b) => b.score - a.score);

    const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div className="relative overflow-hidden py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-orange-900">Bookings</h1>
                        <p className="text-sm text-orange-700 mt-0.5">{bookings.length} bookings total</p>
                    </div>
                    <button onClick={() => navigate("/bookings/create")} className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-orange-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Booking
                    </button>
                </div>
            </div>

            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Total</p>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-bold text-emerald-600">{confirmedCount}</p>
                            <p className="text-xs text-emerald-400 mt-0.5">Confirmed</p>
                        </div>
                        <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-bold text-rose-500">{cancelledCount}</p>
                            <p className="text-xs text-rose-400 mt-0.5">Cancelled</p>
                        </div>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search by name, email or event..."
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
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-3 py-2 text-sm rounded-xl font-medium border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                                ))}
                            </select>
                            {["All", "Confirmed", "Cancelled"].map((s) => {
                                const isActive = filterStatus === s;
                                const activeStyle =
                                    s === "Confirmed" ? "bg-emerald-500 text-white border-emerald-500" :
                                        s === "Cancelled" ? "bg-rose-500 text-white border-rose-500" :
                                            "text-white";
                                const inactiveStyle =
                                    s === "Confirmed" ? "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50" :
                                        s === "Cancelled" ? "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50" :
                                            "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50";
                                return (
                                    <button key={s} onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-2 text-sm rounded-xl font-medium transition-colors ${isActive ? activeStyle : inactiveStyle}`}
                                        style={s === "All" && isActive ? { background: "linear-gradient(135deg, #f97316, #ef4444)" } : {}}
                                    >{s}</button>
                                );
                            })}
                        </div>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(6)].map((_, i) => <BookingRowSkeleton key={i} />)}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-rose-400 text-sm">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-base font-medium text-gray-500">No bookings found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                            {(search || filterStatus !== "All" || filterCategory !== "All") && (
                                <button
                                    onClick={() => { setSearch(""); setFilterStatus("All"); setFilterCategory("All"); }}
                                    className="mt-4 text-sm text-orange-500 hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filtered.map((booking) => (
                                <div key={booking.bookingId} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${booking.status === "Confirmed" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                                            {booking.participantName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{booking.participantName}</p>
                                            <p className="text-xs text-gray-400 truncate">{booking.participantEmail}</p>
                                        </div>
                                    </div>

                                    {/* Event + Date */}
                                    <div className="hidden sm:block flex-1 min-w-0">
                                        <p className="text-sm text-gray-500 truncate">{booking.eventTitle}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(booking.bookingDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>

                                    {/* Status + Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${booking.status === "Confirmed"
                                                ? "text-emerald-600"
                                                : "text-rose-500"
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <button onClick={() => navigate(`/bookings/edit/${booking.bookingId}`)} className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">Edit</button>
                                        <button onClick={() => setDeleteTarget(booking)} className="px-3 py-1.5 text-sm font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {deleteTarget && <DeleteModal booking={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
        </div>
    );
}