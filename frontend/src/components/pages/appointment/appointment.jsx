import { useEffect, useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  // Fetch all doctors
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  // Handle appointment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
    alert("Please log in to book an appointment");
    return;
  }

    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          doctorId: parseInt(doctorId),
          patientId: user.id, // 👈 from logged-in user
          date,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment booked successfully!");
      setDoctorId("");
      setDate("");
      setReason("");
    } catch (err) {
      console.error("Full error details:", err.response?.data || err.message);
    alert(`Error booking appointment: ${err.response?.data?.message || err.message}`);
  }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Book an Appointment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border p-2 rounded"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} — {doc.specialty}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <textarea
          placeholder="Reason for visit..."
          className="w-full border p-2 rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Appointment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;
