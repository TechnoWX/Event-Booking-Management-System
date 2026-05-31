import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";
import { CategoryRowSkeleton } from "../../components/Skeleton";

const categoryConfig = {
    Music: {
        bg: "bg-violet-100", text: "text-violet-600", dot: "bg-violet-500",
        gradFrom: "#7c3aed", gradTo: "#a78bfa", eventBadge: "bg-violet-100 text-violet-600",
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
    },
    Sports: {
        bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-500",
        gradFrom: "#0891b2", gradTo: "#67e8f9", eventBadge: "bg-cyan-100 text-cyan-700",
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Tech: {
        bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500",
        gradFrom: "#1d4ed8", gradTo: "#60a5fa", eventBadge: "bg-blue-100 text-blue-600",
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
    Food: {
        bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-500",
        gradFrom: "#d97706", gradTo: "#fcd34d", eventBadge: "bg-amber-100 text-amber-600",
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    },
    Art: {
        bg: "bg-pink-100", text: "text-pink-600", dot: "bg-pink-500",
        gradFrom: "#be185d", gradTo: "#f9a8d4", eventBadge: "bg-pink-100 text-pink-600",
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
};
const defaultConfig = {
    bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400",
    gradFrom: "#6b7280", gradTo: "#d1d5db", eventBadge: "bg-gray-100 text-gray-600",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
};

function DeleteModal({ category, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Category</h3>
                <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <span className="font-medium text-gray-700">"{category.name}"</span>?</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function CategoryList() {
    const navigate = useNavigate();
    const toast = useToast();
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [catRes, evtRes] = await Promise.all([
                api.get("/Category"),
                api.get("/Event"),
            ]);
            setCategories(catRes.data);
            setEvents(evtRes.data);
        } catch (err) {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteConfirm() {
        try {
            await api.delete(`/Category/${deleteTarget.categoryId}`);
            setCategories((prev) => prev.filter((c) => c.categoryId !== deleteTarget.categoryId));
            toast("Category deleted.", "success");
            setDeleteTarget(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete category.";
            toast(msg, "error");
        }
    }

    function getEventCount(categoryId) {
        return events.filter((e) => e.categoryId === categoryId).length;
    }

    const filtered = search.trim() === ""
        ? categories
        : categories
            .map((cat) => {
                const q = search.toLowerCase();
                const name = cat.name.toLowerCase();
                const desc = cat.description?.toLowerCase() || "";
                let score = 0;
                if (name === q) score += 10;
                else if (name.startsWith(q)) score += 6;
                else if (name.includes(q)) score += 4;
                if (desc.includes(q)) score += 2;
                return { ...cat, score };
            })
            .filter((cat) => cat.score > 0)
            .sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div className="relative overflow-hidden py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-orange-900">Categories</h1>
                        <p className="text-sm text-orange-700 mt-0.5">{categories.length} categories total</p>
                    </div>
                    <button onClick={() => navigate("/categories/create")} className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-orange-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Category
                    </button>
                </div>
            </div>

            <div className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="relative mb-6">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search categories..."
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

                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(5)].map((_, i) => <CategoryRowSkeleton key={i} />)}
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
                            <p className="text-base font-medium text-gray-500">No categories found</p>
                            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="mt-4 text-sm text-orange-500 hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filtered.map((cat) => {
                                const config = categoryConfig[cat.name] || defaultConfig;
                                const eventCount = getEventCount(cat.categoryId);
                                return (
                                    <div
                                        key={cat.categoryId}
                                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                                    >
                                        {/* Hover color wash - slides in from left */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                            style={{ background: `linear-gradient(to right, ${config.gradFrom}12 0%, ${config.gradTo}08 40%, transparent 75%)` }}
                                        />

                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Icon box with gradient */}
                                            <div
                                                className={`w-10 h-10 rounded-xl ${config.text} flex items-center justify-center shrink-0`}
                                                style={{ background: `linear-gradient(135deg, ${config.gradTo}55, ${config.gradFrom}33)` }}
                                            >
                                                {config.icon}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-semibold ${config.text}`}>{cat.name}</span>
                                                    {/* Event count badge */}
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.eventBadge}`}>
                                                        {eventCount} {eventCount === 1 ? "event" : "events"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{cat.description || "No description"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => navigate(`/categories/edit/${cat.categoryId}`)} className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 rounded-xl transition-all duration-150">Edit</button>
                                            <button onClick={() => setDeleteTarget(cat)} className="px-3 py-1.5 text-sm font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">Delete</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {deleteTarget && <DeleteModal category={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
        </div>
    );
}