import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { useToast } from "../../components/Toast";

export default function CategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const toast = useToast();
    const [form, setForm] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            api.get(`/Category/${id}`).then((res) => {
                setForm({ name: res.data.name, description: res.data.description || "" });
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
        if (!form.name.trim()) newErrors.name = "Category name is required.";
        else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";
        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setIsSubmitting(true);
        try {
            if (isEdit) await api.put(`/Category/${id}`, form);
            else await api.post("/Category", form);
            toast(isEdit ? "Category updated!" : "Category created!", "success");
            navigate("/categories");
        } catch (err) {
            const data = err.response?.data;
            let msg = "Failed to save category.";
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative overflow-hidden px-4 py-8" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #fb923c 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: "#f97316" }} />
                <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full opacity-10" style={{ background: "#ef4444" }} />
                <div className="absolute top-2 right-32 w-16 h-16 rounded-full opacity-20" style={{ background: "#ffffff" }} />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="relative">
                        <button onClick={() => navigate("/categories")} className="absolute -top-1 left-0 flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-white/50 hover:bg-white/70 border border-white/60 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-150">
                            <svg className="w-4 h-4" fill="none" stroke="#ea580c" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            Back to Categories
                        </button>
                        <div className="text-center pt-2">
                            <h1 className="text-2xl font-bold text-orange-900">{isEdit ? "Edit Category" : "Create New Category"}</h1>
                            <p className="text-sm text-orange-700 mt-1">{isEdit ? "Update the category details below." : "Add a new category for events."}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-6">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Category Name <span className="text-red-400">*</span></label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Music" className={inputClass("name")} />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal ml-1">(optional)</span></label>
                                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe this category..." rows={3} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => navigate("/categories")} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 active:bg-orange-600 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 transition-colors duration-150">
                                    {isSubmitting ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{isEdit ? "Saving..." : "Creating..."}</>) : (isEdit ? "Save Changes" : "Create Category")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}