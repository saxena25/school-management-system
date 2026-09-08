import React, { useEffect, useState } from 'react';
import { Save, X, Edit2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/ui-components/container';
import { updateProfile } from '../../store/authSlice';
import { usersApi } from '../../services/api';

export const ProfileManagement = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    bio: user?.bio || '',
    address: user?.address || '',
  });
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      bio: user?.bio || '',
      address: user?.address || '',
    });
  }, [user]);

  useEffect(() => {
    usersApi
      .list()
      .then((data) => setProfiles(data.users || []))
      .catch((err) => setError(err.message));
  }, []);

  const handleSaveProfile = async () => {
    try {
      await dispatch(
        updateProfile({
          name: editData.name,
          phone: editData.phone,
          department: editData.department,
          bio: editData.bio,
          address: editData.address,
        })
      ).unwrap();
      setIsEditing(false);
      setMessage('Profile updated');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err.message || err);
    }
  };

  const handleUpdateUserProfile = async () => {
    if (!editingProfile) return;
    try {
      const data = await usersApi.updateUser(editingProfile.id, {
        name: editingProfile.name,
        email: editingProfile.email,
        phone: editingProfile.phone,
        status: editingProfile.status,
      });
      setProfiles((prev) =>
        prev.map((p) => (p.id === data.user.id ? data.user : p))
      );
      setEditingProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="space-y-6 py-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Profile Management</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-lg border bg-white p-8 shadow">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            <p className="mt-1 text-gray-600">Manage your administrator profile</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              <Edit2 className="h-4 w-4" /> Edit
            </button>
          )}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-20 w-20 rounded-full border"
          />
          <div>
            <p className="text-xl font-semibold">{user?.name}</p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {['name', 'phone', 'department', 'address'].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize">
                {field}
              </label>
              <input
                disabled={!isEditing}
                value={editData[field] || ''}
                onChange={(e) =>
                  setEditData({ ...editData, [field]: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              disabled={!isEditing}
              value={editData.bio || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50"
              rows={3}
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">All Users</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b">
                {editingProfile?.id === profile.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        value={editingProfile.name}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            name: e.target.value,
                          })
                        }
                        className="w-full rounded border px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={editingProfile.email}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            email: e.target.value,
                          })
                        }
                        className="w-full rounded border px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-3 capitalize">{profile.role}</td>
                    <td className="px-4 py-3">
                      <select
                        value={editingProfile.status}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            status: e.target.value,
                          })
                        }
                        className="rounded border px-2 py-1"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={handleUpdateUserProfile}
                        className="mr-2 text-green-600"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingProfile(null)}>
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{profile.name}</td>
                    <td className="px-4 py-3">{profile.email}</td>
                    <td className="px-4 py-3 capitalize">{profile.role}</td>
                    <td className="px-4 py-3">{profile.status}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingProfile(profile)}
                        className="text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default ProfileManagement;
