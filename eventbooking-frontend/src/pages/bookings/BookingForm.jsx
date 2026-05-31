import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";

export default function BookingForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [events, setEvents] = useState([]);
    const toast = useToast();
    const [form, setForm] = useState({ eventId: "", participantName: "", participantEmail: "", status: "Confirmed" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get("/Event").then((res) => setEvents(res.data));
        if (isEdit) {
            api.get(`/Booking/${id}`).then((res) => {
                const b = res.data;
                setForm({ eventId: b.eventId, participantName: b.participantName, participantEmail: b.participantEmail, status: b.status });
            });
        }
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    function validate() {
        const newErrors = {};
        if (!form.eventId) newErrors.eventId = "Please select an event.";
        if (!form.participantName.trim()) newErrors.participantName = "Participant name is required.";
        else if (form.participantName.trim().length < 2) newErrors.participantName = "Name must be at least 2 characters.";
        if (!form.participantEmail.trim()) newErrors.participantEmail = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.participantEmail)) newErrors.participantEmail = "Please enter a valid email address.";
        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setIsSubmitting(true);
        try {
            const payload = { ...form, eventId: Number(form.eventId) };
            if (isEdit) await api.put(`/Booking/${id}`, payload);
            else await api.post("/Booking", payload);
            toast(isEdit ? "Booking updated!" : "Booking created!", "success");
            navigate("/bookings");
        } catch (err) {
            const data = err.response?.data;
            let msg = "Failed to save booking.";
            if (data?.message) {
                msg = data.message;
            } else if (data?.errors) {
                // Handle ASP.NET Core ModelState errors
                const firstError = Object.values(data.errors)[0];
                msg = Array.isArray(firstError) ? firstError[0] : firstError;
            }
            toast(msg, "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    function inputClass(field) {
        return `w-full px-3.5 py-2.5 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition ${errors[field] ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-orange-200"}`;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative overflow-hidden px-4 py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="relative">
                        <button onClick={() => navigate("/bookings")} className="absolute -top-1 left-0 flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-white/50 hover:bg-white/70 border border-white/60 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-150">
                            <svg className="w-4 h-4" fill="none" stroke="#ea580c" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            Back to Bookings
                        </button>
                        <div className="text-center pt-2">
                            <h1 className="text-2xl font-bold text-orange-900">{isEdit ? "Edit Booking" : "New Booking"}</h1>
                            <p className="text-sm text-orange-700 mt-1">{isEdit ? "Update the booking details below." : "Fill in the details to register a participant."}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-6">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Event <span className="text-red-400">*</span></label>
                                <div className={`rounded-xl border overflow-hidden ${errors.eventId ? "border-red-300" : "border-gray-200"}`}>
                                    <div className="overflow-y-auto" style={{ maxHeight: "224px" }}>
                                        {events.map((e) => {
                                            const spotsLeft = e.maxParticipants - e.bookedCount;
                                            const isFull = spotsLeft <= 0;
                                            const isSelected = Number(form.eventId) === e.eventId;
                                            return (
                                                <button
                                                    key={e.eventId}
                                                    type="button"
                                                    disabled={isFull && !isEdit}
                                                    onClick={() => { handleChange({ target: { name: "eventId", value: String(e.eventId) } }); }}
                                                    className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-gray-100 last:border-0 transition-colors ${isSelected
                                                            ? "bg-orange-50"
                                                            : isFull
                                                                ? "bg-gray-50 opacity-50 cursor-not-allowed"
                                                                : "bg-white hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${isSelected ? "text-orange-700" : "text-gray-800"}`}>{e.title}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(e.eventDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                                                            {"  "}
                                                            {e.categoryName}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0 ml-3">
                                                        {isFull ? (
                                                            <span className="text-xs font-medium bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">Full</span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">{spotsLeft} left</span>
                                                        )}
                                                        {isSelected && (
                                                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                {errors.eventId && <p className="text-xs text-red-500">{errors.eventId}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Participant Name <span className="text-red-400">*</span></label>
                                <input type="text" name="participantName" value={form.participantName} onChange={handleChange} placeholder="e.g. Ali Hassan" className={inputClass("participantName")} />
                                {errors.participantName && <p className="text-xs text-red-500">{errors.participantName}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Participant Email <span className="text-red-400">*</span></label>
                                <input type="email" name="participantEmail" value={form.participantEmail} onChange={handleChange} placeholder="e.g. ali@email.com" className={inputClass("participantEmail")} />
                                {errors.participantEmail && <p className="text-xs text-red-500">{errors.participantEmail}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Status <span className="text-red-400">*</span></label>
                                <div className="flex gap-3">
                                    {["Confirmed", "Cancelled"].map((s) => (
                                        <label key={s} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${form.status === s ? (s === "Confirmed" ? "bg-green-50 border-green-300 text-green-700" : "bg-red-50 border-red-300 text-red-500") : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                                            <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="hidden" />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => navigate("/bookings")} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 active:bg-orange-600 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 transition-colors duration-150">
                                    {isSubmitting ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{isEdit ? "Saving..." : "Creating..."}</>) : (isEdit ? "Save Changes" : "Create Booking")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}