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
    photo: '',
    // NEW FIELDS:
    bio: '',
    experience: 0,
    ticketPrice: 0,
    education: [],
    qualifications: [],
    timeSlots: []
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
        photo: response.data.photo || '',
        // NEW FIELDS:
        bio: response.data.bio || '',
        experience: response.data.experience || 0,
        ticketPrice: response.data.ticketPrice || 0,
        education: response.data.education || [],
        qualifications: response.data.qualifications || [],
        timeSlots: response.data.timeSlots || []
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

  // Handle basic input changes
  const handleInputChange = (e) => {
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

  // TIME SLOTS METHODS
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
        photo: doctor.photo || '',
        bio: doctor.bio || '',
        experience: doctor.experience || 0,
        ticketPrice: doctor.ticketPrice || 0,
        education: doctor.education || [],
        qualifications: doctor.qualifications || [],
        timeSlots: doctor.timeSlots || []
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
    <div className="max-w-6xl mx-auto p-6">
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
              {doctor && (
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <span>Experience: {doctor.experience || 0} years</span>
                  <span>Ticket Price: KSH {doctor.ticketPrice || 0}</span>
                </div>
              )}
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
            {/* BASIC INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{doctor.experience || 0} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price (KSH)
                </label>
                {(editing || !doctor) ? (
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">KSH {doctor.ticketPrice || 0}</p>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {(editing || !doctor) ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell patients about your background, expertise, and approach to healthcare..."
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {doctor.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </div>

            {/* DYNAMIC SECTIONS - Only show in edit mode */}
            {(editing || !doctor) && (
              <>
                {/* EDUCATION SECTION */}
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
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
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Experience & Qualifications</h3>
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
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Available Time Slots</h3>
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
              </>
            )}
          </form>

          {/* DISPLAY MODE - Show dynamic data when not editing */}
          {!editing && doctor && (
            <div className="space-y-8">
              {/* Education Display */}
              {doctor.education && doctor.education.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Education</h3>
                  <div className="space-y-3">
                    {doctor.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{edu.degree}</p>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>{new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Display */}
              {doctor.qualifications && doctor.qualifications.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Experience & Qualifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.qualifications.map((qual, index) => (
                      <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="font-semibold text-gray-800">{qual.position}</p>
                        <p className="text-gray-600">{qual.hospital}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(qual.startDate).toLocaleDateString()} - {qual.endDate === 'present' ? 'Present' : new Date(qual.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Slots Display */}
              {doctor.timeSlots && doctor.timeSlots.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Time Slots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctor.timeSlots.map((slot, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-gray-800">{slot.day}</p>
                        <p className="text-gray-600">{slot.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;