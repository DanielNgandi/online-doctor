// components/Doctor/DoctorProfile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    contact: '',
    hospital: '',
    photo: ''
  });
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalPatients: 0
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      console.log("Fetching doctor profile for user:", userData);

      const response = await axios.get('http://localhost:5000/api/doctors/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If we get here, profile exists
      setDoctor(response.data);
      setFormData({
        name: response.data.name || '',
        specialty: response.data.specialty || '',
        contact: response.data.contact || '',
        hospital: response.data.hospital || '',
        photo: response.data.photo || ''
      });
      
      // Fetch stats
      fetchDoctorStats();
      
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      
      if (error.response?.status === 404) {
        // Profile doesn't exist - this is NORMAL for new users
        console.log("No doctor profile found - showing setup form");
        setDoctor(null);
        setEditing(true);
        
        // Pre-fill with user data
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setFormData(prev => ({
            ...prev,
            name: userData.username || 'Dr. ' + userData.username
          }));
        }
        
        // Set empty stats for new users
        setStats({
          totalAppointments: 0,
          upcomingAppointments: 0,
          totalPatients: 0
        });
        
      } else {
        // Real error
        setMessage('Error loading profile: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      // Don't show error for stats - just use defaults
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      let response;

      if (!doctor) {
        // Create new profile
        console.log("Creating new doctor profile...");
        response = await axios.post('http://localhost:5000/api/doctors/profile', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setMessage('✅ Profile created successfully!');
      } else {
        // Update existing profile
        console.log("Updating existing doctor profile...");
        response = await axios.put('http://localhost:5000/api/doctors/profile', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setMessage('✅ Profile updated successfully!');
      }
      
      setDoctor(response.data.doctor || response.data);
      setEditing(false);
      
      // Refresh the data after a short delay
      setTimeout(() => {
        fetchDoctorProfile();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('❌ Failed to save profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (doctor) {
      // Reset to original data if editing existing profile
      setFormData({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        contact: doctor.contact || '',
        hospital: doctor.hospital || '',
        photo: doctor.photo || ''
      });
      setEditing(false);
    } else {
      // For new users, keep the form as is but exit editing mode
      setEditing(false);
    }
    setMessage('');
  };

  const startEditing = () => {
    setEditing(true);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
              {doctor?.photo ? (
                <img 
                  src={doctor.photo} 
                  alt={doctor.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 text-4xl font-bold">
                  {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                </span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {doctor ? `Dr. ${doctor.name}` : 'Welcome Doctor!'}
              </h1>
              <p className="text-blue-100 text-lg mb-1">
                {doctor?.specialty || 'Complete your profile to get started'}
              </p>
              <p className="text-blue-200">
                {doctor?.hospital || 'Your hospital/clinic will appear here'}
              </p>
              {!doctor && (
                <p className="text-blue-100 text-sm mt-2">
                  Let's set up your profile to start receiving patients
                </p>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 text-center ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 
            message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Stats Section - Only show if profile exists */}
        {doctor && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
              <div className="text-gray-600">Total Appointments</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.upcomingAppointments}</div>
              <div className="text-gray-600">Upcoming</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{stats.totalPatients}</div>
              <div className="text-gray-600">Total Patients</div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {doctor ? 'Profile Information' : 'Setup Your Doctor Profile'}
            </h2>
            {!editing && doctor ? (
              <button
                onClick={startEditing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (editing || !doctor) && (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : (doctor ? 'Save Changes' : 'Create Profile')}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  {doctor ? 'Cancel' : 'Skip for Now'}
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{doctor.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g. Cardiology, Pediatrics"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{doctor.specialty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information *
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Phone number or email"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{doctor.contact}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital/Clinic
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hospital or clinic name"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{doctor.hospital || 'Not specified'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg break-all">
                    {doctor.photo || 'No photo URL provided'}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Additional Information - Only show if profile exists */}
          {!editing && doctor && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium">Average Rating:</span>
                  <p>{doctor.avgRating ? `${doctor.avgRating}/5` : 'No ratings yet'}</p>
                </div>
                <div>
                  <span className="font-medium">Total Ratings:</span>
                  <p>{doctor.totalRating || 0}</p>
                </div>
                <div>
                  <span className="font-medium">Member Since:</span>
                  <p>{doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;