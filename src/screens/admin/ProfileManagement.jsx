import React, { useState } from 'react';
import { Save, X, Edit2, Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from '../../components/ui-components/container';
import data from '../../data/admin/profileManagement.json';

export const ProfileManagement = () => {
  const user = useSelector((state) => state.auth.user);
  // const data = require('../../data/admin/profileManagement.json');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || data.userProfile.name,
    email: user?.email || data.userProfile.email,
    phone: data.userProfile.phone,
    department: data.userProfile.department,
    bio: data.userProfile.bio,
    address: data.userProfile.address,
    joinDate: data.userProfile.joinDate,
  });

  const [profiles, setProfiles] = useState(data.profiles);

  const [editingProfile, setEditingProfile] = useState(null);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile changes
  };

  const handleUpdateUserProfile = () => {
    if (editingProfile) {
      setProfiles(profiles.map(p => 
        p.id === editingProfile.id ? editingProfile : p
      ));
      setEditingProfile(null);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Management</h1>

      {/* Admin Profile Section */}
      <div className="bg-white rounded-lg p-8 shadow border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            <p className="text-gray-600 mt-1">Manage your administrator profile</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-lg bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4">
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
            {isEditing && (
              <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition">
                <Upload className="w-4 h-4" />
                Change Photo
              </button>
            )}
            <p className="text-center text-gray-600 mt-4">Administrator</p>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      rows="3"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg font-medium transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{editData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{editData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{editData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{editData.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="text-lg font-semibold text-gray-900">{editData.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Users Profiles */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Users</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editingProfile ? (
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300 col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingProfile.phone}
                    onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingProfile.status}
                    onChange={(e) => setEditingProfile({ ...editingProfile, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateUserProfile}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingProfile(null)}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          
          {profiles.map(profile => (
            <div key={profile.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600">{profile.role}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  profile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {profile.status}
                </span>
              </div>
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p><span className="font-medium">Email:</span> {profile.email}</p>
                <p><span className="font-medium">Phone:</span> {profile.phone}</p>
                <p><span className="font-medium">Joined:</span> {profile.joinDate}</p>
              </div>
              <button
                onClick={() => setEditingProfile(profile)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProfileManagement;
