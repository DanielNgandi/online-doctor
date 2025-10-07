import { useState } from "react";
import axios from "axios";

function AdminAddDoctor() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    specialty: "",
    contact: "",
    photo: "",
    hospital: ""
  });

  const [message, setMessage] = useState("");

  // handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // get token from localStorage (after login)
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5000/api/admin/doctors", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage("✅ Doctor added successfully!");
      console.log(res.data);

      // reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        specialty: "",
        contact: "",
        photo: "",
        hospital: ""
      });

    } catch (error) {
      console.error("Error adding doctor:", error);
      setMessage("❌ Failed to add doctor. Check console.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Add New Doctor</h2>

      {message && <p className="mb-4 text-center text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="text" name="specialty" placeholder="Specialty (e.g. Cardiology)" value={formData.specialty} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="text" name="hospital" placeholder="Hospital" value={formData.hospital} onChange={handleChange} className="w-full p-2 border rounded" />

        <input type="text" name="photo" placeholder="Photo URL" value={formData.photo} onChange={handleChange} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Doctor
        </button>
      </form>
    </div>
  );
}

export default AdminAddDoctor;
