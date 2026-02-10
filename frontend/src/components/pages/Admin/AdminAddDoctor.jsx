import API from "../../../Api";
import { useState } from "react";
//import axios from "axios";

function AdminAddDoctor() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    specialty: "",
    contact: "",
    photo: "",
    hospital: "",

    bio: "",
    experience: 0,
    ticketPrice: 0,
    education: [],
    qualifications: [],
    timeSlots: []
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, 
      [name]: name === 'experience' || name === 'ticketPrice' ? parseInt(value) || 0 : value
    }));
  };

  // EDUCATION METHODS
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: "",
        institution: "",
        startDate: "",
        endDate: ""
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // QUALIFICATIONS/EXPERIENCE METHODS
  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, {
        position: "",
        hospital: "",
        startDate: "",
        endDate: ""
      }]
    }));
  };

  const updateQualification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? { ...qual, [field]: value } : qual
      )
    }));
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  
  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, {
        day: "Monday",
        time: "9:00 AM - 5:00 PM"
      }]
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
    
      // const token = localStorage.getItem("token");
      // const user = JSON.parse(localStorage.getItem("user"));

      //console.log("Submitting doctor data:", formData);

      const res = await API.post("/api/admin/doctors", formData);

      
      setMessage("✅ Doctor data ready! (Backend integration needed)");
      console.log("Full doctor data to send:", formData);

      

      // const res = await axios.post("http://localhost:5000/api/admin/doctors", formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });

      setMessage("✅ Doctor added successfully!");
      console.log(res.data);
      

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        specialty: "",
        contact: "",
        photo: "",
        hospital: "",
        bio: "",
        experience: 0,
        ticketPrice: 0,
        education: [],
        qualifications: [],
        timeSlots: []
      });

    } catch (error) {
      console.error("Error adding doctor:", error);
      setMessage("❌ Failed to add doctor. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Add New Doctor</h2>

      {message && (
        <div className={`p-3 mb-4 rounded ${
          message.includes("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
            <input type="text" name="specialty" placeholder="Specialty (e.g. Cardiology)" value={formData.specialty} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
            <input type="text" name="hospital" placeholder="Hospital" value={formData.hospital} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input type="text" name="photo" placeholder="Photo URL" value={formData.photo} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded" min="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (KSH)</label>
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} className="w-full p-2 border rounded" min="0" />
          </div>
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full p-2 border rounded" placeholder="Doctor's biography and background..." />
        </div>

        {/* EDUCATION SECTION */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <button type="button" onClick={addEducation} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              + Add Education
            </button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={index} className="border p-4 rounded mb-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="p-2 border rounded" />
                <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="p-2 border rounded" />
                <input type="date" placeholder="Start Date" value={edu.startDate} onChange={(e) => updateEducation(index, 'startDate', e.target.value)} className="p-2 border rounded" />
                <input type="date" placeholder="End Date" value={edu.endDate} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} className="p-2 border rounded" />
              </div>
              <button type="button" onClick={() => removeEducation(index)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* QUALIFICATIONS/EXPERIENCE SECTION */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Experience & Qualifications</h3>
            <button type="button" onClick={addQualification} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              + Add Experience
            </button>
          </div>
          
          {formData.qualifications.map((qual, index) => (
            <div key={index} className="border p-4 rounded mb-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input type="text" placeholder="Position" value={qual.position} onChange={(e) => updateQualification(index, 'position', e.target.value)} className="p-2 border rounded" />
                <input type="text" placeholder="Hospital" value={qual.hospital} onChange={(e) => updateQualification(index, 'hospital', e.target.value)} className="p-2 border rounded" />
                <input type="date" placeholder="Start Date" value={qual.startDate} onChange={(e) => updateQualification(index, 'startDate', e.target.value)} className="p-2 border rounded" />
                <input type="date" placeholder="End Date" value={qual.endDate} onChange={(e) => updateQualification(index, 'endDate', e.target.value)} className="p-2 border rounded" />
              </div>
              <button type="button" onClick={() => removeQualification(index)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* TIME SLOTS SECTION */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Time Slots</h3>
            <button type="button" onClick={addTimeSlot} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
              + Add Time Slot
            </button>
          </div>
          
          {formData.timeSlots.map((slot, index) => (
            <div key={index} className="border p-4 rounded mb-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <select value={slot.day} onChange={(e) => updateTimeSlot(index, 'day', e.target.value)} className="p-2 border rounded">
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <input type="text" placeholder="Time (e.g., 9:00 AM - 5:00 PM)" value={slot.time} onChange={(e) => updateTimeSlot(index, 'time', e.target.value)} className="p-2 border rounded" />
              </div>
              <button type="button" onClick={() => removeTimeSlot(index)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold">
          {loading ? "Adding Doctor..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}

export default AdminAddDoctor;