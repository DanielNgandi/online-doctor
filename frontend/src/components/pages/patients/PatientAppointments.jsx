import { useEffect, useState } from "react";
//import axios from "axios";
import API from "../../../Api.js";

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPatientProfile, setHasPatientProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [filter, setFilter] = useState("all");

  //   useEffect(() => {
  // //   const checkProfileAndFetchAppointments = async () => {
  // //     const token = localStorage.getItem("token");
  // //     const user = JSON.parse(localStorage.getItem("user"));

  // //     if (!user || !user.id) {
  // //       setError("Please log in to view appointments");
  // //       setCheckingProfile(false);
  // //       setLoading(false);
  // //       return;
  // //     }

  // //     try {
  // //       // First check if patient profile exists
  // //       const profileRes = await axios.get(
  // //         "http://localhost:5000/api/patient/profile",
  // //         {
  // //           headers: {
  // //             Authorization: `Bearer ${token}`,
  // //           },
  // //         }
  // //       );

  // //       if (profileRes.data && profileRes.data.id) {
  // //         setHasPatientProfile(true);
  // //         // If profile exists, fetch appointments
  // //         fetchAppointments(token);
  // //       }
  // //     } catch (err) {
  // //       if (err.response?.status === 404) {
  // //         setHasPatientProfile(false);
  // //         setError("profile-not-found");
  // //       } else {
  // //         console.error("Error checking profile:", err);
  // //         setError("Failed to check profile. Please try again.");
  // //       }
  // //     } finally {
  // //       setCheckingProfile(false);
  // //       setLoading(false);
  // //     }
  // //   };

  // //   checkProfileAndFetchAppointments();
  // // }, []);


  // // Fetch appointments when filter changes (only if profile exists)
  // useEffect(() => {
  //   if (hasPatientProfile) {
  //     const token = localStorage.getItem("token");
  //     fetchAppointments(token);
  //   }
  // }, [filter, hasPatientProfile]);
  // useEffect(() => {
  //   fetchAppointments();
  // }, [filter]);

  // const fetchAppointments = async () => {
  //   try {
  //     setLoading(true);
  //     //const token = localStorage.getItem("token");
      
  //     let url = "http://localhost:5000/api/appointments/patient/my-appointments";
  //     const params = new URLSearchParams();
      
  //     if (filter !== "all") {
  //       params.append("filter", filter);
  //     }
      
  //     if (params.toString()) {
  //       url += `?${params.toString()}`;
  //     }

  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
      
  //     setAppointments(response.data);
  //     setError("");
  //   } catch (err) {
  //     console.error("Error fetching appointments:", err);
  //     setError("Failed to load appointments");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleString();
  // };

  // const getStatus = (appointmentDate) => {
  //   const now = new Date();
  //   const appointment = new Date(appointmentDate);
  //   return appointment > now ? "Upcoming" : "Completed";
  // };

  // const getStatusColor = (status) => {
  //   return status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  // };
  // Utility functions
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

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

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      let url = "/api/appointments/patient/my-appointments";
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await API.get(url);
      setAppointments(response.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Check patient profile and fetch appointments
  useEffect(() => {
    const checkProfileAndFetchAppointments = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        setError("Please log in to view appointments");
        setCheckingProfile(false);
        setLoading(false);
        return;
      }

      try {
        const profileRes = await API.get("/api/patient/profile");

        if (profileRes.data?.id) {
          setHasPatientProfile(true);
          await fetchAppointments();
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setHasPatientProfile(false);
          setError("profile-not-found");
        } else {
          console.error("Error checking profile:", err);
          setError("Failed to check profile. Please try again.");
        }
      } finally {
        setCheckingProfile(false);
        setLoading(false);
      }
    };

    checkProfileAndFetchAppointments();
  }, [filter]); // re-check appointments when filter changes

   if (checkingProfile) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Checking your profile...</p>
      </div>
    );
  }

  // Show profile required message if no profile
  if (!hasPatientProfile && error === "profile-not-found") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Profile Required</h2>
        <p className="text-gray-600 mb-4">
          Please complete your patient profile before viewing appointments.
        </p>
        <button
          onClick={() => window.location.href = "/patient-profile"}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Go to Profile
        </button>
      </div>
    );
  }

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
          <p className="text-gray-600">View and manage your appointments</p>
        </div>

        {/* Filters - Only show if patient has profile */}
        {hasPatientProfile && (
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

              <div className="flex items-end">
                <button
                  onClick={() => setFilter("all")}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && error !== "profile-not-found" && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Appointments List */}
        <div className="p-6">
          {!hasPatientProfile ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Complete your profile to view appointments</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400">You haven't booked any appointments yet</p>
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
                          Dr. {appointment.doctor?.name || "Unknown Doctor"}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(appointment.date))}`}>
                          {getStatus(appointment.date)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date & Time:</span>
                          <p>{formatDate(appointment.date)}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium">Doctor:</span>
                          <p>Dr. {appointment.doctor?.name || "N/A"} - {appointment.doctor?.specialty || "N/A"}</p>
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
        {hasPatientProfile && appointments.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;