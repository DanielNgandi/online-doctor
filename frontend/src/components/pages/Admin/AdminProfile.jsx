// components/Admin/AdminProfile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    department: '',
    photo: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchAdminProfile();
    fetchAdminStats();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAdmin(response.data);
      setFormData({
        name: response.data.name || response.data.username || '',
        email: response.data.email || '',
        contact: response.data.contact || '',
        department: response.data.department || '',
        photo: response.data.photo || ''
      });
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
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
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/admin/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setAdmin(response.data.admin);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: admin?.name || admin?.username || '',
      email: admin?.email || '',
      contact: admin?.contact || '',
      department: admin?.department || '',
      photo: admin?.photo || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
              {admin?.photo ? (
                <img 
                  src={admin.photo} 
                  alt={admin.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 text-4xl font-bold">
                  {admin?.name?.charAt(0)?.toUpperCase() || admin?.username?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{admin?.name || admin?.username || 'Admin User'}</h1>
              <p className="text-purple-100 text-lg mb-1">{admin?.role || 'Administrator'}</p>
              <p className="text-purple-200">{admin?.department || 'System Administration'}</p>
              <p className="text-purple-200 text-sm mt-1">{admin?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Patients</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.totalDoctors}</div>
            <div className="text-gray-600">Total Doctors</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.totalAppointments}</div>
            <div className="text-gray-600">Total Appointments</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.todayAppointments}</div>
            <div className="text-gray-600">Today's Appointments</div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{admin?.name || admin?.username || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{admin?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Not set"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{admin?.contact || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="System Administration"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{admin?.department || 'System Administration'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                {editing ? (
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg break-all">
                    {admin?.photo || 'No photo URL provided'}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Additional Information */}
          {!editing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium">Admin ID:</span>
                  <p>{admin?.id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <p>{admin?.role || 'Administrator'}</p>
                </div>
                <div>
                  <span className="font-medium">Member Since:</span>
                  <p>{admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Permissions:</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Full system access • User management • Doctor management • Appointment oversight • Analytics
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;