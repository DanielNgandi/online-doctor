// src/components/patients/PatientProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PatientProfileSetup() {
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: ""
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check if profile exists and load data
  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || user.role !== "patient") {
        navigate("/login");
        return;
      }

      try {
        // const response = await axios.get(
        //   "http://localhost:5000/api/patient/profile",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        
        const response = await API.get("/api/patient/profile");
        
        if (response.data) {
          setProfile({
            name: response.data.name || "",
            dob: response.data.dob ? response.data.dob.split('T')[0] : "",
            gender: response.data.gender || "",
            contact: response.data.contact || ""
          });
          setIsEditing(false);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // No profile exists yet, show empty form for creation
          setIsEditing(true);
        } else {
          console.error("Error fetching profile:", err);
          setMessage("Error loading profile");
        }
      }
    };

    checkProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");

  //   try {
  //     // Check if profile exists first
  //     try {
  //       await axios.get("http://localhost:5000/api/patient/profile", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
        
  //       // Profile exists, update it
  //       const response = await axios.put(
  //         "http://localhost:5000/api/patient/profile",
  //         profile,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setMessage("Profile updated successfully!");
  //       setIsEditing(false);
  //     } catch (error) {
  //       if (error.response?.status === 404) {
  //         // Profile doesn't exist, create it
  //         const response = await axios.post(
  //           "http://localhost:5000/api/patient/profile",
  //           profile,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         setMessage("Profile created successfully!");
  //         setIsEditing(false);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error saving profile:", err);
  //     setMessage(`Error: ${err.response?.data?.message || "Failed to save profile"}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  try {
      // Try to get profile first
      try {
        await API.get("/api/patient/profile");
        // If exists, update
        await API.put("/api/patient/profile", profile);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } catch (error) {
        if (error.response?.status === 404) {
          // If profile doesn't exist, create it
          await API.post("/api/patient/profile", profile);
          setMessage("Profile created successfully!");
          setIsEditing(false);
        } else {
          throw error;
        }
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage(
        `Error: ${err.response?.data?.message || "Failed to save profile"}`
      );
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Patient Profile
      </h2>

      {message && (
        <div className={`p-3 rounded mb-4 ${
          message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {isEditing ? (
            <>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>

      {!isEditing && profile.name && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Profile Complete!</h3>
          <p className="text-blue-700">
            Your profile is complete. You can now{" "}
            <button
              onClick={() => navigate("/book-appointment")}
              className="text-blue-600 underline font-semibold"
            >
              book appointments
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default PatientProfileSetup;