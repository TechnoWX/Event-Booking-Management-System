import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import EventList from "./pages/events/EventList";
import EventForm from "./pages/events/EventForm";
import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";
import BookingList from "./pages/bookings/BookingList";
import BookingForm from "./pages/bookings/BookingForm";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/create" element={<EventForm />} />
        <Route path="/events/edit/:id" element={<EventForm />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CategoryForm />} />
        <Route path="/categories/edit/:id" element={<CategoryForm />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/create" element={<BookingForm />} />
        <Route path="/bookings/edit/:id" element={<BookingForm />} />
      </Routes>
    </div>
  );
}