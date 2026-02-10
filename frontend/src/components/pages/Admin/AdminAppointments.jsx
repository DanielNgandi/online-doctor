// src/components/AdminAppointments.js
import API from '../../../Api';
import React, { useState, useEffect } from 'react';
//import axios from 'axios';


const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, [filter, selectedDate]);

  // const fetchAppointments = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('token');
      
  //     // let url = 'http://localhost:5000/api/admin/appointments';
  //    let url = "/api/admin/appointments";
  //     const params = new URLSearchParams();
      
  //     if (filter !== 'all') {
  //       params.append('filter', filter);
  //     }
  //     if (selectedDate) {
  //       params.append('date', selectedDate);
  //     }
      
  //     if (params.toString()) {
  //       url += `?${params.toString()}`;
  //     }
  //      console.log("Calling ADMIN endpoint:", url);

  //     // const response = await axios.get(url, {
  //     //   headers: { Authorization: `Bearer ${token}` }
  //     // });
  //     const response = await API.get(url);
      
  //     if (response.data.success) {
  //       setAppointments(response.data.appointments);
  //     } else {
  //       setError('Failed to load appointments');
  //     }
  //     setError("");
  //   } catch (error) {
  //     console.error('Error fetching appointments:', error);
  //     setError('Failed to load appointments');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
    const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (filter !== "all") params.filter = filter;
      if (selectedDate) params.date = selectedDate;

      console.log("📡 Fetching appointments with params:", params);

      const response = await API.get("/api/admin/appointments", { params });

      if (response.data?.success) {
        setAppointments(response.data.appointments);
      } else {
        setError("Failed to load appointments");
      }
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // const fetchStats = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     // const response = await axios.get('http://localhost:5000/api/admin/appointments/stats', {
  //     //   headers: { Authorization: `Bearer ${token}` }
  //     // });
  //     await API.get("/api/admin/appointments/stats");

  //     if (response.data.success) {
  //       setStats(response.data.stats);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stats:', error);
  //   }
  // };
   const fetchStats = async () => {
    try {
      const response = await API.get("/api/admin/appointments/stats");
      if (response.data?.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatus = (appointmentDate) => {
    const now = new Date();
    const appointment = new Date(appointmentDate);
    return appointment > now ? "Upcoming" : "Completed";
  };

  const getStatusColor = (status) => {
    return status === "Upcoming" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-green-100 text-green-800";
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
          <p className="text-gray-600">View and manage all patient appointments across the system</p>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📊</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Total Appointments</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📅</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Today's Appointments</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.today || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⏰</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Upcoming</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end">
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

            <div className="ml-auto text-sm text-gray-600">
              Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (${filter})`}
              {selectedDate && ` on ${selectedDate}`}
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
              <p className="text-gray-400">Appointments will appear here when patients book with doctors</p>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Patient Information */}
                    <div className="lg:col-span-2">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="text-gray-600">{appointment.patient.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Age:</span>
                            <span className="text-gray-600">{calculateAge(appointment.patient.dob)} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Gender:</span>
                            <span className="text-gray-600">{appointment.patient.gender || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-600">{appointment.patient.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Doctor Information */}
                    <div className="lg:col-span-2">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Doctor Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="text-gray-600">Dr. {appointment.doctor.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Specialty:</span>
                            <span className="text-gray-600">{appointment.doctor.specialty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Hospital:</span>
                            <span className="text-gray-600">{appointment.doctor.hospital || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-600">{appointment.doctor.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details & Status */}
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Appointment Details</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Date & Time:</span>
                            <p className="text-gray-600 mt-1">{formatDateTime(appointment.date)}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(appointment.date))}`}>
                              {getStatus(appointment.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason and Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Reason for Visit</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded text-sm">
                        {appointment.reason || 'General Consultation'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">Patient Contact:</span>
                          <span className="text-gray-600">{appointment.patient.contact}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">Doctor Contact:</span>
                          <span className="text-gray-600">{appointment.doctor.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Appointment ID: #{appointment.id}</span>
                      <span>Booked on: {new Date(appointment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;