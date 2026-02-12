import { useEffect, useState } from "react";
//import axios from "axios";
import API from "../../../Api.js";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPatientProfile, setHasPatientProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
    
  useEffect(() => {
  //   const checkPatientProfile = async () => {
  //     //const token = localStorage.getItem("token");
  //     //const user = JSON.parse(localStorage.getItem("user"));

  //     if (!user || !user.id) {
  //       alert("Please log in to book an appointment");
  //       setCheckingProfile(false);
  //       return;
  //     }

  //     try {
  //       // const patientRes = await axios.get(
  //       //   "http://localhost:5000/api/patient/profile",
  //       //   {
  //       //     headers: {
  //       //       Authorization: `Bearer ${token}`,
  //       //     },
  //       //   }
  //       // );
  //       API.get("/api/patient/profile");
        
  //       if (patientRes.data && patientRes.data.id) {
  //         setPatientId(patientRes.data.id);
  //         setHasPatientProfile(true);
  //         console.log("Patient ID found:", patientRes.data.id);
  //       }
  //     } catch (err) {
  //       if (err.response?.status === 404) {
  //         setHasPatientProfile(false);
  //         setPatientId("");
  //       } else {
  //         console.error("Error checking patient profile:", err);
  //         setHasPatientProfile(false);
  //       }
  //     } finally {
  //       setCheckingProfile(false);
  //     }
  //   };

  //   checkPatientProfile();
  // }, []);
      const checkPatientProfile = async () => {
      try {
        const response = await API.get("/api/patient/profile");

        if (response.data && response.data.id) {
          setPatientId(response.data.id);
          setHasPatientProfile(true);
          console.log("Patient ID found:", response.data.id);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setHasPatientProfile(false);
          setPatientId("");
        } else {
          console.error("Error checking patient profile:", err);
          setHasPatientProfile(false);
        }
      } finally {
        setCheckingProfile(false);
      }
    };

    checkPatientProfile();
  }, []);


  // Fetch doctors only if patient profile exists
  // useEffect(() => {
  //    if (hasPatientProfile) {
  //     // const token = localStorage.getItem("token");
  //     // axios
  //     //   .get("http://localhost:5000/api/doctors", {
  //     //     headers: {
  //     //       Authorization: `Bearer ${token}`,
  //     //     },
  //     //   })
  //     API.get("/api/doctors");
  //       .then((res) => setDoctors(res.data))
  //       .catch((err) => console.error("Error fetching doctors:", err));
  //   }
  // }, [hasPatientProfile]);
  useEffect(() => {
    if (!hasPatientProfile) return;

    const fetchDoctors = async () => {
      try {
        const res = await API.get("/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, [hasPatientProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasPatientProfile) {
      alert("Please complete your patient profile first.");
      return;
    }

    //const token = localStorage.getItem("token");
    setLoading(true);

  //   try {
  //     // await axios.post(
  //     //   "http://localhost:5000/api/appointments",
  //     //   {
  //     //     doctorId: parseInt(doctorId),
  //     //     patientId: parseInt(patientId),
  //     //     date: new Date(date).toISOString(),
  //     //     reason,
  //     //   },
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer ${token}`,
  //     //     },
  //     //   }
  //     // );
  //     API.post("/api/appointments", data);

  //     alert("Appointment booked successfully!");
  //     setDoctorId("");
  //     setDate("");
  //     setReason("");
  //   } catch (err) {
  //     console.error("Full error details:", err.response?.data || err.message);
  //     alert(`Error booking appointment: ${err.response?.data?.message || err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   try {
      const data = {
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        date: new Date(date).toISOString(),
        reason,
      };

      await API.post("/api/appointments", data);

      alert("Appointment booked successfully!");
      setDoctorId("");
      setDate("");
      setReason("");
    } catch (err) {
      console.error("Full error details:", err.response?.data || err.message);
      alert(
        `Error booking appointment: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Checking your profile...</p>
      </div>
    );
  }
   if (!hasPatientProfile) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Profile Required</h2>
        <p className="text-gray-600 mb-4">
          Please complete your patient profile before booking appointments.
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
return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Book an Appointment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor
          </label>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date & Time
          </label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Visit
          </label>
          <textarea
            placeholder="Describe your symptoms or reason for appointment..."
            className="w-full border p-2 rounded"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading || !patientId}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
        
        {!patientId && (
          <p className="text-red-500 text-sm text-center">
            Please complete your patient profile before booking an appointment.
          </p>
        )}
      </form>
    </div>
  );
}
export default BookAppointment;
