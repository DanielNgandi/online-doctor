import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, upcoming, past
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [filter, selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      let url = "http://localhost:5000/api/appointments/doctor/my-appointments"; 
      const params = new URLSearchParams();
      
      if (filter !== "all") {
        params.append("filter", filter);
      }
      if (selectedDate) {
        params.append("date", selectedDate);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setAppointments(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatus = (appointmentDate) => {
    const now = new Date();
    const appointment = new Date(appointmentDate);
    return appointment > now ? "Upcoming" : "Completed";
  };

  const getStatusColor = (status) => {
    return status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-gray-600">Manage and view all patient appointments</p>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Appointments</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDate("");
                  setFilter("all");
                }}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Appointments List */}
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400">Appointments will appear here when patients book with you</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {appointment.patient?.name || "Unknown Patient"}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(appointment.date))}`}>
                          {getStatus(appointment.date)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date & Time:</span>
                          <p>{formatDate(appointment.date)}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium">Patient Contact:</span>
                          <p>{appointment.patient?.contact || "N/A"}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium">Patient gender:</span>
                          <p>{appointment.patient?.gender || "N/A"}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium">Appointment ID:</span>
                          <p>#{appointment.id}</p>
                        </div>
                      </div>

                      {appointment.reason && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700">Reason:</span>
                          <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded">{appointment.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {appointments.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (${filter})`}
              {selectedDate && ` on ${selectedDate}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;