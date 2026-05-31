import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";

export default function EventForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const toast = useToast();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", location: "", eventDate: "", maxParticipants: "", categoryId: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get("/Category").then((res) => setCategories(res.data));
        if (isEdit) {
            api.get(`/Event/${id}`).then((res) => {
                const e = res.data;
                const d = new Date(e.eventDate);
                const pad = (n) => String(n).padStart(2, "0");
                setForm({ title: e.title, description: e.description || "", location: e.location, eventDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`, maxParticipants: e.maxParticipants, categoryId: e.categoryId });
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
        if (!form.title.trim()) newErrors.title = "Title is required.";
        else if (form.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters.";
        if (!form.location.trim()) newErrors.location = "Location is required.";
        if (!form.eventDate) newErrors.eventDate = "Event date and time is required.";
        else if (new Date(form.eventDate) <= new Date()) newErrors.eventDate = "Event date must be in the future.";
        if (!form.maxParticipants) newErrors.maxParticipants = "Max participants is required.";
        else if (Number(form.maxParticipants) < 1) newErrors.maxParticipants = "Must be at least 1.";
        if (!form.categoryId) newErrors.categoryId = "Please select a category.";
        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setIsSubmitting(true);
        try {
            const payload = { ...form, categoryId: Number(form.categoryId), maxParticipants: Number(form.maxParticipants) };
            if (isEdit) await api.put(`/Event/${id}`, payload);
            else await api.post("/Event", payload);
            toast(isEdit ? "Event updated successfully!" : "Event created successfully!", "success");
            navigate("/events");
        } catch (err) {
            const data = err.response?.data;
            let msg = "Failed to save event. Please try again.";
            if (data?.message) {
                msg = data.message;
            } else if (data?.errors) {
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

    function ErrorMsg({ msg }) {
        if (!msg) return null;
        return <p className="text-xs text-red-500 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{msg}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Colorful Header */}
            <div className="relative overflow-hidden px-4 py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="relative">
                        <button onClick={() => navigate("/events")} className="absolute -top-1 left-0 flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-white/50 hover:bg-white/70 border border-white/60 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-150">
                            <svg className="w-4 h-4" fill="none" stroke="#ea580c" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            Back to Events
                        </button>
                        <div className="text-center pt-2">
                            <h1 className="text-2xl font-bold text-orange-900">{isEdit ? "Edit Event" : "Create New Event"}</h1>
                            <p className="text-sm text-orange-700 mt-1">{isEdit ? "Update the event details below." : "Fill in the details to create a new event."}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="px-4 py-6">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Event Title <span className="text-red-400">*</span></label>
                                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Jazz Night 2026" className={inputClass("title")} />
                                <ErrorMsg msg={errors.title} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal ml-1">(optional)</span></label>
                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your event..." rows={3} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition resize-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Category <span className="text-red-400">*</span></label>
                                <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass("categoryId")}>
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (<option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>))}
                                </select>
                                <ErrorMsg msg={errors.categoryId} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Location <span className="text-red-400">*</span></label>
                                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. KLCC Convention Centre" className={inputClass("location")} />
                                <ErrorMsg msg={errors.location} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Date & Time <span className="text-red-400">*</span></label>
                                    <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} className={inputClass("eventDate")} />
                                    <ErrorMsg msg={errors.eventDate} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Max Participants <span className="text-red-400">*</span></label>
                                    <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} placeholder="e.g. 100" min={1} className={inputClass("maxParticipants")} />
                                    <ErrorMsg msg={errors.maxParticipants} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => navigate("/events")} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 active:bg-orange-600 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 transition-colors duration-150">
                                    {isSubmitting ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{isEdit ? "Saving..." : "Creating..."}</>) : (isEdit ? "Save Changes" : "Create Event")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}